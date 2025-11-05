import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollAnimation() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  // Example layered stop-motion-like transformations
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="scroll-container">
      <motion.div style={{ rotate, scale, opacity }} className="layer layer1" />
      <motion.div style={{ rotate: rotate, scale: scale }} className="layer layer2" />
      <motion.div style={{ rotate: rotate, opacity: opacity }} className="layer layer3" />
    </section>
  );
}