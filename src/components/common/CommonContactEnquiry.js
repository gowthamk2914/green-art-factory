'use client';

import { useEffect, useRef, useState } from 'react';
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

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Full name is required.';
    if (!values.whatsapp.trim()) next.whatsapp = 'Whatsapp number is required.';
    if (!values.email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Enter a valid email address.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      submitProjectEnquiryRequest({
        full_name: values.name,
        whatsapp_number: values.whatsapp,
        email: values.email,
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
              <a href="tel:+911234567890" className="enq-contact-row">
                <span className="enq-contact-icon">
                  <Phone size={15} />
                </span>
                +91 1234567890
              </a>
              <a href="mailto:hello@greenartfactory.com" className="enq-contact-row">
                <span className="enq-contact-icon">
                  <Mail size={15} />
                </span>
                hello@greenartfactory.com
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

          <form onSubmit={handleSubmit} className="enq-form">
            <div className="enq-row">
              <Field
                label="Full Name"
                placeholder="Your name"
                value={values.name}
                onChange={handleChange('name')}
                focused={focusedField === 'name'}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                error={errors.name}
              />
              <Field
                label="Whatsapp Number"
                type="tel"
                placeholder="+xx xx xxx xxxx"
                value={values.whatsapp}
                onChange={handleChange('whatsapp')}
                focused={focusedField === 'whatsapp'}
                onFocus={() => setFocusedField('whatsapp')}
                onBlur={() => setFocusedField(null)}
                error={errors.whatsapp}
              />
            </div>

            <Field
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange('email')}
              focused={focusedField === 'email'}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              error={errors.email}
            />

            <Field
              label="Project Location"
              placeholder="City, Country"
              value={values.location}
              onChange={handleChange('location')}
              focused={focusedField === 'location'}
              onFocus={() => setFocusedField('location')}
              onBlur={() => setFocusedField(null)}
              error={errors.location}
            />

            <div className="enq-field">
              <label className="enq-label">Project Details</label>
              <textarea
                rows={4}
                placeholder="Tell us about your project — space dimensions, vision, timeline..."
                value={values.details}
                onChange={handleChange('details')}
                onFocus={() => setFocusedField('details')}
                onBlur={() => setFocusedField(null)}
                className={`enq-input enq-textarea ${focusedField === 'details' ? 'enq-input--focused' : ''}`}
              />
              {errors.details && <span className="enq-error-text">{errors.details}</span>}
            </div>

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

function Field({ label, type = 'text', placeholder, value, onChange, focused, onFocus, onBlur, error }) {
  return (
    <div className="enq-field">
      <label className="enq-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`enq-input ${focused ? 'enq-input--focused' : ''} ${error ? 'enq-input--error' : ''}`}
      />
      {error && <span className="enq-error-text">{error}</span>}
    </div>
  );
}