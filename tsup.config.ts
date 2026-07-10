import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'recharts', /^@radix-ui\//],
  // El DS usa APIs client-only de React (createContext vía Radix, hooks). Sin esta
  // directiva, un Server Component del App Router que importe el barrel rompe en RSC
  // ("createContext is not a function"). La marca convierte al paquete en frontera de cliente.
  banner: { js: '"use client";' },
  publicDir: 'src/styles', // copia tokens.css + tailwind.css → dist/
});
