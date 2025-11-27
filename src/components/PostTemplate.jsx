import React, { useState, useRef } from "react";
import GalleryButtons from "./GalleryButtons";

export default function PostTemplate({ post, isNarrow }) {
  const images = [post.image, ...post.extraImages];
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef(null);

  const scrollToImage = (index) => {
    if (!galleryRef.current) return;
    const target = galleryRef.current.children[index];
    if (!target) return;

    galleryRef.current.scrollTo({
      top: target.offsetTop,
      behavior: "smooth"
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const next = Math.max(0, prev - 1);
      scrollToImage(next);
      return next;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = Math.min(images.length - 1, prev + 1);
      scrollToImage(next);
      return next;
    });
  };

  return (
    <section className="post-section">
      <div className={`post-layout ${isNarrow ? "narrow" : "wide"}`}>
        
        {/* IMAGES */}
        <div className="post-image-column">
          <div className="gallery-wrapper">

            <div className="gallery-column" ref={galleryRef}>
              {images.map((src, i) => (
                <img key={i} src={src} className="gallery-image" alt="" />
              ))}
            </div>

            <GalleryButtons
              currentIndex={currentIndex}
              total={images.length}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </div>

        {/* TEXT */}
        <div className="post-text-column">
          <h2 className="post-title">{post.title}</h2>
          <div className="post-text">{post.text}</div>
        </div>
      </div>
    </section>
  );
}
