import React from "react";
import "../styles/variables.css";
import "../styles/base.css";
import "../styles/layout.css";
import "../styles/buttons.css";
import "../styles/loader.css";
import "../styles/header-waitlist.css";
import "../styles/gallery.css";
import "../styles/cta.css";
import "../styles/animations.css";
import "../styles/inactivity-hint.css";

export default function ScrollAnimation() {
  return (
    <section className="scroll-outer">
      <div className="sticky-viewport">
        <div className="images-stack">
          <div className="stacked-image-wrapper" style={{ zIndex: 1 }}>
            <video
              className="stacked-image"
              src="/animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
