import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function UploadProofPage() {
  return (
    <DashboardPageLayout
      title="Upload Payment Proof"
      description="Upload your payment proof to complete the registration process."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/dashboard/customer" },
        { label: "Upload Payment Proof", isActive: true },
      ]}
    >
      <ComingSoon text="Payment proof upload feature coming soon..." />
    </DashboardPageLayout>
  );
}
