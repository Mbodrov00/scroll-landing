import React from "react";
import ScrollAnimation from "./components/ScrollAnimation";
import ContactForm from "./components/ContactForm";
import BlogFeed from "./components/BlogFeed";

export default function App() {
  return (
    <div>
      <header className="hero">
        <h1>Product Coming Soon</h1>
        <p>Join our waiting list and stay informed.</p>
      </header>
      <ScrollAnimation />
      <section id="blog">
        <h2>News & Updates</h2>
        <BlogFeed />
      </section>
      <section id="contact">
        <h2>Join the Waiting List</h2>
        <ContactForm />
      </section>
      <footer className="footer">
        <p>© 2025 ProductName</p>
      </footer>
    </div>
  );
}