import { Stack, Title, Text, Paper, Group, Loader, Center, Badge, Modal, Button, Flex } from "@mantine/core";
import { IconCalendar, IconDownload } from "@tabler/icons-react";
import { useState, useRef } from "react";
import { useRoles } from "../hooks/useRoles";
import { RoleTablePreview } from "../ui/RoleTablePreview";
import type { Rol } from "../types";
import { toPng } from "html-to-image";
import "./RolesHistory.css";

export const RolesHistory = () => {
  const { roles, loading, error } = useRoles();
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [downloading, setDownloading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!tableRef.current || !selectedRol) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `rol-ujieres-${selectedRol.monthLabel.toLowerCase()}-${selectedRol.year}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al exportar imagen:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Stack gap="md" className="history-container">
      <Title order={3} className="history-title">
        Historial de Roles
      </Title>

      {loading ? (
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      ) : error ? (
        <Text c="red" size="sm" ta="center">
          {error}
        </Text>
      ) : roles.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="xl">
          No hay roles guardados aún.
        </Text>
      ) : (
        <Stack gap="sm">
          {roles.map((rol) => (
            <Paper 
              key={rol.id} 
              p="md" 
              radius="md" 
              className="history-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedRol(rol)}
            >
              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <IconCalendar size={20} color="var(--mantine-color-blue-5)" />
                  <div>
                    <Text fw={600} size="sm">
                      Rol Ujieres {rol.monthLabel}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {rol.year} · {rol.dates.length} fechas
                    </Text>
                  </div>
                </Group>
                <Badge
                  variant="light"
                  size="sm"
                  style={{
                    background: rol.colorScheme.header,
                    color: "#fff",
                  }}
                >
                  {rol.monthLabel}
                </Badge>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      <Modal
        opened={!!selectedRol}
        onClose={() => setSelectedRol(null)}
        title={`Rol Ujieres ${selectedRol?.monthLabel} ${selectedRol?.year}`}
        size="auto"
        centered
      >
        {selectedRol && (
          <Stack gap="md">
            <div style={{ overflowX: "auto" }}>
              <Flex ref={tableRef} justify={'center'} style={{ minWidth: 850 }}>
                <div style={{ width: 850, backgroundColor: "#ffffff" }}>
                  <RoleTablePreview
                    monthLabel={selectedRol.monthLabel}
                    dates={selectedRol.dates}
                    assignments={selectedRol.assignments}
                    colorScheme={selectedRol.colorScheme}
                  />
                </div>
              </Flex>
            </div>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setSelectedRol(null)}>
                Cerrar
              </Button>
              <Button 
                onClick={handleDownload} 
                loading={downloading}
                leftSection={<IconDownload size={16} />}
              >
                Descargar Imagen
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};
