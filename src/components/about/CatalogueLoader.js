"use client";

// Server Components (like your About page) aren't allowed to call
// next/dynamic with { ssr: false } directly — Next.js throws a build
// error if you try. This tiny Client Component does that dynamic import
// instead, so About.js can just import THIS file normally.
//
// react-pdf / react-pageflip touch browser-only APIs (DOMMatrix, canvas)
// as soon as their modules load, so they must never be evaluated during
// server rendering — ssr:false is what prevents that.

import dynamic from "next/dynamic";

const Catalogue = dynamic(() => import("./Catalogue"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "56px 24px", textAlign: "center", color: "#b9bcae" }}>
      Loading catalogue…
    </div>
  ),
});

export default Catalogue;