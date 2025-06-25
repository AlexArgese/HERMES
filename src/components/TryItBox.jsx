import React, { useRef, useState } from "react";
import "./TryItBox.css";

const STEPS = [
  { img: "/how_it_works/step_one.png",   imgGT: "/how_it_works/GTstep_one.png",    label: "Initial Prompt",            box: { x: 110,  y: 120,  w: 140, h: 140 } },
  { img: "/how_it_works/seg_wrong.png",  imgGT: "/how_it_works/GTseg_wrong.png",   label: "Poor Segmentation",         box: { x: 155,  y: 315, w: 100, h: 105 } },
  { img: "/how_it_works/seg_mid1.png",   imgGT: "/how_it_works/GTseg_mid1.png",    label: "Improving...",              box: { x: 170,  y: 240, w: 70, h: 55 } },
  { img: "/how_it_works/seg_mid2.png",   imgGT: "/how_it_works/GTseg_mid2.png",    label: "Improving...",              box: {  x: 120,  y: 210, w: 120, h: 75 } },
  { img: "/how_it_works/seg_mid3.png",   imgGT: "/how_it_works/GTseg_mid3.png",    label: "Improving...",              box: { x: 120,  y: 170, w: 120, h: 120 } },
  { img: "/how_it_works/seg_final.png",  imgGT: "/how_it_works/GTseg_final.png",   label: "Done! Accurate Result",     box: { x: 120,  y: 135, w: 118, h: 158 } }
];

export default function TryItBox() {
  const [box, setBox] = useState(STEPS[0].box);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(0);
  const [refining, setRefining] = useState(false);
  const [fade, setFade] = useState(false);
  const imgRef = useRef(null);
  const drag = useRef(null);

  const getPoint = (e) => ("touches" in e ? e.touches[0] : e);

  const startDrag = (e) => {
    e.preventDefault();
    const { clientX, clientY } = getPoint(e);
    const rect = imgRef.current.getBoundingClientRect();
    drag.current = {
      offsetX: clientX - (rect.left + box.x),
      offsetY: clientY - (rect.top + box.y)
    };
    setDragging(true);
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", endDrag, { once: true });
    window.addEventListener("touchend", endDrag, { once: true });
  };

  const onMove = (e) => {
    e.preventDefault();
    const { clientX, clientY } = getPoint(e);
    const rect = imgRef.current.getBoundingClientRect();
    const newX = Math.min(Math.max(clientX - drag.current.offsetX, rect.left), rect.right - box.w);
    const newY = Math.min(Math.max(clientY - drag.current.offsetY, rect.top), rect.bottom - box.h);
    setBox({ ...box, x: newX - rect.left, y: newY - rect.top });
  };

  const endDrag = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("touchmove", onMove);
    document.body.style.userSelect = "";
    setDragging(false);
    startRefinement();
  };

  const startRefinement = () => {
    setRefining(true);
    let i = 1;
    const advanceStep = () => {
      if (i < STEPS.length) {
        setFade(true);
        setTimeout(() => {
          setStep(i);
          setBox(STEPS[i].box);
          setFade(false);
          i++;
          setTimeout(advanceStep, 3000);
        }, 600);
      } else {
        setTimeout(() => setRefining(false), 1500);
      }
    };
    setTimeout(advanceStep, 1200);
  };

  return (
    <section className="try-wrapper">
      <p className="try-intro" style={{margin: '2em 0 3em 0'}}>
        HERMES combines foundation models, smart quality control, and iterative refinement,
        turning weak prompts into strong segmentations.
      </p>

      <div className="try-box">
        <div className="try-badge">
          Not still clear?<br />Try it yourself!
        </div>
        <div className="try-content">
        
        <div className="try-text">
            {refining ? (
              <div>
                <p>Refining prompt...</p>
                <h2><strong>{STEPS[step].label}</strong></h2>
              </div>
            ) : (
              <>
                <p>Move the red box over the image to define a segmentation prompt.</p>
                <h2><strong>Then release and watch HERMES in action.</strong></h2>
              </>
            )}
          </div>

        <div className="try-photos">
          <div className="try-img" ref={imgRef}>
          <h3 className="subtitle">Input image</h3>
            <img
              src={STEPS[step].img}
              alt="demo"
              draggable="false"
              className={fade ? "fading" : ""}
            />
            <div
              className={`bbox ${dragging || refining ? "dragging" : ""}`}
              style={{
                left: box.x,
                top: box.y,
                width: box.w,
                height: box.h,
                animation: refining ? "pulse 0.8s infinite alternate" : "none"
              }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            />
            {refining && <div className="loader" />}
          </div>

          

          <div className="try-img" ref={imgRef}>
          <h3 className="subtitle">Predicted Mask</h3>
            <img
              src={STEPS[step].imgGT}
              alt="demo"
              draggable="false"
              className={fade ? "fading" : ""}
            />

            {refining && <div className="loader" />}
          </div>

          <div className="try-img" ref={imgRef}>
            <h3 className="subtitle">Ground Truth</h3>
            <img
              src='/how_it_works/Ground_thruth.png'
              alt="demo"
              draggable="false"
            />
          </div>
          </div>

        </div>
      </div>
    </section>
  );
}
