import { describe, expect, it } from 'vitest';
import { dragsSheet, shouldCloseSheet } from './sheetDrag';

describe('shouldCloseSheet', () => {
  it('cierra si se bajó un cuarto del alto', () => {
    expect(shouldCloseSheet(150, 600, 0)).toBe(true);
    expect(shouldCloseSheet(149, 600, 0)).toBe(false);
  });

  it('en hojas bajas exige al menos 80 px', () => {
    expect(shouldCloseSheet(79, 200, 0)).toBe(false);
    expect(shouldCloseSheet(80, 200, 0)).toBe(true);
  });

  it('un tirón rápido cierra aunque el recorrido sea corto', () => {
    expect(shouldCloseSheet(40, 600, 0.8)).toBe(true);
    expect(shouldCloseSheet(20, 600, 0.8)).toBe(false);
  });

  it('hacia arriba o sin moverse no cierra', () => {
    expect(shouldCloseSheet(0, 600, 1)).toBe(false);
    expect(shouldCloseSheet(-200, 600, 1)).toBe(false);
  });
});

describe('dragsSheet', () => {
  it('desde el encabezado, hacia abajo, arrastra aunque el cuerpo esté scrolleado', () => {
    expect(dragsSheet({ dx: 0, dy: 10, inHeader: true, bodyAtTop: false })).toBe(true);
  });

  it('en el cuerpo arrastra sólo si ya está arriba de todo', () => {
    expect(dragsSheet({ dx: 0, dy: 10, inHeader: false, bodyAtTop: true })).toBe(true);
    expect(dragsSheet({ dx: 0, dy: 10, inHeader: false, bodyAtTop: false })).toBe(false);
  });

  it('hacia arriba o de costado deja scrollear', () => {
    expect(dragsSheet({ dx: 0, dy: -10, inHeader: true, bodyAtTop: true })).toBe(false);
    expect(dragsSheet({ dx: 20, dy: 10, inHeader: true, bodyAtTop: true })).toBe(false);
  });
});
