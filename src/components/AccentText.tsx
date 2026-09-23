import { Fragment } from 'react';

export interface AccentSegment {
  text: string;
  accent: boolean;
}

/**
 * Parte un texto con marcas `*así*` en tramos normales y tramos en acento.
 * Un `*` sin cerrar (o `**` vacío) queda como texto literal. Permite varios
 * acentos y en cualquier posición: "Todo lo que *su proyecto* necesita".
 */
export function parseAccent(text: string): AccentSegment[] {
  const segmentos: AccentSegment[] = [];
  const re = /\*([^*]+)\*/g;
  let desde = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > desde) segmentos.push({ text: text.slice(desde, i), accent: false });
    segmentos.push({ text: m[1], accent: true });
    desde = i + m[0].length;
  }
  if (desde < text.length) segmentos.push({ text: text.slice(desde), accent: false });
  return segmentos;
}

/** El texto sin las marcas de acento (para aria-label, alt, títulos de pestaña). */
export function stripAccent(text: string): string {
  return parseAccent(text)
    .map((s) => s.text)
    .join('');
}

export interface AccentTextProps {
  /** Texto con marcas `*acento*`. */
  text: string;
  /** Versión para pantallas chicas (debajo de `md`). Vacío o ausente ⇒ se usa `text`. */
  mobileText?: string;
  /** Clases del `<em>` de cada tramo en acento. Sin esta prop, los `*` no se interpretan. */
  accentClassName?: string;
}

function Tramos({ text, accentClassName }: { text: string; accentClassName?: string }) {
  if (accentClassName === undefined) return <>{text}</>;
  return (
    <>
      {parseAccent(text).map((s, i) =>
        s.accent ? (
          <em key={i} className={accentClassName}>
            {s.text}
          </em>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Texto con acentos en cualquier posición y, opcionalmente, otra versión para
 * mobile. Con `mobileText` se renderizan las dos y se alterna por CSS en `md`
 * (sin JS, sin salto de hidratación).
 */
export function AccentText({ text, mobileText, accentClassName }: AccentTextProps) {
  if (!mobileText || mobileText === text) return <Tramos text={text} accentClassName={accentClassName} />;
  return (
    <>
      <span className="md:hidden">
        <Tramos text={mobileText} accentClassName={accentClassName} />
      </span>
      <span className="hidden md:inline">
        <Tramos text={text} accentClassName={accentClassName} />
      </span>
    </>
  );
}
