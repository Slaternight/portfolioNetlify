import React from 'react';
import './Nav.css'


function Navigation() {
  return (
    <nav>
      <ul>

        <li>
          <a href="/">Inicio</a>
        </li>

        <li>
          <a href="/productos">Portafolio</a>
        </li>

        <li>
          <a href="/contact">Contact</a>
        </li>

      </ul>

     
    </nav>
  );
}

export default Navigation;