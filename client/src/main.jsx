/**
=========================================================
* Cosmic Classroom React App
=========================================================
*/

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <div className="space-theme">
          <App />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
