import { useNavigate } from "react-router";
import { Stack, Title, Text, SimpleGrid, Paper, ThemeIcon } from "@mantine/core";
import {
  IconUsers,
  IconCalendarPlus,
  IconHistory,
} from "@tabler/icons-react";
import "./Home.css";

const actions = [
  {
    title: "Administración",
    description: "Gestionar servidores, auxiliares y uniformes",
    icon: IconUsers,
    color: "blue",
    to: "/administracion",
  },
  {
    title: "Crear Nuevo Rol",
    description: "Generar el rol del mes",
    icon: IconCalendarPlus,
    color: "green",
    to: "/crear-rol/mes",
  },
  {
    title: "Historial de Roles",
    description: "Ver roles anteriores",
    icon: IconHistory,
    color: "violet",
    to: "/historial",
  },
];

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Stack gap="lg" className="home-container">
      <div className="home-hero">
        <Title order={2} className="home-title">
          Bienvenido
        </Title>
        <Text c="dimmed" size="sm">
          Gestión de Ujieres CFVA
        </Text>
      </div>

      <SimpleGrid cols={1} spacing="md">
        {actions.map((action) => (
          <Paper
            key={action.to}
            className="home-card"
            p="lg"
            radius="lg"
            onClick={() => navigate(action.to)}
          >
            <div className="home-card-content">
              <ThemeIcon
                size={48}
                radius="xl"
                variant="light"
                color={action.color}
              >
                <action.icon size={26} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="md">
                  {action.title}
                </Text>
                <Text c="dimmed" size="xs">
                  {action.description}
                </Text>
              </div>
            </div>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
};
