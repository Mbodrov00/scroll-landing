import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/buttons.css';
import './styles/loader.css';
import './styles/header-waitlist.css';
import './styles/gallery.css';
import './styles/cta.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
