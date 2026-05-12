import {
  Checkbox as MantineCheckbox,
  type CheckboxProps as MantineCheckboxProps,
} from "@mantine/core";

interface CheckboxProps extends MantineCheckboxProps {
  id?: string;
}

export const Checkbox = ({ ...props }: CheckboxProps) => {
  return <MantineCheckbox radius="sm" {...props} />;
};
