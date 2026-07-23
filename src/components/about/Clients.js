// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import Image from "next/image";

// const BG_IMAGE = "/images/clients-bg.png";


// const CLIENTS = [
//   { id: 1, logo: "/images/logo.png" },
//   { id: 2, logo: "/images/logo.png" },
//   { id: 3, logo: "/images/logo.png" },
//   { id: 4, logo: "/images/logo.png" },
//   { id: 5, logo: "/images/logo.png" },
//   { id: 6, logo: "/images/logo.png" },
//   { id: 7, logo: "/images/logo.png" },
// ];

// const LOGO_PX = {
//   sm: 40,
//   md: 56,
//   lg: 76,
//   xl: 100,
// };

// /* visibleCount = how many cards sit in the row, spacing = px distance
//    between each card's center. Keep visibleCount odd so there's always
//    one true center card. */
// const BREAKPOINTS = [
//   { minWidth: 1024, visibleCount: 5, spacing: 210 },
//   { minWidth: 640, visibleCount: 3, spacing: 160 },
//   { minWidth: 0, visibleCount: 1, spacing: 130 },
// ];

// function getLayout(width) {
//   const match = BREAKPOINTS.find((bp) => width >= bp.minWidth);
//   return match || BREAKPOINTS[BREAKPOINTS.length - 1];
// }

// function sizeForOffset(absOffset) {
//   if (absOffset === 0) return "xl";
//   if (absOffset === 1) return "lg";
//   if (absOffset === 2) return "md";
//   return "sm";
// }

// /* True modulo (handles negative numbers), so content always wraps
//    around the CLIENTS array in both directions. */
// function mod(n, m) {
//   return ((n % m) + m) % m;
// }

// const DRAG_THRESHOLD_PX = 4;




// export default function Clients() {
//   /* `active` is an unbounded integer, not clamped to the array length.
//      Content wraps via mod() at render time, but the raw number keeps
//      climbing/falling so the slide animation never has to "jump". */
//   const [active, setActive] = useState(0);
//   const [layout, setLayout] = useState(BREAKPOINTS[0]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragDeltaPx, setDragDeltaPx] = useState(0);

//   const dragStartXRef = useRef(0);
//   const draggedRef = useRef(false);

//   useEffect(() => {
//     const updateLayout = () => setLayout(getLayout(window.innerWidth));
//     updateLayout();
//     window.addEventListener("resize", updateLayout);
//     return () => window.removeEventListener("resize", updateLayout);
//   }, []);

//   const total = CLIENTS.length;
//   const { visibleCount, spacing } = layout;
//   const half = Math.floor(visibleCount / 2);
//   const buffer = 2; /* extra hidden cards each side, for a smooth edge */

//   const goTo = useCallback((steps) => {
//     setActive((prev) => prev + steps);
//   }, []);

//   const handlePrev = useCallback(() => goTo(-1), [goTo]);
//   const handleNext = useCallback(() => goTo(1), [goTo]);

//   const endDrag = useCallback(() => {
//     if (!isDragging) return;
//     const steps = Math.round(-dragDeltaPx / spacing);
//     setIsDragging(false);
//     setDragDeltaPx(0);
//     if (steps !== 0) {
//       setActive((prev) => prev + steps);
//     }
//   }, [isDragging, dragDeltaPx, spacing]);

//   const handlePointerDown = (e) => {
//     setIsDragging(true);
//     draggedRef.current = false;
//     dragStartXRef.current = e.clientX;
//     e.currentTarget.setPointerCapture?.(e.pointerId);
//   };

//   const handlePointerMove = (e) => {
//     if (!isDragging) return;
//     const delta = e.clientX - dragStartXRef.current;
//     if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
//       draggedRef.current = true;
//     }
//     setDragDeltaPx(delta);
//   };

//   const handlePointerUp = () => {
//     endDrag();
//   };

