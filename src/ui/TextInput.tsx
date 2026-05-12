import {
  TextInput as MantineTextInput,
  type TextInputProps as MantineTextInputProps,
} from "@mantine/core";

interface TextInputProps extends MantineTextInputProps {
  id?: string;
}

export const TextInput = ({ ...props }: TextInputProps) => {
  return <MantineTextInput radius="md" {...props} />;
};
