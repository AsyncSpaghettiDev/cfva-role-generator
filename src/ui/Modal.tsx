import {
  Modal as MantineModal,
  type ModalProps as MantineModalProps,
} from "@mantine/core";

interface ModalProps extends MantineModalProps {
  id?: string;
}

export const Modal = ({ children, ...props }: ModalProps) => {
  return (
    <MantineModal radius="lg" centered {...props}>
      {children}
    </MantineModal>
  );
};
