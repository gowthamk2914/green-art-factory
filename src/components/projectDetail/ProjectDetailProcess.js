"use client";

import { useSelector } from "react-redux";

// Fixed step order/labels — the API gives us the content for each under
// `content.challenge` / `content.solution` / `content.execution`, but no
// title or number of its own, so those stay hardcoded here.
const STEP_DEFINITIONS = [
  { key: "challenge", title: "Our Challenge" },
  { key: "solution", title: "Our Solution" },
  { key: "execution", title: "Our Execution" },
];

// content.* values come through as HTML strings (e.g. "<p>...</p>"),
// same pattern as design_approach.description.
function isHtml(value) {
  return typeof value === "string" && /<[a-z][\s\S]*>/i.test(value);
}

function ProcessRow({ step, isAlt }) {
  return (
    <div className={`projectDetailProcessRow${isAlt ? " isAlt" : ""}`}>
      <div className="projectDetailProcessInner">
        <div className="projectDetailProcessHeadingCol">
          <span className="projectDetailProcessNumber">{step.display_no}</span>
          <h3 className="projectDetailProcessTitle">{step.title}</h3>
        </div>

        {isHtml(step.description) ? (
          <div
            className="projectDetailProcessDescription"
            dangerouslySetInnerHTML={{ __html: step.description }}
          />
        ) : (
          <p className="projectDetailProcessDescription">{step.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetailProcess() {
  // `ProjectDetail` must match the key used in your rootReducer.
  // The [slug] page dispatches the fetch — this component only reads.
  const project = useSelector((state) => state.ProjectDetail?.data);

  if (!project) return null;

  const content = project.content ?? {};

  // Only include steps the API actually filled in, and number them
  // sequentially (01, 02, 03...) based on what's present rather than a
  // fixed index — so a project missing e.g. "challenge" doesn't leave a
  // gap like 01, 03.
  const steps = STEP_DEFINITIONS.filter((def) => Boolean(content[def.key])).map(
    (def, index) => ({
      title: def.title,
      description: content[def.key],
      display_no: String(index + 1).padStart(2, "0"),
    })
  );

  if (steps.length === 0) return null;

  return (
    <section className="projectDetailProcessSection" aria-label="Project process">
      {steps.map((step, index) => (
        <ProcessRow key={step.title} step={step} isAlt={index % 2 === 1} />
      ))}
    </section>
  );
}