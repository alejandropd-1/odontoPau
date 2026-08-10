'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

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
              <Image
                src="/images/profesionales/paula-gualtieri-estudio.webp"
                alt="Retrato de la Dra. Paula Gualtieri"
                fill
                sizes="192px"
                className="team__avatar-image"
              />
            </div>
            <div className="team__featured-content">
              <h3 className="team__member-name">Dra. Paula Gualtieri</h3>
              <p className="team__member-license">MN 31757</p>
              <p className="team__member-role">
                Especialista en ortodoncia y ortopedia.
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
                mn: 'MN 32457',
                role: 'Especialista en rehabilitación oral (Implantes y prótesis).',
                image: '/images/profesionales/roberto-dominguez-estudio.webp',
                imageAlt: 'Retrato del Dr. Roberto Dominguez'
              },
              {
                name: 'Dra. Emilia Omastott',
                mn: 'MN 40113',
                role: 'Atención niños, Maestría en cirugía dental.',
                image: '/images/profesionales/maria-emilia-omastott-estudio.webp',
                imageAlt: 'Retrato de la Dra. Emilia Omastott'
              },
              {
                name: 'Dr. Pablo Martinez',
                mn: 'MN 33337',
                role: 'Especialista en Endodoncia.',
                image: '/images/profesionales/pablo-alejandro-martinez-estudio.webp',
                imageAlt: 'Retrato del Dr. Pablo Martinez'
              }
            ].map((member, idx) => (
              <div key={idx} className="team__list-card">
                <div className="team__list-avatar">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="48px"
                    className="team__list-avatar-image"
                  />
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
