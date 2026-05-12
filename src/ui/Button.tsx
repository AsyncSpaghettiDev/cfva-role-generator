import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from "@mantine/core";
import type { MouseEventHandler, ReactNode } from "react";

interface ButtonProps extends MantineButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  children,
  variant = "filled",
  ...props
}: ButtonProps) => {
  return (
    <MantineButton variant={variant} radius="md" {...props}>
      {children}
    </MantineButton>
  );
};
