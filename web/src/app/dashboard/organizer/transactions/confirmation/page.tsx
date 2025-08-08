"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";
import { Badge } from "@/components/ui/atomic/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/atomic/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/atomic/table";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  ImageIcon,
  RefreshCwIcon,
} from "lucide-react";
import { transactionService } from "@/lib/api/transaction-service";
import { Transaction } from "@/types/transaction.types";
import { format } from "date-fns";
import { toast } from "sonner";

export default function TransactionConfirmationPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    setLoading(true);
    try {
      const data = await transactionService.getTransactionsWaitingConfirmation(
        session.user.accessToken
      );
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
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

    setProcessingId(transactionId);
    try {
      await transactionService.updateTransactionStatus(
        transactionId,
        status,
        session.user.accessToken
      );

      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== transactionId)
      );

      toast.success(
        `Transaction ${
          status === "DONE" ? "approved" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction status");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Transactions", href: "/dashboard/organizer/transactions" },
    { label: "Waiting Confirmation", isActive: true },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardPageLayout
      title="Transaction Confirmations"
      description="Review and approve payment confirmations from customers"
      breadcrumbs={breadcrumbs}
    >
      <div className="px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold">Pending Confirmations</h2>
              <p className="text-sm text-muted-foreground">
                {transactions.length} transaction(s) waiting for your approval
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={loadTransactions}
            disabled={loading}
            className="self-start sm:self-auto cursor-pointer"
          >
            <RefreshCwIcon
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-8 animate-pulse bg-muted rounded"></div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse bg-muted/50 rounded"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground mb-4">
                No transactions waiting for confirmation at the moment.
              </p>
              <Button variant="outline" onClick={loadTransactions}>
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block">
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
                                {transaction.User?.firstName}{" "}
                                {transaction.User?.lastName}
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
                            {format(
                              new Date(transaction.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {transaction.paymentProof ? (
                              <Button
                                variant="outline"
                                className="cursor-pointer"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    transaction.paymentProof,
                                    "_blank"
                                  )
                                }
                              >
                                <ImageIcon className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">
                                No proof
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    disabled={processingId === transaction.id}
                                    className="cursor-pointer"
                                  >
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Approve Transaction
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to approve
                                      transaction{" "}
                                      <span className="font-mono">
                                        {transaction.transactionCode}
                                      </span>
                                      ? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleStatusUpdate(
                                          transaction.id,
                                          "DONE"
                                        )
                                      }
                                    >
                                      Approve
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={processingId === transaction.id}
                                    className="cursor-pointer"
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Reject Transaction
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject
                                      transaction{" "}
                                      <span className="font-mono">
                                        {transaction.transactionCode}
                                      </span>
                                      ? This will refund any points used and
                                      restore event seats.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleStatusUpdate(
                                          transaction.id,
                                          "REJECTED"
                                        )
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-mono">
                          {transaction.transactionCode}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(transaction.createdAt),
                            "MMM dd, yyyy"
                          )}
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
                          {transaction.User?.firstName}{" "}
                          {transaction.User?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.User?.email}
                        </p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">
                          Event
                        </label>
                        <p className="font-medium">
                          {transaction.Event?.eventName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {transaction.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Amount
                        </p>
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="flex-1"
                            disabled={processingId === transaction.id}
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Approve Transaction
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve this transaction?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleStatusUpdate(transaction.id, "DONE")
                              }
                            >
                              Approve
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            disabled={processingId === transaction.id}
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reject Transaction
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this transaction?
                              This will refund any points used.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleStatusUpdate(transaction.id, "REJECTED")
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}
