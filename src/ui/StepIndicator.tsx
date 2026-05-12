import { Group, Text } from "@mantine/core";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const StepIndicator = ({
  currentStep,
  totalSteps,
}: StepIndicatorProps) => {
  return (
    <Group gap={6} justify="center" mb="md">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === currentStep ? 28 : 10,
            height: 10,
            borderRadius: 5,
            background:
              i === currentStep
                ? "var(--mantine-color-blue-6)"
                : i < currentStep
                  ? "var(--mantine-color-blue-3)"
                  : "var(--mantine-color-gray-3)",
            transition: "all 0.3s ease",
          }}
        />
      ))}
      <Text size="xs" c="dimmed" ml="xs">
        {currentStep + 1}/{totalSteps}
      </Text>
    </Group>
  );
};
