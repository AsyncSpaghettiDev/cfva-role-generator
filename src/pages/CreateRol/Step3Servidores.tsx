import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Stack,
  Title,
  Text,
  Paper,
  Switch,
  Loader,
  Center,
  ScrollArea,
} from "@mantine/core";
import { useRolWizard } from "../../hooks/useRolWizard";
import { useServidores } from "../../hooks/useServidores";
import { Checkbox } from "../../ui/Checkbox";
import { Button } from "../../ui/Button";
import { StepIndicator } from "../../ui/StepIndicator";

export const Step3Servidores = () => {
  const navigate = useNavigate();
  const { servidores, loading } = useServidores();
  const {
    useAllServidores,
    setUseAllServidores,
    selectedServidoreIds,
    setSelectedServidoreIds,
    setSelectedServidores,
  } = useRolWizard();

  // Sync full server list to context when using all
  useEffect(() => {
    if (useAllServidores) {
      setSelectedServidoreIds(servidores.map((s) => s.id));
      setSelectedServidores(servidores);
    }
  }, [useAllServidores, servidores, setSelectedServidoreIds, setSelectedServidores]);

  const toggleServidor = (id: string) => {
    const newIds = selectedServidoreIds.includes(id)
      ? selectedServidoreIds.filter((x) => x !== id)
      : [...selectedServidoreIds, id];
    setSelectedServidoreIds(newIds);
    setSelectedServidores(servidores.filter((s) => newIds.includes(s.id)));
  };

  const handleNext = () => {
    if (useAllServidores) {
      setSelectedServidores(servidores);
    }
    navigate("/crear-rol/reglas");
  };

  return (
    <Stack gap="md" pb={140}>
      <StepIndicator currentStep={2} totalSteps={6} />

      <div style={{ textAlign: "center" }}>
        <Title order={4} c="gray.1">
          Servidores
        </Title>
        <Text c="dimmed" size="sm" mt={4}>
          ¿Usar todos o seleccionar?
        </Text>
      </div>

      <Paper p="md" radius="md" className="wizard-card">
        <Switch
          label="Usar todos los servidores registrados"
          checked={useAllServidores}
          onChange={(e) => setUseAllServidores(e.currentTarget.checked)}
          size="md"
        />
      </Paper>

      {loading ? (
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      ) : !useAllServidores ? (
        <Paper p="md" radius="md" className="wizard-card">
          <Text size="sm" fw={500} mb="sm">
            Selecciona los servidores:
          </Text>
          <ScrollArea.Autosize mah={350}>
            <Stack gap="xs">
              {servidores.map((s) => (
                <Checkbox
                  key={s.id}
                  label={s.name}
                  checked={selectedServidoreIds.includes(s.id)}
                  onChange={() => toggleServidor(s.id)}
                />
              ))}
            </Stack>
          </ScrollArea.Autosize>
          <Text c="dimmed" size="xs" mt="sm">
            {selectedServidoreIds.length} de {servidores.length} seleccionados
          </Text>
        </Paper>
      ) : (
        <Text c="dimmed" size="sm" ta="center">
          Se usarán los {servidores.length} servidores registrados
        </Text>
      )}

      <div className="wizard-nav">
        <div className="wizard-nav-inner">
          <Button
            variant="subtle"
            onClick={() => navigate("/crear-rol/fechas")}
          >
            Anterior
          </Button>
          <Button onClick={handleNext}>Siguiente</Button>
        </div>
      </div>
    </Stack>
  );
};
