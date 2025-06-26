import React, { useState, useEffect } from 'react';

export default function DeviceGuard({ children }) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024); 
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (!isDesktop) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="logo">
            <img src="/hermes_logo_trasparente.png" alt="hermes" style={{ height: '2rem' }} />
        </div>
        <h2>Desktop Only</h2>
        <p>This site is only available on desktop devices.</p>
      </div>
    );
  }

  return <>{children}</>;
}
