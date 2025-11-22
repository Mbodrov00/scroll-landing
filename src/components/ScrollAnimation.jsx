import React, { useRef, useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import "./Clocks.css";
import ContactForm from "./ContactForm";

export default function ScrollAnimation() {
  const outerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const totalFrames = 10; // adjust to your actual number of frames
  const framePath = (i) => `/shots/frame-${i + 1}.png`;

  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sequentially preload frames
  useEffect(() => {
    let isMounted = true;

    const loadFrame = async (index) => {
      if (index >= totalFrames || !isMounted) return;
      const img = new Image();
      img.src = framePath(index);
      img.onload = () => {
        if (!isMounted) return;
        setImages((prev) => {
          const copy = [...prev];
          copy[index] = img.src;
          return copy;
        });
        loadFrame(index + 1); // load next frame
      };
      img.onerror = () => {
        console.error(`Failed to load frame ${index + 1}`);
        loadFrame(index + 1); // continue even if a frame fails
      };
    };

    loadFrame(0);

    return () => {
      isMounted = false;
    };
  }, []);

  // Update frame based on scroll
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = Math.min(totalFrames - 1, Math.floor(v * (totalFrames - 1)));
      setCurrentIndex(idx);
    });
    return () => unsub && unsub();
  }, [scrollYProgress]);

  return (
    <section ref={outerRef} className="scroll-outer">
      <div className="sticky-viewport">
        <div className="images-stack">
          <div className="stacked-image-wrapper" style={{ zIndex: 1 }}>
            {images[currentIndex] ? (
              <img
                src={images[currentIndex]}
                alt={`Frame ${currentIndex + 1}`}
                className="stacked-image"
                loading="eager"
              />
            ) : (
              <div
                style={{
                  width: "800px", // fallback width, adjust to your frame size
                  height: "450px",
                  backgroundColor: "#000",
                }}
              />
            )}
          </div>
        </div>
        <HintOnInactivity />
      </div>
    </section>
  );
}

function HintOnInactivity() {
  const hintRef = useRef(null);
  useEffect(() => {
    let timer;
    const show = () => hintRef.current?.classList.add("visible");
    const hide = () => {
      hintRef.current?.classList.remove("visible");
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