//   const handlePointerLeave = () => {
//     if (isDragging) endDrag();
//   };

//   /* Swallow the click that fires right after a drag, so releasing the
//      cursor over a card doesn't also trigger a click action on it. */
//   const handleTrackClickCapture = (e) => {
//     if (draggedRef.current) {
//       e.stopPropagation();
//       e.preventDefault();
//       draggedRef.current = false;
//     }
//   };

//   const outerHalf = half + buffer;
//   const slots = [];
//   for (let offset = -outerHalf; offset <= outerHalf; offset += 1) {
//     const rawIndex = active + offset;
//     const virtualIndex = mod(rawIndex, total);
//     slots.push({ key: rawIndex, offset, client: CLIENTS[virtualIndex] });
//   }

//   const [isPaused, setIsPaused] = useState(false);

// useEffect(() => {
//   if (isDragging || isPaused) return;

//   const interval = setInterval(() => {
//     setActive((prev) => prev + 1);
//   }, 2000);

//   return () => clearInterval(interval);
// }, [isDragging, isPaused]);


// const GAP = 30;

// const cardWidths = {
//   xl: 220,
//   lg: 180,
//   md: 150,
//   sm: 120,
// };

// function getTranslate(offset) {
//   let x = 0;

//   if (offset > 0) {
//     for (let i = 1; i <= offset; i++) {
//       const prev = sizeForOffset(i - 1);
//       const curr = sizeForOffset(i);

//       x +=
//         (cardWidths[prev] + cardWidths[curr]) / 2 + GAP;
//     }
//   } else if (offset < 0) {
//     for (let i = -1; i >= offset; i--) {
//       const prev = sizeForOffset(Math.abs(i + 1));
//       const curr = sizeForOffset(Math.abs(i));

//       x -=
//         (cardWidths[prev] + cardWidths[curr]) / 2 + GAP;
//     }
//   }

//   return x;
// }


//   return (
//     <section
//       className="gaf-clients-section"
//       style={{ backgroundImage: `url(${BG_IMAGE})` }}
//     >
//       <div className="gaf-clients-badge">Trusted Leaders</div>

//       <h2 className="gaf-clients-heading">
//         Clients We&rsquo;ve Partnered With
//       </h2>

//       <div className="gaf-clients-carousel">
//         <div
//   className={`gaf-clients-track ${
//     isDragging ? "gaf-clients-track--dragging" : ""
//   }`}
//   onPointerDown={handlePointerDown}
//   onPointerMove={handlePointerMove}
//   onPointerUp={handlePointerUp}
//   onPointerCancel={handlePointerUp}
//   onPointerLeave={handlePointerLeave}
//   onClickCapture={handleTrackClickCapture}
//   onMouseEnter={() => setIsPaused(true)}
//   onMouseLeave={() => setIsPaused(false)}
// >
//           {slots.map(({ key, offset, client }) => {
//             const absOffset = Math.abs(offset);
//             const sizeName = sizeForOffset(absOffset);
//             const sizeClass = `gaf-clients-card--${sizeName}`;
//             const logoPx = LOGO_PX[sizeName];
//             const isCenter = offset === 0;
//             const isVisible = absOffset <= half;

//             const translateX =
//   getTranslate(offset) + (isDragging ? dragDeltaPx : 0);

//             return (
//               <div
//                 key={key}
//                 className={`gaf-clients-card ${sizeClass} ${
//                   isCenter ? "gaf-clients-card--center" : ""
//                 }`}
//                 style={{
//                   transform: `translate(-50%, -50%) translateX(${translateX}px)`,
//                   transition: isDragging
//                     ? "none"
//                     : "transform 0.4s ease, width 0.4s ease, height 0.4s ease, opacity 0.4s ease",
//                   opacity: isVisible ? undefined : 0,
//                   pointerEvents: isVisible ? "auto" : "none",
//                 }}
//               >
//                 <Image
//                   src={client.logo}
//                   alt={`Client ${client.id} logo`}
//                   width={logoPx}
//                   height={logoPx}
//                   className="gaf-clients-logo-img"
//                   draggable={false}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="gaf-clients-controls">
//         <button
//           type="button"
//           className="gaf-clients-nav-btn"
//           aria-label="Previous client"
//           onClick={handlePrev}
//         >
//           <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
//             <path
//               d="M9 1L2 8L9 15"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>

