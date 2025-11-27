import React from "react";
import "../styles/gallery-buttons.css"; // define colors in CSS

export default function GalleryButtons({ currentIndex, total, onPrev, onNext }) {
  return (
    <div className="gallery-buttons-container">
      {currentIndex > 0 && (
        <button className="gallery-btn up" onClick={onPrev}>
          <span></span>
        </button>
      )}
      {currentIndex < total - 1 && (
        <button className="gallery-btn down" onClick={onNext}>
          <span></span>
        </button>
      )}
    </div>
  );
}
