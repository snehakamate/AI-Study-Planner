// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Resource from "./pages/Resource";
import Roadmap from "./pages/Roadmap";
import InterviewPrep from "./pages/InterviewPrep";
import Predictor from "./pages/Predictor"; // ✅ Add Predictor import


function RequireAuth({ children }) {
  const isAuthed = Boolean(localStorage.getItem("auth"));
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/resources"
          element={
            <RequireAuth>
              <Resource />
            </RequireAuth>
          }
        />
        <Route
          path="/roadmap"
          element={
            <RequireAuth>
              <Roadmap />
            </RequireAuth>
          }
        />
        <Route
          path="/interview-prep"
          element={
            <RequireAuth>
              <InterviewPrep />
            </RequireAuth>
          }
        />
        <Route
          path="/predictor"
          element={
            <RequireAuth>
              <Predictor />
            </RequireAuth>
          }
        /> {/* ✅ Add Predictor route */}
      </Routes>
    </Router>
  );
}

export default App;
