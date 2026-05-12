import { useState } from "react";
import {
  Stack,
  Title,
  SegmentedControl,
  Text,
  Group,
  Paper,
  ActionIcon,
  Loader,
  Center,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { useServidores } from "../hooks/useServidores";
import { useAuxiliares } from "../hooks/useAuxiliares";
import { useUniformes } from "../hooks/useUniformes";
import "./Administracion.css";

type Tab = "servidores" | "auxiliares" | "uniformes";

export const Administracion = () => {
  const [tab, setTab] = useState<Tab>("servidores");
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const servidores = useServidores();
  const auxiliares = useAuxiliares();
  const uniformes = useUniformes();

  const currentData = {
    servidores: {
      items: servidores.servidores.map((s) => ({ id: s.id, label: s.name })),
      loading: servidores.loading,
      error: servidores.error,
      add: servidores.add,
      remove: servidores.remove,
      placeholder: "Nombre del servidor",
    },
    auxiliares: {
      items: auxiliares.auxiliares.map((a) => ({ id: a.id, label: a.name })),
      loading: auxiliares.loading,
      error: auxiliares.error,
      add: auxiliares.add,
      remove: auxiliares.remove,
      placeholder: "Nombre del auxiliar",
    },
    uniformes: {
      items: uniformes.uniformes.map((u) => ({
        id: u.id,
        label: u.description,
      })),
      loading: uniformes.loading,
      error: uniformes.error,
      add: uniformes.add,
      remove: uniformes.remove,
      placeholder: "Descripción del uniforme (ej: BLANCO CON NEGRO)",
    },
  }[tab];

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await currentData.add(newName);
      setNewName("");
    } catch {
      // Error is handled by the hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="md" className="admin-container">
      <Title order={3} className="admin-title">
        Administración
      </Title>

      <SegmentedControl
        value={tab}
        onChange={(v) => {
          setTab(v as Tab);
          setNewName("");
        }}
        data={[
          { label: "Servidores", value: "servidores" },
          { label: "Auxiliares", value: "auxiliares" },
          { label: "Uniformes", value: "uniformes" },
        ]}
        fullWidth
        radius="md"
        size="sm"
        className="admin-tabs"
      />

      {/* Add form */}
      <Paper p="md" radius="md" className="admin-form-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <Group gap="sm" align="flex-end">
            <TextInput
              style={{ flex: 1 }}
              placeholder={currentData.placeholder}
              value={newName}
              onChange={(e) => setNewName(e.currentTarget.value)}
              id="admin-new-name-input"
            />
            <Button
              type="submit"
              loading={saving}
              leftSection={<IconPlus size={16} />}
              size="sm"
            >
              Agregar
            </Button>
          </Group>
        </form>
      </Paper>

      {/* List */}
      {currentData.loading ? (
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      ) : currentData.error ? (
        <Text c="red" size="sm" ta="center">
          {currentData.error}
        </Text>
      ) : currentData.items.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="xl">
          No hay registros aún. ¡Agrega el primero!
        </Text>
      ) : (
        <Stack gap="xs">
          {currentData.items.map((item) => (
            <Paper key={item.id} p="sm" radius="md" className="admin-item">
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  {item.label}
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={() => currentData.remove(item.id)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
          <Text c="dimmed" size="xs" ta="center">
            {currentData.items.length} registro
            {currentData.items.length !== 1 ? "s" : ""}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
