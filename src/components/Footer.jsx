import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className='big-footer'>
      <div className="footer">
        <div className="footer-container1">
          <img src="/hermes_logo_trasparente.png" className='logo-footer'/>
          Copyright © 2025 | EURECOM | All rights reserved.
        </div>
        <div className="footer-container2">
          <div className='line-footer'>
            <img src="/Al4Health.png" alt="Al4Health@EURECOM"/>
            <span className='partOf'>part of Al4Health@EURECOM</span> 
          </div>
          <div className='line-footer'>
            <img src="/logo_alex.png" alt="Al4Health@EURECOM"/>
            <span className='partOf'>Website, graphics & animations by <strong>
              <a target="_blank"
              rel="noopener noreferrer"
              style={{color:'#ff4081'}}
              href='https://alexargese.github.io'>Alex Argese
              </a>
            </strong></span> 
          </div>
        </div>
      </div>
      <p className="footer-note">
        Some images on this website are AI-generated.
      </p>
    </footer>
  )
}

export default Footer
