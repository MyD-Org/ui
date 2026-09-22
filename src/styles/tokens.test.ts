import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const css = readFileSync(
  resolve(fileURLToPath(import.meta.url), "..", "tokens.css"),
  "utf8",
);

const tailwind = readFileSync(
  resolve(fileURLToPath(import.meta.url), "..", "tailwind.css"),
  "utf8",
);

describe("mapeo tailwind", () => {
  it("expone la utilidad scroll-fino, con los colores de la piel", () => {
    expect(tailwind).toContain("@utility scroll-fino");
    expect(tailwind).toContain("scrollbar-color: var(--color-border-strong) transparent;");
  });

  it("mapea los roles nuevos a @theme inline", () => {
    expect(tailwind).toContain("--color-highlight: var(--color-highlight);");
    expect(tailwind).toContain("--color-accent-soft: var(--color-accent-soft);");
    expect(tailwind).toContain("--font-display: var(--font-display);");
  });

  it("define la animación marquee con keyframes", () => {
    expect(tailwind).toContain("--animate-marquee:");
    expect(tailwind).toContain("@keyframes marquee");
  });
});

describe("tema editorial", () => {
  it("existe el selector dual .editorial / [data-theme='editorial']", () => {
    expect(css).toMatch(/\.editorial,\s*\n?\[data-theme='editorial'\]/);
  });

  it("usa la paleta cálida del rediseño", () => {
    const bloque = css.split("[data-theme='editorial']")[1];
    expect(bloque).toContain("--color-bg: #f7f2ea");
    expect(bloque).toContain("--color-surface: #fffcf7");
    expect(bloque).toContain("--color-text: #33291f");
    expect(bloque).toContain("--color-primary: #33291f");
    expect(bloque).toContain("--color-accent: #c07a2b");
    expect(bloque).toContain("--color-accent-strong: #b3603f");
    expect(bloque).toContain("--font-display: 'Fraunces', Georgia, serif");
    expect(bloque).toContain("--font-sans: 'Nunito Sans'");
  });

  it("los roles nuevos existen en el default :root (contrato completo)", () => {
    const root = css.split(".dark")[0];
    expect(root).toContain("--color-highlight:");
    expect(root).toContain("--color-accent-soft:");
    expect(root).toContain("--font-display:");
  });

  it("los roles nuevos existen también en dark", () => {
    const dark = css.split("[data-theme='dark']")[1];
    expect(dark).toContain("--color-highlight:");
    expect(dark).toContain("--color-accent-soft:");
    expect(dark).toContain("--font-display:");
  });
});

/**
 * Guarda de radios: la escala de formas es un token (`--radius-sm`, `--radius`,
 * `--radius-lg`) y cada piel la redefine — el Shop la sube a 14/20/28, el CRM
 * la deja en 8/12/18. Una utilidad como `rounded-md` NO está mapeada en
 * `tailwind.css`, así que Tailwind cae a sus 6px de fábrica y ese componente
 * deja de obedecer a la piel: queda con la única esquina dura de la página.
 *
 * Pasó con DropdownMenu, Tooltip y Menu. Esto lo atrapa antes del review.
 */
describe("radios: sólo la escala de tokens", () => {
  const FUERA_DE_ESCALA = /\brounded-(?:md|xl|2xl|3xl|4xl)\b/;

  it("`rounded-md` y compañía no están mapeados en tailwind.css", () => {
    // Si algún día se agregan, esta guarda deja de tener sentido y hay que
    // actualizarla en vez de borrarla.
    expect(tailwind).not.toContain("--radius-md:");
    expect(tailwind).not.toContain("--radius-xl:");
  });

  it("ningún componente usa un radio fuera de la escala", async () => {
    const { readdirSync } = await import("node:fs");
    const dir = resolve(fileURLToPath(import.meta.url), "..", "..", "components");
    const infractores = readdirSync(dir)
      .filter((f) => f.endsWith(".tsx") && !f.includes(".test.") && !f.includes(".stories."))
      .flatMap((f) => {
        const texto = readFileSync(resolve(dir, f), "utf8");
        return FUERA_DE_ESCALA.test(texto) ? [`${f}: ${texto.match(FUERA_DE_ESCALA)?.[0]}`] : [];
      });
    expect(infractores, infractores.join("\n")).toEqual([]);
  });
});
