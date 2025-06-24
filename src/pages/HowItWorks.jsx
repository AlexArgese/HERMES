import React from 'react';
import HowSteps   from '../components/HowSteps';
import TryItBox from '../components/TryItBox';   
import './NNQC.css';
import ScrollToHash from "../components/ScrollToHash"; 

export default function HowItWorks() {
  return (
    <div id='start'>
      <ScrollToHash/>
      <HowSteps />
      <TryItBox />    
    </div>
  );
}
