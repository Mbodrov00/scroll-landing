import React, { useState, useEffect, useRef } from "react";
import posts from "./Posts";
import PostTemplate from "./PostTemplate";
import "../styles/variables.css";
import "../styles/blog-feed.css"; // contains all layout rules

export default function BlogFeed() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const update = () => setIsNarrow(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();

    if (e.deltaY > 0 && activeIndex < posts.length - 1) {
      setActiveIndex((i) => i + 1);
    }
    if (e.deltaY < 0 && activeIndex > 0) {
      setActiveIndex((i) => i - 1);
    }
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    const viewHeight = scrollRef.current.clientHeight;

    scrollRef.current.scrollTo({
      top: activeIndex * viewHeight,
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    <div className="blog-feed">
      <div
        ref={scrollRef}
        className="blog-feed-scroll"
        onWheel={handleWheel}
      >
        {posts.map((post, index) => (
          <PostTemplate
            key={index}
            post={post}
            isNarrow={isNarrow}
          />
        ))}
      </div>
    </div>
  );
}
