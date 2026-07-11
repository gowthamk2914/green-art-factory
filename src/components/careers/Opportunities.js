'use client';

import { useMemo, useState } from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

const CORNER_IMAGE_SRC = '/images/card-corner-leaf.png';

const DEPARTMENTS = ['All Departments', 'Landscape Design', 'Botanical Care', 'Operations'];

const JOBS = [
  {
    id: 1,
    department: 'Landscape Design',
    title: 'Senior Landscape Architect',
    location: 'Dubai, UAE',
    type: 'Full-Time',
    description:
      'Lead the design and execution of premium botanical installations for luxury commercial and residential clients.',
  },
  {
    id: 2,
    department: 'Botanical Care',
    title: 'Horticulture Specialist',
    location: 'Tamilnadu, India',
    type: 'Full-Time',
    description:
      'Maintain and nurture our signature indoor green spaces, ensuring optimal health and aesthetic perfection of exotic plants.',
  },
  {
    id: 3,
    department: 'Operations',
    title: 'Project Manager',
    location: 'Remote / Hybrid',
    type: 'Full-Time',
    description:
      'Coordinate complex landscaping installations, liaising between designers, clients, and on-site horticultural teams.',
  },
  {
    id: 4,
    department: 'Studio',
    title: 'Botanical Photographer',
    location: 'Dubai, UAE',
    type: 'Part-Time',
    description:
      'Capture the essence of our living designs for editorial features and premium portfolio presentations.',
  },
];

export default function Opportunities() {
  const [activeFilter, setActiveFilter] = useState('All Departments');

  const filteredJobs = useMemo(() => {
    if (activeFilter === 'All Departments') return JOBS;
    return JOBS.filter((job) => job.department === activeFilter);
  }, [activeFilter]);

  return (
    <section className="ops-section">
      <div className="ops-header">
        <h2 className="ops-title">Current Opportunities</h2>
        <p className="ops-subtitle">Discover where your talents can flourish.</p>

        <div className="ops-filters">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              type="button"
              className={`ops-filter-btn ${activeFilter === dept ? 'ops-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="ops-grid" key={activeFilter}>
        {filteredJobs.length === 0 ? (
          <p className="ops-empty">No open positions in this department right now.</p>
        ) : (
          filteredJobs.map((job, i) => (
            <div
              key={job.id}
              className="ops-card"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <img
                src={CORNER_IMAGE_SRC}
                alt=""
                aria-hidden="true"
                className="ops-corner-image"
              />

              <div className="ops-card-content">
                <span className="ops-department">{job.department}</span>
                <h3 className="ops-job-title">{job.title}</h3>

                <div className="ops-meta">
                  <span className="ops-meta-item">
                    <MapPin size={14} />
                    {job.location}
                  </span>
                  <span className="ops-meta-item">
                    <Clock size={14} />
                    {job.type}
                  </span>
                </div>

                <p className="ops-description">{job.description}</p>

                <a href={`#apply-${job.id}`} className="ops-apply">
                  Apply Now
                  <ArrowRight size={16} className="ops-apply-arrow" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}