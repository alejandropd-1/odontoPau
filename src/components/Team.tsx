'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { tinaField } from 'tinacms/dist/react';
import type { VisualRecord } from '@/cms/tina/visual-data';
import type { HomePageData } from '@/data/site-pages';

interface TeamProps {
  data: HomePageData['team'];
  editorData?: VisualRecord;
}

export default function Team({ data, editorData }: TeamProps) {
  const featuredEditor = editorData?.featured as VisualRecord | undefined;
  const memberEditors = editorData?.members as VisualRecord[] | undefined;
  return (
    <section className="team" id="equipo" data-tina-field={editorData ? tinaField(editorData) : undefined}>
      <div className="team__inner">
        <div className="team__header">
          <span className="team__eyebrow" data-tina-field={editorData ? tinaField(editorData, 'eyebrow') : undefined}>
            {data.eyebrow}
          </span>
          <h2 className="team__title" data-tina-field={editorData ? tinaField(editorData, 'title') : undefined}>{data.title}</h2>
          <p className="team__description" data-tina-field={editorData ? tinaField(editorData, 'description') : undefined}>{data.description}</p>
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
                src={data.featured.image}
                alt={data.featured.imageAlt}
                fill
                sizes="192px"
                className="team__avatar-image"
                data-tina-field={featuredEditor ? tinaField(featuredEditor, 'image') : undefined}
              />
            </div>
            <div className="team__featured-content">
              <h3 className="team__member-name" data-tina-field={featuredEditor ? tinaField(featuredEditor, 'name') : undefined}>{data.featured.name}</h3>
              <p className="team__member-license" data-tina-field={featuredEditor ? tinaField(featuredEditor, 'license') : undefined}>{data.featured.license}</p>
              <p className="team__member-role" data-tina-field={featuredEditor ? tinaField(featuredEditor, 'role') : undefined}>{data.featured.role}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="team__list"
          >
            {data.members.map((member, idx) => {
              const editorMember = memberEditors?.[idx];
              return (
              <div key={`${member.name}-${idx}`} className="team__list-card" data-tina-field={editorMember ? tinaField(editorMember) : undefined}>
                <div className="team__list-avatar">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="48px"
                    className="team__list-avatar-image"
                    data-tina-field={editorMember ? tinaField(editorMember, 'image') : undefined}
                  />
                </div>
                <div className="team__list-content">
                  <h3 className="team__list-name" data-tina-field={editorMember ? tinaField(editorMember, 'name') : undefined}>{member.name}</h3>
                  <span className="team__list-license" data-tina-field={editorMember ? tinaField(editorMember, 'license') : undefined}>{member.license}</span>
                  <p className="team__list-role" data-tina-field={editorMember ? tinaField(editorMember, 'role') : undefined}>{member.role}</p>
                </div>
              </div>
            );})}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
