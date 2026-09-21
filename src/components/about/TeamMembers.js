"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

// Adjust this path to wherever your teamMembers/actions.js lives
import { getTeamMembersRequest } from "../../redux/TeamMembers/actions";

/* Your 6 wave-shape assets: 3 colors × up/down. */
const COLORS = ["peach", "pink", "blue"];
const DIRECTIONS = ["up", "down"];

const SECONDS_PER_CARD = 6; // same speed as before (30s / 5 cards)
const SECONDS_PER_CARD_MOBILE = 4.4;

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
        <img src={wave.src} alt="" aria-hidden="true" className="gaf-team-wave-bg" />

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
  const dispatch = useDispatch();

  // `teamMembers` must match the key used in your rootReducer
const { data, loading, error } = useSelector((state) => state.TeamMembers);


  useEffect(() => {
    dispatch(getTeamMembersRequest());
  }, [dispatch]);

  /* Map API fields (designation -> role) and build one "set" of cards.
     If the API returns only a few people, the set is padded (min 6, even
     count) so one set fills a wide screen and the up/down pattern stays
     seamless at the loop point. */
  const baseSet = useMemo(() => {
    const base = (data || []).map((m) => ({
      id: m.id,
      name: m.name,
      role: m.designation,
      image: m.image,
    }));
    if (base.length === 0) return [];

    const set = [...base];
    while (set.length < 6 || set.length % 2 !== 0) {
      set.push(base[set.length % base.length]);
    }
    return set;
  }, [data]);

  // 4 back-to-back copies (keeps the -25% keyframe valid)
  const loopedTeam = useMemo(
    () => [...baseSet, ...baseSet, ...baseSet, ...baseSet],
    [baseSet]
  );

  const trackStyle = {
    "--gaf-duration": `${baseSet.length * SECONDS_PER_CARD}s`,
    "--gaf-duration-mobile": `${baseSet.length * SECONDS_PER_CARD_MOBILE}s`,
  };

  return (
    <section className="gaf-team-section">
      <h2 className="gaf-team-heading">Meet Our Team</h2>
      <p className="gaf-team-subtext">
        Our dedicated team of experienced real estate professionals is at the
        heart of what we do. With a deep knowledge of the local market and a
        passion for helping clients achieve their real estate goals.
      </p>

      {loading && baseSet.length === 0 && (
        <p className="gaf-team-status" role="status">Loading our team…</p>
      )}

      {error && baseSet.length === 0 && (
        <div className="gaf-team-status" role="alert">
          <p>We couldn't load the team. {error}</p>
          <button
            type="button"
            className="gaf-team-retry"
            onClick={() => dispatch(getTeamMembersRequest())}
          >
            Try again
          </button>
        </div>
      )}

      {baseSet.length > 0 && (
        <div className="gaf-team-marquee">
          <div className="gaf-team-track" style={trackStyle}>
            {loopedTeam.map((member, i) => (
              <TeamCard
                key={`${member.id}-${i}`}
                member={member}
                index={i % baseSet.length}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}