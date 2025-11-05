import React, { useState } from "react";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("Invalid email");
      return;
    }
    // Placeholder: replace with backend or Formspree endpoint
    setStatus("Submitted successfully");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Join</button>
      <p>{status}</p>
    </form>
  );
}