import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const newsItems = [
  { date: "June 2025", text: "Hermes website completed", isNew: true},
  { date: "April 2025", text: "Start development Hermes website", isNew: false},
];

export default function Home() {
  const videoRef = useRef(null);
  const [playedBefore] = useState(Boolean(window.__hermesIntroPlayed));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/HERMES.pdf';
    link.download = 'HERMES_research_paper.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const seekToLastFrame = () => {
      const FRAME_OFFSET = 0.05;
      const target = Math.max(video.duration - FRAME_OFFSET, 0);
      try {
        video.currentTime = target;
      } catch (err) {
      }
      video.pause();
    };

    if (playedBefore) {
      if (video.readyState >= 1) {
        seekToLastFrame();
      } else {
        video.addEventListener('loadedmetadata', seekToLastFrame, { once: true });
      }
      return; 
    }

    const markAsPlayed = () => {
      window.__hermesIntroPlayed = true;
    };

    const handleEnded = () => {
      seekToLastFrame();
    };

    video.addEventListener('play', markAsPlayed, { once: true });
    video.addEventListener('ended', handleEnded, { once: true });

    return () => {
      video.removeEventListener('play', markAsPlayed);
      video.removeEventListener('ended', handleEnded);
    };
  }, [playedBefore]);

  return (
    <div className="home-page">
      {/* Intro Video Background */}
      <div className="video-container">
        <video
          ref={videoRef}
          className="background-video"
          src="/home/Hermes.mp4"
          muted
          playsInline
          preload="auto"
          {...(!playedBefore ? { autoPlay: true } : {})}
        />
      </div>

      <div className="section-block">
        <div className="section-header">
          <h2>News & Updates</h2>
        </div>
        <section className="info-section2 news-section">
          <div className="news-grid">
            {newsItems.map((item, index) => (
              <div className="news-card" key={index}>
                <div className="news-header">
                  <span className="news-date">{item.date}</span>
                  {item.isNew && <span className="news-badge">NEW</span>}
                </div>
                <p className="news-text">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* What is HERMES? */}
      <div className="section-block">
        <div className="section-header">
          <h2>What is HERMES?</h2>
        </div>
        <div className="info-section">
          <div className="info-writings">
            <ul className="features-list">
              <li>
                <img src="/home/icon1.png" alt="Automation" />
                <span>Automation</span>
              </li>
              <li>
                <img src="/home/icon2.png" alt="Prompt Refinement" />
                <span>Prompt Refinement</span>
              </li>
              <li>
                <img src="/home/icon3.png" alt="Intelligent Quality Evaluation" />
                <span>Intelligent Quality Evaluation</span>
              </li>
            </ul>
            <p className="info-text">
              HERMES is a system that helps improve automatic medical image segmentations
              by checking their quality and fixing mistakes. It works by creating a
              reference to see if the result is good enough and, if not, it adjusts the
              input to get a better result. HERMES makes medical image analysis more
              accurate and automatic, without needing human people to check every step.
            </p>
          </div>
          <img
            className="info-illustration"
            src="/home/what_is_hermes.png"
            alt="What is Hermes Illustration"
          />
        </div>
      </div>

      {/* Why does HERMES matter? */}
      <div className="section-block">
        <div className="section-header">
          <h2>Why does HERMES matter?</h2>
        </div>

        <div className="why-container">
          <p className="info-text">
            HERMES matters because it makes medical image segmentation more reliable,
            faster, and less dependent on human checks. By automatically improving
            mistakes, it helps create more accurate results that are important for
            diagnosis and research. This saves time, reduces human error, and supports
            building fully automatic and scalable medical imaging systems.
          </p>

          {/* Flow diagram */}
          <div className="flow-diagram">
            <div className="flow-item">
              <span className="flow-label">Random Prompt</span>
              <img src="/home/Random_Prompt.png" alt="Random Prompt" />
            </div>

            <span className="flow-arrow">&#8594;</span>

            <div className="flow-item">
              <span className="flow-label">Inaccurate Segmentation</span>
              <img src="/home/Inaccurate_Segmentation.png" alt="Inaccurate Segmentation" />
            </div>

            <span className="flow-arrow">&#8594;</span>

            <div className="flow-item">
              <span className="flow-label">No quality Check</span>
              <img src="/home/No_quality_Check.png" alt="No Quality Check" />
            </div>

            {/* Separator and HERMES node */}
            <div className="flow-terminator">
              <div className="vertical-line" />
              <span className="flow-arrow">&#8594;</span>
              <img src="/hermes_logo_trasparente.png" alt="hermes" style={{height:'2rem'}}/>
            </div>
          </div>

          <Link to="/problem#title" className="cta-button">
            Explore the problem &gt;
          </Link>
        </div>
      </div>
      {/* Download the paper */}
      <div className="section-block">
        <div className="section-header">
          <h2>Download the Full Paper of HERMES</h2>
        </div>
        <div className="nnqc-section nnqc-text-dsc">
            <p style={{textAlign:'center'}}>Discover the full methodology behind <strong>HERMES</strong>, including
            implementation details, evaluation benchmarks, and citations.
            Download the official research paper here.</p>
            <a className="nnqc-button" onClick={handleDownload}>
                Download full HERMES research paper &gt;
            </a>
        </div>
      </div>
    </div>
  );
}
