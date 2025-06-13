
// src/pages/Dashboard.jsx
import React from 'react';
import './Dashboard.css';
import { FaUser, FaHome, FaComments, FaClipboardCheck, FaHandsHelping } from 'react-icons/fa';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">Evalytics-AI</div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-link active"><FaHome /> Home</a>
          <a href="#" className="nav-link"><FaUser /> My Profile</a>
          <a href="#" className="nav-link"><FaComments /> Interviews</a>
          <a href="#" className="nav-link"><FaClipboardCheck /> Assessments</a>
          <a href="#" className="nav-link"><FaHandsHelping /> Help</a>
        </nav>
      </aside>

      <main className="main-content">
        <div className="card">
          <h2>Welcome, Candidate 👩‍💻</h2>
          <ul className="action-list">
            <li>📝 View Exam Instructions</li>
            <li>▶️ Start Exam</li>
            <li>📊 View Results</li>
          </ul>
        </div>
      </main>
    </div>
  );
}