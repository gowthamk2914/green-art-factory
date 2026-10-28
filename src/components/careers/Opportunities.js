'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

import { getCareersRequest } from '../../redux/Opportunities/actions';

const CORNER_IMAGE_SRC = '/images/card-corner-leaf.png';
const ALL_FILTER = 'All Departments';

function getJobsForFilter(jobs, dept) {
  if (dept === ALL_FILTER) return jobs;
  return jobs.filter((job) => job.department === dept);
}

export default function Opportunities() {
  const dispatch = useDispatch();

  // `Careers` must match the key used in your rootReducer
  const { data, loading, error } = useSelector((state) => state.Opportunities);

  useEffect(() => {
    dispatch(getCareersRequest());
  }, [dispatch]);

  // Map API fields to the shape the card markup expects, and drop
  // anything the API has flagged inactive (status: false).
  const jobs = useMemo(() => {
    return (data || [])
      .filter((job) => job.status)
      .map((job) => ({
        id: job.id,
        slug: job.slug,
        department: job.category,
        title: job.title,
        location: job.location,
        type: job.job_type,
        description: job.description,
        applyUrl: job.apply_url,
      }));
  }, [data]);

  // Filter chips are built from whatever categories actually come back,
  // so a new department added in the CMS shows up here automatically.
  const departments = useMemo(() => {
    const unique = Array.from(new Set(jobs.map((job) => job.department))).filter(Boolean);
    return [ALL_FILTER, ...unique];
  }, [jobs]);

  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [isLeaving, setIsLeaving] = useState(false);
  const pendingFilterRef = useRef(null);

  // Keep the visible list (and the active filter, if it no longer
  // exists) in sync once the jobs actually arrive from the API.
  useEffect(() => {
    if (!departments.includes(activeFilter)) {
      setActiveFilter(ALL_FILTER);
      setDisplayedJobs(jobs);
      return;
    }
    setDisplayedJobs(getJobsForFilter(jobs, activeFilter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  const headerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsHeaderVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFilterClick = (dept) => {
    if (dept === activeFilter || isLeaving) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setActiveFilter(dept);
      setDisplayedJobs(getJobsForFilter(jobs, dept));
      return;
    }

    // Play the exit animation on the current cards first, then swap
    // the data and let the (already-existing) entrance animation
    // handle the new set — avoids the old "cards just vanish" cut.
    pendingFilterRef.current = dept;
    setIsLeaving(true);

    window.setTimeout(() => {
      const nextDept = pendingFilterRef.current;
      setActiveFilter(nextDept);
      setDisplayedJobs(getJobsForFilter(jobs, nextDept));
      setIsLeaving(false);
    }, 260);
  };

  // Pre-fill "Position Applying For" in the form below, then scroll to it.
  // Jobs with their own external apply_url keep opening that link instead.
  const handleApplyClick = (job) => (e) => {
    if (job.applyUrl) return;

    e.preventDefault();

    window.dispatchEvent(
      new CustomEvent('gaf:select-position', {
        detail: { title: job.title, slug: job.slug },
      })
    );

    const form = document.getElementById('apply');
    if (form) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <section id="open-positions" className="ops-section">
      <div
        ref={headerRef}
        className={`ops-header ${isHeaderVisible ? 'ops-header--visible' : ''}`}
      >
        <h2 className="ops-title">Current Opportunities</h2>
        <p className="ops-subtitle">Discover where your talents can flourish.</p>

        <div className="ops-filters">
          {departments.map((dept, i) => (
            <button
              key={dept}
              type="button"
              className={`ops-filter-btn ${activeFilter === dept ? 'ops-filter-btn--active' : ''}`}
              style={{ transitionDelay: `${0.25 + i * 0.07}s` }}
              onClick={() => handleFilterClick(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {loading && jobs.length === 0 && (
        <p className="ops-empty" role="status">Loading open positions…</p>
      )}

      {error && jobs.length === 0 && !loading && (
        <div className="ops-empty" role="alert">
          <p>We couldn't load open positions. {error}</p>
          <button
            type="button"
            className="ops-filter-btn"
            onClick={() => dispatch(getCareersRequest())}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && (jobs.length > 0 || !error) && (
        <div
          className={`ops-grid ${isLeaving ? 'ops-grid--leaving' : ''}`}
          key={activeFilter}
        >
          {displayedJobs.length === 0 ? (
            <p className="ops-empty">No open positions in this department right now.</p>
          ) : (
            displayedJobs.map((job, i) => (
              <div
                key={job.id}
                className="ops-card"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <img
                  src={CORNER_IMAGE_SRC}
                  alt="corner image"
                  aria-hidden="true"
                  className="ops-corner-image"
                />

                <div className="ops-card-content">
                  <span className="ops-department">{job.department}</span>
                  <h3 className="ops-job-title">{job.title}</h3>

                  <div className="ops-meta">
                    <span className="ops-meta-item">
                      <MapPin size={14} aria-hidden="true" />
                      {job.location}
                    </span>
                    <span className="ops-meta-item">
                      <Clock size={14} aria-hidden="true" />
                      {job.type}
                    </span>
                  </div>

                  <p className="ops-description">{job.description}</p>

                  {/* External apply_url still opens in a new tab. Otherwise the
                      click selects this role in the form and scrolls to it. The
                      ?position= link is the fallback for new tabs / copied links. */}
                  <a
                    href={job.applyUrl || `?position=${encodeURIComponent(job.slug)}#apply`}
                    onClick={handleApplyClick(job)}
                    target={job.applyUrl ? '_blank' : undefined}
                    rel={job.applyUrl ? 'noopener noreferrer' : undefined}
                    className="ops-apply"
                    aria-label={`Apply now for ${job.title}`}
                  >
                    Apply Now
                    <ArrowRight size={16} className="ops-apply-arrow" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}