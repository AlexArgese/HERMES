// src/components/RefinementResults.jsx
import React from 'react';
import "../pages/Results.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// registra i moduli di Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RefinementResults() {
  // 1) i pDSC thresholds
  const thresholds = ['70','80','90'];

  // 2) i dati per ciascun metodo e organo
  const prostateValues = {
    HERMES: [72, 79, 83],
    PostDAE: [53, 65, 52],
    cVAE:     [74, 73, 66]
  };
  const spleenValues = {
    HERMES: [71, 81, 85],
    PostDAE: [51, 54, 54],
    cVAE:     [68, 71, 76]
  };

  // 3) helper per costruire il data object
  const makeData = (values) => ({
    labels: thresholds,
    datasets: [
      { label: 'HERMES',   data: values.HERMES,   backgroundColor: '#e74c3c' },
      { label: 'PostDAE',   data: values.PostDAE,   backgroundColor: '#f1c40f' },
      { label: 'cVAE',      data: values.cVAE,      backgroundColor: '#27ae60' },
    ]
  });

  // 4) opzioni comuni
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#fff' } },
      title: {
        display: true,
        text: 'Refinement Results: Mean DSC by Method and pDSC Threshold',
        color: '#fff'
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'pDSC Threshold', color: '#fff' },
        ticks: { color: '#fff' },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'DSC (%)', color: '#fff' },
        ticks: { color: '#fff', stepSize: 10 },
        min: 0, max: 100,
        grid: { color: '#55000022' }
      }
    }
  };

  return (
    <>
      <p style={{margin:'0'}}>
        Once our pDSC thresholds are defined, we measure how often each method—HERMES, PostDAE, and cVAE—produces segmentations that meet or exceed those levels.</p>
        <ul>
            <li><strong>PostDAE:</strong> is a post-hoc denoising autoencoder that takes an initial segmentation and “cleans up” structural errors by learning a mapping from noisy masks back to high‐quality ones.</li>
            <li><strong>cVAE:</strong> (conditional Variational Autoencoder) refines the segmentation by modeling the distribution of plausible masks conditioned on the original image, effectively learning to correct mistakes in context.</li>
        </ul>
        <p style={{margin:'0'}}>At stricter thresholds (e.g. pDSC ≥ 90 %), HERMES still leads the field, achieving higher rates of “pass” than either PostDAE or cVAE.</p>
      <div className="bar-charts">
        <div className="chart-container">
          <h4>Prostate (MedSAM)</h4>
          <div className="chart-wrapper">
            <Bar data={makeData(prostateValues)} options={options} />
          </div>
        </div>
        <div className="chart-container">
          <h4>Spleen (MedSAM)</h4>
          <div className="chart-wrapper">
            <Bar data={makeData(spleenValues)} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}
