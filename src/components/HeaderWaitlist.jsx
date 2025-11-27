import React from "react";
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

export default function HeaderWaitlist() {
  const [hovered, setHovered] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("Invalid email");
      return;
    }
    try {
      setStatus("Submitting...");
      await submitEmail(email);
      setStatus("Joined!");
      setEmail("");
      setTimeout(() => setStatus(""), 2000);
    } catch (_e) {
      setStatus("Failed. Check Firebase config.");
    }
  };
  return (
    <div
      className="header-waitlist"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <form className={`hw-form ${hovered ? "open" : ""}`} onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="example@main.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="hw-button waitlist">Join the waiting list</button>
      </form>
      <div className="hw-status">{status}</div>
    </div>
  );
}


