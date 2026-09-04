import type { EditorialUnavailableReason } from './editorial-dashboard-model';

/**
 * Contacto del responsable del sitio. Es configuración no secreta del admin,
 * independiente del contacto del consultorio y de la disponibilidad de TinaCloud.
 */
export const editorialSupportContact = {
  name: 'Alejandro',
  email: 'admin@useodontopro.com',
  whatsapp: '541160513261',
} as const;

export type EditorialDiagnosticOperation =
  | 'catalogo'
  | 'historial'
  | 'publicacion';

const operationLabels: Record<EditorialDiagnosticOperation, string> = {
  catalogo: 'lectura del catálogo editorial',
  historial: 'lectura del historial de publicaciones',
  publicacion: 'pedido de publicación',
};

const reasonLabels: Record<EditorialUnavailableReason, string> = {
  session: 'la sesión dejó de ser válida',
  permission: 'la cuenta no tiene acceso a esa operación',
  timeout: 'la espera se agotó sin respuesta',
  service: 'el servicio de edición no respondió',
};

const diagnosticTimeZone = 'America/Argentina/Buenos_Aires';

const diagnosticFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: diagnosticTimeZone,
});

export interface EditorialDiagnosticInput {
  siteName: string;
  incidentId: string;
  operation: EditorialDiagnosticOperation;
  reason: EditorialUnavailableReason;
  at: Date;
}

/**
 * Resumen para soporte con una lista cerrada de campos. No incorpora errores
 * crudos, tokens, cookies, consultas, variables, documentos ni URLs con parámetros.
 */
export function buildEditorialDiagnostic(input: EditorialDiagnosticInput): string {
  return [
    `Sitio: ${input.siteName}`,
    `Fecha: ${diagnosticFormatter.format(input.at)} (${diagnosticTimeZone})`,
    `Operación: ${operationLabels[input.operation]}`,
    `Situación: ${reasonLabels[input.reason]}`,
    `Código: ${input.incidentId}`,
  ].join('\n');
}

export function editorialSupportMailtoHref(diagnostic?: string): string {
  const subject = 'Panel editorial: necesito ayuda';
  const body = diagnostic
    ? `Hola Alejandro,\n\nNo puedo usar el panel editorial.\n\n${diagnostic}\n`
    : 'Hola Alejandro,\n\nNo puedo usar el panel editorial.\n';
  return `mailto:${editorialSupportContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function editorialSupportWhatsappHref(diagnostic?: string): string {
  const text = diagnostic
    ? `Hola Alejandro, no puedo usar el panel editorial.\n\n${diagnostic}`
    : 'Hola Alejandro, no puedo usar el panel editorial.';
  return `https://wa.me/${editorialSupportContact.whatsapp}?text=${encodeURIComponent(text)}`;
}
