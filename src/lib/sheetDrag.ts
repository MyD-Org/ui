/**
 * Arrastrar para cerrar la hoja (`Dialog placement="sheet"`): reglas del
 * gesto, sin DOM. El hook que las aplica vive en `Dialog.tsx`.
 */

/** Recorrido mínimo, en px, antes de decidir si el gesto es vertical u horizontal. */
export const SHEET_DRAG_INTENT_PX = 8;

/**
 * Tras soltar, ¿se cierra la hoja? Sí si se la bajó al menos un cuarto de su
 * alto (mínimo 80 px), o si se la tiró rápido hacia abajo (un "flick") aunque
 * el recorrido sea corto.
 *
 * @param offset px hacia abajo desde donde empezó el gesto.
 * @param height alto de la hoja en px.
 * @param velocity px/ms hacia abajo en el último tramo del gesto.
 */
export function shouldCloseSheet(offset: number, height: number, velocity: number): boolean {
  if (offset <= 0) return false;
  if (offset >= Math.max(80, height * 0.25)) return true;
  return velocity >= 0.5 && offset >= 30;
}

/**
 * ¿El gesto que arranca mueve la hoja o deja scrollear su contenido? Mueve la
 * hoja si empezó en el encabezado, o si el cuerpo ya está arriba de todo y el
 * dedo baja (como las hojas nativas). Hacia arriba o de costado, nunca.
 */
export function dragsSheet({
  dx,
  dy,
  inHeader,
  bodyAtTop,
}: {
  dx: number;
  dy: number;
  inHeader: boolean;
  bodyAtTop: boolean;
}): boolean {
  if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) return false;
  return inHeader || bodyAtTop;
}
