'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

import { tratamientos } from '@/data/tratamientos';

interface CaseDetailContentProps {
  id: string;
  casoId: string;
}

export default function CaseDetailContent({ id, casoId }: CaseDetailContentProps) {
  const tratamiento = tratamientos.find((t) => t.id === id);
  const caso = tratamiento?.casosClinicos.find((c) => c.id.toString() === casoId);

  if (!tratamiento || !caso) return null;
  const whatsappNumber = '5491137854198';
  const getWhatsAppLink = (message: string) => 
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-surface-background">
      <Navbar />
      
      <div className="pt-24">
        <Breadcrumb 
          items={[
            { label: tratamiento.tituloHero, href: `/tratamientos/${id}` },
            { label: `Caso: ${caso.paciente}` }
          ]} 
        />
      </div>

      {/* Hero Section */}
      <section className="relative pb-16 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wider uppercase mb-6"
          >
            Caso de Éxito: {tratamiento.tituloHero}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-on-surface mb-6 leading-tight"
          >
            Caso Clínico: <span className="text-orange-600">{caso.titulo}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-on-surface-variant max-w-2xl mx-auto"
          >
            Un viaje desde el malestar crónico hasta la sonrisa definitiva mediante tecnología de precisión.
          </motion.p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-auto-fit min-[768px]:flex min-[768px]:flex-wrap justify-center gap-6">
            {caso.imagenes ? (
              caso.imagenes.map((img: string, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative group rounded-[2rem] overflow-hidden shadow-xl border-4 border-white flex-1 min-w-[300px] max-w-[500px]"
                >
                  <div className="aspect-[4/3] relative bg-slate-200">
                    <Image 
                      src={img} 
                      alt={`Imagen ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-6 left-6 px-4 py-2 bg-zinc-900/80 backdrop-blur text-white text-xs font-bold rounded-full">ANTES</div>
                  )}
                  {idx === (caso.imagenes?.length ?? 0) - 1 && idx > 0 && (
                    <div className="absolute top-6 left-6 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-full">DESPUÉS</div>
                  )}
                </motion.div>
              ))
            ) : (
              <>
                {caso.imagenAntes && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative group rounded-[2rem] overflow-hidden shadow-xl border-4 border-white flex-1 min-w-[300px] max-w-[500px]"
                  >
                    <div className="aspect-[4/3] relative bg-slate-200">
                      <Image 
                        src={caso.imagenAntes} 
                        alt="Antes"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute top-6 left-6 px-4 py-2 bg-zinc-900/80 backdrop-blur text-white text-xs font-bold rounded-full">ANTES</div>
                  </motion.div>
                )}
                {caso.imagenDespues && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative group rounded-[2rem] overflow-hidden shadow-xl border-4 border-white flex-1 min-w-[300px] max-w-[500px]"
                  >
                    <div className="aspect-[4/3] relative bg-orange-100">
                      <Image 
                        src={caso.imagenDespues} 
                        alt="Después"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute top-6 left-6 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-full">DESPUÉS</div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Challenge */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 text-orange-600 mb-6">
                <AlertCircle className="w-8 h-8" />
                <h2 className="text-3xl font-bold text-on-surface">El Desafío</h2>
              </div>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
                {caso.desafio || 'El paciente presentaba una situación clínica compleja que afectaba tanto su salud bucodental como su bienestar emocional.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-surface-background border border-surface-variant">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Diagnóstico</h4>
                  <p className="text-sm font-semibold text-on-surface">{caso.diagnostico || 'Evaluación pendiente de detalle.'}</p>
                </div>
                <div className="p-6 rounded-2xl bg-surface-background border border-surface-variant">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Duración</h4>
                  <p className="text-sm font-semibold text-on-surface">{caso.duracion || 'Variable según evolución.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-orange-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-orange-600/20">
            <h2 className="text-3xl font-bold mb-8">Nuestra Solución</h2>
            <p className="text-orange-50 leading-relaxed mb-10 text-lg">
              {caso.solucion || 'Implementamos un abordaje integral basado en tecnología digital para garantizar resultados óptimos y duraderos.'}
            </p>
            <ul className="space-y-6">
              {(caso.solucionFeatures || ['Planificación 3D', 'Materiales Premium', 'Seguimiento Personalizado']).map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* CTA Footer */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-zinc-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
              ¿Querés lograr un resultado similar?
            </h2>
            <p className="text-zinc-400 mb-12 max-w-xl mx-auto relative z-10 text-lg">
              Agendá tu consulta hoy mismo y comenzá tu propia transformación.
            </p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <a 
                href={getWhatsAppLink(`Vi el caso de ${tratamiento.tituloHero} y me gustaría lograr un resultado similar`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/30 flex items-center gap-3 text-lg"
              >
                Agendar Consulta <ArrowRight className="w-5 h-5" />
              </a>
              <Link 
                href={`/tratamientos/${id}`}
                className="px-12 py-5 bg-white/10 backdrop-blur text-white rounded-full font-bold hover:bg-white/20 transition-all flex items-center gap-3 border border-white/20 text-lg"
              >
                Ver otros casos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
