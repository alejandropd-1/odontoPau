'use client';

import Image from 'next/image';
import Link from 'next/link';
import { tinaField, useTina } from 'tinacms/dist/react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Info,
  Play,
  ShieldAlert,
  TriangleAlert,
  UserRoundCheck,
  XCircle,
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ShareArticleMenu from '@/components/ShareArticleMenu';
import {
  type Instruccion,
  type InstructionMatrixGroup,
  type InstructionNoticeTone,
  type InstructionResourceGallery,
  type InstructionSection,
} from '@/data/instrucciones';
import { formatInstructionDate, instructionStatusLabels } from '@/lib/instruction-display';
import {
  instructionFromVisualData,
  tinaTemplateField,
  type TinaVisualPayload,
} from '@/cms/tina/visual-data';

type VisualRecord = Record<string, unknown>;

interface InstructionContentProps {
  instruction: Instruccion;
  shareUrl: string;
  visual: TinaVisualPayload<{ instruccion: VisualRecord }>;
}

const matrixStates = [
  { key: 'yes' as const, label: 'Sí', icon: CheckCircle2 },
  { key: 'caution' as const, label: 'Precaución', icon: TriangleAlert },
  { key: 'no' as const, label: 'No', icon: XCircle },
];

const noticeIcons: Record<InstructionNoticeTone, typeof Info> = {
  info: Info,
  important: ShieldAlert,
  contact: AlertCircle,
};

