// Guardas de la salida por módulo (0.31.0).
//
// El ESM se emite archivo por archivo (tsup con `bundle: false`), así que:
// (a) todo import relativo del código publicado tiene que llevar `.js`: esbuild no
//     reescribe especificadores y Node/Next no resuelven `./Button` sin extensión.
// (b) cada componente es frontera de cliente por sí mismo: `'use client'` tiene que
//     ser la primera sentencia del archivo (antes lo ponía el banner del bundle único).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = dirname(fileURLToPath(import.meta.url));

function esPublicado(archivo: string): boolean {
  return /\.tsx?$/.test(archivo) && !/\.(test|stories)\.tsx?$/.test(archivo) && !archivo.endsWith('.d.ts');
}

function listar(dir: string): string[] {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    return statSync(ruta).isDirectory() ? listar(ruta) : [ruta];
  });
}

/** Especificadores relativos de `import … from`, `export … from`, `import '…'` e `import('…')`. */
export function importsRelativos(codigo: string): string[] {
  const re = /(?:\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]*)\1/g;
  return [...codigo.matchAll(re)].map((m) => m[2]);
}

/** Quita comentarios y líneas vacías del principio del archivo. */
export function primeraSentencia(codigo: string): string {
  let resto = codigo;
  for (;;) {
    const antes = resto;
    resto = resto.replace(/^\s+/, '').replace(/^\/\/[^\n]*\n?/, '').replace(/^\/\*[\s\S]*?\*\//, '');
    if (resto === antes) break;
  }
  return resto.split('\n', 1)[0] ?? '';
}

const publicados = listar(SRC).filter(esPublicado);
const componentes = publicados.filter((f) => dirname(f) === join(SRC, 'components'));

describe('estructura de módulos del DS', () => {
  it('encuentra el código publicado', () => {
    expect(componentes.length).toBeGreaterThan(50);
    expect(publicados).toContain(join(SRC, 'index.ts'));
  });

  it('todo import relativo del código publicado termina en .js', () => {
    const faltan = publicados.flatMap((f) =>
      importsRelativos(readFileSync(f, 'utf8'))
        .filter((spec) => !spec.endsWith('.js'))
        .map((spec) => `${relative(SRC, f)} → ${spec}`),
    );
    expect(faltan).toEqual([]);
  });

  it("cada componente arranca con 'use client'", () => {
    const sinDirectiva = componentes
      .filter((f) => !/^['"]use client['"];?$/.test(primeraSentencia(readFileSync(f, 'utf8')).trim()))
      .map((f) => relative(SRC, f));
    expect(sinDirectiva).toEqual([]);
  });

  it('los helpers de detección funcionan', () => {
    expect(importsRelativos("import { a } from './a';\nexport * from '../b.js';\nimport './c.css';")).toEqual([
      './a',
      '../b.js',
      './c.css',
    ]);
    expect(importsRelativos("import x from 'react';")).toEqual([]);
    expect(primeraSentencia("// hola\n/* bloque */\n'use client';\nimport x from 'y';")).toBe("'use client';");
  });
});
