import React, { useEffect, useId, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { useCMS } from 'tinacms';
import type { TinaField } from 'tinacms';
import { visibleEditorialStatusValues } from './editorial-profile';

type EditorialFieldProps = {
  field: TinaField & { namespace: string[] };
  input: {
    name: string;
    value: string;
    type?: string;
    onChange: (event: ChangeEvent<string>) => void;
    onFocus: (event?: FocusEvent<string>) => void;
    onBlur: (event?: FocusEvent<string>) => void;
  };
  meta: {
    error?: unknown;
  };
};

type EditorialChipFieldProps = {
  field: TinaField & { namespace: string[] };
  input: {
    name: string;
    value: string[];
    onChange: (event: ChangeEvent<string>) => void;
    onFocus: (event?: FocusEvent<string>) => void;
    onBlur: (event?: FocusEvent<string>) => void;
  };
  meta: {
    error?: unknown;
  };
};

type EditorialOption = string | { label?: string; value: string };

type EditorialChoiceFieldProps = {
  field: TinaField & { namespace: string[]; options?: EditorialOption[] };
  input: {
    name: string;
    value: string | string[] | undefined;
    onChange: (value: unknown) => void;
    onFocus: (event?: FocusEvent<HTMLElement>) => void;
    onBlur: (event?: FocusEvent<HTMLElement>) => void;
  };
  meta: {
    error?: unknown;
  };
};

const EDITORIAL_FIELD_STYLE_ID = 'odonto-editorial-field-styles';
const EDITORIAL_FIELD_STYLES = `
  .odonto-editorial-field { --editorial-accent: #c44e1a; --editorial-error: #b3261e; --editorial-border: #8b817c; width: 100%; min-width: 0; margin: 0 0 1.25rem; box-sizing: border-box; }
  .odonto-editorial-field *, .odonto-editorial-field *::before, .odonto-editorial-field *::after { box-sizing: border-box; }
  .odonto-editorial-field__control { position: relative; width: 100%; min-width: 0; min-height: 56px; overflow: hidden; border: 1px solid var(--editorial-border); border-radius: 8px; background: #fff; transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease; }
  .odonto-editorial-field__control::after { position: absolute; right: 0; bottom: 0; left: 0; height: 3px; border-radius: 0 0 7px 7px; background: var(--editorial-accent); content: ''; opacity: 0; transform: scaleX(.5); transform-origin: center; transition: opacity 150ms ease, transform 150ms ease; pointer-events: none; }
  .odonto-editorial-field__control--focused { border-color: var(--editorial-accent); box-shadow: 0 0 0 3px rgb(196 78 26 / 15%); }
  .odonto-editorial-field__control--focused::after, .odonto-editorial-field__control--invalid::after { opacity: 1; transform: scaleX(1); }
  .odonto-editorial-field__control--invalid { border-color: var(--editorial-error); }
  .odonto-editorial-field__control--invalid::after { background: var(--editorial-error); }
  .odonto-editorial-field__input { width: 100%; min-height: 54px; margin: 0; padding: 1.45rem 1rem .35rem; border: 0; outline: 0; background: transparent; color: #2f2926; font: inherit; line-height: 1.35; resize: vertical; }
  .odonto-editorial-field__control--multiline, .odonto-editorial-field__control--multiline .odonto-editorial-field__input { min-height: 128px; }
  .odonto-editorial-field__label { position: absolute; top: 17px; left: 1rem; max-width: calc(100% - 2rem); overflow: hidden; color: #615853; font-size: 1rem; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; transform-origin: left top; transition: color 150ms ease, font-size 150ms ease, top 150ms ease; pointer-events: none; }
  .odonto-editorial-field__label--floating { top: 7px; color: var(--editorial-accent); font-size: .75rem; font-weight: 600; }
  .odonto-editorial-field__description, .odonto-editorial-field__error { margin: .35rem 0 0; padding-inline: .25rem; font-size: .75rem; line-height: 1.4; }
  .odonto-editorial-field__description { color: #6d625c; }
  .odonto-editorial-field__error { color: var(--editorial-error); font-weight: 600; }
  .odonto-editorial-chips__label { display: block; margin: 0 0 .35rem; color: #3c3430; font-size: .875rem; font-weight: 600; line-height: 1.35; }
  .odonto-editorial-chips__entry { display: flex; width: 100%; min-width: 0; gap: .5rem; }
  .odonto-editorial-chips__entry-input { min-width: 0; min-height: 48px; flex: 1 1 auto; padding: .7rem .85rem; border: 1px solid var(--editorial-border); border-radius: 8px; outline: 0; background: #fff; color: #2f2926; font: inherit; }
  .odonto-editorial-chips__entry-input:focus { border-color: var(--editorial-accent); box-shadow: 0 0 0 3px rgb(196 78 26 / 15%); }
  .odonto-editorial-chips__add { position: relative; width: 32px; min-width: 32px; height: 32px; align-self: center; padding: 0; border: 0; border-radius: 999px; background: var(--editorial-accent); color: #fff; font-size: 0; cursor: pointer; }
  .odonto-editorial-chips__add::before, .odonto-editorial-chips__add::after { position: absolute; top: 50%; left: 50%; width: 14px; height: 2px; border-radius: 999px; background: currentColor; content: ''; transform: translate(-50%, -50%); }
  .odonto-editorial-chips__add::after { transform: translate(-50%, -50%) rotate(90deg); }
  .odonto-editorial-chips__add:focus-visible, .odonto-editorial-chip__remove:focus-visible { outline: 3px solid rgb(196 78 26 / 25%); outline-offset: 2px; }
  .odonto-editorial-chips__list { display: flex; width: 100%; min-width: 0; flex-wrap: wrap; gap: .45rem; margin: .65rem 0 0; padding: 0; list-style: none; }
  .odonto-editorial-chip { display: inline-flex; width: fit-content; max-width: 100%; min-width: 0; align-items: center; gap: .35rem; padding: .35rem .45rem .35rem .7rem; border: 1px solid #d8c8c0; border-radius: 999px; background: #fff8f4; color: #4a3e38; font-size: .75rem; line-height: 1.25; }
  .odonto-editorial-chip__text { min-width: 0; flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .odonto-editorial-chip__remove { display: grid; width: 1.25rem; min-width: 1.25rem; height: 1.25rem; place-items: center; padding: 0; border: 0; border-radius: 999px; background: transparent; color: #7a655b; font-size: 1rem; line-height: 1; cursor: pointer; }
  .odonto-editorial-chip__remove:hover { background: #f1ded4; color: #9e3e15; }
  .odonto-editorial-choice { width: 100%; min-width: 0; margin: 0 0 1.25rem; }
  .odonto-editorial-choice__control { position: relative; width: 100%; min-width: 0; min-height: 56px; overflow: hidden; border: 1px solid var(--editorial-border, #8b817c); border-radius: 8px; background: #fff; transition: border-color 150ms ease, box-shadow 150ms ease; }
  .odonto-editorial-choice__control::after { position: absolute; right: 0; bottom: 0; left: 0; height: 3px; border-radius: 0 0 7px 7px; background: var(--editorial-accent, #c44e1a); content: ''; opacity: 0; transform: scaleX(.5); transition: opacity 150ms ease, transform 150ms ease; pointer-events: none; }
  .odonto-editorial-choice__control:focus-within { border-color: var(--editorial-accent, #c44e1a); box-shadow: 0 0 0 3px rgb(196 78 26 / 15%); }
  .odonto-editorial-choice__control:focus-within::after { opacity: 1; transform: scaleX(1); }
  .odonto-editorial-choice__label { position: absolute; top: 7px; left: 1rem; z-index: 1; max-width: calc(100% - 3rem); overflow: hidden; color: var(--editorial-accent, #c44e1a); font-size: .75rem; font-weight: 600; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }
  .odonto-editorial-choice__select, .odonto-editorial-choice__date { width: 100%; min-height: 54px; padding: 1.35rem 3rem .3rem 1rem; border: 0; outline: 0; appearance: none; background: transparent; color: #2f2926; font: inherit; cursor: pointer; }
  .odonto-editorial-choice__date { padding-right: 1rem; color-scheme: light; }
  .odonto-editorial-choice__arrow { position: absolute; top: 50%; right: 1rem; width: .7rem; height: .7rem; border-right: 2px solid #756b66; border-bottom: 2px solid #756b66; transform: translateY(-70%) rotate(45deg); pointer-events: none; }
  .odonto-editorial-checks { width: 100%; min-width: 0; margin: 0 0 1.25rem; }
  .odonto-editorial-checks__fieldset { min-width: 0; margin: 0; padding: .55rem .75rem .75rem; border: 1px solid var(--editorial-border, #8b817c); border-radius: 8px; background: #fff; }
  .odonto-editorial-checks__legend { padding: 0 .3rem; color: #3c3430; font-size: .875rem; font-weight: 600; }
  .odonto-editorial-checks__grid { display: grid; gap: .35rem; }
  .odonto-editorial-check { display: flex; min-width: 0; align-items: center; gap: .65rem; padding: .45rem .5rem; border-radius: 6px; color: #403733; cursor: pointer; transition: background-color 150ms ease; }
  .odonto-editorial-check:hover { background: #fff6f1; }
  .odonto-editorial-check__input { position: absolute; width: 1px; height: 1px; opacity: 0; }
  .odonto-editorial-check__box { position: relative; display: grid; width: 20px; min-width: 20px; height: 20px; place-items: center; border: 2px solid #7a706b; border-radius: 4px; background: #fff; transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease; }
  .odonto-editorial-check__input:checked + .odonto-editorial-check__box { border-color: var(--editorial-accent, #c44e1a); background: var(--editorial-accent, #c44e1a); }
  .odonto-editorial-check__input:checked + .odonto-editorial-check__box::after { width: 5px; height: 10px; border-right: 2px solid #fff; border-bottom: 2px solid #fff; content: ''; transform: translateY(-1px) rotate(45deg); }
  .odonto-editorial-check__input:focus-visible + .odonto-editorial-check__box { box-shadow: 0 0 0 3px rgb(196 78 26 / 22%); }
  .odonto-editorial-nested-help { margin: 0 0 1rem; padding: .85rem; border: 1px solid #b8cdf5; border-radius: 8px; background: #eef4ff; color: #38445c; }
  .odonto-editorial-nested-help p { margin: 0 0 .7rem; font-size: .875rem; line-height: 1.5; }
  .odonto-editorial-nested-help__back { display: inline-flex; min-height: 40px; align-items: center; gap: .45rem; padding: .55rem .8rem; border: 1px solid #c44e1a; border-radius: 999px; background: #fff; color: #a54015; font-weight: 600; cursor: pointer; }
  .odonto-editorial-nested-help__back:hover { background: #fff5ef; }
  .odonto-editorial-nested-help__back:focus-visible { outline: 3px solid rgb(196 78 26 / 25%); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .odonto-editorial-field__control, .odonto-editorial-field__control::after, .odonto-editorial-field__label { transition: none; } }
`;

function EditorialFieldStyles() {
  useEffect(() => {
    if (document.getElementById(EDITORIAL_FIELD_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = EDITORIAL_FIELD_STYLE_ID;
    style.textContent = EDITORIAL_FIELD_STYLES;
    document.head.appendChild(style);
  }, []);

  return null;
}

function fieldError(meta: EditorialFieldProps['meta']): string | undefined {
  if (!meta.error) return undefined;
  return typeof meta.error === 'string' ? meta.error : 'Revisá este valor.';
}

function EditorialTextControl({
  field,
  input,
  meta,
  multiline,
}: EditorialFieldProps & { multiline?: boolean }) {
  const generatedId = useId();
  const [focused, setFocused] = useState(false);
  const id = `editorial-${generatedId.replace(/:/g, '')}`;
  const value = typeof input.value === 'string' ? input.value : '';
  const error = fieldError(meta);
  const hasValue = value.length > 0;
  const descriptionId = field.description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const sharedControlProps = {
    id,
    name: input.name,
    value,
    placeholder: focused ? 'Escribí aquí' : '',
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy,
    className: 'odonto-editorial-field__input',
    onFocus: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(true);
      input.onFocus(event as unknown as FocusEvent<string>);
    },
    onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      input.onBlur(event as unknown as FocusEvent<string>);
    },
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      (input.onChange as unknown as (value: string) => void)(event.target.value);
    },
  };

  return (
    <div className="odonto-editorial-field" data-editorial-field={multiline ? 'textarea' : 'text'}>
      <EditorialFieldStyles />
      <div
        className={`odonto-editorial-field__control${focused ? ' odonto-editorial-field__control--focused' : ''}${error ? ' odonto-editorial-field__control--invalid' : ''}${
          multiline ? ' odonto-editorial-field__control--multiline' : ''
        }`}
      >
        {multiline ? (
          <textarea {...sharedControlProps} rows={4} />
        ) : (
          <input {...sharedControlProps} type={input.type || 'text'} />
        )}
        <label
          htmlFor={id}
          className={`odonto-editorial-field__label${focused || hasValue ? ' odonto-editorial-field__label--floating' : ''}`}
        >
          {field.label || field.name}
          {field.required ? <span aria-hidden="true"> *</span> : null}
        </label>
      </div>
      {field.description ? (
        <p id={descriptionId} className="odonto-editorial-field__description">
          {field.description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="odonto-editorial-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const EditorialTextField = EditorialTextControl;

export function EditorialTextareaField(props: EditorialFieldProps) {
  return <EditorialTextField {...props} multiline />;
}

export function EditorialChipField({ field, input, meta }: EditorialChipFieldProps) {
  const generatedId = useId();
  const id = `editorial-chips-${generatedId.replace(/:/g, '')}`;
  const [draft, setDraft] = useState('');
  const values = Array.isArray(input.value) ? input.value : [];
  const error = fieldError(meta);
  const descriptionId = field.description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const changeValues = (nextValues: string[]) => {
    (input.onChange as unknown as (value: string[]) => void)(nextValues);
  };

  const addDraft = () => {
    const next = draft.trim().replace(/,+$/, '').trim();
    if (!next) return;
    if (!values.includes(next)) changeValues([...values, next]);
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== ',') return;
    event.preventDefault();
    addDraft();
  };

  return (
    <div className="odonto-editorial-field odonto-editorial-chips">
      <EditorialFieldStyles />
      <label htmlFor={id} className="odonto-editorial-chips__label">
        {field.label || field.name}
        {field.required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div className="odonto-editorial-chips__entry">
        <input
          id={id}
          name={`${input.name}-draft`}
          value={draft}
          className="odonto-editorial-chips__entry-input"
          placeholder="Escribí una opción"
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={(event) => input.onFocus(event as unknown as FocusEvent<string>)}
          onBlur={(event) => input.onBlur(event as unknown as FocusEvent<string>)}
        />
        <button type="button" className="odonto-editorial-chips__add" onClick={addDraft} aria-label="Agregar opción">
          +
        </button>
      </div>
      {values.length ? (
        <ul className="odonto-editorial-chips__list" aria-label={`${field.label || field.name} cargadas`}>
          {values.map((value, index) => (
            <li className="odonto-editorial-chip" key={`${value}-${index}`} title={value}>
              <span className="odonto-editorial-chip__text">{value}</span>
              <button
                type="button"
                className="odonto-editorial-chip__remove"
                aria-label={`Quitar ${value}`}
                onClick={() => changeValues(values.filter((_, itemIndex) => itemIndex !== index))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {field.description ? (
        <p id={descriptionId} className="odonto-editorial-field__description">
          {field.description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="odonto-editorial-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function optionValue(option: EditorialOption): string {
  return typeof option === 'string' ? option : option.value;
}

function optionLabel(option: EditorialOption): string {
  return typeof option === 'string' ? option : option.label || option.value;
}

export function EditorialSelectField(props: unknown) {
  const { field, input, meta } = props as EditorialChoiceFieldProps;
  const generatedId = useId();
  const id = `editorial-select-${generatedId.replace(/:/g, '')}`;
  const value = typeof input.value === 'string' ? input.value : '';
  const error = fieldError(meta);
  const descriptionId = field.description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const visibleStatusValues = field.name === 'status' ? visibleEditorialStatusValues(value) : undefined;
  const visibleOptions = visibleStatusValues
    ? (field.options ?? []).filter((option) => visibleStatusValues.has(optionValue(option)))
    : field.options ?? [];

  return (
    <div className="odonto-editorial-field odonto-editorial-choice">
      <EditorialFieldStyles />
      <div className="odonto-editorial-choice__control">
        <label className="odonto-editorial-choice__label" htmlFor={id}>
          {field.label || field.name}{field.required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <select
          id={id}
          name={input.name}
          value={value}
          className="odonto-editorial-choice__select"
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? true : undefined}
          onChange={(event) => input.onChange(event.target.value || undefined)}
          onFocus={input.onFocus}
          onBlur={input.onBlur}
        >
          {!field.required ? <option value="">Sin seleccionar</option> : null}
          {visibleOptions.map((option) => (
            <option key={optionValue(option)} value={optionValue(option)}>{optionLabel(option)}</option>
          ))}
        </select>
        <span className="odonto-editorial-choice__arrow" aria-hidden="true" />
      </div>
      {field.description ? <p id={descriptionId} className="odonto-editorial-field__description">{field.description}</p> : null}
      {error ? <p id={errorId} className="odonto-editorial-field__error" role="alert">{error}</p> : null}
    </div>
  );
}

function toLocalDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditorialDateField(props: unknown) {
  const { field, input, meta } = props as EditorialChoiceFieldProps;
  const generatedId = useId();
  const id = `editorial-date-${generatedId.replace(/:/g, '')}`;
  const value = typeof input.value === 'string' && input.value ? toLocalDateTime(input.value) : '';
  const error = fieldError(meta);
  const descriptionId = field.description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="odonto-editorial-field odonto-editorial-choice">
      <EditorialFieldStyles />
      <div className="odonto-editorial-choice__control">
        <label className="odonto-editorial-choice__label" htmlFor={id}>
          {field.label || field.name}{field.required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <input
          id={id}
          name={input.name}
          type="datetime-local"
          value={value}
          className="odonto-editorial-choice__date"
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? true : undefined}
          onChange={(event) => input.onChange(event.target.value ? new Date(event.target.value).toISOString() : undefined)}
          onFocus={input.onFocus}
          onBlur={input.onBlur}
        />
      </div>
      {field.description ? <p id={descriptionId} className="odonto-editorial-field__description">{field.description}</p> : null}
      {error ? <p id={errorId} className="odonto-editorial-field__error" role="alert">{error}</p> : null}
    </div>
  );
}

export function EditorialCheckboxGroupField(props: unknown) {
  const { field, input, meta } = props as EditorialChoiceFieldProps;
  const generatedId = useId();
  const values = Array.isArray(input.value) ? input.value : [];
  const error = fieldError(meta);
  const descriptionId = field.description ? `editorial-checks-${generatedId.replace(/:/g, '')}-description` : undefined;
  const errorId = error ? `editorial-checks-${generatedId.replace(/:/g, '')}-error` : undefined;
  const update = (value: string, checked: boolean) => {
    input.onChange(checked ? [...values, value] : values.filter((item) => item !== value));
  };

  return (
    <div className="odonto-editorial-field odonto-editorial-checks">
      <EditorialFieldStyles />
      <fieldset className="odonto-editorial-checks__fieldset" aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}>
        <legend className="odonto-editorial-checks__legend">
          {field.label || field.name}{field.required ? <span aria-hidden="true"> *</span> : null}
        </legend>
        <div className="odonto-editorial-checks__grid">
          {(field.options ?? []).map((option) => {
            const value = optionValue(option);
            return (
              <label className="odonto-editorial-check" key={value}>
                <input
                  type="checkbox"
                  className="odonto-editorial-check__input"
                  checked={values.includes(value)}
                  onChange={(event) => update(value, event.target.checked)}
                  onFocus={input.onFocus}
                  onBlur={input.onBlur}
                />
                <span className="odonto-editorial-check__box" aria-hidden="true" />
                <span>{optionLabel(option)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {field.description ? <p id={descriptionId} className="odonto-editorial-field__description">{field.description}</p> : null}
      {error ? <p id={errorId} className="odonto-editorial-field__error" role="alert">{error}</p> : null}
    </div>
  );
}

export function NestedEditorHelp({ message, parentLabel }: { message: string; parentLabel: string }) {
  const cms = useCMS();
  const returnToParent = () => {
    if (!cms.state.activeFormId) return;
    cms.dispatch({
      type: 'forms:set-active-field-name',
      value: { formId: cms.state.activeFormId, fieldName: '' },
    });
  };

  return (
    <div className="odonto-editorial-nested-help">
      <EditorialFieldStyles />
      <p>{message}</p>
      <button type="button" className="odonto-editorial-nested-help__back" onClick={returnToParent}>
        <span aria-hidden="true">←</span> Volver a {parentLabel}
      </button>
    </div>
  );
}

export function NestedEditorHelpComponent(message: string, parentLabel: string) {
  return function NestedEditorHelpField() {
    return <NestedEditorHelp message={message} parentLabel={parentLabel} />;
  };
}
