import {
  Select as MantineSelect,
  type SelectProps as MantineSelectProps,
} from "@mantine/core";

interface SelectProps extends MantineSelectProps {
  id?: string;
}

export const Select = ({ ...props }: SelectProps) => {
  return <MantineSelect radius="md" searchable {...props} />;
};
