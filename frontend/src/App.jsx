import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import UploadDashboard from './components/UploadDashboard';
import AnalysisResults from './components/AnalysisResults';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="border-b border-white/5 bg-canvas/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl leading-none">R</span>
            </div>
            <span className="ml-3 font-bold text-2xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">ResumeIQ</span>
          </div>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate('/')} 
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Analyzer
              </button>
              <a 
                href="#" 
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Features
              </a>
            </nav>
            <div className="h-6 w-px bg-white/10 hidden md:block"></div>
            <a 
              href="https://github.com/Trueb/resume-ai-analyzer" 
              target="_blank" 
              rel="noreferrer" 
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-semibold text-white transition-all"
            >
              Github
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<UploadDashboard />} />
            <Route path="/results" element={<AnalysisResults />} />
          </Routes>
        </main>
        <footer className="border-t border-surface-light py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ResumeIQ Platform. AI-Powered Resume Analysis.
        </footer>
        <ToastContainer theme="dark" position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
