import React from "react";

export default function BlogFeed() {
  const posts = [
    { title: "Welcome to our project", date: "2025-11-01", summary: "Introduction and roadmap." },
    { title: "Progress update", date: "2025-11-05", summary: "Sneak peek of upcoming features." }
  ];

  return (
    <div className="blog-feed">
      {posts.map((p, i) => (
        <article key={i}>
          <h3>{p.title}</h3>
          <small>{p.date}</small>
          <p>{p.summary}</p>
        </article>
      ))}
    </div>
  );
}