import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { RouterProvider, createBrowserRouter } from "react-router";
import { AppLayout } from "./ui/AppLayout";
import { Home } from "./pages/Home";
import { Administracion } from "./pages/Administracion";
import { RolesHistory } from "./pages/RolesHistory";
import { WizardLayout } from "./pages/CreateRol/WizardLayout";
import { Step1Month } from "./pages/CreateRol/Step1Month";
import { Step2Dates } from "./pages/CreateRol/Step2Dates";
import { Step3Servidores } from "./pages/CreateRol/Step3Servidores";
import { Step4Rules } from "./pages/CreateRol/Step4Rules";
import { Step5Fill } from "./pages/CreateRol/Step5Fill";
import { Step6Preview } from "./pages/CreateRol/Step6Preview";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  defaultRadius: "md",
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5c5f66",
      "#373A40",
      "#2C2E33",
      "#25262b",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "administracion", element: <Administracion /> },
      { path: "historial", element: <RolesHistory /> },
      {
        path: "crear-rol",
        element: <WizardLayout />,
        children: [
          { path: "mes", element: <Step1Month /> },
          { path: "fechas", element: <Step2Dates /> },
          { path: "servidores", element: <Step3Servidores /> },
          { path: "reglas", element: <Step4Rules /> },
          { path: "asignar", element: <Step5Fill /> },
          { path: "vista-previa", element: <Step6Preview /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
