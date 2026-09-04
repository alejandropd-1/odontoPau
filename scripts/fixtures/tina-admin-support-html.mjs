// Pure HTML transform used by the isolated browser gate. No Tina data is required.
const MARKER = '<!-- odonto-editorial-support -->';

const supportMarkup = `${MARKER}
    <aside class="editorial-support" aria-label="Ayuda del editor" lang="es">
      <details>
        <summary>¿Necesitás ayuda?</summary>
        <div class="editorial-support__panel">
          <strong>El editor puede estar temporalmente no disponible.</strong>
          <p>Esto no retira el contenido ya publicado. Intentá nuevamente en unos minutos.</p>
          <a href="mailto:admin@useodontopro.com">Enviar un correo a Alejandro</a>
          <a href="https://wa.me/541160513261" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
        </div>
      </details>
    </aside>
    <style>
      .editorial-support {
        position: fixed; right: 16px; bottom: 16px; z-index: 1000001;
        max-width: min(360px, calc(100vw - 32px)); color: #201c1a;
        font-family: ui-sans-serif, system-ui, sans-serif; font-size: 16px; line-height: 1.45;
      }
      .editorial-support summary {
        box-sizing: border-box; min-height: 44px; padding: 11px 18px;
        border: 2px solid #a94c22; border-radius: 999px; background: #fffaf6;
        box-shadow: 0 8px 24px rgba(53, 31, 22, .18); color: #7a3215;
        cursor: pointer; font-weight: 700; list-style-position: inside;
      }
      .editorial-support summary:focus-visible, .editorial-support a:focus-visible {
        outline: 3px solid #1769aa; outline-offset: 3px;
      }
      .editorial-support__panel {
        margin-top: 8px; padding: 18px; border: 1px solid #d5b9aa; border-radius: 16px;
        background: #fff; box-shadow: 0 12px 36px rgba(38, 24, 18, .22);
      }
      .editorial-support p { margin: 8px 0 14px; }
      .editorial-support a {
        display: flex; align-items: center; min-height: 44px; color: #8c3d1c;
        font-weight: 700; text-decoration: underline; text-underline-offset: 3px;
      }
      @media (max-width: 480px) {
        .editorial-support { left: 12px; right: 12px; bottom: 12px; max-width: none; }
      }
    </style>`;

export function injectEditorialSupportHtml(html) {
  if (typeof html !== 'string' || !html.includes('</body>')) throw new Error('EDITORIAL_ADMIN_HTML');
  if (html.includes(MARKER)) return html;
  return html.replace('</body>', `${supportMarkup}\n  </body>`);
}
