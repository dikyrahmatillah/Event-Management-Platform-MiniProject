import Image from "next/image";
import { Button } from "@/components/ui/atomic/button";
import { CalendarIcon } from "lucide-react";
import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/atomic/form";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";
import { EventFormType } from "@/types/event.type";

export function EventBannerField({
  form,
  imagePreview,
  setImagePreview,
  setImageFile,
  removeImageDialogOpen,
  setRemoveImageDialogOpen,
  handleRemoveImage,
}: {
  form: EventFormType;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  setImageFile: (file: File | null) => void;
  removeImageDialogOpen: boolean;
  setRemoveImageDialogOpen: (open: boolean) => void;
  handleRemoveImage: () => void;
}) {
  return (
    <section>
      <h2 className="text-lg font-medium mb-1">Event Banner</h2>
      <p className="text-sm text-muted-foreground mb-2">
        Upload an image to represent your event
      </p>
      <FormField
        control={form.control}
        name="eventBanner"
        render={({ field: { onChange } }) => (
          <FormItem>
            <FormControl>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative w-full h-[200px] rounded-lg overflow-hidden border">
                    <Image
                      src={imagePreview}
                      alt="Event banner preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={() => setRemoveImageDialogOpen(true)}
                    >
                      Remove
                    </Button>
                    <ConfirmDialog
                      open={removeImageDialogOpen}
                      onOpenChange={setRemoveImageDialogOpen}
                      title="Remove Image"
                      description="Are you sure you want to remove this event image? This action cannot be undone."
                      confirmLabel="Remove"
                      cancelLabel="Cancel"
                      onConfirm={handleRemoveImage}
                      confirmClassName="bg-red-600 hover:bg-red-700 text-white"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center border-gray-300 hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="p-3 rounded-full bg-gray-100 mb-2">
                        <CalendarIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        SVG, PNG, JPG or GIF (Max 4MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}
