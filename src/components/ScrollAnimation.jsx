import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Clocks.css";
import ContactForm from "./ContactForm";

export default function ScrollAnimation() {
  const outerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });

  // Static list: include all shots known by filename pattern
  const images = [
    ...Array.from({ length: 8 }, (_, i) => `/shots/interface_20251029_2 копия-${i + 1}.png`),
    ...Array.from({ length: 38 }, (_, i) => `/shots/interface_20251029_2 копия-${i + 10}.png`)
  ];

  // Track current frame index based on scroll progress; render just one frame
  const [currentIndex, setCurrentIndex] = React.useState(0);
  React.useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const total = images.length;
      const idx = Math.min(total - 1, Math.max(0, Math.floor(v * (total - 1))));
      setCurrentIndex(idx);
    });
    return () => { unsub && unsub(); };
  }, [scrollYProgress, images.length]);

  return (
    <section ref={outerRef} className="scroll-outer">
      <div className="sticky-viewport">
        <div className="images-stack">
          <div className="stacked-image-wrapper" style={{ zIndex: 1 }}>
            <img
              src={images[currentIndex]}
              alt={`Shot ${currentIndex + 1}`}
              className="stacked-image"
              loading="eager"
            />
          </div>
        </div>
        {/* End-of-scroll overlay */}
        {/* <motion.div
          className="cta-overlay"
          style={{ opacity: useTransform(scrollYProgress, [0.85, 1], [0, 1]) }}
        >
          <div className="cta-card"><ContactForm /></div>
        </motion.div> */}
        <HintOnInactivity />
      </div>
    </section>
  );
}

function HintOnInactivity() {
  const hintRef = useRef(null);
  React.useEffect(() => {
    let timer;
    const show = () => {
      if (hintRef.current) hintRef.current.classList.add("visible");
    };
    const hide = () => {
      if (hintRef.current) hintRef.current.classList.remove("visible");
      window.removeEventListener("scroll", hide, { passive: true });
      window.removeEventListener("wheel", hide, { passive: true });
      window.removeEventListener("touchstart", hide, { passive: true });
    };
    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(show, 10000);
      window.addEventListener("scroll", hide, { passive: true });
      window.addEventListener("wheel", hide, { passive: true });
      window.addEventListener("touchstart", hide, { passive: true });
    };
    const onReady = () => startTimer();
    window.addEventListener("app-ready", onReady, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("app-ready", onReady);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("wheel", hide);
      window.removeEventListener("touchstart", hide);
    };
  }, []);
  return <div ref={hintRef} className="scroll-hint-floating">Scroll to explore the demo ↓</div>;
}