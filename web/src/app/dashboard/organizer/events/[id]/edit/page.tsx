"use client";

import { useEditEventForm } from "@/features/dashboard/organizer/event/hooks/useEditEventForm";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { Button } from "@/components/ui/atomic/button";
import { ArrowLeftIcon, CheckCircle } from "lucide-react";
import { LoadingSkeleton } from "@/components/ui/atomic/loading-skeleton";
import { EventBannerField } from "@/features/dashboard/organizer/event/components/event-banner-field";
import { EventBasicInfoFields } from "@/features/dashboard/organizer/event/components/event-basic-info-fields";
import { EventScheduleFields } from "@/features/dashboard/organizer/event/components/event-schedule-fields";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";
import { Separator } from "@/components/ui/atomic/separator";
import { Form } from "@/components/ui/atomic/form";

const BREADCRUMBS = [
  { label: "Organizer Dashboard", href: "/dashboard/organizer" },
  { label: "Events", href: "/dashboard/organizer/events" },
  { label: "Edit Event", isActive: true },
];

export default function EditEventPage() {
  const {
    form,
    loading,
    isSubmitting,
    imagePreview,
    setImagePreview,
    setImageFile,
    saveDialogOpen,
    setSaveDialogOpen,
    cancelDialogOpen,
    setCancelDialogOpen,
    removeImageDialogOpen,
    setRemoveImageDialogOpen,
    handleBack,
    handleCancel,
    handleSave,
    handleRemoveImage,
  } = useEditEventForm();

  if (loading) {
    return (
      <DashboardPageLayout
        title="Edit Event"
        description="Update event information"
        breadcrumbs={BREADCRUMBS}
      >
        <LoadingSkeleton />
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      title="Edit Event"
      description="Update event information"
      breadcrumbs={BREADCRUMBS}
    >
      <div className="px-4 lg:px-6 max-w-5xl mx-auto">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2 mb-4 cursor-pointer"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => setSaveDialogOpen(true))}
              className="space-y-8"
            >
              <EventBannerField
                form={form}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                setImageFile={setImageFile}
                removeImageDialogOpen={removeImageDialogOpen}
                setRemoveImageDialogOpen={setRemoveImageDialogOpen}
                handleRemoveImage={handleRemoveImage}
              />
              <Separator />
              <EventBasicInfoFields form={form} />
              <Separator />
              <EventScheduleFields form={form} />
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-[120px] cursor-pointer"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Cancel
                </Button>
                <ConfirmDialog
                  open={cancelDialogOpen}
                  onOpenChange={setCancelDialogOpen}
                  title="Discard Changes"
                  description="Are you sure you want to discard your changes? All unsaved changes will be lost."
                  confirmLabel="Discard"
                  cancelLabel="Keep Editing"
                  onConfirm={handleCancel}
                />
                <Button
                  type="button"
                  disabled={isSubmitting}
                  className="min-w-[120px] cursor-pointer"
                  onClick={() => setSaveDialogOpen(true)}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                  {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
                </Button>
                <ConfirmDialog
                  open={saveDialogOpen}
                  onOpenChange={setSaveDialogOpen}
                  title="Save Changes"
                  description="Are you sure you want to save your changes? Please review your inputs before proceeding."
                  confirmLabel="Save"
                  cancelLabel="Cancel"
                  onConfirm={form.handleSubmit(handleSave)}
                  loading={isSubmitting}
                  confirmClassName="bg-blue-600 hover:bg-blue-700 text-white"
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
