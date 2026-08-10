import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { formatInstructionDate, instructionStatusLabels, type Instruccion } from '@/data/instrucciones';
import { getTratamientos } from '@/data/tratamientos';

interface InstructionCardsProps {
  instructions: Instruccion[];
  headingLevel?: 'h2' | 'h3';
}

export default function InstructionCards({ instructions, headingLevel = 'h2' }: InstructionCardsProps) {
  const Heading = headingLevel;
  const tratamientos = getTratamientos();

  return (
    <div className="instructions-index__grid">
      {instructions.map((instruction) => {
        const service = tratamientos.find((item) => item.id === instruction.serviceId);
        const cardImage = instruction.resourceImage || instruction.socialImage;

        return (
          <article key={instruction.id} className="instructions-index__card">
            {(cardImage || service?.heroImage) && (
              <div className="instructions-index__card-media">
                <Image
                  src={cardImage?.src || service?.heroImage || '/images/isologo.png'}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className={`instructions-index__card-image${cardImage ? ' instructions-index__card-image--resource' : ''}`}
                />
              </div>
            )}

            <div className="instructions-index__card-content">
              <div className="instructions-index__card-kicker">
                <span className="instructions-index__date">Actualizada el {formatInstructionDate(instruction.updatedAt)}</span>
                {instruction.status !== 'published' && (
                  <span className="instructions-index__status">Preview · {instructionStatusLabels[instruction.status]}</span>
                )}
              </div>
              <Heading className="instructions-index__card-title">
                <Link href={`/instrucciones/${instruction.category}/${instruction.slug}`}>
                  {instruction.title}
                </Link>
              </Heading>
              <p className="instructions-index__card-excerpt">{instruction.excerpt}</p>
            </div>

            <div className="instructions-index__card-footer">
              <span className="instructions-index__tag">
                <FileText className="instructions-index__tag-icon" aria-hidden="true" />
                {instruction.tags[0] || instruction.categoryLabel}
              </span>
              <span className="instructions-index__readtime">
                <Clock className="instructions-index__readtime-icon" aria-hidden="true" />
                {instruction.readTime}
              </span>
            </div>

            <Link
              className="instructions-index__card-link"
              href={`/instrucciones/${instruction.category}/${instruction.slug}`}
              aria-label={`Ver ${instruction.title}`}
            >
              Ver instrucciones
              <ArrowRight className="instructions-index__card-link-icon" aria-hidden="true" />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
