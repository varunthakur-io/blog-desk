import { useState, useCallback } from 'react';

/**
 * A custom hook to manage confirmation dialog state and logic.
 */
export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'default',
  });

  const confirm = useCallback(({ title, description, onConfirm, variant = 'default' }) => {
    setDialogConfig({
      title,
      description,
      onConfirm: async () => {
        await onConfirm();
        setIsOpen(false);
      },
      variant,
    });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    setIsOpen,
    confirm,
    close,
    dialogConfig,
  };
};
