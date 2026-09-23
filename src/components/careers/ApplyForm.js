'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadCloud, ArrowUpRight, X, CheckCircle2 } from 'lucide-react';

import {
  submitApplicationRequest,
  resetApplicationStatus,
} from '../../redux/ApplyForm/actions';

const HIRING_STEPS = [
  { step: 1, title: 'Application Review', meta: 'Within 2 weeks' },
  { step: 2, title: 'Studio Introduction', meta: '60-min conversation' },
  { step: 3, title: 'Creative Challenge', meta: 'Portfolio / brief review' },
  { step: 4, title: 'Offer & Welcome', meta: 'Join the studio family' },
];

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  position: '',
  portfolio: '',
  coverLetter: '',
};

// Maps the API's snake_case field names back onto our camelCase form state
const API_FIELD_TO_LOCAL = {
  full_name: 'fullName',
  email: 'email',
  phone: 'phone',
  position: 'position',
  portfolio: 'portfolio',
  message: 'coverLetter',
  resume: 'resume',
  consent: 'agreed',
};

// Backend requires a fully qualified URL (Laravel's `url` rule). If the
// person typed "myportfolio.com" without a protocol, add one rather than
// bouncing them with a 422.
function normalizePortfolioUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function ApplyForm() {
  const dispatch = useDispatch();

  // `ApplyForm` must match the key used in your rootReducer
  const { loading, success, message, fieldErrors } = useSelector(
    (state) => state.ApplyForm
  );

  const [values, setValues] = useState(initialValues);
  const [file, setFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Merge server-side field errors (from a failed submit) into the
  // same `errors` object the client-side validation uses, so both
  // render through the existing <Field error={...}> UI.
  useEffect(() => {
    if (!fieldErrors || Object.keys(fieldErrors).length === 0) return;

    const mapped = {};
    Object.entries(fieldErrors).forEach(([apiField, messages]) => {
      const localField = API_FIELD_TO_LOCAL[apiField] || apiField;
      mapped[localField] = Array.isArray(messages) ? messages[0] : messages;
    });

    setErrors((prev) => ({ ...prev, ...mapped }));
  }, [fieldErrors]);

  // Reset the redux submission state if the user leaves the page mid-flow
  useEffect(() => {
    return () => {
      dispatch(resetApplicationStatus());
    };
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validateFile = (candidate) => {
    if (!ACCEPTED_FILE_TYPES.includes(candidate.type)) {
      return 'Please upload a PDF or DOCX file.';
    }
    if (candidate.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File is too large — max ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const applyFile = (candidate) => {
    const error = validateFile(candidate);
    if (error) {
      setErrors((err) => ({ ...err, resume: error }));
      return;
    }
    setFile(candidate);
    setErrors((err) => ({ ...err, resume: undefined }));
  };

  const handleFileSelect = (e) => {
    const candidate = e.target.files?.[0];
    if (candidate) applyFile(candidate);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const candidate = e.dataTransfer.files?.[0];
    if (candidate) applyFile(candidate);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validate = () => {
    const next = {};
    if (!values.fullName.trim()) next.fullName = 'Full name is required.';
    if (!values.email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Enter a valid email address.';
    }
    if (!values.phone.trim()) next.phone = 'Phone number is required.';
    if (!values.position.trim()) next.position = 'Let us know which position.';
    if (values.portfolio.trim() && !isValidUrl(normalizePortfolioUrl(values.portfolio))) {
      next.portfolio = 'Enter a valid URL, e.g. https://yourportfolio.com';
    }
    if (!file) next.resume = 'Please attach your resume.';
    if (!agreed) next.agreed = 'Please agree to the privacy policy to continue.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('full_name', values.fullName);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('position', values.position);
    if (values.portfolio.trim()) {
      formData.append('portfolio', normalizePortfolioUrl(values.portfolio));
    }
    if (values.coverLetter) formData.append('message', values.coverLetter);
    if (file) formData.append('resume', file);
    formData.append('consent', agreed ? '1' : '0');

    dispatch(submitApplicationRequest(formData));
  };

  if (success) {
    return (
      <section id="apply" className="apl-section">
        <div className="apl-success">
          <CheckCircle2 className="apl-success-icon" />
          <h2 className="apl-success-title">Application Sent!</h2>
          <p className="apl-success-text">
            Thank you, {values.fullName.split(' ')[0] || 'friend'} — we&apos;ve received your
            application and will be in touch within two weeks.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="apl-section">
      <div className="apl-grid">
        {/* LEFT: info panel */}
        <div className="apl-info-card">
          <h2 className="apl-info-title">Apply Today</h2>
          <span className="apl-info-rule" />

          <p className="apl-info-text">
            We review every application with care and respond to all candidates within two
            weeks. Our process is designed to be as human and unhurried as the studio itself.
          </p>

          <div className="apl-process-card">
            <span className="apl-process-label">Hiring Process</span>
            {HIRING_STEPS.map((s) => (
              <div key={s.step} className="apl-process-row">
                <span className="apl-process-number">{s.step}</span>
                <div>
                  <p className="apl-process-title">{s.title}</p>
                  <p className="apl-process-meta">{s.meta}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="apl-contact">
            Questions? Reach us at
            <br />
            <a href="mailto:careers@greenartfactory.com">careers@greenartfactory.com</a>
          </p>
        </div>

        {/* RIGHT: form */}
        <form className="apl-form" onSubmit={handleSubmit} noValidate>
          {message && !success && Object.keys(fieldErrors || {}).length === 0 && (
            <p className="apl-error-text" role="alert">{message}</p>
          )}

          <div className="apl-row">
            <Field
              label="Full Name"
              placeholder="Your full name"
              value={values.fullName}
              onChange={handleChange('fullName')}
              error={errors.fullName}
            />
            <Field
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
          </div>

          <div className="apl-row">
            <Field
              label="Phone Number"
              type="tel"
              placeholder="+1 (000) 000 0000"
              value={values.phone}
              onChange={handleChange('phone')}
              error={errors.phone}
            />
            <Field
              label="Position Applying For"
              placeholder="e.g. Senior Landscape Architect"
              value={values.position}
              onChange={handleChange('position')}
              error={errors.position}
            />
          </div>

          <Field
            label="Portfolio / Website"
            placeholder="https://yourportfolio.com"
            value={values.portfolio}
            onChange={handleChange('portfolio')}
          />

          <div className="apl-field">
            <label className="apl-label">Resume / CV</label>
            <div
              className={`apl-dropzone ${isDragging ? 'apl-dropzone--dragging' : ''} ${
                errors.resume ? 'apl-dropzone--error' : ''
              } ${file ? 'apl-dropzone--filled' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="apl-file-input"
              />

              {file ? (
                <div className="apl-file-info">
                  <span className="apl-file-name">{file.name}</span>
                  <span className="apl-file-size">{formatFileSize(file.size)}</span>
                  <button type="button" className="apl-file-remove" onClick={removeFile} aria-label="Remove file">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="apl-upload-icon" strokeWidth={1.6} />
                  <p className="apl-upload-title">Click to upload your resume</p>
                  <p className="apl-upload-meta">PDF, DOCX — max {MAX_FILE_SIZE_MB}MB</p>
                </>
              )}
            </div>
            {errors.resume && <span className="apl-error-text">{errors.resume}</span>}
          </div>

          <div className="apl-field">
            <label className="apl-label">Cover Letter / Message</label>
            <textarea
              rows={5}
              placeholder="Tell us about yourself, what draws you to Green Art Factory, and what you'd love to contribute."
              value={values.coverLetter}
              onChange={handleChange('coverLetter')}
              className="apl-textarea"
            />
          </div>

          <div className="apl-footer">
            <label className="apl-checkbox-row">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setErrors((err) => ({ ...err, agreed: undefined }));
                }}
                className="apl-checkbox"
              />
              <span>
                I agree to the processing of my personal data for recruitment purposes in
                accordance with Green Art Factory&apos;s Privacy Policy.
              </span>
            </label>
            {errors.agreed && <span className="apl-error-text">{errors.agreed}</span>}

            <div className="apl-submit-row">
              <button type="submit" className="apl-submit" disabled={loading}>
                <span className="apl-submit-shine" />
                <span className="apl-submit-text">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </span>
                {!loading && <ArrowUpRight size={16} />}
              </button>
              <p className="apl-footnote">We respond to every application. Thank you for your interest.</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div className="apl-field">
      <label className="apl-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`apl-input ${error ? 'apl-input--error' : ''}`}
      />
      {error && <span className="apl-error-text">{error}</span>}
    </div>
  );
}