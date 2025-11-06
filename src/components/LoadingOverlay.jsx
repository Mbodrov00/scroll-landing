import React, { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const [phase, setPhase] = useState("loading"); // loading → star → quarters → done

  useEffect(() => {
    const onLoaded = () => {
      // Transition sequence
      setPhase("star");
      const t1 = setTimeout(() => setPhase("quarters"), 600);
      const t2 = setTimeout(() => {
        setPhase("done");
        window.dispatchEvent(new Event("app-ready"));
      }, 1200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    if (document.readyState === "complete") {
      onLoaded();
    } else {
      window.addEventListener("load", onLoaded, { once: true });
    }
    return () => window.removeEventListener("load", onLoaded);
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`loading-overlay ${phase}`}>
      {phase === "loading" && <div className="spinner" />}
      {phase === "star" && <div className="star" />}
      {phase === "quarters" && (
        <div className="quarters">
          <div className="quarter q1" />
          <div className="quarter q2" />
          <div className="quarter q3" />
          <div className="quarter q4" />
        </div>
      )}
    </div>
  );
}
