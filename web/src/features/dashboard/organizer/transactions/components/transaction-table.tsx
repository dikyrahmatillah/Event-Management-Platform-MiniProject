import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/atomic/table";
import { Button } from "@/components/ui/atomic/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import {
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
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

export function TransactionTable({
  transactions,
  dialogState,
  setDialogState,
  onStatusUpdate,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Transaction List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Code</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Proof</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-sm">
                  {transaction.transactionCode}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {transaction.User?.firstName} {transaction.User?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.User?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {transaction.Event?.eventName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {transaction.quantity}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(transaction.finalAmount)}
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {transaction.paymentProof ? (
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() =>
                        window.open(transaction.paymentProof, "_blank")
                      }
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">No proof</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      disabled={
                        dialogState?.id === transaction.id &&
                        dialogState?.action === "approve"
                      }
                      className="cursor-pointer"
                      onClick={() =>
                        setDialogState({
                          id: transaction.id,
                          action: "approve",
                        })
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
                      size="sm"
                      variant="destructive"
                      disabled={
                        dialogState?.id === transaction.id &&
                        dialogState?.action === "reject"
                      }
                      className="cursor-pointer"
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
                      onConfirm={() =>
                        onStatusUpdate(transaction.id, "REJECTED")
                      }
                      confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
