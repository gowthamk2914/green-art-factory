'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
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

// Always offered at the end of the "Position Applying For" dropdown
const GENERAL_APPLICATION = 'General Application';

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

/* ------------------------------------------------------------
   Shared validation (same rules on Contact, Services and Careers)
   ------------------------------------------------------------ */
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]*$/u;
const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+\-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9\-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().\-]+$/;

function validateName(value, { required = true, label = 'Name' } = {}) {
  const v = (value || '').trim();
  if (!v) return required ? `${label} is required.` : null;
  if (!NAME_PATTERN.test(v)) {
    return `${label} can only contain letters, spaces, apostrophes, hyphens and full stops.`;
  }
  const letters = v.match(/\p{L}/gu) || [];
  if (letters.length < 2) return `${label} must have at least 2 letters.`;
  if (v.length > 60) return `${label} must be 60 characters or fewer.`;
  return null;
}

function validateEmail(value, { required = true } = {}) {
  const v = (value || '').trim();
  if (!v) return required ? 'Email is required.' : null;
  if (v.length > 254 || v.includes('..') || !EMAIL_PATTERN.test(v)) {
    return 'Enter a valid email address, e.g. name@example.com.';
  }
  return null;
}

function validatePhone(value, { required = true, label = 'Phone number' } = {}) {
  const v = (value || '').trim();
  if (!v) return required ? `${label} is required.` : null;
  if (!PHONE_PATTERN.test(v)) {
    return `${label} can only contain digits, spaces and + ( ) - characters.`;
  }
  const digits = v.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return `Enter a valid ${label.toLowerCase()} (7–15 digits).`;
  }
  return null;
}

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

  // Same job list the Opportunities section loaded
  const jobsData = useSelector((state) => state.Opportunities?.data);

  const [values, setValues] = useState(initialValues);
  const [file, setFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Dropdown options = the open roles from the API + "General Application"
  const positionOptions = useMemo(() => {
    const titles = (jobsData || [])
      .filter((job) => job.status)
      .map((job) => job.title);

    const list = Array.from(new Set(titles));

    // Keep a pre-filled role selectable even if the list hasn't loaded yet
    if (
      values.position &&
      !list.includes(values.position) &&
      values.position !== GENERAL_APPLICATION
    ) {
      list.unshift(values.position);
    }

    return [...list, GENERAL_APPLICATION];
  }, [jobsData, values.position]);

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

  // Receive the role chosen in the Opportunities cards
  useEffect(() => {
    const handleSelect = (e) => {
      const title = e.detail?.title;
      if (!title) return;

      setValues((v) => ({ ...v, position: title }));
      setErrors((err) => ({ ...err, position: undefined }));

      // After the scroll, move focus to the field so it's announced
      window.setTimeout(() => {
        document.getElementById('apl-position')?.focus({ preventScroll: true });
      }, 600);
    };

    window.addEventListener('gaf:select-position', handleSelect);
    return () => window.removeEventListener('gaf:select-position', handleSelect);
  }, []);

  // Pre-fill from the URL (?position=job-slug) once the jobs have loaded
  useEffect(() => {
    if (!jobsData || values.position) return;

    const slug = new URLSearchParams(window.location.search).get('position');
    if (!slug) return;

    const match = jobsData.find((job) => job.status && job.slug === slug);
    if (match) setValues((v) => ({ ...v, position: match.title }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsData]);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  // Rules for the three shared fields (all required on this form)
  const getFieldError = (field) => {
    if (field === 'fullName') return validateName(values.fullName, { label: 'Full name' });
    if (field === 'email') return validateEmail(values.email);
    if (field === 'phone') return validatePhone(values.phone, { label: 'Phone number' });
    return null;
  };

  // Check a single field when the user leaves it
  const handleFieldBlur = (field) => () => {
    const message = getFieldError(field);
    setErrors((err) => ({ ...err, [field]: message || undefined }));
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

    ['fullName', 'email', 'phone'].forEach((field) => {
      const message = getFieldError(field);
      if (message) next[field] = message;
    });

    if (!values.position.trim()) next.position = 'Please select a position.';
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

    if (!validate()) {
      // Move focus to the first invalid field once errors have rendered
      requestAnimationFrame(() => {
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    const formData = new FormData();
    formData.append('full_name', values.fullName.trim());
    formData.append('email', values.email.trim());
    formData.append('phone', values.phone.trim());
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

        {/* RIGHT: form (noValidate: our own red inline messages
            replace the browser's native tooltips) */}
        <form ref={formRef} className="apl-form" onSubmit={handleSubmit} noValidate>
          {message && !success && Object.keys(fieldErrors || {}).length === 0 && (
            <p className="apl-error-text" role="alert">{message}</p>
          )}

          <div className="apl-row">
            <Field
              name="full_name"
              label="Full Name"
              placeholder="Your full name"
              autoComplete="name"
              maxLength={60}
              value={values.fullName}
              onChange={handleChange('fullName')}
              onBlur={handleFieldBlur('fullName')}
              error={errors.fullName}
            />
            <Field
              name="email"
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              maxLength={254}
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleFieldBlur('email')}
              error={errors.email}
            />
          </div>

          <div className="apl-row">
            <Field
              name="phone"
              label="Phone Number"
              type="tel"
              inputMode="tel"
              placeholder="+1 (000) 000 0000"
              autoComplete="tel"
              maxLength={20}
              value={values.phone}
              onChange={handleChange('phone')}
              onBlur={handleFieldBlur('phone')}
              error={errors.phone}
            />

            {/* Position: dropdown built from the open roles, pre-filled
                when the visitor clicks "Apply Now" on a job card */}
            <div className="apl-field">
              <label className="apl-label" htmlFor="apl-position">
                Position Applying For
              </label>
              <select
                id="apl-position"
                name="position"
                value={values.position}
                onChange={handleChange('position')}
                aria-required="true"
                aria-invalid={errors.position ? 'true' : undefined}
                aria-describedby={errors.position ? 'apl-position-error' : undefined}
                className={`apl-input apl-select ${errors.position ? 'apl-input--error' : ''}`}
              >
                <option value="">Select a position</option>
                {positionOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              {errors.position && (
                <span id="apl-position-error" role="alert" className="apl-error-text">
                  {errors.position}
                </span>
              )}
            </div>
          </div>

          <Field
            name="portfolio"
            label="Portfolio / Website"
            placeholder="https://yourportfolio.com"
            autoComplete="url"
            value={values.portfolio}
            onChange={handleChange('portfolio')}
            error={errors.portfolio}
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
            {errors.resume && (
              <span role="alert" className="apl-error-text">{errors.resume}</span>
            )}
          </div>

          <Field
            as="textarea"
            name="message"
            label="Cover Letter / Message"
            rows={5}
            placeholder="Tell us about yourself, what draws you to Green Art Factory, and what you'd love to contribute."
            autoComplete="off"
            value={values.coverLetter}
            onChange={handleChange('coverLetter')}
            error={errors.coverLetter}
          />

          <div className="apl-footer">
            <label className="apl-checkbox-row">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setErrors((err) => ({ ...err, agreed: undefined }));
                }}
                aria-invalid={errors.agreed ? 'true' : undefined}
                className="apl-checkbox"
              />
              <span>
                I agree to the processing of my personal data for recruitment purposes in
                accordance with Green Art Factory&apos;s <a href="/terms-and-privacy" target="_blank" rel="noopener noreferrer" className="terms-and-privacy-checkbox-text">Terms and Privacy</a>.
              </span>
            </label>
            {errors.agreed && (
              <span role="alert" className="apl-error-text">{errors.agreed}</span>
            )}

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

function Field({
  as = 'input',
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  inputMode,
  maxLength,
  rows,
}) {
  const uid = useId();
  const id = `apl-${name}-${uid}`;
  const errorId = `${id}-error`;
  const Tag = as;

  return (
    <div className="apl-field">
      <label className="apl-label" htmlFor={id}>{label}</label>
      <Tag
        id={id}
        name={name}
        type={as === 'input' ? type : undefined}
        inputMode={inputMode}
        maxLength={maxLength}
        rows={as === 'textarea' ? rows : undefined}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${as === 'textarea' ? 'apl-textarea' : 'apl-input'} ${
          error ? 'apl-input--error' : ''
        }`}
      />
      {error && (
        <span id={errorId} role="alert" className="apl-error-text">
          {error}
        </span>
      )}
    </div>
  );
}