'use client';

import { useEffect, useState } from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';


const ADDRESS_LINE_1 = 'Green Art Factory, Green Moss Wall - Floristics Gardens St - Al';
const ADDRESS_LINE_2 = '- Warsan 3 - Dubai - United Arab Emirates';
const ADDRESS_QUERY = 'Green Art Factory, Floristics Garden Street, Al Warsan 3, Dubai, UAE';
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  ADDRESS_QUERY
)}&output=embed`;

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  ADDRESS_QUERY
)}`;

export default function VisitStudioSection() {
  const [mounted, setMounted] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="vs-section relative w-full px-6 py-20 overflow-hidden">
      {/* ambient drifting glows */}
      <div className="vs-glow vs-glow--one" />
      <div className="vs-glow vs-glow--two" />


                <h2
            className={`vs-title text-5xl sm:text-6xl font-extrabold text-[#4B5320] leading-[1.05] tracking-tight transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Visit Our Studio
          </h2>

          <p
            className={`mt-5 text-[17px] leading-relaxed text-[#7C8A66] vs-desc transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '120ms' }}
          >
            Step into our botanical studio and experience the world of luxury landscaping
            firsthand. Our design team is always ready to welcome you.
          </p>


      <div className="vs-heading-address-grid relative mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 items-start">
        {/* LEFT: heading + address card */}
        <div>


          <div
            className={`vs-card group rounded-3xl bg-[#F4F5F0] border border-black/[0.04] p-7 transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '260ms' }}
          >
            <div className="flex items-center gap-3">
              <div className="vs-icon-box w-10 h-10 rounded-xl bg-[#DCEEE2] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#2F9E5B]" strokeWidth={2.25} />
              </div>
              <h3 className="text-[#3F4A2A] font-semibold text-[17px]">Main Studio</h3>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-[#8B9678]">
              {ADDRESS_LINE_1}
              <br />
              {ADDRESS_LINE_2}
            </p>
          </div>

          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`vs-link group inline-flex items-center gap-1.5 mt-6 text-[13px] font-bold tracking-wide text-[#2F9E5B] uppercase transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '380ms' }}
          >
            <span className="vs-link-text">Get Directions</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* RIGHT: map card with reveal + animated pin overlay */}
        <div
          className={`vs-map-wrap relative rounded-[28px] p-3 bg-white transition-all duration-[900ms] ease-out ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
          }`}
          style={{ transitionDelay: '180ms' }}
        >
          <div className="vs-map-reveal relative rounded-[22px] overflow-hidden h-[420px] sm:h-[480px] shadow-2xl shadow-black/10">
            {!mapLoaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#EEF1E8]">
                <div className="vs-spinner" />
              </div>
            )}

            <iframe
              title="Studio location map"
              src={MAP_EMBED_SRC}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            />

          </div>
        </div>
      </div>

      
    </section>
  );
}