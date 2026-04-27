'use client';

import React from 'react';
import { MapPin, Clock, MessageSquare, Phone, Navigation } from 'lucide-react';
import Image from 'next/image';

export default function Location() {
  return (
    <section className="py-24 bg-surface-background" id="ubicacion">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-6 tracking-tight">Visítanos en nuestro consultorio</h2>
            <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
              Un espacio diseñado para tu tranquilidad y confort, equipado con la mejor tecnología para tu cuidado dental.
            </p>

            <div className="space-y-8 mb-10">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary-container w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface mb-1">Dirección</h4>
                  <p className="text-on-surface-variant">Ramón Falcón 2401, Piso 1 Dpto. B<br/>Ciudad Autónoma de Buenos Aires - Flores</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <Clock className="text-primary-container w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface mb-1">Horarios de Atención</h4>
                  <p className="text-on-surface-variant">Lunes a Viernes: 09:00 - 19:00 hs<br/>Sábados: 09:00 - 13:00 hs</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5491137854198?text=Hola,%20quiero%20sacar%20un%20turno"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#1ebe57] transition-all shadow-lg shadow-[#25D366]/20 hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-5 h-5 fill-current" /> Contactar por WhatsApp
              </a>
              <a
                href="tel:+5491137854198"
                className="glass-panel border-primary-container text-primary-container font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-orange-50 transition-all hover:scale-105 active:scale-95"
              >
                <Phone className="w-5 h-5" /> Llamar ahora
              </a>
            </div>
          </div>

          {/* Map Section */}
          <div className="glass-panel rounded-3xl p-2 relative h-[500px] overflow-hidden group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.976372899936!2d-58.46496512431464!3d-34.630037358888586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca27fa9eee21%3A0x985e9d7976637b48!2sCnel.%20Ram%C3%B3n%20L.%20Falc%C3%B3n%202401%2C%20C1406%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1776957558537!5m2!1ses-419!2sar"
              className="w-full h-full rounded-2xl border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            {/* Floating Location Card */}
            <div className="absolute bottom-6 left-6 right-6 glass-panel p-5 rounded-2xl flex items-center justify-between transform translate-y-2 group-hover:translate-y-0 transition-transform pointer-events-none">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Navigation className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h5 className="font-bold text-on-surface">Paula Gualtieri</h5>
                  <span className="text-sm text-on-surface-variant font-medium">Ramón Falcón 2401</span>
                </div>
              </div>
              <a className="text-sm font-bold text-primary-container hover:underline decoration-2 underline-offset-4 pointer-events-auto" href="https://www.google.com/maps/dir/?api=1&destination=Cnel.+Ramón+L.+Falcón+2401,+C1406+CABA" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
