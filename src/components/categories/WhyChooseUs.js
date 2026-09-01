"use client";

import { useSelector } from "react-redux";

export default function WhyChooseUs() {
  const {
    data: pageData,
  } = useSelector(
    (state) => state.NatureShowcase
  );

  const whyChooseUs =
    pageData?.why_choose_us || [];

  return (
    <section className="why-choose-us-section">
      <div className="container">
        <div className="why-choose-us-wrapper">

          <h3 className="why-choose-us-title">
            Why Choose Us ?
          </h3>

          <div className="why-choose-us-grid-wrapper">
            {whyChooseUs
              .sort(
                (a, b) =>
                  Number(a.display_no) -
                  Number(b.display_no)
              )
              .map((item) => (
                <div
                  className="why-choose-us-grid"
                  key={item.id}
                >
                  <h3>
                    {item.display_no}. {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>
                </div>
              ))}
          </div>

        </div>
      </div>
    </section>
  );
}