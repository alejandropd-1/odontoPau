'use client';

import React from 'react';
import { MapPin, Clock, MessageSquare, Navigation } from 'lucide-react';

export default function Location() {
  return (
    <section className="location" id="ubicacion">
      <div className="location__inner">
        <div className="location__grid">
          <div className="location__content">
            <h2 className="location__title">Visítanos en nuestro consultorio</h2>
            <p className="location__description">
              Un espacio diseñado para tu tranquilidad y confort, equipado con la mejor tecnología para tu cuidado dental.
            </p>

            <div className="location__details">
              <div className="location__detail">
                <div className="location__detail-icon-wrap">
                  <MapPin className="location__detail-icon" />
                </div>
                <div className="location__detail-content">
                  <h4 className="location__detail-title">Dirección</h4>
                  <p className="location__detail-text">Ramón Falcón 2401, Piso 1 Dpto. B<br/>Ciudad Autónoma de Buenos Aires - Flores</p>
                </div>
              </div>

              <div className="location__detail">
                <div className="location__detail-icon-wrap">
                  <Clock className="location__detail-icon" />
                </div>
                <div className="location__detail-content">
                  <h4 className="location__detail-title">Horarios para solicitar turnos o consultas</h4>
                  <p className="location__detail-text">
                    Lunes de 9 a 15hs<br/>
                    Martes de 9 a 18hs<br/>
                    Miércoles y jueves de 13 a 18hs<br/>
                    Viernes de 9 a 15hs
                  </p>
                </div>
              </div>
            </div>

            <div className="location__actions">
              <a
                href="https://wa.me/5491137854198?text=Hola,%20quiero%20sacar%20un%20turno"
                target="_blank"
                rel="noopener noreferrer"
                className="location__whatsapp"
              >
                <MessageSquare className="location__whatsapp-icon" /> Contactar por WhatsApp
              </a>
            </div>
          </div>

          <div className="location__map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.976372899936!2d-58.46496512431464!3d-34.630037358888586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca27fa9eee21%3A0x985e9d7976637b48!2sCnel.%20Ram%C3%B3n%20L.%20Falc%C3%B3n%202401%2C%20C1406%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1776957558537!5m2!1ses-419!2sar"
              className="location__iframe"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación del consultorio de la Dra. Paula Gualtieri"
            ></iframe>
            <div className="location__floating-card">
              <div className="location__floating-main">
                <div className="location__floating-icon">
                  <Navigation className="location__floating-icon-svg" />
                </div>
                <div className="location__floating-content">
                  <h5 className="location__floating-title">Paula Gualtieri</h5>
                  <span className="location__floating-address">Ramón Falcón 2401</span>
                </div>
              </div>
              <a className="location__directions" href="https://www.google.com/maps/dir/?api=1&destination=Cnel.+Ramón+L.+Falcón+2401,+C1406+CABA" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