//         <button
//           type="button"
//           className="gaf-clients-nav-btn"
//           aria-label="Next client"
//           onClick={handleNext}
//         >
//           <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
//             <path
//               d="M1 1L8 8L1 15"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>
//       </div>

//       <p className="gaf-clients-description">
//         Our clients are at the heart of everything we do.
//         <br />
//         Their trust and satisfaction inspire us to deliver excellence every day.
//       </p>
//     </section>
//   );
// }




"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { getPartnersRequest } from "../../redux/Clients/actions";

const BG_IMAGE = "/images/clients-bg.png";


const LOGO_PX = {
  sm: 40,
  md: 56,
  lg: 76,
  xl: 100,
};

/* visibleCount = how many cards sit in the row, spacing = px distance
   between each card's center. Keep visibleCount odd so there's always
   one true center card. */
const BREAKPOINTS = [
  { minWidth: 1024, visibleCount: 5, spacing: 210 },
  { minWidth: 640, visibleCount: 3, spacing: 160 },
  { minWidth: 0, visibleCount: 1, spacing: 130 },
];

function getLayout(width) {
  const match = BREAKPOINTS.find((bp) => width >= bp.minWidth);
  return match || BREAKPOINTS[BREAKPOINTS.length - 1];
}

function sizeForOffset(absOffset) {
  if (absOffset === 0) return "xl";
  if (absOffset === 1) return "lg";
  if (absOffset === 2) return "md";
  return "sm";
}

/* True modulo (handles negative numbers), so content always wraps
   around the CLIENTS array in both directions. */
function mod(n, m) {
  return ((n % m) + m) % m;
}

const DRAG_THRESHOLD_PX = 4;




export default function Clients() {

  const dispatch = useDispatch();

const {
  loading,
  data: CLIENTS,
  error,
} = useSelector(
  (state) => state.Clients
);

useEffect(() => {
  dispatch(getPartnersRequest());
}, [dispatch]);


  /* `active` is an unbounded integer, not clamped to the array length.
     Content wraps via mod() at render time, but the raw number keeps
     climbing/falling so the slide animation never has to "jump". */
  const [active, setActive] = useState(0);
  const [layout, setLayout] = useState(BREAKPOINTS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDeltaPx, setDragDeltaPx] = useState(0);

  const dragStartXRef = useRef(0);
  const draggedRef = useRef(false);

  useEffect(() => {
    const updateLayout = () => setLayout(getLayout(window.innerWidth));
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);



  const clients = Array.isArray(CLIENTS) ? CLIENTS : [];
  const total = clients.length;
  const { visibleCount, spacing } = layout;
  const half = Math.floor(visibleCount / 2);
  const buffer = 2; /* extra hidden cards each side, for a smooth edge */

  const goTo = useCallback((steps) => {
    setActive((prev) => prev + steps);
  }, []);

  const handlePrev = useCallback(() => goTo(-1), [goTo]);
  const handleNext = useCallback(() => goTo(1), [goTo]);

  const endDrag = useCallback(() => {
    if (!isDragging) return;
    const steps = Math.round(-dragDeltaPx / spacing);
    setIsDragging(false);
    setDragDeltaPx(0);
    if (steps !== 0) {
      setActive((prev) => prev + steps);
    }
  }, [isDragging, dragDeltaPx, spacing]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    draggedRef.current = false;
    dragStartXRef.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
      draggedRef.current = true;
    }
    setDragDeltaPx(delta);
  };

  const handlePointerUp = () => {
    endDrag();
  };

  const handlePointerLeave = () => {
    if (isDragging) endDrag();
  };

  /* Swallow the click that fires right after a drag, so releasing the
     cursor over a card doesn't also trigger a click action on it. */
  const handleTrackClickCapture = (e) => {
    if (draggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      draggedRef.current = false;
    }
  };

  const outerHalf = half + buffer;
  const slots = [];

if (total > 0) {
  for (let offset = -outerHalf; offset <= outerHalf; offset++) {
    const rawIndex = active + offset;
    const virtualIndex = mod(rawIndex, total);

    slots.push({
      key: rawIndex,
      offset,
      client: clients[virtualIndex],
    });
  }
}
  const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
  if (isDragging || isPaused) return;

  const interval = setInterval(() => {
    setActive((prev) => prev + 1);
  }, 2000);

  return () => clearInterval(interval);
}, [isDragging, isPaused]);


