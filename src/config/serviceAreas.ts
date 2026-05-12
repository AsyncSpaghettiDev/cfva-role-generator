import type { DateType } from "../types";

export interface ServiceArea {
  id: string;
  label: string;
  /** Whether this area can have an auxiliar assigned */
  allowAuxiliar: boolean;
}

export const sundayAreas: ServiceArea[] = [
  { id: "estacionamiento", label: "ESTACIONAMIENTO", allowAuxiliar: true },
  { id: "entrada", label: "ENTRADA", allowAuxiliar: true },
  { id: "lDerecho", label: "L.DERECHO", allowAuxiliar: true },
  { id: "lIzquierdo", label: "L.IZQUIERDO", allowAuxiliar: true },
];

export const thursdayAreas: ServiceArea[] = [
  { id: "estacionamiento", label: "ESTACIONAMIENTO", allowAuxiliar: false },
  { id: "entrada", label: "ENTRADA", allowAuxiliar: false },
];

export const getAreasForType = (type: DateType, customAreaIds?: string[]): ServiceArea[] => {
  if (type === "custom" && customAreaIds && customAreaIds.length > 0) {
    // Return all areas that match the selected custom IDs
    const allAreas = [...sundayAreas, ...thursdayAreas];
    // filter to keep only unique ones selected
    const uniqueMap = new Map<string, ServiceArea>();
    allAreas.forEach(a => uniqueMap.set(a.id, a));
    return customAreaIds.map(id => uniqueMap.get(id)).filter(Boolean) as ServiceArea[];
  }
  return type === "thursday" ? thursdayAreas : sundayAreas;
};
