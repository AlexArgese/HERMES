import "../pages/NNQC.css";

import React, { useState, useRef } from 'react';
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

// 1) registra i moduli Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family = '"Abel", sans-serif';

export default function DSCCorrelationChart() {
  // 2) dati grezzi (le correlazioni DSC da Tabella 1 in ordine)
  const labels = [
    'Heart-LV',
    'Heart-MYO',
    'Heart-RV',
    'Prostate-PZ',
    'Prostate-TZ',
    'Prostate-Whole',
    'Spleen-Whole',
    'Liver-Whole',
    'Brain-Whole'
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'nnQC',
        data: [0.93, 0.92, 0.92, 0.81, 0.96, 0.97, 0.95, 0.90, 0.83],
        borderColor: '#9b59b6',
        tension: 0.3,
        fill: false,
        pointRadius: 4
      },
      {
        label: 'Wang et al.',
        data: [0.90, 0.91, 0.75, 0.55, 0.65, 0.64, 0.71, 0.72, 0.42],
        borderColor: '#27ae60',
        tension: 0.3,
        fill: false,
        pointRadius: 4
      },
      {
        label: 'Fournel et al.',
        data: [0.21, 0.51, 0.58, 0.33, 0.44, 0.66, 0.07, 0.58, 0.19],
        borderColor: '#e74c3c',
        tension: 0.3,
        fill: false,
        pointRadius: 4
      },
      {
        label: 'Galati et al.',
        data: [0.75, -0.06, 0.66, 0.71, 0.26, 0.26, -0.36, 0.0, -0.48],
        borderColor: '#3498db',
        tension: 0.3,
        fill: false,
        pointRadius: 4
      }
    ]
  };

  // stati per organo e modello selezionati
  const organKeys = Object.keys({
    Spleen: {},
    Prostate: {},
    Heart: {}
  });
  const [organ, selOrgan] = useState(organKeys[0]);
  const [selectedModel, setSelectedModel] = useState('Wang et al.');
  const chartRef = useRef(null);

  // gestore click sulle linee (usando ref e getElementsAtEventForMode)
  const handleChartClick = (event) => {
    const chart = chartRef.current;
    if (!chart) return;
    // ottieni elementi dataset premuti (dataset mode)
    const elements = chart.getElementsAtEventForMode(
      // passiamo l'evento nativo MouseEvent
      event.nativeEvent,
      'dataset',
      { intersect: false },
      false
    );
    if (elements && elements.length > 0) {
      const { datasetIndex } = elements[0];
      if (datasetIndex === 1) {
        setSelectedModel('Wang et al.');
      } else if (datasetIndex === 3) {
        setSelectedModel('Galati et al.');
      }
    }
  };

  // 3) opzioni di stile
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -0.6,
        max: 1.2,
        title: { display: true, text: 'Correlation (r)' },
        grid: { color: '#55000022' },
        ticks: { stepSize: 0.2 }
      },
      x: {
        title: { display: true, text: 'Organ-Class' },
        grid: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#fff', boxWidth: 12 }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      title: {
        display: true,
        text: 'DSC Correlation Across Organs',
        color: '#fff',
        font: {
          family: '"Anta", sans-serif',
          size: 25
        }
      }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  const images = {
    Spleen: {
      title: 'Spleen',
      original: '/nnqc/spleen-original.png',
      GT: '/nnqc/spleen-GT.png',
      wang: '/nnqc/spleen-wang.png',
      galati: '/nnqc/spleen-galati.png',
      nnqc: '/nnqc/spleen-nnqc.png'
    },
    Prostate: {
      title: 'Prostate',
      original: '/nnqc/prostate-original.png',
      GT: '/nnqc/prostate-GT.png',
      wang: '/nnqc/prostate-wang.png',
      galati: '/nnqc/prostate-galati.png',
      nnqc: '/nnqc/prostate-nnqc.png'
    },
    Heart: {
      title: 'Heart',
      original: '/nnqc/heart-original.png',
      GT: '/nnqc/heart-GT.png',
      wang: '/nnqc/heart-wang.png',
      galati: '/nnqc/heart-galati.png',
      nnqc: '/nnqc/heart-nnqc.png'
    }
  };

  return (
    <>
      <div className='graph-dsc'>
        <Line
          ref={chartRef}
          data={data}
          options={options}
          onClick={handleChartClick}
        />
      </div>
      <div className="dsc-title2">
        <div className="dsc-title-nav">
          <p>Select a line to compare segmentation results and see how they performs compared to nnQC.</p>
          <ul className="nav-links-dsc">
            {organKeys.map(i => (
              <li key={i}>
                <a
                  onClick={() => selOrgan(i)}
                  className={organ === i ? 'active' : ''}
                >
                  {i}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className='dsc-image'>
          <img src={images[organ].original} />
        </div>
      </div>
      <div className="three-images">
        <div className="fingerprints-box">
          <div className="section-header"><h4>Ground-truth</h4></div>
          <div className="nnqc-section">
            <img src={images[organ].GT} />
          </div>
        </div>
        <div className="fingerprints-box">
          <div className="section-header"><h4>nnQC</h4></div>
          <div className="nnqc-section">
            <img src={images[organ].nnqc} />
          </div>
        </div>
        <div className="fingerprints-box">
          <div className="section-header">
            <h4>{selectedModel ?
              selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1) :
              'Select model'
            }</h4>
          </div>
          {selectedModel && (
            <div className="nnqc-section">
              <img src={selectedModel=="Wang et al."? images[organ].wang : images[organ].galati} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
