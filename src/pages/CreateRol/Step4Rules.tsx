import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  ActionIcon,
  Chip,
  ScrollArea,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { useRolWizard } from "../../hooks/useRolWizard";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { Select } from "../../ui/Select";
import { StepIndicator } from "../../ui/StepIndicator";
import type { RuleType, ServidorRule } from "../../types";

export const Step4Rules = () => {
  const navigate = useNavigate();
  const { selectedServidores, dates, rules, setRules } = useRolWizard();

  const [modalOpen, setModalOpen] = useState(false);
  const [ruleServidor, setRuleServidor] = useState<string | null>(null);
  const [ruleType, setRuleType] = useState<RuleType>("except");
  const [ruleDates, setRuleDates] = useState<string[]>([]);

  const formatDate = (dateStr: string) => {
    try {
      const d = parse(dateStr, "yyyy-MM-dd", new Date());
      return format(d, "dd-MMM", { locale: es }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  const handleAddRule = () => {
    if (!ruleServidor || ruleDates.length === 0) return;
    const servidor = selectedServidores.find((s) => s.id === ruleServidor);
    if (!servidor) return;

    const newRule: ServidorRule = {
      servidorId: ruleServidor,
      servidorName: servidor.name,
      type: ruleType,
      dates: ruleDates,
    };

    // Replace if rule already exists for this servidor
    const filtered = rules.filter((r) => r.servidorId !== ruleServidor);
    setRules([...filtered, newRule]);

    setRuleServidor(null);
    setRuleDates([]);
    setModalOpen(false);
  };

  const removeRule = (servidorId: string) => {
    setRules(rules.filter((r) => r.servidorId !== servidorId));
  };

  return (
    <Stack gap="md" pb={140}>
      <StepIndicator currentStep={3} totalSteps={6} />

      <div style={{ textAlign: "center" }}>
        <Title order={4} c="gray.1">
          Reglas de Disponibilidad
        </Title>
        <Text c="dimmed" size="sm" mt={4}>
          Configura excepciones para servidores
        </Text>
      </div>

      {rules.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="md">
          Sin reglas configuradas. Todos los servidores estarán disponibles
          todas las fechas.
        </Text>
      ) : (
        <Stack gap="xs">
          {rules.map((rule) => (
            <Paper
              key={rule.servidorId}
              p="sm"
              radius="md"
              className="wizard-card"
            >
              <Group justify="space-between" mb={4}>
                <Text size="sm" fw={600}>
                  {rule.servidorName}
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={() => removeRule(rule.servidorId)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
              <Text size="xs" c="dimmed">
                {rule.type === "only"
                  ? "Solo disponible: "
                  : "No disponible: "}
                {rule.dates.map(formatDate).join(", ")}
              </Text>
            </Paper>
          ))}
        </Stack>
      )}

      <Button
        variant="light"
        leftSection={<IconPlus size={16} />}
        onClick={() => setModalOpen(true)}
        fullWidth
      >
        Agregar regla
      </Button>

      {/* Add rule modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Regla de disponibilidad"
      >
        <Stack gap="md">
          <Select
            label="Servidor"
            placeholder="Seleccionar servidor"
            data={selectedServidores.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
            value={ruleServidor}
            onChange={setRuleServidor}
            id="rule-servidor-select"
          />

          <Select
            label="Tipo de regla"
            data={[
              { value: "only", label: "Solo estas fechas" },
              { value: "except", label: "Excepto estas fechas" },
            ]}
            value={ruleType}
            onChange={(v) => setRuleType((v || "except") as RuleType)}
            id="rule-type-select"
          />

          <div>
            <Text size="sm" fw={500} mb="xs">
              Fechas:
            </Text>
            <ScrollArea.Autosize mah={200}>
              <Chip.Group multiple value={ruleDates} onChange={setRuleDates}>
                <Group gap="xs">
                  {dates.map((d) => (
                    <Chip key={d.date} value={d.date} size="xs" radius="md">
                      {formatDate(d.date)}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </ScrollArea.Autosize>
          </div>

          <Button onClick={handleAddRule} fullWidth>
            Guardar regla
          </Button>
        </Stack>
      </Modal>

      <div className="wizard-nav">
        <div className="wizard-nav-inner">
          <Button
            variant="subtle"
            onClick={() => navigate("/crear-rol/servidores")}
          >
            Anterior
          </Button>
          <Button onClick={() => navigate("/crear-rol/asignar")}>
            Siguiente
          </Button>
        </div>
      </div>
    </Stack>
  );
};
