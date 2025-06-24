import React, { useState } from "react";
import NNQCModuleView from '../components/NNQCModuleView.jsx';
import DSCCorrelationChart from '../components/DSCCorrelationChart.jsx';
import "./NNQC.css";

export default function NNQC() {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/nnqc/nnQC__a_self_adapting_framework_for_quality_control_in_organ_segmentation.pdf';
        link.download = 'nnQC_research_paper.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
  return (
    <>
      {/* ---------- HERO (IMPOSTAZIONE) ---------- */}
      <header className="nnqc-hero-title">
        <h1><span className="accent">nnQC:</span>The brain behind <span className="accent">HERMES</span></h1>
        <h2>Self-Adaptive Quality Control for Medical Image Segmentation</h2>
        <p>A general-purpose framework for evaluating and improving segmentation accuracy, across organs, models, and imaging modalities.</p>
      </header>

      {/* ---------- “WHAT IS NNQC?” (IMPOSTAZIONE) ---------- */}
      <div className="section-block">
        <div className="section-header"><h2>What is nnQC?</h2></div>

        <div className="nnqc-section">
            <h3>What is nnQC, and how does it evaluate segmentation quality even without ground truth?</h3>
            <p>Medical image segmentation models often need a way to check if their output is good, but most of the time, the real ground truth (the correct segmentation manually drawn by a human) is not available.</p>
            <p>This is where nnQC comes in.</p>
            <p>nnQC stands for no-new Quality Control: a framework that can assess the quality of a segmentation, even when the correct answer is unknown.</p>
        </div>
      </div>


      {/* ==========  INTERACTIVE “HOW IT WORKS?”  ========== */}
      <div className="section-block">
        <div className="section-header"><h2>How it works?</h2></div>

        <div className="nnqc-section nnqc-how">
          <NNQCModuleView/>
        </div>
      </div>

      {/* ========== WHY IT WORKS? ========== */}
      <div className="section-block">
        <div className="section-header"><h2>Why it works?</h2></div>
        <div className="nnqc-section nnqc-why">
          {/* ——— LEFT COLUMN: testo + bullet icons ——— */}
          <div className="why-list">
            <div className="why-elenco">
                <p className="why-intro">
                Other QC methods are organ-specific or need real labels. Some fail when masks are too degraded. nnQC is:
                </p>
                <ul>
                    <li>
                        <img src="/nnqc/icona1.png" alt="Self-adaptive" />
                        <span>Self-adaptive</span>
                    </li>
                    <li>
                        <img src="/nnqc/icona2.png" alt="Modality-agnostic" />
                        <span>Modality-agnostic (CT, MRI, ...)</span>
                    </li>
                    <li>
                        <img src="/nnqc/icona3.png" alt="Robust" />
                        <span>Robust even with poor inputs</span>
                    </li>
                </ul>
            </div>
             {/* ——— RIGHT COLUMN: Fingerprints box ——— */}
            <div className="fingerprints-box">
                <div className="section-header"><h2>Fingerprints</h2></div>
                <div className="nnqc-section">
                    <p>
                    nnQC automatically adapts to any dataset by extracting key characteristics called fingerprints such as voxel spacing, intensity range, and image orientation.
                    </p>
                    <p>
                    This lets the system normalize inputs and work reliably across different modalities like CT, MRI, or ultrasound, without manual tuning.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sezione grafico correlazione DSC */}
      <div className="section-block">
        <div className="section-header">
          <h2>Performance Comparison (DSC Correlation)</h2>
        </div>
        <div className="nnqc-section nnqc-text-dsc">
            <p>This chart compares the performance of different quality estimation methods across several organ segmentation tasks.</p>
            <p>The line at the top is nnQC, which consistently achieves the highest correlation with the true segmentation quality.</p>
            <p>The other methods  (Galati et al., Fournel et al., and Wang et al.) represent previously published approaches, but show lower and more variable performance, especially on complex organs.</p>
            <p>nnQC stands out for its stability and accuracy, even where other methods fail.</p>
            <DSCCorrelationChart/>
        </div>
      </div>

      {/* Download the paper */}
      <div className="section-block">
        <div className="section-header">
          <h2>Download the Full Paper of nnQC</h2>
        </div>
        <div className="nnqc-section nnqc-text-dsc">
            <p style={{textAlign:'center'}}>Discover the full methodology behind nnQC, including implementation details, evaluation benchmarks, and citations. Download the official research paper here.</p>
            <a className="nnqc-button" onClick={handleDownload}>
                Download full nnQC research paper &gt;
            </a>
        </div>
      </div>
    </>
  );
}
