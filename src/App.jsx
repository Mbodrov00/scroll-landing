import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import ScrollAnimation from "./components/ScrollAnimation";
import LoadingOverlay from "./components/LoadingOverlay";
import Blog from "./pages/Blog";
import Team from "./pages/Team";
import "./styles/base.css";
import "./styles/layout.css";

export default function App() {
  return (
    <div className="page-offset">
      <LoadingOverlay />
      <header className="app-header">
        <div className="brand">planground</div>
        <nav className="nav">
          <NavLink to="/blog">blog</NavLink>
          <NavLink to="/team">team</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<ScrollAnimation />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </div>
  );
}