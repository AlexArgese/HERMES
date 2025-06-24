import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import './HowSteps.css';

/* —————————————————  DATA  ————————————————— */
const steps = [
  { id:1, title:'Step 1', subtitle:'Starts with a random or rough prompt',
    text:'HERMES receives an initial prompt, even if it\'s randomly placed or imprecise, to generate the first segmentation attempt.',
    image:'/how_it_works/step1.png',
    bullets:['Misplaced input','Uncertain start'],
    icons:['/how_it_works/step1_icon1.png','/how_it_works/step1_icon2.png']
  },
  { id:2, title:'Step 2', subtitle:'Foundation model predicts a mask',
    text:'The foundation model segments the image based on that prompt. However, the result is often inaccurate at this stage.',
    image:'/how_it_works/step2.png',
    bullets:['Inaccurate mask','Invalid output'],
    icons:['/how_it_works/step2_icon1.png','/how_it_works/step2_icon2.png']
  },
  { id:3, title:'Step 3', subtitle:'Segmentation is checked by nnQC',
    text:'HERMES uses nnQC to compare the segmentation with an internally generated pseudo-ground truth and assigns a quality score.',
    image:'/how_it_works/step3.png',
    bullets:['Quality check','Smart analysis'],
    icons:['/how_it_works/step3_icon1.png','/how_it_works/step3_icon2.png']
  },
  { id:4, title:'Step 4', subtitle:'If quality is low, the prompt is improved',
    text:'If the score is below a set threshold, HERMES adjusts the prompt to better target the anatomical structure.',
    image:'/how_it_works/step4.png',
    bullets:['Auto-correction','Refinement loop'],
    icons:['/how_it_works/step4_icon1.png','/how_it_works/step4_icon2.png']
  },
  { id:5, title:'Step 5', subtitle:'Repeats until high-quality is reached',
    text:'HERMES repeats the process until the segmentation meets the quality standard, delivering accurate and reliable results automatically.',
    image:'/how_it_works/step5.png',
    bullets:['Precise segmentation','Trusted result'],
    icons:['/how_it_works/step5_icon1.png','/how_it_works/step5_icon2.png']
  }
];



/* ——————————————————— COMPONENT ——————————————————— */
export default function HowSteps() {
    const [active, setActive] = useState(1);
  
    const vpRef   = useRef(null);   // viewport scrollabile
    const railRef = useRef(null);   // rail flex
    const colsRef = useRef([]);     // singole colonne
  
    /** centra la colonna idx */
    const centerCol = (idx) => {
      const vp  = vpRef.current;
      const col = colsRef.current[idx];
      if (!vp || !col) return;
      const target = col.offsetLeft + col.offsetWidth / 2 - vp.clientWidth / 2;
      vp.scrollTo({ left: target, behavior: 'smooth' });
    };
  
    /** sposta tutto a sinistra (step 1) */
    const scrollToStart = () => {
      vpRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    };
  
    /** sposta tutto a destra (step 5) */
    const scrollToEnd = () => {
      const vp   = vpRef.current;
      const rail = railRef.current;
      if (!vp || !rail) return;
      vp.scrollTo({ left: rail.scrollWidth - vp.clientWidth, behavior: 'smooth' });
    };
  
    /** handler click */
    const handleClick = (idx, id) => {
      setActive(id);
      if (idx === 0)       scrollToStart();   // Step 1
      else if (idx === steps.length - 1) scrollToEnd();   // Step 5
      else                  centerCol(idx);  // Step 2-4
    };
  
    return (
      <section className="how-wrapper">
        <h1 className="how-title hermes">How HERMES Works</h1>
        <p className="how-subtitle">From messy prompts to accurate, verified segmentations</p>
  
        <div className="grid-viewport" ref={vpRef}>
          <div className="grid-rail" ref={railRef}>
            {steps.map((s, i) => (
              <div
                key={s.id}
                ref={(el) => (colsRef.current[i] = el)}
                className={`grid-col ${active === s.id ? 'active' : ''}`}
                onClick={() => handleClick(i, s.id)}
              >
                <div className="grid-cell"><CardText {...s} /></div>
                <div className="grid-cell"><CardImg  {...s} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  /* ——— sottocomponenti ——— */
  function CardText({ title, subtitle, text, bullets, icons }) {
    return (
      <div className="card">
        <span className="badge">{title}</span>
        <div className="content-card">
          <h3>{subtitle}</h3>
          <p className="dummy-text">{text}</p>
          <ul style={{ marginTop: '1em' }}>
            {bullets.map((b, idx) => (
              <div key={idx} className="bullet-point">
                {icons[idx] && (
                  <img
                    src={icons[idx]}
                    alt=""
                    style={{ width: '2em', margin: 0, border: 'none' }}
                  />
                )}
                {b}
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  function CardImg({ image }) {
    return (
      <div className="card">
        <img src={image} alt="" />
      </div>
    );
  }