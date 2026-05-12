import { Outlet, NavLink, useLocation } from "react-router";
import { AppShell, Group, Text, ActionIcon, Stack } from "@mantine/core";
import {
  IconHome,
  IconUsers,
  IconCalendarPlus,
  IconHistory,
} from "@tabler/icons-react";
import "./AppLayout.css";

const navItems = [
  { to: "/", icon: IconHome, label: "Inicio" },
  { to: "/administracion", icon: IconUsers, label: "Admin" },
  { to: "/crear-rol/mes", icon: IconCalendarPlus, label: "Nuevo" },
  { to: "/historial", icon: IconHistory, label: "Historial" },
];

export const AppLayout = () => {
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 56 }}
      footer={{ height: 64 }}
      padding="md"
    >
      <AppShell.Header className="app-header">
        <Group h="100%" px="md" justify="center">
          <Text fw={700} size="lg" className="app-title">
            CFVA Servidores
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Main className="app-main">
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer className="app-footer">
        <Group h="100%" justify="space-around" align="center" px="xs">
          {navItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <NavLink key={item.to} to={item.to} className="nav-link">
                <Stack gap={2} align="center">
                  <ActionIcon
                    variant={isActive ? "light" : "transparent"}
                    color={isActive ? "blue" : "gray"}
                    size="lg"
                    radius="xl"
                  >
                    <item.icon size={22} />
                  </ActionIcon>
                  <Text
                    size="xs"
                    c={isActive ? "blue" : "dimmed"}
                    fw={isActive ? 600 : 400}
                  >
                    {item.label}
                  </Text>
                </Stack>
              </NavLink>
            );
          })}
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};
