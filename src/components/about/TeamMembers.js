import Image from "next/image";

/* Replace every team photo with your real one in /public. */
const TEAM = [
  { name: "John Smith", role: "Company CEO", image: "/images/about-team-1.png" },
  { name: "David Johnson", role: "Co-Founder", image: "/images/about-team-2.png" },
  { name: "Mary Johnson", role: "Property Managers", image: "/images/about-team-3.png" },
  { name: "Patricia Davis", role: "Estate Consultant", image: "/images/about-team-4.png" },
  { name: "Patricia Davis", role: "Estate Consultant", image: "/images/about-team-3.png" },
];

/* Your 6 wave-shape assets: 3 colors × up/down. File names below are
   guesses — rename these to match whatever you actually saved them as
   in /public/images/. */
const COLORS = ["peach", "pink", "blue"];
const DIRECTIONS = ["up", "down"];

function getWaveVariant(index) {
  const color = COLORS[index % COLORS.length];
  const direction = DIRECTIONS[index % 2]; // alternates every card
  return {
    direction,
    src: `/images/${color}-${direction}.png`,
  };
}

function TeamCard({ member, index }) {
  const wave = getWaveVariant(index);

  return (
    <div className={`gaf-team-card gaf-team-card--${wave.direction}`}>
      <div className="gaf-team-photo-wrap">
        {/* The colored wave shape itself, sitting behind the photo */}
        <img src={wave.src} alt="" aria-hidden="true" className="gaf-team-wave-bg" />

        {/* The portrait, masked to the exact same PNG shape so it only
            shows through the wave silhouette — no hand-coded SVG path,
            it uses your actual asset's alpha shape directly. */}
        <div
          className="gaf-team-photo-mask"
          style={{
            WebkitMaskImage: `url(${wave.src})`,
            maskImage: `url(${wave.src})`,
          }}
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="280px"
            className="gaf-team-photo"
          />
        </div>
      </div>

      <h3 className="gaf-team-name">{member.name}</h3>
      <p className="gaf-team-role">{member.role}</p>
    </div>
  );
}

export default function TeamMembers() {
  // Rendered 4x back-to-back. With only 2 copies, any screen wider than
  // roughly half the track's total width runs out of duplicated cards
  // before the animation reaches its wrap point — which is exactly the
  // "blank space near the end of the loop" symptom. 4 copies leaves a
  // much bigger content buffer ahead of the visible window at all times.
  const loopedTeam = [...TEAM, ...TEAM, ...TEAM, ...TEAM];

  return (
    <section className="gaf-team-section">
      <h2 className="gaf-team-heading">Meet Our Team</h2>
      <p className="gaf-team-subtext">
        Our dedicated team of experienced real estate professionals is at the
        heart of what we do. With a deep knowledge of the local market and a
        passion for helping clients achieve their real estate goals.
      </p>

      <div className="gaf-team-marquee">
        <div className="gaf-team-track">
          {loopedTeam.map((member, i) => (
            <TeamCard key={`${member.name}-${i}`} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}