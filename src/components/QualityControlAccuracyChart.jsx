// src/components/QualityControlAccuracyChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../pages/Results.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family = `"Abel", sans-serif`;

export default function QualityControlAccuracyChart() {
  const thresholds = ['0.7', '0.8', '0.9'];

  const data = {
    labels: thresholds,
    datasets: [
      {
        label: 'Galati et al.',
        data: [55, 41, 27],   
        borderColor: '#3498db',
        pointBackgroundColor: '#3498db',
        tension: 0.3,
        fill: false,
        pointRadius: 4
      },
      {
        label: 'Wang et al.',
        data: [62, 56, 37],
        borderColor: '#f1c40f',
        pointBackgroundColor: '#f1c40f',
        tension: 0.3,
        fill: false,
        pointRadius: 4
      },
      {
        label: 'HERMES',
        data: [100, 98, 93],
        borderColor: '#e74c3c',
        pointBackgroundColor: '#e74c3c',
        tension: 0.3,
        fill: false,
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#fff' }
      },
      title: {
        display: true,
        text: 'Quality Control Accuracy by Method and pDSC Threshold',
        color: '#fff',
        font: { size: 18 }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'pDSC Threshold', color: '#fff' },
        ticks: { color: '#fff' },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Accuracy (%)', color: '#fff' },
        ticks: { color: '#fff', callback: v => `${v}%`, stepSize: 10 },
        min: 0,
        max: 100,
        grid: { color: '#55000022' }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <>
        <p>
          At its core, HERMES relies on the nnQC quality estimator.
          It achieves near-perfect accuracy in identifying poor-quality
          segmentations (up to 100% at pDSC 0.7), enabling precise correction decisions.
        </p>
        <div className="graph-dsc" style={{ height: '400px' }}>
          <Line data={data} options={options} />
        </div>
    </>
  );
}