const GAP = 30;

const cardWidths = {
  xl: 220,
  lg: 180,
  md: 150,
  sm: 120,
};

function getTranslate(offset) {
  let x = 0;

  if (offset > 0) {
    for (let i = 1; i <= offset; i++) {
      const prev = sizeForOffset(i - 1);
      const curr = sizeForOffset(i);

      x +=
        (cardWidths[prev] + cardWidths[curr]) / 2 + GAP;
    }
  } else if (offset < 0) {
    for (let i = -1; i >= offset; i--) {
      const prev = sizeForOffset(Math.abs(i + 1));
      const curr = sizeForOffset(Math.abs(i));

      x -=
        (cardWidths[prev] + cardWidths[curr]) / 2 + GAP;
    }
  }

  return x;
}


  return (
    <section
      className="gaf-clients-section"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      <div className="gaf-clients-badge">Trusted Leaders</div>

      <h2 className="gaf-clients-heading">
        Clients We&rsquo;ve Partnered With
      </h2>

      <div className="gaf-clients-carousel">
        <div
  className={`gaf-clients-track ${
    isDragging ? "gaf-clients-track--dragging" : ""
  }`}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={handlePointerUp}
  onPointerLeave={handlePointerLeave}
  onClickCapture={handleTrackClickCapture}
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
>
          {slots.map(({ key, offset, client }) => {
            if (!client) return null;
            const absOffset = Math.abs(offset);
            const sizeName = sizeForOffset(absOffset);
            const sizeClass = `gaf-clients-card--${sizeName}`;
            const logoPx = LOGO_PX[sizeName];
            const isCenter = offset === 0;
            const isVisible = absOffset <= half;

            const translateX =
  getTranslate(offset) + (isDragging ? dragDeltaPx : 0);

            return (
              <div
                key={key}
                className={`gaf-clients-card ${sizeClass} ${
                  isCenter ? "gaf-clients-card--center" : ""
                }`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px)`,
                  transition: isDragging
                    ? "none"
                    : "transform 0.4s ease, width 0.4s ease, height 0.4s ease, opacity 0.4s ease",
                  opacity: isVisible ? undefined : 0,
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                {/* <a
  href={client.website_url || "#"}
  target="_blank"
  rel="noopener noreferrer"
> */}
  <Image
    src={client.logo}
    alt={client.name}
    width={logoPx}
    height={logoPx}
    className="gaf-clients-logo-img"
    draggable={false}
  />
{/* </a> */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="gaf-clients-controls">
        <button
          type="button"
          className="gaf-clients-nav-btn"
          aria-label="Previous client"
          onClick={handlePrev}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M9 1L2 8L9 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="gaf-clients-nav-btn"
          aria-label="Next client"
          onClick={handleNext}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M1 1L8 8L1 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="gaf-clients-description">
        Our clients are at the heart of everything we do.
        <br />
        Their trust and satisfaction inspire us to deliver excellence every day.
      </p>
    </section>
  );
}