import { defineConfig } from 'tsup';

// Dos salidas (desde 0.31.0):
//
// 1. ESM archivo por archivo (`bundle: false`): dist/index.js es un barrel de re-exports y
//    cada componente vive en dist/components/X.js con su propio "use client" (escrito en el
//    fuente). Así un consumidor con tree-shaking u `optimizePackageImports` (Next) sólo
//    arrastra los módulos que importa: recharts y react-day-picker quedan fuera de las
//    páginas que no usan gráficos ni DateRangeField. Los imports relativos del fuente llevan
//    `.js` porque esbuild no reescribe especificadores (lo exige src/estructura-modulos.test.ts).
//
// 2. CJS bundleado como hasta 0.30.0: un solo dist/index.cjs con el banner "use client".
//
// dist/ se limpia en `prebuild` (las dos configs corren en paralelo: ninguna usa `clean`).
// scripts/verificar-dist.mjs (postbuild) valida el resultado.
export default defineConfig([
  {
    entry: [
      'src/index.ts',
      'src/components/*.tsx',
      'src/lib/*.{ts,tsx}',
      '!src/**/*.test.*',
      '!src/**/*.stories.*',
    ],
    format: ['esm'],
    bundle: false,
    // Tipos: un solo index.d.ts bundleado, igual que antes.
    dts: { entry: { index: 'src/index.ts' } },
    publicDir: 'src/styles', // copia tokens.css + tailwind.css → dist/
  },
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs'],
    dts: true,
    external: ['react', 'react-dom', 'recharts', /^react-day-picker/, /^@radix-ui\//],
    // El DS usa APIs client-only de React (createContext vía Radix, hooks). Sin esta
    // directiva, un Server Component que haga require del paquete rompe en RSC
    // ("createContext is not a function"). En ESM la directiva va por componente.
    banner: { js: '"use client";' },
  },
]);
