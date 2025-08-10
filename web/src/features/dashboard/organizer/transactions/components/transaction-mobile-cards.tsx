import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";
import { Badge } from "@/components/ui/atomic/badge";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ImageIcon,
} from "lucide-react";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";
import { Transaction } from "@/types/transaction.types";
import { format } from "date-fns";
import { formatCurrency } from "@/components/format-currency";

type Props = {
  transactions: Transaction[];
  dialogState: { id: number; action: "approve" | "reject" } | null;
  setDialogState: (
    state: { id: number; action: "approve" | "reject" } | null
  ) => void;
  onStatusUpdate: (id: number, status: "DONE" | "REJECTED") => void;
};

export function TransactionMobileCards({
  transactions,
  dialogState,
  setDialogState,
  onStatusUpdate,
}: Props) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base font-mono">
                  {transaction.transactionCode}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600"
              >
                <ClockIcon className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">
                  Customer
                </label>
                <p className="font-medium">
                  {transaction.User?.firstName} {transaction.User?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.User?.email}
                </p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">
                  Event
                </label>
                <p className="font-medium">{transaction.Event?.eventName}</p>
                <p className="text-xs text-muted-foreground">
                  Qty: {transaction.quantity}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg">
                  {formatCurrency(transaction.finalAmount)}
                </p>
              </div>
              {transaction.paymentProof && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(transaction.paymentProof, "_blank")
                  }
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  View Proof
                </Button>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1"
                disabled={
                  dialogState?.id === transaction.id &&
                  dialogState?.action === "approve"
                }
                onClick={() =>
                  setDialogState({ id: transaction.id, action: "approve" })
                }
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <ConfirmDialog
                open={
                  dialogState?.id === transaction.id &&
                  dialogState?.action === "approve"
                }
                onOpenChange={(open) => !open && setDialogState(null)}
                title="Approve Transaction"
                description="Are you sure you want to approve this transaction? This action cannot be undone."
                confirmLabel="Approve"
                cancelLabel="Cancel"
                onConfirm={() => onStatusUpdate(transaction.id, "DONE")}
              />
              <Button
                variant="destructive"
                className="flex-1"
                disabled={
                  dialogState?.id === transaction.id &&
                  dialogState?.action === "reject"
                }
                onClick={() =>
                  setDialogState({ id: transaction.id, action: "reject" })
                }
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <ConfirmDialog
                open={
                  dialogState?.id === transaction.id &&
                  dialogState?.action === "reject"
                }
                onOpenChange={(open) => !open && setDialogState(null)}
                title="Reject Transaction"
                description="Are you sure you want to reject this transaction? This will refund any points used."
                confirmLabel="Reject"
                cancelLabel="Cancel"
                onConfirm={() => onStatusUpdate(transaction.id, "REJECTED")}
                confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
