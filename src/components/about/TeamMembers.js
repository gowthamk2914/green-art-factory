import Image from "next/image";

/* Replace every image with your real team photos in /public.
   `bg` cycles through the three reference colors automatically if
   you don't set one, so you can just add more people below. */
const BG_COLORS = ["#f6d9b8", "#f4b9bb", "#bcd9ee"];

const TEAM = [
  { name: "John Smith", role: "Company CEO", image: "/images/team/john-smith.jpg" },
  { name: "David Johnson", role: "Co-Founder", image: "/images/team/david-johnson.jpg" },
  { name: "Mary Johnson", role: "Property Managers", image: "/images/team/mary-johnson.jpg" },
  { name: "Patricia Davis", role: "Estate Consultant", image: "/images/team/patricia-davis-1.jpg" },
  { name: "Patricia Davis", role: "Estate Consultant", image: "/images/team/patricia-davis-2.jpg" },
];

function TeamCard({ member, index }) {
  const bg = BG_COLORS[index % BG_COLORS.length];

  return (
    <div className="gaf-team-card">
      <div className="gaf-team-photo-wrap" style={{ backgroundColor: bg }}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="280px"
          className="gaf-team-photo"
        />
      </div>
      <h3 className="gaf-team-name">{member.name}</h3>
      <p className="gaf-team-role">{member.role}</p>
    </div>
  );
}

export default function TeamMembers() {
  // Rendered twice back-to-back so the CSS animation can loop from
  // -50% back to 0% with zero visible seam — always moving, never
  // resetting or pausing.
  const loopedTeam = [...TEAM, ...TEAM];

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

      {/* wave clip-path shared by every card, scales with each card's
          own box since clipPathUnits is objectBoundingBox */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="gaf-team-wave" clipPathUnits="objectBoundingBox">
            <path d="M0,0.16 C0.18,0 0.32,0.3 0.5,0.16 C0.68,0.02 0.82,0.32 1,0.16 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
}