'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'motion/react';
import { Star, CheckCircle2, ArrowRight, Phone, AlertCircle, Clock, ShieldCheck, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { tratamientos } from '@/data/tratamientos';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const casoId = params?.casoId as string;
  
  const tratamiento = tratamientos.find((t) => t.id === id);
  const caso = tratamiento?.casosClinicos.find((c) => c.id.toString() === casoId);

  if (!tratamiento || !caso) {
    notFound();
  }

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
            className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-6"
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
            Paciente: {caso.paciente} — Un viaje desde el malestar crónico hasta la sonrisa definitiva mediante tecnología de precisión.
          </motion.p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group rounded-[2rem] overflow-hidden shadow-xl border-4 border-white"
            >
              <div className="aspect-[4/3] bg-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">
                [Imagen Antes]
              </div>
              <div className="absolute top-6 left-6 px-4 py-2 bg-zinc-900/80 backdrop-blur text-white text-xs font-bold rounded-full">ANTES</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group rounded-[2rem] overflow-hidden shadow-xl border-4 border-white"
            >
              <div className="aspect-[4/3] bg-orange-100 flex items-center justify-center text-orange-400 font-bold uppercase tracking-widest">
                [Imagen Después]
              </div>
              <div className="absolute top-6 left-6 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-full">DESPUÉS</div>
            </motion.div>
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
              {(caso.solucionFeatures || ['Planificación 3D', 'Materiales Premium', 'Seguimiento Personalizado']).map((f, i) => (
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

      {/* Stats Row */}
      <section className="py-16 border-y border-surface-variant bg-surface-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {(caso.stats || [
              { label: 'Recuperación', value: '100%' },
              { label: 'Dolor', value: '0' },
              { label: 'Estética', value: 'A++' },
              { label: 'Garantía', value: '10+' }
            ]).map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-5xl font-bold text-on-surface">{stat.value}</p>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-surface-background rounded-[3rem] p-12 md:p-16 border border-surface-variant relative">
            <div className="absolute -top-10 left-12 md:left-16">
              <div className="w-20 h-20 rounded-3xl bg-white border border-surface-variant p-2 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-orange-100 flex items-center justify-center">
                   <span className="text-2xl font-bold text-orange-600">{caso.paciente.charAt(0)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium text-on-surface mb-8 italic leading-snug">
                "{caso.testimonio}"
              </blockquote>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-on-surface">{caso.paciente}</span>
                <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">{caso.titulo}</span>
              </div>
            </div>
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
                href={getWhatsAppLink(`Hola, vi el caso de ${caso.paciente} y me gustaría lograr un resultado similar`)}
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
