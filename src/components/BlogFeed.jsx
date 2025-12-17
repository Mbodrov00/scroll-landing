import React, { useState, useEffect, useRef } from "react";
import posts from "./Posts";
import PostTemplate from "./PostTemplate";
import "../styles/variables.css";
import "../styles/blog-feed.css";

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

  return (
    <div className="blog-feed">
      <div
        ref={scrollRef}
        className="blog-feed-scroll"
        //onWheel={handleWheel}
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
