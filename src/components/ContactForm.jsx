import React, { useState } from "react";
// Submit to backend -> Google Sheets
async function submitEmail(email) {
  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
}

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("Invalid email");
      return;
    }
    try {
      setStatus("Submitting...");
      await submitEmail(email);
      setStatus("Submitted successfully");
      setEmail("");
    } catch (_e) {
      setStatus("Failed to submit");
    }
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