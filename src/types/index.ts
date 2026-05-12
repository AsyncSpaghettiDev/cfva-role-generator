// ── Entity types ──

export interface Servidor {
  id: string;
  name: string;
}

export interface Auxiliar {
  id: string;
  name: string;
}

export interface Uniforme {
  id: string;
  description: string;
}

// ── Date / scheduling types ──

export type DateType = "sunday" | "thursday" | "custom";

export interface RolDate {
  date: string; // YYYY-MM-DD
  type: DateType;
  customAreas?: string[]; // IDs of areas active for custom dates
}

// ── Assignment types ──

export interface AreaAssignment {
  servidorId: string;
  servidorName?: string;
  auxiliarId?: string;
  auxiliarName?: string;
}

export interface DayAssignment {
  date: string;
  type: DateType;
  areas: Record<string, AreaAssignment>; // keyed by area id
  encargadoId?: string;
  encargadoName?: string;
  ofrenda?: string[]; // servidor names
  uniformeDescription?: string; // only sundays
}

// ── Rules ──

export type RuleType = "only" | "except";

export interface ServidorRule {
  servidorId: string;
  servidorName: string;
  type: RuleType;
  dates: string[]; // YYYY-MM-DD
}

// ── Color scheme ──

export interface ColorScheme {
  header: string;
  accent1: string;
  accent2: string;
  text: string;
}

// ── Saved rol ──

export interface Rol {
  id?: string;
  month: number; // 0-11
  year: number;
  monthLabel: string; // e.g. "MAYO"
  dates: RolDate[];
  assignments: DayAssignment[];
  colorScheme: ColorScheme;
  createdAt: string;
}
