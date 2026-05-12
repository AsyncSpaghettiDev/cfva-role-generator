import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Stack,
  Text,
  Paper,
  Group,
  Badge,
  Divider,
  Tooltip,
  Alert,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { useRolWizard } from "../../hooks/useRolWizard";
import { useAuxiliares } from "../../hooks/useAuxiliares";
import { useUniformes } from "../../hooks/useUniformes";
import { getAreasForType } from "../../config/serviceAreas";
import { Button } from "../../ui/Button";
import { Select } from "../../ui/Select";
import { StepIndicator } from "../../ui/StepIndicator";
import type { AreaAssignment } from "../../types";

export const Step5Fill = () => {
  const navigate = useNavigate();
  const {
    dates,
    assignments,
    updateAssignment,
    selectedServidores,
    rules,
  } = useRolWizard();

  const { auxiliares } = useAuxiliares();
  const { uniformes } = useUniformes();

  const [currentDateIdx, setCurrentDateIdx] = useState(0);

  const currentDate = dates[currentDateIdx];
  const currentAssignment = assignments[currentDateIdx];
  const areas = useMemo(
    () => (currentDate ? getAreasForType(currentDate.type, currentDate.customAreas) : []),
    [currentDate]
  );
  const isSunday = currentDate?.type === "sunday" || currentDate?.type === "custom";

  // ── Availability helpers ──

  const isServidorAvailable = (servidorId: string, dateStr: string) => {
    const rule = rules.find((r) => r.servidorId === servidorId);
    if (!rule) return true;
    if (rule.type === "only") return rule.dates.includes(dateStr);
    if (rule.type === "except") return !rule.dates.includes(dateStr);
    return true;
  };

  // ── Validation: consecutive weeks ──
  const getConsecutiveWarning = (
    servidorId: string,
    dateIdx: number
  ): string | null => {
    if (!servidorId) return null;
    // Check prev and next date of same type
    const currentType = dates[dateIdx].type;
    for (const offset of [-1, 1]) {
      const neighborIdx = dateIdx + offset;
      if (neighborIdx < 0 || neighborIdx >= dates.length) continue;
      if (dates[neighborIdx].type !== currentType) continue;
      const neighborAssignment = assignments[neighborIdx];
      if (!neighborAssignment) continue;
      const usedInNeighbor = Object.values(neighborAssignment.areas).some(
        (a) => a.servidorId === servidorId
      );
      if (usedInNeighbor) {
        const name =
          selectedServidores.find((s) => s.id === servidorId)?.name || "";
        const dir = offset === -1 ? "anterior" : "siguiente";
        return `${name} ya está asignado la semana ${dir}`;
      }
    }
    return null;
  };

  // ── Validation: more than 2 times in month ──
  const getMonthCountWarning = (servidorId: string): string | null => {
    if (!servidorId) return null;
    let count = 0;
    for (const a of assignments) {
      for (const area of Object.values(a.areas)) {
        if (area.servidorId === servidorId) count++;
      }
    }
    if (count > 2) {
      const name =
        selectedServidores.find((s) => s.id === servidorId)?.name || "";
      return `${name} aparece ${count} veces este mes (se recomienda máximo 2)`;
    }
    return null;
  };

  // Collect all warnings for current date
  const currentWarnings = useMemo(() => {
    if (!currentAssignment) return [];
    const warns: string[] = [];
    for (const area of Object.values(currentAssignment.areas)) {
      const cw = getConsecutiveWarning(area.servidorId, currentDateIdx);
      if (cw) warns.push(cw);
      const mw = getMonthCountWarning(area.servidorId);
      if (mw) warns.push(mw);
    }
    return [...new Set(warns)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAssignment, currentDateIdx, assignments]);

  // ── Handlers ──

  const handleAreaChange = (
    areaId: string,
    field: keyof AreaAssignment,
    value: string
  ) => {
    if (!currentAssignment) return;
    const newAreas = { ...currentAssignment.areas };
    newAreas[areaId] = { ...newAreas[areaId], [field]: value };

    // Auto-fill name
    if (field === "servidorId") {
      const s = selectedServidores.find((x) => x.id === value);
      newAreas[areaId].servidorName = s?.name || "";
    }
    if (field === "auxiliarId") {
      const a = auxiliares.find((x) => x.id === value);
      newAreas[areaId].auxiliarName = a?.name || "";
    }

    updateAssignment(currentDate.date, { areas: newAreas });
  };

  const handleEncargadoChange = (servidorId: string | null) => {
    const s = selectedServidores.find((x) => x.id === servidorId);
    updateAssignment(currentDate.date, {
      encargadoId: servidorId || undefined,
      encargadoName: s?.name || undefined,
    });
  };

  const handleOfrendaChange = (index: number, servidorId: string) => {
    const current = currentAssignment?.ofrenda || ["", ""];
    const newOfrenda = [...current];
    // Store the name, not the ID, since it's what the table displays
    const s = selectedServidores.find((x) => x.id === servidorId);
    newOfrenda[index] = s?.name || "";
    updateAssignment(currentDate.date, { ofrenda: newOfrenda });
  };

  const handleUniformeChange = (val: string | null) => {
    updateAssignment(currentDate.date, {
      uniformeDescription: val || undefined,
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = parse(dateStr, "yyyy-MM-dd", new Date());
      return format(d, "dd-MMM-yy", { locale: es }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  // Build servidor options with availability
  const servidorOptions = selectedServidores.map((s) => {
    const available = isServidorAvailable(s.id, currentDate?.date || "");
    return {
      value: s.id,
      label: s.name,
      disabled: false, // Don't disable, just mark gray
      available,
    };
  });

  const servidorSelectData = servidorOptions.map((o) => ({
    value: o.value,
    label: o.available ? o.label : `⚠️ ${o.label}`,
  }));

  // Encargado options: only servidores assigned to this day
  const assignedServidorIds = currentAssignment
    ? Object.values(currentAssignment.areas)
      .map((a) => a.servidorId)
      .filter(Boolean)
    : [];

  const encargadoOptions = selectedServidores
    .filter((s) => assignedServidorIds.includes(s.id))
    .map((s) => ({ value: s.id, label: s.name }));

  const ofrenda1Options = selectedServidores
    .filter((s) => assignedServidorIds.includes(s.id))
    .filter((s) => currentAssignment?.ofrenda?.[1] !== s.name)
    .map((s) => ({ value: s.id, label: s.name }));

  const ofrenda2Options = selectedServidores
    .filter((s) => assignedServidorIds.includes(s.id))
    .filter((s) => currentAssignment?.ofrenda?.[0] !== s.name)
    .map((s) => ({ value: s.id, label: s.name }));

  const auxiliarSelectData = auxiliares.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const uniformeSelectData = uniformes.map((u) => ({
    value: u.description,
    label: u.description,
  }));

  if (!currentDate || !currentAssignment) return null;

  // Helper: find a servidor's ID from their name (for ofrenda which stores names)
  const findServidorIdByName = (name?: string): string | null => {
    if (!name) return null;
    const s = selectedServidores.find((x) => x.name === name);
    return s?.id || null;
  };

  const getServidorOptionsForArea = (areaId: string) => {
    return servidorSelectData.filter((option) => {
      const isAssignedElsewhere = Object.entries(currentAssignment.areas).some(
        ([aId, aData]) => aId !== areaId && aData.servidorId === option.value
      );
      return !isAssignedElsewhere;
    });
  };

  const getAuxiliarOptionsForArea = (areaId: string) => {
    return auxiliarSelectData.filter((option) => {
      const isAssignedElsewhere = Object.entries(currentAssignment.areas).some(
        ([aId, aData]) => aId !== areaId && aData.auxiliarId === option.value
      );
      return !isAssignedElsewhere;
    });
  };

  // Check if all dates have all required areas filled con servidor
  const isComplete = dates.every((d, dIdx) => {
    const a = assignments[dIdx];
    if (!a) return false;
    const requiredAreas = getAreasForType(d.type, d.customAreas);
    const areasComplete = requiredAreas.every((ra) => !!a.areas[ra.id]?.servidorId);

    if (d.type === "sunday" || d.type === "custom") {
      const hasEncargado = !!a.encargadoId;
      const hasOfrenda = a.ofrenda && a.ofrenda.filter(Boolean).length === 2;
      const hasUniforme = !!a.uniformeDescription;
      return areasComplete && hasEncargado && hasOfrenda && hasUniforme;
    }

    return areasComplete;
  });

  return (
    <Stack gap="md" pb={180}>
      <StepIndicator currentStep={4} totalSteps={6} />

      {/* Date navigation */}
      <Group justify="space-between" align="center">
        <Button
          variant="subtle"
          size="xs"
          disabled={currentDateIdx === 0}
          onClick={() => setCurrentDateIdx((i) => i - 1)}
          leftSection={<IconChevronLeft size={14} />}
        >
          Ant
        </Button>
        <div style={{ textAlign: "center" }}>
          <Text fw={700} size="md">
            {formatDate(currentDate.date)}
          </Text>
          <Badge
            variant="light"
            color={currentDate.type === "sunday" ? "blue" : "green"}
            size="xs"
          >
            {currentDate.type === "sunday"
              ? "Domingo"
              : currentDate.type === "thursday"
                ? "Jueves"
                : "Personalizado"}
          </Badge>
        </div>
        <Button
          variant="subtle"
          size="xs"
          disabled={currentDateIdx === dates.length - 1}
          onClick={() => setCurrentDateIdx((i) => i + 1)}
          rightSection={<IconChevronRight size={14} />}
        >
          Sig
        </Button>
      </Group>

      {/* Warnings */}
      {currentWarnings.length > 0 && (
        <Alert
          icon={<IconAlertTriangle size={16} />}
          color="yellow"
          variant="light"
          radius="md"
        >
          <Stack gap={4}>
            {currentWarnings.map((w, i) => (
              <Text key={i} size="xs">
                {w}
              </Text>
            ))}
          </Stack>
        </Alert>
      )}

      {/* Service areas */}
      <Stack gap="sm">
        {areas.map((area) => (
          <Paper key={area.id} p="sm" radius="md" className="wizard-fill-card">
            <Text size="xs" fw={700} c="blue" mb="xs">
              {area.label}
            </Text>
            <Stack gap="xs">
              {(() => {
                const selectedId = currentAssignment.areas[area.id]?.servidorId;
                const isAvailable = selectedId
                  ? isServidorAvailable(selectedId, currentDate.date)
                  : true;
                return (
                  <Tooltip
                    label="Este servidor podría no estar disponible"
                    disabled={isAvailable}
                    position="top"
                  >
                    <div>
                      <Select
                        placeholder="Servidor"
                        data={getServidorOptionsForArea(area.id)}
                        value={
                          currentAssignment.areas[area.id]?.servidorId || null
                        }
                        onChange={(v) =>
                          handleAreaChange(area.id, "servidorId", v || "")
                        }
                        size="sm"
                        clearable
                        id={`area-${area.id}-servidor`}
                        styles={
                          !isAvailable
                            ? {
                              input: {
                                borderColor: "var(--mantine-color-yellow-5)",
                                background:
                                  "rgba(250, 204, 21, 0.05)",
                              },
                            }
                            : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                );
              })()}

              {isSunday && area.allowAuxiliar && (
                <Select
                  placeholder="Auxiliar (opcional)"
                  data={getAuxiliarOptionsForArea(area.id)}
                  value={
                    currentAssignment.areas[area.id]?.auxiliarId || null
                  }
                  onChange={(v) =>
                    handleAreaChange(area.id, "auxiliarId", v || "")
                  }
                  size="xs"
                  clearable
                  id={`area-${area.id}-auxiliar`}
                />
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Sunday-only fields */}
      {isSunday && (
        <>
          <Divider label="Configuración del domingo" labelPosition="center" />

          <Paper p="sm" radius="md" className="wizard-fill-card">
            <Text size="xs" fw={700} c="blue" mb="xs">
              ENCARGADO/A
            </Text>
            <Select
              placeholder="Seleccionar encargado"
              data={encargadoOptions}
              value={currentAssignment.encargadoId || null}
              onChange={handleEncargadoChange}
              size="sm"
              clearable
              id="encargado-select"
            />
          </Paper>

          <Paper p="sm" radius="md" className="wizard-fill-card">
            <Text size="xs" fw={700} c="blue" mb="xs">
              OFRENDA (2 personas)
            </Text>
            <Stack gap="xs">
              <Select
                placeholder="Persona 1"
                data={ofrenda1Options}
                value={findServidorIdByName(currentAssignment.ofrenda?.[0])}
                onChange={(v) => handleOfrendaChange(0, v || "")}
                size="sm"
                clearable
                id="ofrenda-1-select"
              />
              <Select
                placeholder="Persona 2"
                data={ofrenda2Options}
                value={findServidorIdByName(currentAssignment.ofrenda?.[1])}
                onChange={(v) => handleOfrendaChange(1, v || "")}
                size="sm"
                clearable
                id="ofrenda-2-select"
              />
            </Stack>
          </Paper>

          <Paper p="sm" radius="md" className="wizard-fill-card">
            <Text size="xs" fw={700} c="blue" mb="xs">
              UNIFORME
            </Text>
            <Select
              placeholder="Seleccionar uniforme"
              data={uniformeSelectData}
              value={currentAssignment.uniformeDescription || null}
              onChange={handleUniformeChange}
              size="sm"
              clearable
              id="uniforme-select"
            />
          </Paper>
        </>
      )}

      {/* Date indicator */}
      <Group justify="center" gap={6}>
        {dates.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentDateIdx(i)}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                i === currentDateIdx
                  ? "var(--mantine-color-blue-5)"
                  : "var(--mantine-color-gray-6)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          />
        ))}
      </Group>

      {/* Navigation */}
      <div className="wizard-nav">
        <div className="wizard-nav-inner">
          <Button
            variant="subtle"
            onClick={() => navigate("/crear-rol/reglas")}
          >
            Anterior
          </Button>
          <Tooltip
            label="Completa todas las áreas de servicio en todas las fechas"
            disabled={isComplete}
          >
            <div>
              <Button
                onClick={() => navigate("/crear-rol/vista-previa")}
                disabled={!isComplete}
              >
                Vista Previa
              </Button>
            </div>
          </Tooltip>
        </div>
      </div>
    </Stack>
  );
};
