import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Problem from './pages/Problem';
import HowItWorks from './pages/HowItWorks';
import NNQC from './pages/NNQC';
import Results from './pages/Results';
import DeviceGuard from './DeviceGuard';

export default function App() {
  return (
    
      <div className="app">
        <DeviceGuard>
        <Navbar />
        <main className="main-content ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/nnqc" element={<NNQC />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
        <Footer/>
        </DeviceGuard>
      </div>
  );
}