function renderMatrixGroup(
  group: InstructionMatrixGroup,
  groupIndex: number,
  editorGroup?: VisualRecord,
) {
  return (
    <section
      key={group.title}
      className="instruction-detail__matrix-group"
      data-tina-field={editorGroup ? tinaField(editorGroup) : undefined}
      aria-labelledby={`instruction-matrix-group-${groupIndex}`}
    >
      <h3
        id={`instruction-matrix-group-${groupIndex}`}
        data-tina-field={editorGroup ? tinaField(editorGroup, 'title') : undefined}
      >
        {group.title}
      </h3>
      <div className="instruction-detail__matrix-states">
        {matrixStates.map(({ key, label, icon: Icon }) => {
          const items = group[key];
          if (!items?.length) {
            return null;
          }

          return (
            <div key={key} className={`instruction-detail__matrix-state instruction-detail__matrix-state--${key}`}>
              <h4>
                <Icon aria-hidden="true" />
                {label}
              </h4>
              <ul>
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function renderSection(
  section: InstructionSection,
  editorSection: VisualRecord | undefined,
  index: number,
) {
  const key = `${section.type}-${index}`;
  const titleId = `instruction-section-${index}`;
  const field = (name: string) => editorSection
    ? tinaField(editorSection, tinaTemplateField(section.type, name))
    : undefined;

  switch (section.type) {
    case 'steps':
      return (
        <section key={key} className="instruction-detail__section" data-tina-field={editorSection ? tinaField(editorSection) : undefined} aria-labelledby={section.title ? titleId : undefined}>
          {section.title && <h2 id={titleId} data-tina-field={field('title')}>{section.title}</h2>}
          {section.intro && <p className="instruction-detail__section-intro" data-tina-field={field('intro')}>{section.intro}</p>}
          <ol className="instruction-detail__steps" data-tina-field={field('items')}>
            {section.items.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </section>
      );
    case 'matrix':
      return (
        <section key={key} className="instruction-detail__section instruction-detail__section--matrix" data-tina-field={editorSection ? tinaField(editorSection) : undefined} aria-labelledby={section.title ? titleId : undefined}>
          {section.title && <h2 id={titleId} data-tina-field={field('title')}>{section.title}</h2>}
          {section.intro && <p className="instruction-detail__section-intro" data-tina-field={field('intro')}>{section.intro}</p>}
          <div className="instruction-detail__matrix">
            {section.groups.map((group, groupIndex) => renderMatrixGroup(
              group,
              groupIndex,
              (editorSection?.matrix_groups as VisualRecord[] | undefined)?.[groupIndex],
            ))}
          </div>
        </section>
      );
    case 'notice': {
      const Icon = noticeIcons[section.tone];
      return (
        <aside key={key} className={`instruction-detail__notice instruction-detail__notice--${section.tone}`} data-tina-field={editorSection ? tinaField(editorSection) : undefined} aria-labelledby={titleId}>
          <Icon aria-hidden="true" />
          <div>
            <h2 id={titleId} data-tina-field={field('title')}>{section.title}</h2>
            <p data-tina-field={field('text')}>{section.text}</p>
          </div>
        </aside>
      );
    }
    case 'text':
      return (
        <section key={key} className="instruction-detail__section" data-tina-field={editorSection ? tinaField(editorSection) : undefined} aria-labelledby={section.title ? titleId : undefined}>
          {section.title && <h2 id={titleId} data-tina-field={field('title')}>{section.title}</h2>}
          <div className="instruction-detail__prose" data-tina-field={field('paragraphs')}>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>
      );
  }
}

function renderResourceGallery(
  resourceGallery: InstructionResourceGallery,
  editorGallery?: VisualRecord,
) {
  return (
    <section
      className="instruction-detail__resource-gallery"
      aria-labelledby="instruction-resource-gallery-title"
      data-tina-field={editorGallery ? tinaField(editorGallery) : undefined}
    >
      <div className="instruction-detail__resource-gallery-heading">
        <div>
          <span>Guía visual para guardar</span>
          <h2 id="instruction-resource-gallery-title" data-tina-field={editorGallery ? tinaField(editorGallery, 'title') : undefined}>{resourceGallery.title}</h2>
        </div>
        {resourceGallery.intro && <p>{resourceGallery.intro}</p>}
      </div>

      <ol className="instruction-detail__resource-grid">
        {resourceGallery.images.map((resource, index) => {
          const resourceNumber = String(index + 1).padStart(2, '0');

          return (
            <li
              className="instruction-detail__resource-card"
              key={resource.src}
              data-tina-field={(editorGallery?.images as VisualRecord[] | undefined)?.[index]
                ? tinaField((editorGallery?.images as VisualRecord[])[index])
                : undefined}
            >
              <div className="instruction-detail__resource-card-media">
                <a
                  className="instruction-detail__resource-card-preview"
                  href={resource.downloadSrc || resource.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={resource.downloadSrc
                    ? `Reproducir video: ${resource.label || `recurso ${resourceNumber}`}`
                    : `Abrir imagen completa: ${resource.label || `recurso ${resourceNumber}`}`}
                >
                  <span className="instruction-detail__resource-number" aria-hidden="true">
                    {resourceNumber}
                  </span>
                  <Image
                    src={resource.src}
                    alt={resource.alt}
                    width={resource.width}
                    height={resource.height}
                    sizes="(min-width: 1200px) 18rem, (min-width: 768px) 36vw, 92vw"
                    loading="lazy"
                    className="instruction-detail__resource-card-image"
                  />
                  {resource.downloadSrc && (
                    <span className="instruction-detail__resource-play" aria-hidden="true">
                      <Play />
                    </span>
                  )}
                </a>
                {resource.downloadSrc && (
                  <a
                    className="instruction-detail__resource-download"
                    href={resource.downloadSrc}
                    download
                    aria-label={resource.downloadLabel || `Descargar video ${resourceNumber}`}
                    title={resource.downloadLabel || `Descargar video ${resourceNumber}`}
                  >
                    <Download aria-hidden="true" />
                  </a>
                )}
              </div>
              <div className="instruction-detail__resource-card-body">
                <h3>{resource.label || `Recurso ${resourceNumber}`}</h3>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function InstructionContent({
  instruction: initialInstruction,
  shareUrl,
  visual,
}: InstructionContentProps) {
  const { data } = useTina(visual);
  const editorInstruction = data.instruccion;
  const instruction = instructionFromVisualData(editorInstruction, initialInstruction);
  const editorSections = Array.isArray(editorInstruction.sections)
    ? editorInstruction.sections as VisualRecord[]
    : [];
  const resourceImage = instruction.resourceImage;
  const resourceGallery = instruction.resourceGallery;
  const showSingleResource = Boolean(resourceImage && !resourceGallery);
  const galleryAnchorIndex = resourceGallery
    ? instruction.sections.findIndex((section) => section.type === 'matrix')
    : -1;

  return (
    <main className="instruction-detail" data-tina-field={tinaField(editorInstruction)}>
      <Navbar />

      <div className="instruction-detail__breadcrumb-spacer">
        <Breadcrumb items={[
          { label: 'Instrucciones', href: '/instrucciones' },
          { label: instruction.title },
        ]} />
      </div>

      <article className="instruction-detail__article">
        <div className="instruction-detail__inner">
          <Link className="instruction-detail__back-link" href="/instrucciones">
            <ArrowLeft aria-hidden="true" />
            Volver a instrucciones
          </Link>

          {instruction.status !== 'published' && (
            <p className="instruction-detail__preview-notice" role="status">
              Vista previa editorial · Estado: {instructionStatusLabels[instruction.status]} · No indexada
            </p>
          )}

          <header className="instruction-detail__hero">
            <span className="instruction-detail__eyebrow" data-tina-field={tinaField(editorInstruction, 'heroLabel')}>
              {instruction.heroLabel || instruction.categoryLabel}
            </span>
            <h1 className="instruction-detail__title" data-tina-field={tinaField(editorInstruction, 'title')}>
              <span>Guía:</span> {instruction.title}
            </h1>
            <p className="instruction-detail__excerpt" data-tina-field={tinaField(editorInstruction, 'excerpt')}>{instruction.excerpt}</p>

            <div className="instruction-detail__meta">
              <span className="instruction-detail__meta-item">
                <Calendar aria-hidden="true" />
                Actualizada el {formatInstructionDate(instruction.updatedAt)}
              </span>
              <span className="instruction-detail__meta-item">
                <Clock aria-hidden="true" />
                {instruction.readTime}
              </span>
              {instruction.clinicalReviewer && (
                <span className="instruction-detail__meta-item">
                  <UserRoundCheck aria-hidden="true" />
                  Revisada por {instruction.clinicalReviewer}
                </span>
              )}
              <ShareArticleMenu title={instruction.title} text={instruction.excerpt} url={shareUrl} />
            </div>
          </header>

          <div className={`instruction-detail__layout${showSingleResource ? ' instruction-detail__layout--with-resource' : ''}`}>
            <div className="instruction-detail__body">
              {instruction.sections.map((section, index) => {
                const renderedSection = renderSection(section, editorSections[index], index);

                if (resourceGallery && index === galleryAnchorIndex) {
                  return (
                    <div className="instruction-detail__care-layout" key={`care-layout-${index}`}>
                      {renderedSection}
                      {renderResourceGallery(
                        resourceGallery,
                        editorInstruction.resourceGallery as VisualRecord | undefined,
                      )}
                    </div>
                  );
                }

                return renderedSection;
              })}
            </div>

            {showSingleResource && resourceImage && (
              <aside className="instruction-detail__resource" aria-labelledby="instruction-resource-title" data-tina-field={editorInstruction.resourceImage ? tinaField(editorInstruction.resourceImage as VisualRecord) : undefined}>
                <div className="instruction-detail__resource-heading">
                  <span>Recurso para guardar</span>
                  <h2 id="instruction-resource-title">{resourceImage.label || 'Guía visual'}</h2>
                  <p>La misma información está disponible en el contenido de esta página para facilitar su lectura.</p>
                </div>
                <a
                  className="instruction-detail__resource-preview"
                  href={resourceImage.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir imagen completa: ${resourceImage.label || instruction.title}`}
                >
                  <Image
                    src={resourceImage.src}
                    alt={resourceImage.alt}
                    width={resourceImage.width}
                    height={resourceImage.height}
                    sizes="(min-width: 1200px) 28rem, (min-width: 768px) 42rem, 92vw"
                    loading="eager"
                    className="instruction-detail__resource-image"
                  />
                </a>
                <div className="instruction-detail__resource-actions">
                  <a href={resourceImage.src} target="_blank" rel="noopener noreferrer">
                    Ver imagen completa
                    <ExternalLink aria-hidden="true" />
                  </a>
                  <a href={resourceImage.src} download>
                    {resourceImage.downloadLabel || 'Descargar guía'}
                    <Download aria-hidden="true" />
                  </a>
                </div>
              </aside>
            )}
          </div>

          <footer className="instruction-detail__footer">
            <p><strong>Importante:</strong> esta guía acompaña la atención profesional y no reemplaza una evaluación ni las indicaciones personalizadas.</p>
            <div className="instruction-detail__tags" aria-label="Temas de la instrucción">
              {instruction.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </footer>
        </div>
      </article>

      <Footer />
    </main>
  );
}
