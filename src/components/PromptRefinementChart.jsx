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
import '../pages/Results.css'; // il tuo CSS

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PromptRefinementChart() {
  const thresholds = ['70', '80', '90'];

  const data = {
    labels: thresholds,
    datasets: [
      {
        label: 'MedSAM',
        data: [2.74, 5.48, 6.18],
        borderColor: '#f1c40f',
        tension: 0.3,
        pointRadius: 4,
        fill: false
      },
      {
        label: 'ScribblePrompt',
        data: [1.38, 1.77, 3.29],
        borderColor: '#e67e22',
        tension: 0.3,
        pointRadius: 4,
        fill: false
      },
      {
        label: 'MIDeepSeg',
        data: [2.00, 2.15, 3.69],
        borderColor: '#e74c3c',
        tension: 0.3,
        pointRadius: 4,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#fff' }
      },
      title: {
        display: true,
        text: 'Average Number of Refinement Steps vs. pDSC Threshold',
        color: '#fff',
        font: { size: 18 }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'pDSC Threshold', color: '#fff' },
        ticks: { color: '#fff' },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Average Refinement Steps', color: '#fff' },
        ticks: {
          color: '#fff',
          stepSize: 1,
          callback: value => value.toFixed(0)  // mostra solo interi
        },
        min: 0,
        max: 7,
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
      <p style={{ margin: 0 }}>
      Rather than a one-shot pass, HERMES runs in a fully automated, model-agnostic loop: after each iteration it updates the prompt based on the previous output, correcting mistakes and filling anatomical gaps. This cycle repeats until the target quality threshold is reached.
      </p>
      <div className="bar-charts" style={{ marginTop: '1rem' }}>
        <div className="chart-container" style={{ flex: '1 1 100%' }}>
          <div className="chart-wrapper" style={{ height: '400px' }}>
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}
