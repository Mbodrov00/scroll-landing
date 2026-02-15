import React from "react";

export default function Team() {
  const teammates = [
    { 
      name: "Michael Bodrov", 
      role: "Founder & CEO", 
      bio: "M.Sc. in Architecture, Founder & Computational Architect" 
    }
  ];

  return (
    <main>
      <h1>Team</h1>
      <p>Meet the people behind planground.</p>
      <div className="cards-grid">
        {teammates.map((member) => (
          <article key={member.name} className="content-card">
            <small className="card-meta">{member.role}</small>
            <h3>{member.name}</h3>
            <p>{member.bio}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

