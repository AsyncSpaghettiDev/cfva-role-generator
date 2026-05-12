import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  addMonths,
} from "date-fns";
import type {
  RolDate,
  Servidor,
  ServidorRule,
  DayAssignment,
  ColorScheme,
  DateType,
} from "../types";
import { getAreasForType } from "../config/serviceAreas";
import { presetPalettes } from "../config/colorPalettes";

// ── Helpers ──

const MONTH_NAMES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
];

/** Get all Thursdays (4) and Sundays (0) in a given month/year */
export const computeDefaultDates = (
  month: number,
  year: number
): RolDate[] => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const allDays = eachDayOfInterval({ start, end });

  return allDays
    .filter((d) => {
      const dow = getDay(d);
      return dow === 0 || dow === 4; // Sunday=0, Thursday=4
    })
    .map((d) => ({
      date: format(d, "yyyy-MM-dd"),
      type: (getDay(d) === 0 ? "sunday" : "thursday") as DateType,
    }));
};

/** Build empty assignments for a set of dates */
const buildEmptyAssignments = (dates: RolDate[]): DayAssignment[] =>
  dates.map((d) => {
    const areas: DayAssignment["areas"] = {};
    for (const area of getAreasForType(d.type, d.customAreas)) {
      areas[area.id] = { servidorId: "", servidorName: "" };
    }
    return {
      date: d.date,
      type: d.type,
      areas,
      encargadoId: undefined,
      encargadoName: undefined,
      ofrenda: undefined,
      uniformeDescription: undefined,
    };
  });

// ── Context shape ──

interface WizardState {
  month: number;
  year: number;
  monthLabel: string;
  dates: RolDate[];
  useAllServidores: boolean;
  selectedServidoreIds: string[];
  selectedServidores: Servidor[];
  rules: ServidorRule[];
  assignments: DayAssignment[];
  colorScheme: ColorScheme;
}

interface WizardActions {
  setMonthYear: (month: number, year: number) => void;
  setDates: (dates: RolDate[]) => void;
  addDate: (date: RolDate) => void;
  removeDate: (dateStr: string) => void;
  setUseAllServidores: (val: boolean) => void;
  setSelectedServidoreIds: (ids: string[]) => void;
  setSelectedServidores: (list: Servidor[]) => void;
  setRules: (rules: ServidorRule[]) => void;
  updateAssignment: (dateStr: string, updated: Partial<DayAssignment>) => void;
  setAssignments: (assignments: DayAssignment[]) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  resetWizard: () => void;
}

type WizardContextValue = WizardState & WizardActions;

const WizardContext = createContext<WizardContextValue | null>(null);

// ── Provider ──

const getInitialMonthYear = () => {
  const next = addMonths(new Date(), 1);
  return { month: next.getMonth(), year: next.getFullYear() };
};

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const init = getInitialMonthYear();

  const [month, setMonth] = useState(init.month);
  const [year, setYear] = useState(init.year);
  const [dates, setDatesState] = useState<RolDate[]>(() =>
    computeDefaultDates(init.month, init.year)
  );
  const [useAllServidores, setUseAllServidores] = useState(true);
  const [selectedServidoreIds, setSelectedServidoreIds] = useState<string[]>(
    []
  );
  const [selectedServidores, setSelectedServidores] = useState<Servidor[]>([]);
  const [rules, setRules] = useState<ServidorRule[]>([]);
  const [assignments, setAssignments] = useState<DayAssignment[]>(() =>
    buildEmptyAssignments(computeDefaultDates(init.month, init.year))
  );
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    presetPalettes[0].scheme
  );

  const monthLabel = MONTH_NAMES[month];

  const setMonthYear = useCallback((m: number, y: number) => {
    setMonth(m);
    setYear(y);
    const newDates = computeDefaultDates(m, y);
    setDatesState(newDates);
    setAssignments(buildEmptyAssignments(newDates));
  }, []);

  const setDates = useCallback((d: RolDate[]) => {
    const sorted = [...d].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setDatesState(sorted);
    setAssignments(buildEmptyAssignments(sorted));
  }, []);

  const addDate = useCallback(
    (d: RolDate) => {
      const existing = dates.find((x) => x.date === d.date);
      if (existing) return;
      setDates([...dates, d]);
    },
    [dates, setDates]
  );

  const removeDate = useCallback(
    (dateStr: string) => {
      setDates(dates.filter((d) => d.date !== dateStr));
    },
    [dates, setDates]
  );

  const updateAssignment = useCallback(
    (dateStr: string, updated: Partial<DayAssignment>) => {
      setAssignments((prev) =>
        prev.map((a) => (a.date === dateStr ? { ...a, ...updated } : a))
      );
    },
    []
  );

  const resetWizard = useCallback(() => {
    const i = getInitialMonthYear();
    setMonth(i.month);
    setYear(i.year);
    const d = computeDefaultDates(i.month, i.year);
    setDatesState(d);
    setAssignments(buildEmptyAssignments(d));
    setUseAllServidores(true);
    setSelectedServidoreIds([]);
    setSelectedServidores([]);
    setRules([]);
    setColorScheme(presetPalettes[0].scheme);
  }, []);

  const value = useMemo<WizardContextValue>(
    () => ({
      month,
      year,
      monthLabel,
      dates,
      useAllServidores,
      selectedServidoreIds,
      selectedServidores,
      rules,
      assignments,
      colorScheme,
      setMonthYear,
      setDates,
      addDate,
      removeDate,
      setUseAllServidores,
      setSelectedServidoreIds,
      setSelectedServidores,
      setRules,
      updateAssignment,
      setAssignments,
      setColorScheme,
      resetWizard,
    }),
    [
      month,
      year,
      monthLabel,
      dates,
      useAllServidores,
      selectedServidoreIds,
      selectedServidores,
      rules,
      assignments,
      colorScheme,
      setMonthYear,
      setDates,
      addDate,
      removeDate,
      setUseAllServidores,
      setSelectedServidoreIds,
      setSelectedServidores,
      setRules,
      updateAssignment,
      setAssignments,
      setColorScheme,
      resetWizard,
    ]
  );

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
};

// ── Hook ──

export const useRolWizard = (): WizardContextValue => {
  const ctx = useContext(WizardContext);
  if (!ctx)
    throw new Error("useRolWizard must be used inside <WizardProvider>");
  return ctx;
};
