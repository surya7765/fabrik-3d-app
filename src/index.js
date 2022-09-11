import React from "react";
import ReactDOM from "react-dom/client";
// import router routes
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" exact element={<App/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);
