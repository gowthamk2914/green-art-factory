'use client';

import { useEffect, useState } from 'react';
import { Clock, CalendarClock } from 'lucide-react';


const HOURS = [
  { day: 'Monday', time: '8:00 AM — 6:00 PM', open: true },
  { day: 'Tuesday', time: '8:00 AM — 6:00 PM', open: true },
  { day: 'Wednesday', time: '8:00 AM — 6:00 PM', open: true },
  { day: 'Thursday', time: '8:00 AM — 6:00 PM', open: true },
  { day: 'Friday', time: '8:00 AM — 5:00 PM', open: true },
  { day: 'Saturday', time: '9:00 AM — 2:00 PM', open: true },
  { day: 'Sunday', time: 'Closed', open: false },
];

export default function BusinessHours() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-[820px] bg-gradient-to-br from-[#3B4A1F] via-[#2E3A18] to-[#1F2811] px-6 py-24 overflow-hidden">
      {/* ambient glows — plain CSS keyframe driven */}
      <div className="bh-glow bh-glow--one" />
      <div className="bh-glow bh-glow--two" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr_340px] gap-6 items-start">
        {/* LEFT: intro card */}
        <div
          className={`bh-card rounded-[24px] bg-white/[0.08] border border-white/10 p-8 self-center transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
          }`}
        >
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            When We're
            <br />
            <span className="text-[#34D399]">Available</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            We dedicate time to understanding your vision. Visit us, call, or schedule a
            consultation during our working hours.
          </p>
          <button className="bh-btn group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[#2E3A18] font-semibold shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-[1.04] active:scale-95">
            Book a Consultation
          </button>
        </div>

        {/* CENTER: operating hours card */}
        <div
          className={`rounded-[28px] bg-white/[0.06] border border-white/10 backdrop-blur-sm p-8 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '120ms' }}
        >
          <div className="flex items-start gap-4">
            <div className="bh-icon-box w-11 h-11 rounded-xl bg-[#34D399]/15 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#34D399]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Operating Hours</h3>
              <p className="text-sm text-white/50 mt-0.5">All branches follow the same schedule</p>
            </div>
          </div>

          <ul className="mt-6 divide-y divide-white/10">
            {HOURS.map((row, i) => (
              <li
                key={row.day}
                className={`bh-row flex items-center justify-between py-4 transition-all duration-500 ease-out ${
                  mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: `${220 + i * 70}ms` }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      row.open ? 'bg-[#34D399] bh-dot-live' : 'bg-white/25'
                    }`}
                  />
                  <span className={`font-medium ${row.open ? 'text-white' : 'text-white/40'}`}>
                    {row.day}
                  </span>
                </span>
                <span className={row.open ? 'text-white/70' : 'text-white/30'}>{row.time}</span>
              </li>
            ))}
          </ul>

          <div className="bh-emergency mt-5 rounded-xl bg-[#34D399]/10 border-l-4 border-[#34D399] px-5 py-4">
            <p className="text-sm text-white/80 leading-relaxed">
              Emergency consultations and after-hours support available via WhatsApp 24/7.
            </p>
          </div>
        </div>

        {/* RIGHT: image + public holidays */}
        <div
          className={`flex flex-col gap-6 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="bh-image-card relative rounded-[24px] overflow-hidden h-56 group cursor-pointer">
            <img
              src="images/bh-image-card.png"
              alt="Garden bathed in golden light"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <p className="absolute bottom-4 left-5 right-5 text-white font-semibold text-[15px]">
              Your garden awaits transformation
            </p>
          </div>

          <div className="rounded-[20px] bg-white/[0.06] border border-white/10 p-6">
            <div className="flex items-center gap-2 text-[#34D399]">
              <CalendarClock className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase">Public Holidays</span>
            </div>
            <p className="mt-2.5 text-sm text-white/60 leading-relaxed">
              Hours may vary on public holidays. Please call ahead or check our socials for
              updates.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}