import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  ActionIcon,
  Badge,
  MultiSelect,
} from "@mantine/core";
import { IconTrash, IconPlus, IconCalendar } from "@tabler/icons-react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { useRolWizard } from "../../hooks/useRolWizard";
import { sundayAreas } from "../../config/serviceAreas";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { TextInput } from "../../ui/TextInput";
import { Select } from "../../ui/Select";
import { StepIndicator } from "../../ui/StepIndicator";
import type { DateType } from "../../types";

const typeLabels: Record<DateType, string> = {
  sunday: "Domingo",
  thursday: "Jueves",
  custom: "Personalizado",
};

const typeColors: Record<DateType, string> = {
  sunday: "blue",
  thursday: "green",
  custom: "orange",
};

export const Step2Dates = () => {
  const navigate = useNavigate();
  const { dates, removeDate, addDate, month, year } = useRolWizard();
  const [modalOpen, setModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newType, setNewType] = useState<DateType>("sunday");
  const [customAreas, setCustomAreas] = useState<string[]>([]);

  const handleAddDate = () => {
    if (!newDate) return;
    addDate({ 
      date: newDate, 
      type: newType,
      customAreas: newType === "custom" ? customAreas : undefined
    });
    setNewDate("");
    setCustomAreas([]);
    setModalOpen(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = parse(dateStr, "yyyy-MM-dd", new Date());
      return format(d, "dd-MMM-yy", { locale: es }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  const minDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const maxDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;

  return (
    <Stack gap="md" pb={140}>
      <StepIndicator currentStep={1} totalSteps={6} />

      <div style={{ textAlign: "center" }}>
        <Title order={4} c="gray.1">
          Fechas del Rol
        </Title>
        <Text c="dimmed" size="sm" mt={4}>
          Revisa o agrega fechas adicionales
        </Text>
      </div>

      <Stack gap="xs">
        {dates.map((d) => (
          <Paper key={d.date} p="sm" radius="md" className="wizard-card">
            <Group justify="space-between">
              <Group gap="sm">
                <IconCalendar size={16} color="var(--mantine-color-blue-5)" />
                <Text size="sm" fw={500}>
                  {formatDateDisplay(d.date)}
                </Text>
                <Badge variant="light" color={typeColors[d.type]} size="xs">
                  {typeLabels[d.type]}
                </Badge>
              </Group>
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={() => removeDate(d.date)}
              >
                <IconTrash size={14} />
              </ActionIcon>
            </Group>
          </Paper>
        ))}
      </Stack>

      <Button
        variant="light"
        leftSection={<IconPlus size={16} />}
        onClick={() => setModalOpen(true)}
        fullWidth
      >
        Agregar fecha
      </Button>

      {/* Add date modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Agregar fecha"
      >
        <Stack gap="md">
          <TextInput
            type="date"
            label="Fecha"
            value={newDate}
            onChange={(e) => setNewDate(e.currentTarget.value)}
            min={minDate}
            max={maxDate}
            id="add-date-input"
          />
          <Select
            label="Tipo de día"
            data={[
              { value: "sunday", label: "Domingo" },
              { value: "thursday", label: "Jueves" },
              { value: "custom", label: "Personalizado" },
            ]}
            value={newType}
            onChange={(v) => setNewType((v || "sunday") as DateType)}
            id="add-date-type-select"
          />
          {newType === "custom" && (
            <MultiSelect
              label="Áreas de servicio"
              placeholder="Selecciona las áreas"
              data={sundayAreas.map((a) => ({ value: a.id, label: a.label }))}
              value={customAreas}
              onChange={setCustomAreas}
              clearable
              searchable
            />
          )}
          <Button onClick={handleAddDate} fullWidth>
            Agregar
          </Button>
        </Stack>
      </Modal>

      {/* Navigation */}
      <div className="wizard-nav">
        <div className="wizard-nav-inner">
          <Button
            variant="subtle"
            onClick={() => navigate("/crear-rol/mes")}
          >
            Anterior
          </Button>
          <Button onClick={() => navigate("/crear-rol/servidores")}>
            Siguiente
          </Button>
        </div>
      </div>
    </Stack>
  );
};
