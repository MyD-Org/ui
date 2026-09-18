import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const css = readFileSync(
  resolve(fileURLToPath(import.meta.url), "..", "tokens.css"),
  "utf8",
);

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
