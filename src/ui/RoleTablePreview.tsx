import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import type { ColorScheme, DayAssignment, RolDate } from "../types";
import { getAreasForType } from "../config/serviceAreas";
import "./RoleTablePreview.css";

interface RoleTablePreviewProps {
  monthLabel: string;
  dates: RolDate[];
  assignments: DayAssignment[];
  colorScheme: ColorScheme;
}

export const RoleTablePreview = ({
  monthLabel,
  dates,
  assignments,
  colorScheme,
}: RoleTablePreviewProps) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = parse(dateStr, "yyyy-MM-dd", new Date());
      return format(d, "dd-MMM-yy", { locale: es }).toLowerCase();
    } catch {
      return dateStr;
    }
  };
  return (
    <div className="role-table-wrapper">
      <h2
        className="role-table-title"
        style={{ color: colorScheme.header }}
      >
        ROL UJIERES {monthLabel}
      </h2>
      <table
        className="role-table"
        style={{ borderColor: colorScheme.header }}
      >
        <thead>
          <tr>
            <th
              style={{
                background: colorScheme.header,
                color: "#fff",
                borderColor: colorScheme.header,
              }}
            >
              FECHA
            </th>
            <th
              style={{
                background: colorScheme.header,
                color: "#fff",
                borderColor: colorScheme.header,
              }}
            >
              ÁREA DE SERVICIO
            </th>
            <th
              style={{
                background: colorScheme.header,
                color: "#fff",
                borderColor: colorScheme.header,
              }}
            >
              NOMBRE
            </th>
            <th
              style={{
                background: colorScheme.header,
                color: "#fff",
                borderColor: colorScheme.header,
              }}
            >
              OFRENDA
            </th>
            <th
              style={{
                background: colorScheme.header,
                color: "#fff",
                borderColor: colorScheme.header,
              }}
            >
              UNIFORME
            </th>
          </tr>
        </thead>
        <tbody>
          {dates.map((dateInfo, dateIdx) => {
            const assignment = assignments[dateIdx];
            if (!assignment) return null;
            
            const areas = getAreasForType(dateInfo.type, dateInfo.customAreas);
            const isSunday = dateInfo.type === "sunday" || dateInfo.type === "custom";
            const rowBg = dateIdx % 2 === 0 ? colorScheme.accent1 : colorScheme.accent2;

            const ofrendaList = isSunday ? (assignment.ofrenda || []).filter(Boolean) : [];
            const uniforme = isSunday ? assignment.uniformeDescription || "" : "";

            return (
              <tr key={dateInfo.date}>
                <td
                  className="role-table-date"
                  style={{
                    background: rowBg,
                    color: colorScheme.text,
                    borderColor: colorScheme.header,
                  }}
                >
                  {formatDate(dateInfo.date)}
                </td>
                <td
                  className="role-table-area"
                  style={{
                    background: rowBg,
                    color: colorScheme.text,
                    borderColor: colorScheme.header,
                    fontWeight: 700,
                  }}
                >
                  {areas.map((area, i) => (
                    <div key={area.id} style={{ marginBottom: i < areas.length - 1 ? 4 : 0 }}>
                      {area.label}
                    </div>
                  ))}
                </td>
                <td
                  style={{
                    background: rowBg,
                    color: colorScheme.text,
                    borderColor: colorScheme.header,
                  }}
                >
                  {areas.map((area, i) => {
                    let nombreContent = assignment.areas[area.id]?.servidorName || "\u00A0";
                    let encargadoLabel = "";

                    if (
                      assignment.encargadoId &&
                      assignment.areas[area.id]?.servidorId === assignment.encargadoId
                    ) {
                      nombreContent = `*${nombreContent}`;
                      encargadoLabel = "A CARGO";
                    }

                    const auxName = assignment.areas[area.id]?.auxiliarName;
                    let auxDisplay = "";
                    if (auxName) {
                      auxDisplay = `AUX ${auxName}`;
                    }

                    return (
                      <div 
                        key={area.id} 
                        style={{ 
                          marginBottom: i < areas.length - 1 ? 4 : 0,
                          display: "flex", 
                          justifyContent: "space-between" 
                        }}
                      >
                        <div>
                          <span>{nombreContent}</span>
                          {encargadoLabel && (
                            <span className="role-table-encargado"> {encargadoLabel}</span>
                          )}
                        </div>
                        {auxDisplay && (
                          <div className="role-table-aux" style={{ textAlign: "right", marginLeft: 8 }}>
                            {auxDisplay}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </td>
                <td
                  className="role-table-ofrenda"
                  style={{
                    background: rowBg,
                    color: colorScheme.text,
                    borderColor: colorScheme.header,
                  }}
                >
                  {ofrendaList.map((name, i) => (
                    <div key={i}>{name}</div>
                  ))}
                </td>
                <td
                  className="role-table-uniforme"
                  style={{
                    background: rowBg,
                    color: colorScheme.text,
                    borderColor: colorScheme.header,
                    fontWeight: 700,
                  }}
                >
                  {uniforme}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
