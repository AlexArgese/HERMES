import React from 'react';
import { Link } from 'react-router-dom';
import './Problem.css';
import ScrollToHash from "../components/ScrollToHash"; 


export default function Problem() {
  return (
    <div className="problem-page" id='title'>
      <ScrollToHash />
      {/* ─────────── Titolo + sottotitolo ─────────── */}
      <h1 className="problem-title">
        <span className="initial">T</span>he&nbsp;
        <span className="initial">P</span>roblem&nbsp;with&nbsp;
        <span className="initial">P</span>rompt-
        <span className="initial">B</span>ased&nbsp;
        <span className="initial">S</span>egmentation
      </h1>

      <p className="problem-subtitle">
        Foundation models depend on prompts like boxes, clicks or scribbles to guide segmentation.<br />
        But in real scenarios, prompts are often random or misplaced.<br />
        This leads to incorrect segmentations and nobody is checking.
      </p>

      {/* ─────────── BLOCCO 1 – Random Prompt (INVARIATO) ─────────── */}
      <div className="problem-section">
        <div className="problem-row">
          <h3 className="block-title">Random Prompt</h3>
          <section className="problem-block">
            <div className="problem-text">
                <p>Foundation models like MedSAM, ScribblePrompt, and MIDeepSeg have introduced powerful, general-purpose solutions for medical image segmentation. <a href='/results' className='link-text'>What is a Foundation Model?</a></p>
                <p>They can adapt to different organs, imaging modalities, and tasks. But they all rely on a common input: a prompt.</p>
                <p>In theory, this makes segmentation interactive and flexible. But in practice, especially in automated pipelines, these prompts are:</p>
                    <li>randomly generated</li>
                    <li>loosely or inaccurately placed</li>
                    <li>derived from weak heuristics without anatomical reasoning</li>
                <p style={{marginTop:'1em'}}>As a result, the model begins its prediction from an uninformative or misleading starting point.</p>
                <p>It lacks anatomical context, clinical logic, or even alignment with the real organ structure.</p>
                <div className='effect-sentence'>
                    <div className="new-effect vertical-line" />
                    <p style={{margin:'0'}}>The model thus starts from an uninformative guess, without real clinical context. And if the prompt is problematic, then everything that is generated afterwards is also problematic.</p>
                </div>
            </div>
          </section>
        </div>

        <div className="problem-img">
          <img src="/problem/random_prompt.png" alt="Random prompt X-ray" />
        </div>
      </div>

      <div className="down-arrow">↓</div>

      {/* ─────────── BLOCCO 2 – Wrong Segmentation (FIXED ORDER) ─────────── */}
      <div className="problem-section">
        {/* immagine a sinistra  */}
        <div className="problem-img">
          <img src="/problem/wrong_segmentation.png" alt="Wrong segmentation" />
        </div>

        {/* testo a destra */}
        <div className="problem-row">
          <h3 className="block-title">Wrong Segmentation</h3>
          <section className="problem-block">
            <div className="problem-text">
                <p>Foundation models are only as good as the prompt they receive. When that starting point is off, even slightly, the entire segmentation collapses.</p>
                <p>The output mask may:</p>
                    <li>completely miss the organ</li>
                    <li>capture only a fragment</li>
                    <li>extend far beyond the intended boundary</li>    
                <p style={{marginTop:'1em'}}>This results in segmentations that are anatomically implausible (too small, too large, or simply misplaced).</p>
                <p>In medical contexts, these errors aren’t just technical: they can lead to incorrect measurements, failed diagnoses, or invalid analyses.</p>
                <div className='effect-sentence'>
                    <div className="new-effect vertical-line" />
                    <p style={{margin:'0'}}>The segmentation might look clean even if it’s anatomically wrong. And without any correction mechanism, the system simply accepts it.</p>
                </div>
            </div>
          </section>
        </div>
      </div>

      <div className="down-arrow">↓</div>

      {/* ─────────── BLOCCO 3 – No Quality Check ─────────── */}
      <div className="problem-section">
        <div className="problem-row">
          <h3 className="block-title">No Quality Check</h3>
          <section className="problem-block">
            <div className="problem-text">
                <p>Once a segmentation is generated, most pipelines assume it’s correct.</p>
                <p>There is no human reviewing each result, no quality control model validating it and no warning when things go wrong.</p>
                <p>The output is:</p>
                    <li>passed to downstream tools</li>
                    <li>used in automatic measurements</li>
                    <li>embedded in clinical reports and datasets</li>    
                <p style={{marginTop:'1em'}}>If it’s wrong, it stays wrong.</p>
                <p>And worse, it becomes data contamination for everything that follows.</p>
                <div className='effect-sentence'>
                    <div className="new-effect vertical-line" />
                    <p style={{margin:'0'}}>Without a quality check, there is no way to detect or fix these failures. And that’s exactly where <span className='hermes'>HERMES</span> comes in.</p>
                </div>
            </div>
          </section>
        </div>

        <div className="problem-img">
          <img src="/problem/no_quality_check.png" alt="No quality check" />
        </div>
      </div>

      {/* ─────────── SUMMARY ─────────── */}
      <div className="problem-section">
      <div className="problem-row">
        <h3 className="summary-title">What goes wrong without HERMES?</h3>
        <section className="problem-summary">
          <ul className="summary-list">
            <li><img src="/problem/1.png" alt="" /><span>Random prompts produce inconsistent results</span></li>
            <li><img src="/problem/2.png" alt="" /><span>Models missegment or miss structures</span></li>
            <li><img src="/problem/3.png" alt="" /><span>No one verifies the output</span></li>
            <li><img src="/problem/4.png" alt="" /><span>Mistakes propagate through the pipeline</span></li>
          </ul>

          <p className="claim">Errors go undetected.<br /><strong>Until HERMES.</strong></p>

          <Link to="/how-it-works#start" className="cta-button">But, how? &gt;</Link>
        </section>
        </div>
      </div>
    </div>
  );
}
