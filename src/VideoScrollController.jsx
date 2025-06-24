// File: VideoScrollController.jsx
import React, { useEffect, useRef } from 'react';

/**
 * VideoScrollController
 *
 * Scrub video playback smoothly based on scroll, even on fast scrolls.
 */
export default function VideoScrollController() {
  const videoRef = useRef(null);
  const ticking = useRef(false);
  const targetTime = useRef(0);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Calculate desired video time based on scroll
    const updateTargetTime = () => {
      const duration = vid.duration || 0;
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      targetTime.current = progress * duration;
      // If not already animating, start
      if (!ticking.current) {
        ticking.current = true;
        animate();
      }
    };

    // Smoothly tween currentTime towards targetTime
    const animate = () => {
      const diff = targetTime.current - vid.currentTime;
      // Continue animating while the difference is significant
      if (Math.abs(diff) > 0.05) {
        vid.currentTime += diff * 0.2; // ease factor
        requestAnimationFrame(animate);
      } else {
        vid.currentTime = targetTime.current;
        ticking.current = false;
      }
    };

    const onScroll = updateTargetTime;
    const onMeta = updateTargetTime;

    vid.addEventListener('loadedmetadata', onMeta);
    window.addEventListener('scroll', onScroll);

    // Initial sync if metadata already loaded
    if (vid.readyState >= 1) onMeta();

    return () => {
      vid.removeEventListener('loadedmetadata', onMeta);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: -1,
      }}
    >
      <source src="/Hermes.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}