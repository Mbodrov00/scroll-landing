import React from "react";

export default function BlogFeed() {
  const posts = [
    { title: "Planground is a web application for creating architectural plans.",
      date: "2025-11-01",
      summary: "Its primary function is to translate abstract, rough geometry into a clear architectural plan based on rules defined by the user."
    },
    {
      title: "How does it work?",
      date: "2025-11-01",
      summary: "The architect (=user) works on the plan at an abstract level, adding, removing, reducing, enlarging rooms, drawing on top, giving specific prompts for the inclusion of a number of rooms with various connections and areas." },
    {
      title: "If you are an architect, you can use Planground to create architectural plans.",
      date: "2025-11-01",
      summary: "Sign up for the waitlist to get early access to the product."
    },
    {
      title: "If you want to become a part of Plangroun's team",
      date: "2025-11-01",
      summary: "Send us an email with your resume to tg @mmbodrov"
    },
  ];

  return (
    <div className="cards-grid">
      {posts.map((p, i) => (
        <article key={i} className="content-card">
          <small className="card-meta">{p.date}</small>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
        </article>
      ))}
    </div>
  );
}