import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Clocks.css";

export default function ScrollAnimation() {
  const outerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });

  return (
    <section ref={outerRef} className="scroll-outer">
      <div className="sticky-viewport">
        <div className="grid-2x2">
          {[0, 1, 2, 3].map((index) => {
            const speeds = [1.0, 1.4, 1.8, 2.2];
            const start = index * 0.12;
            const end = start + 0.5;
            const y = useTransform(scrollYProgress, [0, 1], [
              `${30 * speeds[index]}%`,
              `${-30 * speeds[index]}%`,
            ]);
            const opacity = useTransform(scrollYProgress, [0, start, end], [0, 0, 1]);
            return (
              <div className="cell" key={index}>
                <motion.div className="number" style={{ y, opacity }}>
                  {index + 1}
                </motion.div>
              </div>
            );
          })}
        </div>
        {/* End-of-scroll overlay */}
        <motion.div
          className="cta-overlay"
          style={{ opacity: useTransform(scrollYProgress, [0.85, 1], [0, 1]) }}
        >
          <div className="cta-card">
            <h2>Join the waiting list</h2>
            <p>Be first to know when planground launches.</p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Notify me</button>
            </form>
          </div>
        </motion.div>
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