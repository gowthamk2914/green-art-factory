'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Phone, Mail } from 'lucide-react';

import {
  submitProjectEnquiryRequest,
  resetProjectEnquiryStatus,
} from '../../redux/CommonContactEnquiryForm/actions';

const IMAGE_SRC =
  '/images/common-contact-enquiry.jpg';

// Maps the API's field names back onto our local form state
const API_FIELD_TO_LOCAL = {
  full_name: 'name',
  whatsapp_number: 'whatsapp',
  email: 'email',
  project_location: 'location',
  project_details: 'details',
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

export default function EnquirySection() {
  const dispatch = useDispatch();

  // `ProjectEnquiry` must match the key used in your rootReducer
  const { loading, success, message, fieldErrors } = useSelector(
    (state) => state.CommonContactEnquiryForm
  );

  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    name: '',
    whatsapp: '',
    email: '',
    location: '',
    details: '',
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Merge server-side validation errors into local field errors
  useEffect(() => {
    if (!fieldErrors || Object.keys(fieldErrors).length === 0) return;

    const mapped = {};
    Object.entries(fieldErrors).forEach(([apiField, messages]) => {
      const localField = API_FIELD_TO_LOCAL[apiField] || apiField;
      mapped[localField] = Array.isArray(messages) ? messages[0] : messages;
    });

    setErrors((prev) => ({ ...prev, ...mapped }));
  }, [fieldErrors]);

  // On success, clear the form and reset the "Sent!" state after a
  // couple seconds — same timing as the original mock.
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      dispatch(resetProjectEnquiryStatus());
      setValues({ name: '', whatsapp: '', email: '', location: '', details: '' });
    }, 2600);

    return () => clearTimeout(timer);
  }, [success, dispatch]);

  // Reset submission state if the user navigates away mid-flow
  useEffect(() => {
    return () => {
      dispatch(resetProjectEnquiryStatus());
    };
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  // Rules per field (all three are required on this form)
  const getFieldError = (field) => {
    if (field === 'name') return validateName(values.name, { label: 'Full name' });
    if (field === 'whatsapp') {
      return validatePhone(values.whatsapp, { label: 'Whatsapp number' });
    }
    if (field === 'email') return validateEmail(values.email);
    return null;
  };

  // Check a single field when the user leaves it
  const handleFieldBlur = (field) => () => {
    setFocusedField(null);
    const message = getFieldError(field);
    setErrors((err) => ({ ...err, [field]: message || undefined }));
  };

  const validate = () => {
    const next = {};
    ['name', 'whatsapp', 'email'].forEach((field) => {
      const message = getFieldError(field);
      if (message) next[field] = message;
    });
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

    dispatch(
      submitProjectEnquiryRequest({
        full_name: values.name.trim(),
        whatsapp_number: values.whatsapp.trim(),
        email: values.email.trim(),
        project_location: values.location || undefined,
        project_details: values.details || undefined,
      })
    );
  };

  return (
    <section ref={sectionRef} className={`enq-section ${visible ? 'enq-visible' : ''}`}>
      <div className="container">
      <div className="enq-grid">
        {/* LEFT: image panel */}
        <div className="enq-image-card enq-anim enq-anim--left">
          <img src={IMAGE_SRC} alt="Fresh green cuttings in pots bathed in warm light" className="enq-image" />
          <div className="enq-image-shade" />

          <div className="enq-image-content">
            <span className="enq-eyebrow">Let's Create Something</span>
            <h3 className="enq-image-title">
              Your Vision.
              <br />
              Our Craft.
            </h3>

            <div className="enq-divider" />

            <div className="enq-contact-list">
              <a href="tel:+971569588315" className="enq-contact-row">
                <span className="enq-contact-icon">
                  <Phone size={15} aria-hidden="true" />
                </span>
                (+971) 56 9588 315
              </a>
              <a href="mailto:info@greenartfactory.com" className="enq-contact-row">
                <span className="enq-contact-icon">
                  <Mail size={15} aria-hidden="true" />
                </span>
                info@greenartfactory.com
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: form card */}
        <div className="enq-form-card enq-anim enq-anim--right">
          <span className="enq-tag">Send Enquiry</span>
          <h2 className="enq-title">
            Start Your
            <br />
            <span className="enq-title-accent">First Project</span>
          </h2>
          <p className="enq-subtitle">
            Tell us about your space and vision. Our design consultants will respond within 24 hours.
          </p>

          {message && !success && Object.keys(fieldErrors || {}).length === 0 && (
            <p className="enq-error-text" role="alert">{message}</p>
          )}

          {/* noValidate: our own red inline messages replace the
              browser's native tooltips */}
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="enq-form">
            <div className="enq-row">
              <Field
                name="name"
                label="Full Name"
                placeholder="Your name"
                autoComplete="name"
                maxLength={60}
                value={values.name}
                onChange={handleChange('name')}
                focused={focusedField === 'name'}
                onFocus={() => setFocusedField('name')}
                onBlur={handleFieldBlur('name')}
                error={errors.name}
              />
              <Field
                name="whatsapp"
                label="Whatsapp Number"
                type="tel"
                inputMode="tel"
                placeholder="+xx xx xxx xxxx"
                autoComplete="tel"
                maxLength={20}
                value={values.whatsapp}
                onChange={handleChange('whatsapp')}
                focused={focusedField === 'whatsapp'}
                onFocus={() => setFocusedField('whatsapp')}
                onBlur={handleFieldBlur('whatsapp')}
                error={errors.whatsapp}
              />
            </div>

            <Field
              name="email"
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              maxLength={254}
              value={values.email}
              onChange={handleChange('email')}
              focused={focusedField === 'email'}
              onFocus={() => setFocusedField('email')}
              onBlur={handleFieldBlur('email')}
              error={errors.email}
            />

            <Field
              name="location"
              label="Project Location"
              placeholder="City, Country"
              autoComplete="off"
              value={values.location}
              onChange={handleChange('location')}
              focused={focusedField === 'location'}
              onFocus={() => setFocusedField('location')}
              onBlur={() => setFocusedField(null)}
              error={errors.location}
            />

            <Field
              as="textarea"
              name="details"
              label="Project Details"
              rows={4}
              placeholder="Tell us about your project — space dimensions, vision, timeline..."
              autoComplete="off"
              value={values.details}
              onChange={handleChange('details')}
              focused={focusedField === 'details'}
              onFocus={() => setFocusedField('details')}
              onBlur={() => setFocusedField(null)}
              error={errors.details}
            />

            <button type="submit" disabled={loading} className="enq-submit">
              <span className="enq-submit-shine" />
              <span className="enq-submit-text">
                {success ? 'Sent! We\u2019ll be in touch' : loading ? 'Sending...' : 'Submit'}
              </span>
            </button>

            <p className="enq-footnote">Response guaranteed within 24 hours. No commitment required.</p>
          </form>
        </div>
      </div>
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
  focused,
  onFocus,
  onBlur,
  error,
  autoComplete,
  inputMode,
  maxLength,
  rows,
}) {
  const uid = useId();
  const id = `enq-${name}-${uid}`;
  const errorId = `${id}-error`;
  const Tag = as;

  return (
    <div className="enq-field">
      <label className="enq-label" htmlFor={id}>{label}</label>
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
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`enq-input ${as === 'textarea' ? 'enq-textarea' : ''} ${
          focused ? 'enq-input--focused' : ''
        } ${error ? 'enq-input--error' : ''}`}
      />
      {error && (
        <span id={errorId} role="alert" className="enq-error-text">
          {error}
        </span>
      )}
    </div>
  );
}