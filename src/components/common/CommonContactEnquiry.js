'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, Mail } from 'lucide-react';


const IMAGE_SRC =
  '/images/common-contact-enquiry.jpg';

export default function EnquirySection() {
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    name: '',
    whatsapp: '',
    email: '',
    location: '',
    details: '',
  });
  const [focusedField, setFocusedField] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2600);
    }, 1200);
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
            Tell us about your space and vision. Our design consultants will respond within
            24 hours.
          </p>

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
            />

            <Field
              label="Project Location"
              placeholder="City, Country"
              value={values.location}
              onChange={handleChange('location')}
              focused={focusedField === 'location'}
              onFocus={() => setFocusedField('location')}
              onBlur={() => setFocusedField(null)}
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
            </div>

            <button type="submit" disabled={submitting} className="enq-submit">
              <span className="enq-submit-shine" />
              <span className="enq-submit-text">
                {submitted ? 'Sent! We\u2019ll be in touch' : submitting ? 'Sending...' : 'Submit'}
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

function Field({ label, type = 'text', placeholder, value, onChange, focused, onFocus, onBlur }) {
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
        className={`enq-input ${focused ? 'enq-input--focused' : ''}`}
      />
    </div>
  );
}