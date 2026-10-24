"use client";

import { useSelector } from "react-redux";

// Fixed step order/labels. The API only supplies the content for each.
const STEP_DEFINITIONS = [
  { key: "challenge", title: "Our Challenge" },
  { key: "solution", title: "Our Solution" },
  { key: "execution", title: "Our Execution" },
];

function isHtml(value) {
  return typeof value === "string" && /<[a-z][\s\S]*>/i.test(value);
}

// True only if the value has real visible content. The dashboard's editor
// saves "empty" fields as "<p></p>" or "<p>&nbsp;</p>", which are truthy
// strings but show nothing. Media tags count as content.
function hasMeaningfulContent(value) {
  if (typeof value !== "string") return false;
  if (/<(img|iframe|video)\b/i.test(value)) return true;

  const text = value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 0;
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
  const project = useSelector((state) => state.ProjectDetail?.data);

  if (!project) return null;

  const content = project.content ?? {};

  // Keep only steps with real content, then number them sequentially
  // (01, 02, 03) based on what's left, so there are no gaps like 01, 03.
  const steps = STEP_DEFINITIONS.filter((def) =>
    hasMeaningfulContent(content[def.key])
  ).map((def, index) => ({
    key: def.key,
    title: def.title,
    description: content[def.key],
    display_no: String(index + 1).padStart(2, "0"),
  }));

  // Hide the whole section when none of the three has content
  if (steps.length === 0) return null;

  return (
    <section className="projectDetailProcessSection" aria-label="Project process">
      {steps.map((step, index) => (
        <ProcessRow key={step.key} step={step} isAlt={index % 2 === 1} />
      ))}
    </section>
  );
}