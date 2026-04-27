'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, ArrowRight, MessageSquare, Phone } from 'lucide-react';
import { tratamientos } from '@/data/tratamientos';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

interface TreatmentDetailContentProps {
  id: string;
}

export default function TreatmentDetailContent({ id }: TreatmentDetailContentProps) {
  const tratamiento = tratamientos.find((t) => t.id === id);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  if (!tratamiento) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = 400; 
      const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const whatsappNumber = '5491137854198';
  const getWhatsAppLink = (message: string) => 
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-surface-background">
      <Navbar />
      
      <div className="pt-24">
        <Breadcrumb items={[{ label: tratamiento.tituloHero }]} />
      </div>

      {/* Hero Section */}
      <section className="relative pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wider uppercase mb-6">
              Excelencia Restaurativa
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-on-surface mb-6 leading-tight">
              {tratamiento.tituloHero.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 1 ? 'text-orange-600' : ''}>{word} </span>
              ))}
            </h1>
            <p className="text-lg text-on-surface-variant mb-10 max-w-xl leading-relaxed">
              {tratamiento.descripcionHero}
            </p>
              <a 
                href={getWhatsAppLink(`Hola, quiero solicitar una valoración para ${tratamiento.tituloHero}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-fit justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2"
              >
                Solicitar Valoración <ArrowRight className="w-5 h-5" />
              </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative shadow-2xl">
              <Image 
                src={tratamiento.heroImage} 
                alt={tratamiento.tituloHero}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent"></div>
            </div>
            {/* Dr. Badge Overlay */}
            <div className="absolute top-10 -right-6 md:right-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <span className="text-orange-600 font-bold">PG</span>
              </div>
              <div>
                {tratamiento.id === 'pediatria' ? (
                  <>
                    <p className="text-xs font-bold text-on-surface">Dra. Paula Gualtieri</p>
                    <p className="text-xs font-bold text-on-surface mt-1">Dra. Emilia Omastott</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mt-1">Especialistas en {tratamiento.tituloHero}</p>
                  </>
                ) : tratamiento.id === 'implantes' ? (
                  <>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Paula Gualtieri Odontología</p>
                    <p className="text-xs font-bold text-on-surface mt-1">Dr. Roberto Dominguez</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mt-1">Especialista en Rehabilitación Oral</p>
                  </>
                ) : tratamiento.id === 'estetica-dental' ? (
                  <>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Paula Gualtieri Odontología</p>
                    <p className="text-xs font-bold text-on-surface mt-1">Dr. Roberto Dominguez</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mt-1">Especialista en {tratamiento.tituloHero}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold text-on-surface">Dra. Paula Gualtieri</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Especialista en {tratamiento.tituloHero}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clinical Cases Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">Casos Clínicos</h2>
              <p className="text-on-surface-variant max-w-xl">Descubre cómo hemos transformado vidas a través de la reconstrucción dental avanzada. Resultados reales de pacientes reales.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => scroll('left')}
                className="p-4 rounded-full border border-surface-variant hover:bg-surface-background transition-colors"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-4 rounded-full border border-surface-variant hover:bg-surface-background transition-colors"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 scroll-smooth"
          >
            {tratamiento.casosClinicos.map((caso: any, idx: number) => (
              <motion.div 
                key={caso.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="max-w-[350px] w-full flex-shrink-0 bg-surface-background rounded-3xl overflow-hidden border border-surface-variant hover:shadow-xl transition-all duration-500 snap-start"
              >
                <div className="aspect-[1.5/1] relative overflow-hidden bg-slate-200">
                  <Image 
                    src={caso.imagenDespues || caso.imagenAntes || (caso.imagenes && caso.imagenes.length > 0 ? caso.imagenes[caso.imagenes.length - 1] : '')} 
                    alt={caso.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {caso.estado && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-zinc-900/80 backdrop-blur text-white text-[10px] font-bold rounded-full">
                      {caso.estado}
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between pt-6 border-t border-surface-variant">
                    {caso.fecha && (
                      <span className="text-xs text-on-surface-variant font-medium">{caso.fecha}</span>
                    )}
                    <Link href={`/tratamientos/${tratamiento.id}/casos/${caso.id}`} className="text-xs font-bold text-orange-600 hover:underline">Ver Caso Completo</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (Orange Box) */}
      <section className="py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-orange-600 rounded-[3rem] p-8 md:p-16 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden shadow-2xl shadow-orange-600/20">
             {/* Decorative Background Icon */}
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 pointer-events-none">
                <tratamiento.icon className="w-96 h-96" />
             </div>

             <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">¿Por qué elegir nuestros {tratamiento.tituloHero.toLowerCase()}?</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {tratamiento.features.map((feature: string, i: number) => (
                   <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                       <CheckCircle2 className="w-6 h-6 text-orange-600" />
                     </div>
                     <span className="font-semibold text-sm md:text-base">{feature}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="bg-white p-8 rounded-[2rem] text-zinc-900 shadow-xl">
                  <p className="text-4xl font-bold text-orange-600 mb-2">98%</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tasa de Éxito</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] text-zinc-900 shadow-xl mt-8">
                  <p className="text-4xl font-bold text-orange-600 mb-2">15+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Años de Experiencia</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-zinc-900 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-bold text-white mb-8">¿Listo para transformar su sonrisa?</h2>
              <p className="text-zinc-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">Unite a los pacientes que han recuperado su confianza con nuestro tratamientos de vanguardia.</p>
              <div className="flex flex-wrap justify-center gap-4 relative z-10">
                <a 
                  href={getWhatsAppLink(`Hola, quiero agendar mi cita para el tratamiento de ${tratamiento.tituloHero}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all flex items-center gap-2"
                >
                  Agendar Cita <CheckCircle2 className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
