'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'motion/react';
import { Star, CheckCircle2, ArrowRight, MessageSquare, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { tratamientos } from '@/data/tratamientos';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TreatmentPage() {
  const params = useParams();
  const id = params?.id as string;
  const tratamiento = tratamientos.find((t) => t.id === id);

  if (!tratamiento) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-6">
              Excelencia Restaurativa
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-on-surface mb-6 leading-tight">
              {tratamiento.tituloHero.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'text-orange-600' : ''}>{word} </span>
              ))}
            </h1>
            <p className="text-lg text-on-surface-variant mb-10 max-w-xl leading-relaxed">
              {tratamiento.descripcionHero}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2">
                Solicitar Valoración <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-full border border-surface-variant">
                <CheckCircle2 className="text-orange-600 w-5 h-5" />
                <span className="text-sm font-semibold text-on-surface">Garantía de por vida</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative shadow-2xl">
              {/* Using a placeholder since I don't have the actual images yet */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-blue-50 flex items-center justify-center">
                <tratamiento.icon className="w-32 h-32 text-orange-600/20" />
              </div>
            </div>
            {/* Dr. Badge Overlay */}
            <div className="absolute -top-6 -right-6 md:right-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-bold">PG</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Dra. Paula Gualtieri</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Especialista en {tratamiento.tituloHero}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Casos Clínicos */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Casos Clínicos</h2>
              <p className="text-on-surface-variant max-w-xl">
                Descubra cómo hemos transformado vidas a través de la reconstrucción dental avanzada. Resultados reales de pacientes reales.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-surface-variant flex items-center justify-center hover:bg-surface-background transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-10 h-10 rounded-full border border-surface-variant flex items-center justify-center hover:bg-surface-background transition-colors text-orange-600">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tratamiento.casosClinicos.map((caso, idx) => (
              <motion.div 
                key={caso.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-surface-background rounded-3xl overflow-hidden border border-surface-variant hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[1.5/1] relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
                    [ANTES / DESPUÉS]
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Resultado Real</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <p className="text-on-surface mb-6 italic leading-relaxed">
                    "{caso.testimonio}"
                  </p>
                  <div className="flex items-center justify-between border-t border-surface-variant pt-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">{caso.paciente}</span>
                      <span className="text-xs text-on-surface-variant">{caso.fecha}</span>
                    </div>
                    <Link href="#" className="text-xs font-bold text-orange-600 hover:underline">Ver Caso Completo</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Box (Orange Section) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">¿Por qué elegir nuestros {tratamiento.id}?</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Main Big Feature (Left) */}
            <div className="bg-orange-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">{tratamiento.features[3].split(':')[0]}</h3>
                <p className="text-orange-100 max-w-sm leading-relaxed">
                  {tratamiento.features[3].split(':')[1]}
                </p>
              </div>
              <div className="mt-12 -mb-20 -mr-20 relative">
                <div className="aspect-square bg-orange-500/50 rounded-full blur-3xl absolute inset-0"></div>
                <div className="bg-orange-700/30 rounded-3xl p-4 border border-white/10 aspect-video flex items-center justify-center">
                   <tratamiento.icon className="w-40 h-40 text-white/10" />
                </div>
              </div>
            </div>

            {/* Sub Features Grid (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] p-8 border border-surface-variant flex flex-col justify-between hover:border-orange-200 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{tratamiento.features[0].split(':')[0]}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {tratamiento.features[0].split(':')[1]}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-8 border border-surface-variant flex flex-col justify-between hover:border-orange-200 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6 text-2xl font-bold text-orange-600">
                    98%
                  </div>
                  <h4 className="text-lg font-bold mb-2">{tratamiento.features[1].split(':')[0]}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {tratamiento.features[1].split(':')[1]}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-8 border border-surface-variant md:col-span-2 flex items-center justify-between hover:border-orange-200 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-2xl font-bold text-orange-600">
                    10+
                  </div>
                  <h4 className="text-lg font-bold mb-2">{tratamiento.features[2].split(':')[0]}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {tratamiento.features[2].split(':')[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-zinc-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10 italic">
              ¿Listo para transformar su sonrisa?
            </h2>
            <p className="text-zinc-400 mb-10 max-w-xl mx-auto relative z-10">
              Reserve hoy su primera consulta de valoración gratuita y reciba un plan de tratamiento personalizado a su medida.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <button className="px-10 py-4 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all flex items-center gap-2">
                Agendar Cita Gratis <CheckCircle2 className="w-5 h-5" />
              </button>
              <button className="px-10 py-4 bg-white/10 backdrop-blur text-white rounded-full font-bold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20">
                Hablar con un Especialista <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
