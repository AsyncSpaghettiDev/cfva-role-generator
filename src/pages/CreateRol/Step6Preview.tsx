import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Stack,
  Title,
  Text,
  Paper,
  ColorInput,
  SimpleGrid,
  ScrollArea,
  Flex,
} from "@mantine/core";
import { IconDownload, IconPalette, IconCheck } from "@tabler/icons-react";
import { toPng } from "html-to-image";
import { useRolWizard } from "../../hooks/useRolWizard";
import { useRoles } from "../../hooks/useRoles";
import { RoleTablePreview } from "../../ui/RoleTablePreview";
import { Button } from "../../ui/Button";
import { StepIndicator } from "../../ui/StepIndicator";
import {
  presetPalettes,
  generatePaletteFromHeader,
} from "../../config/colorPalettes";

const DEFAULT_SWATCHES = [
  "#ffffff", "#000000", "#f87171", "#fb923c", "#fbbf24", "#a3e635",
  "#4ade80", "#2dd4bf", "#38bdf8", "#818cf8", "#c084fc", "#f472b6",
  "#8B0000", "#1a3a5c", "#2d5016", "#4a1a6b"
];

const CustomColorField = ({ label, value, onChange }: { label: string, value: string, onChange: (c: string) => void }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <Stack gap={4}>
      <ColorInput
        label={label}
        value={value}
        onChange={onChange}
        format="hex"
        size="sm"
        swatches={DEFAULT_SWATCHES}
        withPicker={showAdvanced}
      />
      <Button
        variant="subtle"
        size="xs"
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{ alignSelf: "flex-end", height: 24, fontSize: 10 }}
      >
        {showAdvanced ? "Ocultar avanzado" : "Avanzado / Ruleta"}
      </Button>
    </Stack>
  );
};

export const Step6Preview = () => {
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);
  const {
    monthLabel,
    month,
    year,
    dates,
    assignments,
    colorScheme,
    setColorScheme,
    resetWizard,
  } = useRolWizard();
  const { save } = useRoles();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const handleHeaderColorChange = (color: string) => {
    if (color && color.length === 7) {
      const generated = generatePaletteFromHeader(color);
      setColorScheme(generated);
    }
  };

  const handleDownload = async () => {
    if (!tableRef.current) return;
    try {
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `rol-ujieres-${monthLabel.toLowerCase()}-${year}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al exportar imagen:", err);
    }
  };

  const handleSaveAndDownload = async () => {
    setSaving(true);
    try {
      await handleDownload();
      await save({
        month,
        year,
        monthLabel,
        dates,
        assignments,
        colorScheme,
        createdAt: new Date().toISOString(),
      });
      setSaved(true);
    } catch (err) {
      console.error("Error al guardar:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    resetWizard();
    navigate("/");
  };

  return (
    <Stack gap="md" pb={140}>
      <StepIndicator currentStep={5} totalSteps={6} />

      <div style={{ textAlign: "center" }}>
        <Title order={4} c="gray.1">
          Vista Previa
        </Title>
        <Text c="dimmed" size="sm" mt={4}>
          Revisa el rol antes de guardar
        </Text>
      </div>

      {/* Color palette toggle */}
      <Button
        variant="light"
        leftSection={<IconPalette size={16} />}
        onClick={() => setShowPalette(!showPalette)}
        fullWidth
      >
        {showPalette ? "Ocultar paleta" : "Cambiar colores"}
      </Button>

      {showPalette && (
        <Paper p="md" radius="md" className="wizard-card">
          <Text size="sm" fw={600} mb="sm">
            Paletas predefinidas
          </Text>
          <SimpleGrid cols={4} spacing="xs" mb="md">
            {presetPalettes.map((p) => (
              <Paper
                key={p.name}
                p="xs"
                radius="md"
                onClick={() => setColorScheme(p.scheme)}
                style={{
                  cursor: "pointer",
                  border:
                    colorScheme.header === p.scheme.header
                      ? "2px solid var(--mantine-color-blue-5)"
                      : "1px solid rgba(255,255,255,0.1)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 24,
                    borderRadius: 6,
                    background: `linear-gradient(135deg, ${p.scheme.header}, ${p.scheme.accent1}, ${p.scheme.accent2})`,
                    marginBottom: 4,
                  }}
                />
                <Text size="xs" c="dimmed">
                  {p.name}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>

          <Text size="sm" fw={600} mb="xs">
            Personalizar
          </Text>
          <Stack gap="xs">
            <CustomColorField
              label="Color encabezado"
              value={colorScheme.header}
              onChange={handleHeaderColorChange}
            />
            <CustomColorField
              label="Acento 1 (fechas)"
              value={colorScheme.accent1}
              onChange={(c) =>
                setColorScheme({ ...colorScheme, accent1: c })
              }
            />
            <CustomColorField
              label="Acento 2 (filas)"
              value={colorScheme.accent2}
              onChange={(c) =>
                setColorScheme({ ...colorScheme, accent2: c })
              }
            />
            <CustomColorField
              label="Color de texto"
              value={colorScheme.text}
              onChange={(c) =>
                setColorScheme({ ...colorScheme, text: c })
              }
            />
          </Stack>
        </Paper>
      )}

      <ScrollArea>
        <Flex ref={tableRef} justify={'center'} style={{ minWidth: 850 }}>

          <div ref={tableRef} style={{ width: 850, backgroundColor: "#ffffff" }}>
            <RoleTablePreview
              monthLabel={monthLabel}
              dates={dates}
              assignments={assignments}
              colorScheme={colorScheme}
            />
          </div>
        </Flex>
      </ScrollArea>

      {/* Navigation + Actions in sticky bar */}
      <div className="wizard-nav">
        <div className="wizard-nav-inner">
          {saved ? (
            <>
              <Button
                color="green"
                leftSection={<IconCheck size={16} />}
                disabled
                style={{ flex: 1 }}
              >
                ¡Guardado!
              </Button>
              <Button variant="light" onClick={handleFinish} style={{ flex: 1 }}>
                Volver al inicio
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="subtle"
                onClick={() => navigate("/crear-rol/asignar")}
              >
                Anterior
              </Button>
              <Button
                onClick={handleSaveAndDownload}
                loading={saving}
                leftSection={<IconDownload size={16} />}
                style={{ flex: 1 }}
              >
                Descargar y Guardar
              </Button>
            </>
          )}
        </div>
      </div>
    </Stack>
  );
};
