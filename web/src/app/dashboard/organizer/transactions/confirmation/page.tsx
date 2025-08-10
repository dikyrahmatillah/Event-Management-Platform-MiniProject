"use client";

import { useSession } from "next-auth/react";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

import {
  Header,
  LoadingSkeleton,
  EmptyState,
} from "@/features/dashboard/organizer/transactions/components/transaction-confirmation-ui";
import { useTransactionConfirmations } from "@/features/dashboard/organizer/transactions/hooks/useTransactionConfirmations";
import { TransactionTable } from "@/features/dashboard/organizer/transactions/components/transaction-table";
import { TransactionMobileCards } from "@/features/dashboard/organizer/transactions/components/transaction-mobile-cards";

const BREADCRUMBS = [
  { label: "Organizer Dashboard", href: "/dashboard/organizer" },
  { label: "Transactions", href: "/dashboard/organizer/transactions" },
  { label: "Waiting Confirmation", isActive: true },
];

export default function TransactionConfirmationPage() {
  const { data: session, status } = useSession();

  const safeSession = session ?? { user: { accessToken: "" } };

  const {
    transactions,
    loading,
    dialogState,
    setDialogState,
    handleStatusUpdate,
    reload,
  } = useTransactionConfirmations(safeSession);

  if (status === "loading") {
    return <LoadingSkeleton />;
  }

  if (!session) {
    return <EmptyState onRefresh={() => window.location.reload()} />;
  }

  return (
    <DashboardPageLayout
      title="Transaction Confirmations"
      description="Review and approve payment confirmations from customers"
      breadcrumbs={BREADCRUMBS}
    >
      <div className="px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto">
        <Header
          count={transactions.length}
          loading={loading}
          onRefresh={reload}
        />

        {loading ? (
          <LoadingSkeleton />
        ) : transactions.length === 0 ? (
          <EmptyState onRefresh={reload} />
        ) : (
          <div className="space-y-4">
            <div className="hidden md:block">
              <TransactionTable
                transactions={transactions}
                dialogState={dialogState}
                setDialogState={setDialogState}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
            <div className="md:hidden">
              <TransactionMobileCards
                transactions={transactions}
                dialogState={dialogState}
                setDialogState={setDialogState}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}
