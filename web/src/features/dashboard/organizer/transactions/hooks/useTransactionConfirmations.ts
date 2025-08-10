import { useCallback, useEffect, useState } from "react";
import { transactionService } from "@/lib/api/transaction-service";
import { Transaction } from "@/types/transaction.types";
import { toast } from "sonner";

interface Session {
  user?: {
    accessToken?: string;
  };
}

export function useTransactionConfirmations(session: Session) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogState, setDialogState] = useState<{
    id: number;
    action: "approve" | "reject";
  } | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    try {
      const data = await transactionService.getTransactionsWaitingConfirmation(
        session.user.accessToken
      );
      setTransactions(data);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.accessToken]);

  const handleStatusUpdate = async (
    transactionId: number,
    status: "DONE" | "REJECTED"
  ) => {
    if (!session?.user?.accessToken) return;
    setDialogState(null);
    try {
      await transactionService.updateTransactionStatus(
        transactionId,
        status,
        session.user.accessToken
      );
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      toast.success(
        `Transaction ${
          status === "DONE" ? "approved" : "rejected"
        } successfully`
      );
    } catch {
      toast.error("Failed to update transaction status");
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    dialogState,
    setDialogState,
    handleStatusUpdate,
    reload: loadTransactions,
  };
}
