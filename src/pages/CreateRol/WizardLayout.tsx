import { Outlet } from "react-router";
import { Stack } from "@mantine/core";
import { WizardProvider } from "../../hooks/useRolWizard";
import "./WizardLayout.css";

export const WizardLayout = () => {
  return (
    <WizardProvider>
      <Stack gap="sm">
        <Outlet />
      </Stack>
    </WizardProvider>
  );
};
