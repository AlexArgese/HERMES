import React, { useState } from 'react';          /* + useState */
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  /* stato per mostrare / nascondere il menu in mobile */
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/hermes_logo_trasparente.png" alt="hermes" style={{ height: '2rem' }} />
      </div>

      {/* HAMBURGER – comparirà solo <768 px grazie al CSS sotto */}
      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Apri/chiudi navigazione"
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      {/* la tua lista resta IDENTICA: aggiungo solo la classe `open` al toggle */}
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><NavLink to="/" end   className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
        <li><NavLink to="/problem"        className={({ isActive }) => (isActive ? 'active' : '')}>Problem</NavLink></li>
        <li><NavLink to="/how-it-works"   className={({ isActive }) => (isActive ? 'active' : '')}>How it works</NavLink></li>
        <li><NavLink to="/nnqc"           className={({ isActive }) => (isActive ? 'active' : '')}>nnQC</NavLink></li>
        <li><NavLink to="/results"        className={({ isActive }) => (isActive ? 'active' : '')}>Results</NavLink></li>
      </ul>
    </nav>
  );
}
