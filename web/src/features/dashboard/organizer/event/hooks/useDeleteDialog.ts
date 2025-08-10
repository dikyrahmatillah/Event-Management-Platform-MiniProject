import { useState } from "react";

export function useDeleteDialog() {
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    eventId: number | null;
    eventName: string;
  }>({
    isOpen: false,
    eventId: null,
    eventName: "",
  });

  const openDialog = (eventId: number, eventName: string) => {
    setDialog({ isOpen: true, eventId, eventName });
  };

  const closeDialog = () => {
    setDialog({ isOpen: false, eventId: null, eventName: "" });
  };

  return { dialog, openDialog, closeDialog, setDialog };
}
