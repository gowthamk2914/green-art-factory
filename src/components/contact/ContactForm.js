'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, ArrowRight, Send } from 'lucide-react';
import Link from "next/link";

import {
  submitEnquiryRequest,
  resetEnquiryStatus,
} from '../../redux/ContactPageForm/actions';

// Maps the API's field names back onto our local form state.
// (Currently 1:1, kept as a map in case the backend renames anything.)
const API_FIELD_TO_LOCAL = {
  name: 'name',
  email: 'email',
  mobile: 'mobile',
  project_details: 'details',
};

/**
 * ContactSection
 * A botanical-themed contact form paired with a WhatsApp "instant consultation" card.
 * Drop this component anywhere in a Next.js app (app/ or pages/ router both work).
 *
 * Requires: tailwindcss, lucide-react
 *   npm install lucide-react
 */
export default function ContactSection() {
  const dispatch = useDispatch();

  // `Contact` must match the key used in your rootReducer
  const { loading, success, message, fieldErrors } = useSelector(
    (state) => state.ContactPageForm
  );

  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [values, setValues] = useState({
    name: '',
    email: '',
    mobile: '',
    details: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMounted(true);
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

  // On a successful submit, clear the form and reset the "Sent!" state
  // after a couple of seconds, same timing as the original mock.
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      dispatch(resetEnquiryStatus());
      setValues({ name: '', email: '', mobile: '', details: '' });
    }, 2400);

    return () => clearTimeout(timer);
  }, [success, dispatch]);

  // Reset submission state if the user navigates away mid-flow
  useEffect(() => {
    return () => {
      dispatch(resetEnquiryStatus());
    };
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Name is required.';
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
      submitEnquiryRequest({
        name: values.name,
        email: values.email,
        mobile: values.mobile || undefined,
        project_details: values.details || undefined,
      })
    );
  };

  return (

    <>

                  <div className="breadcrumb container">
  <Link href="/" className="breadcrumb-item">
    Home
  </Link>

  <i className="bi bi-chevron-right breadcrumb-arrow"></i>

  <Link href="/contact" className="breadcrumb-item active">
    Contact Us
  </Link>
</div>


    <section className="relative w-full contact-us-page-form-section flex items-center justify-center bg-[#F7F6F1] px-6 py-20 overflow-hidden">
      

      
      {/* ambient botanical glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#8A9A5B]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#4B5320]/10 blur-3xl" />

      <div className="relative w-full max-w-5xl">
        {/* WhatsApp card (sits behind, overlapping the right edge of the form card) */}
        <div
          className={`absolute instant-consultation-card top-16 z-0 w-full max-w-[420px] transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <div className="relative rounded-[28px] bg-gradient-to-br from-[#5B6B2F] to-[#3E4A22] p-8 shadow-2xl shadow-[#3E4A22]/30 overflow-hidden">
            {/* subtle sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />

            {/* icon */}
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-black/20 animate-float">
              <MessageCircle className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
            </div>

            <h3 className="relative mt-6 text-2xl font-semibold text-white tracking-tight">
              Instant Consultation
            </h3>
            <p className="relative mt-3 text-[15px] leading-relaxed text-white/70">
              Connect instantly with our horticultural experts. Share photos, discuss
              concepts, and get professional advice — all on WhatsApp.
            </p>

            <div className="relative mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[0.07] border border-white/10 px-4 py-3 transition-colors hover:bg-white/[0.1]">
                <div className="text-xl font-bold text-[#6EE7A0]">~2min</div>
                <div className="text-xs text-white/55 mt-0.5">Avg. Response</div>
              </div>
              <div className="rounded-2xl bg-white/[0.07] border border-white/10 px-4 py-3 transition-colors hover:bg-white/[0.1]">
                <div className="text-xl font-bold text-[#6EE7A0]">24/7</div>
                <div className="text-xs text-white/55 mt-0.5">Available</div>
              </div>
            </div>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2FD675] to-[#1DAE5C] px-6 py-3.5 text-white font-semibold shadow-lg shadow-[#1DAE5C]/30 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <MessageCircle className="relative w-4 h-4" fill="white" strokeWidth={0} />
              <span className="relative">Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Contact form card (in front, offset top-left) */}
        <div
          className={`contact-form-card relative z-10 w-full max-w-[700px] rounded-[28px] bg-white p-10 shadow-2xl shadow-black/[0.08] transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-normal text-[#4B5320] tracking-tight">
            Contact Form
          </h2>
          <p className="mt-2 text-[15px] text-gray-500">Tell us about your botanical vision.</p>

          {message && !success && Object.keys(fieldErrors || {}).length === 0 && (
            <p className="mt-4 text-sm text-red-600" role="alert">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-2 max-[640px]:grid-cols-1 gap-4">
              <FormField
                placeholder="Your Name"
                value={values.name}
                onChange={handleChange('name')}
                focused={focusedField === 'name'}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                error={errors.name}
              />
              <FormField
                type="email"
                placeholder="Email Address"
                value={values.email}
                onChange={handleChange('email')}
                focused={focusedField === 'email'}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                error={errors.email}
              />
            </div>

            <FormField
              type="tel"
              placeholder="Mobile Number"
              value={values.mobile}
              onChange={handleChange('mobile')}
              focused={focusedField === 'mobile'}
              onFocus={() => setFocusedField('mobile')}
              onBlur={() => setFocusedField(null)}
              error={errors.mobile}
            />

            <div>
              <textarea
                placeholder="Project Details"
                value={values.details}
                onChange={handleChange('details')}
                onFocus={() => setFocusedField('details')}
                onBlur={() => setFocusedField(null)}
                rows={4}
                className={`w-full rounded-2xl border bg-transparent px-5 py-4 text-[15px] text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-300 resize-none ${
                  focusedField === 'details'
                    ? 'border-[#4B5320] shadow-[0_0_0_4px_rgba(75,83,32,0.08)]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.details && (
                <p className="mt-1.5 text-xs text-red-600">{errors.details}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden flex items-center gap-2 rounded-full bg-[#4B5320] px-7 py-3.5 text-white font-medium shadow-lg shadow-[#4B5320]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#4B5320]/35 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-70"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span className="relative">
                  {success ? 'Sent!' : loading ? 'Sending...' : 'Submit Enquiry'}
                </span>
                {success ? (
                  <Send className="relative w-4 h-4" />
                ) : (
                  <ArrowRight
                    className={`relative w-4 h-4 transition-transform duration-300 ${
                      loading ? 'translate-x-1' : 'group-hover:translate-x-1'
                    }`}
                  />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </section>

    </>
  );
}

function FormField({ type = 'text', placeholder, value, onChange, focused, onFocus, onBlur, error }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full rounded-2xl border bg-transparent px-5 py-4 text-[15px] text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-300 ${
          error
            ? 'border-red-400 shadow-[0_0_0_4px_rgba(220,38,38,0.06)]'
            : focused
            ? 'border-[#4B5320] shadow-[0_0_0_4px_rgba(75,83,32,0.08)]'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}