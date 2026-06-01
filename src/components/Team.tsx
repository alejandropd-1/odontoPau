'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function Team() {
  return (
    <section className="team" id="equipo">
      <div className="team__inner">
        <div className="team__header">
          <span className="team__eyebrow">
            Conocé a los especialistas
          </span>
          <h2 className="team__title">Equipo de trabajo</h2>
          <p className="team__description">
            Contamos con un equipo de profesionales altamente capacitados para brindarte la mejor atención en cada especialidad odontológica.
          </p>
        </div>

        <div className="team__grid">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="team__featured"
          >
            <div className="team__avatar">
              <div className="team__avatar-fallback">
                PG
              </div>
            </div>
            <div className="team__featured-content">
              <h3 className="team__member-name">Dra. Paula Gualtieri</h3>
              <p className="team__member-license">MN</p>
              <p className="team__member-role">
                Especialista en alineadores dentales y ortopedia.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="team__list"
          >
            {[
              {
                name: 'Dr. Roberto Dominguez',
                mn: 'MN',
                role: 'Especialista en rehabilitación oral (Implantes y prótesis).'
              },
              {
                name: 'Dra. Emilia Omastott',
                mn: 'MN',
                role: 'Atención niños, Maestría en cirugía dental.'
              },
              {
                name: 'Dr. Pablo Martinez',
                mn: 'MN',
                role: 'Especialista en Endodoncia.'
              }
            ].map((member, idx) => (
              <div key={idx} className="team__list-card">
                <div className="team__list-icon-wrap">
                  <CheckCircle2 className="team__list-icon" />
                </div>
                <div className="team__list-content">
                  <h3 className="team__list-name">{member.name}</h3>
                  <span className="team__list-license">{member.mn}</span>
                  <p className="team__list-role">{member.role}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
