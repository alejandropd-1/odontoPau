'use client';

import React from 'react';
import { MapPin, Clock, MessageSquare, Navigation } from 'lucide-react';
import { tinaField } from 'tinacms/dist/react';
import type { VisualRecord } from '@/cms/tina/visual-data';
import type { HomePageData } from '@/data/site-pages';

interface LocationProps {
  data: HomePageData['location'];
  editorData?: VisualRecord;
}

export default function Location({ data, editorData }: LocationProps) {
  return (
    <section className="location" id="ubicacion" data-tina-field={editorData ? tinaField(editorData) : undefined}>
      <div className="location__inner">
        <div className="location__grid">
          <div className="location__content">
            <h2 className="location__title" data-tina-field={editorData ? tinaField(editorData, 'title') : undefined}>{data.title}</h2>
            <p className="location__description" data-tina-field={editorData ? tinaField(editorData, 'description') : undefined}>{data.description}</p>

            <div className="location__details">
              <div className="location__detail">
                <div className="location__detail-icon-wrap"><MapPin className="location__detail-icon" /></div>
                <div className="location__detail-content">
                  <h4 className="location__detail-title" data-tina-field={editorData ? tinaField(editorData, 'addressTitle') : undefined}>{data.addressTitle}</h4>
                  <p className="location__detail-text" data-tina-field={editorData ? tinaField(editorData, 'addressLines') : undefined}>
                    {data.addressLines.map((line, index) => (
                      <React.Fragment key={`${line}-${index}`}>{line}{index < data.addressLines.length - 1 && <br />}</React.Fragment>
                    ))}
                  </p>
                </div>
              </div>

              <div className="location__detail">
                <div className="location__detail-icon-wrap"><Clock className="location__detail-icon" /></div>
                <div className="location__detail-content">
                  <h4 className="location__detail-title" data-tina-field={editorData ? tinaField(editorData, 'hoursTitle') : undefined}>{data.hoursTitle}</h4>
                  <p className="location__detail-text" data-tina-field={editorData ? tinaField(editorData, 'hours') : undefined}>
                    {data.hours.map((line, index) => (
                      <React.Fragment key={`${line}-${index}`}>{line}{index < data.hours.length - 1 && <br />}</React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="location__actions">
              <a href={data.whatsappHref} target="_blank" rel="noopener noreferrer" className="location__whatsapp" data-tina-field={editorData ? tinaField(editorData, 'whatsappLabel') : undefined}>
                <MessageSquare className="location__whatsapp-icon" /> {data.whatsappLabel}
              </a>
            </div>
          </div>

          <div className="location__map">
            <iframe
              src={data.mapEmbedUrl}
              className="location__iframe"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={data.mapTitle}
            />
            <div className="location__floating-card">
              <div className="location__floating-main">
                <div className="location__floating-icon"><Navigation className="location__floating-icon-svg" /></div>
                <div className="location__floating-content">
                  <h5 className="location__floating-title" data-tina-field={editorData ? tinaField(editorData, 'placeName') : undefined}>{data.placeName}</h5>
                  <span className="location__floating-address" data-tina-field={editorData ? tinaField(editorData, 'placeAddress') : undefined}>{data.placeAddress}</span>
                </div>
              </div>
              <a className="location__directions" href={data.directionsHref} target="_blank" rel="noopener noreferrer" data-tina-field={editorData ? tinaField(editorData, 'directionsLabel') : undefined}>{data.directionsLabel}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
