import { useNavigate } from "react-router";
import { Stack, Title, Text, Paper, SimpleGrid } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import { useRolWizard } from "../../hooks/useRolWizard";
import { Button } from "../../ui/Button";
import { StepIndicator } from "../../ui/StepIndicator";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const Step1Month = () => {
  const navigate = useNavigate();
  const { month, year, setMonthYear } = useRolWizard();

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];

  return (
    <Stack gap="md" pb={140}>
      <StepIndicator currentStep={0} totalSteps={6} />

      <div style={{ textAlign: "center" }}>
        <IconCalendar
          size={40}
          color="var(--mantine-color-blue-5)"
          style={{ marginBottom: 8 }}
        />
        <Title order={4} c="gray.1">
          Nuevo Rol de Ujieres
        </Title>
        <Text c="dimmed" size="sm" mt={4}>
          Selecciona el mes para el rol
        </Text>
      </div>

      {/* Year selector */}
      <SimpleGrid cols={2} spacing="xs">
        {years.map((y) => (
          <Paper
            key={y}
            p="sm"
            radius="md"
            className={`wizard-card ${y === year ? "wizard-card-active" : ""}`}
            onClick={() => setMonthYear(month, y)}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <Text fw={600} size="sm">
              {y}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Month grid */}
      <SimpleGrid cols={3} spacing="xs">
        {MONTH_NAMES.map((name, i) => (
          <Paper
            key={i}
            p="sm"
            radius="md"
            className={`wizard-card ${i === month ? "wizard-card-active" : ""}`}
            onClick={() => setMonthYear(i, year)}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <Text size="xs" fw={i === month ? 700 : 400}>
              {name}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Navigation */}
      <div className="wizard-nav">
        <div className="wizard-nav-inner">
          <div /> {/* spacer */}
          <Button onClick={() => navigate("/crear-rol/fechas")} fullWidth>
            Siguiente
          </Button>
        </div>
      </div>
    </Stack>
  );
};
