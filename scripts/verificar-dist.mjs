// postbuild: valida la salida por módulo (0.31.0). Sale con código 1 ante cualquier falla.
//
// 1. Existen index.js, index.cjs, index.d.ts, index.d.cts, tokens.css y tailwind.css.
// 2. dist/index.js (barrel) y dist/lib/*.js NO llevan "use client".
// 3. Cada dist/components/*.js empieza con "use client".
// 4. Todo import relativo de dist/**/*.js termina en .js y apunta a un archivo que existe.
// 5. Un consumidor que importa sólo `Button` desde el barrel (bundler con tree-shaking,
//    como Next/webpack con sideEffects) no arrastra recharts ni react-day-picker.
// 6. dist/index.cjs sigue siendo el bundle único con el banner "use client".
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(raiz, 'dist');
const errores = [];

const DIRECTIVA = /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*["']use client["'];?/;

function listar(dir) {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    return statSync(ruta).isDirectory() ? listar(ruta) : [ruta];
  });
}

// 1
for (const f of ['index.js', 'index.cjs', 'index.d.ts', 'index.d.cts', 'tokens.css', 'tailwind.css']) {
  if (!existsSync(join(dist, f))) errores.push(`falta dist/${f}`);
}

if (errores.length === 0) {
  const js = listar(dist).filter((f) => f.endsWith('.js'));
  const componentes = js.filter((f) => dirname(f) === join(dist, 'components'));
  const sinDirectiva = [join(dist, 'index.js'), ...js.filter((f) => dirname(f) === join(dist, 'lib'))];

  if (componentes.length === 0) errores.push('dist/components está vacío: ¿el ESM salió bundleado?');

  // 2
  for (const f of sinDirectiva) {
    if (DIRECTIVA.test(readFileSync(f, 'utf8'))) errores.push(`${relative(raiz, f)} no debe llevar "use client"`);
  }
  // 3
  for (const f of componentes) {
    if (!DIRECTIVA.test(readFileSync(f, 'utf8'))) errores.push(`${relative(raiz, f)} no empieza con "use client"`);
  }
  // 4
  const re = /(?:\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]*)\1/g;
  for (const f of js) {
    for (const [, , spec] of readFileSync(f, 'utf8').matchAll(re)) {
      if (!spec.endsWith('.js')) errores.push(`${relative(raiz, f)}: import sin .js → ${spec}`);
      else if (!existsSync(resolve(dirname(f), spec))) errores.push(`${relative(raiz, f)}: no existe ${spec}`);
    }
  }
  // 5
  const pesados = /^(recharts|react-day-picker)(\/|$)/;
  const r = await build({
    stdin: { contents: "import { Button } from './dist/index.js'; console.log(Button);", resolveDir: raiz },
    bundle: true,
    write: false,
    metafile: true,
    format: 'esm',
    logLevel: 'silent',
    // Todo lo que no es del DS queda afuera: sólo interesa qué importa el grafo del DS.
    plugins: [
      {
        name: 'externos',
        setup(b) {
          b.onResolve({ filter: /^[^./]/ }, (a) => ({ path: a.path, external: true }));
        },
      },
    ],
  });
  const arrastrados = Object.values(r.metafile.outputs)
    .flatMap((o) => o.imports.map((i) => i.path))
    .filter((p) => pesados.test(p));
  if (arrastrados.length) errores.push(`importar sólo Button arrastra: ${[...new Set(arrastrados)].join(', ')}`);
  // 6
  if (!DIRECTIVA.test(readFileSync(join(dist, 'index.cjs'), 'utf8'))) errores.push('dist/index.cjs perdió el banner "use client"');
}

if (errores.length) {
  console.error(`verificar-dist: ${errores.length} problema(s)\n- ${errores.join('\n- ')}`);
  process.exit(1);
}
console.log('verificar-dist: OK');
