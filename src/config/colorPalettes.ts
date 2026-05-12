import type { ColorScheme } from "../types";

export interface ColorPalette {
  name: string;
  scheme: ColorScheme;
}

/**
 * Given a header hex color, generate two lighter shades for accent1 and accent2
 * and auto-calculate a good text color.
 */
export const generatePaletteFromHeader = (headerHex: string): ColorScheme => {
  const r = parseInt(headerHex.slice(1, 3), 16);
  const g = parseInt(headerHex.slice(3, 5), 16);
  const b = parseInt(headerHex.slice(5, 7), 16);

  // Accent 1: lighter (mix with white ~60%)
  const a1r = Math.round(r + (255 - r) * 0.6);
  const a1g = Math.round(g + (255 - g) * 0.6);
  const a1b = Math.round(b + (255 - b) * 0.6);

  // Accent 2: even lighter (mix with white ~82%)
  const a2r = Math.round(r + (255 - r) * 0.82);
  const a2g = Math.round(g + (255 - g) * 0.82);
  const a2b = Math.round(b + (255 - b) * 0.82);

  // Text: use dark if header is light, otherwise dark text for table body
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  const text = luminance > 140 ? "#1a1a1a" : "#1a1a1a"; // table text is always dark

  const toHex = (rv: number, gv: number, bv: number) =>
    `#${rv.toString(16).padStart(2, "0")}${gv.toString(16).padStart(2, "0")}${bv.toString(16).padStart(2, "0")}`;

  return {
    header: headerHex,
    accent1: toHex(a1r, a1g, a1b),
    accent2: toHex(a2r, a2g, a2b),
    text,
  };
};

/** Preset palettes inspired by Excel-like color schemes */
export const presetPalettes: ColorPalette[] = [
  {
    name: "Vino",
    scheme: generatePaletteFromHeader("#8B0000"),
  },
  {
    name: "Azul Marino",
    scheme: generatePaletteFromHeader("#1a3a5c"),
  },
  {
    name: "Verde Bosque",
    scheme: generatePaletteFromHeader("#2d5016"),
  },
  {
    name: "Morado",
    scheme: generatePaletteFromHeader("#4a1a6b"),
  },
  {
    name: "Gris Elegante",
    scheme: generatePaletteFromHeader("#3a3a3a"),
  },
  {
    name: "Terracota",
    scheme: generatePaletteFromHeader("#a0522d"),
  },
  {
    name: "Azul Real",
    scheme: generatePaletteFromHeader("#1e3a8a"),
  },
  {
    name: "Rosa Antiguo",
    scheme: generatePaletteFromHeader("#8b3a62"),
  },
];
