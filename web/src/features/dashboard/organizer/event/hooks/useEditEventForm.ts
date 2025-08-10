import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { EventFormSchema, eventFormSchema } from "@/types/event.type";
import EventService from "@/lib/api/event-service";

export function useEditEventForm() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const eventId = params.id as string;
  const eventService = new EventService();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [removeImageDialogOpen, setRemoveImageDialogOpen] = useState(false);

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventBanner: undefined,
      eventName: "",
      eventDescription: "",
      category: "",
      location: "",
      price: 0,
      totalSeats: 0,
      startDate: undefined,
      endDate: undefined,
      ticketTypes: [],
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (!eventId) return;
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(Number(eventId));
        if (eventData.imageUrl) setImagePreview(eventData.imageUrl);
        form.reset({
          eventBanner: undefined,
          eventName: eventData.eventName || "",
          eventDescription: eventData.description || "",
          category: eventData.category || "",
          location: eventData.location || "",
          price:
            typeof eventData.price === "string"
              ? parseInt(eventData.price) || 0
              : eventData.price || 0,
          totalSeats: eventData.totalSeats || 0,
          startDate: eventData.startDate
            ? new Date(eventData.startDate)
            : undefined,
          endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
          ticketTypes: eventData.ticketTypes || [],
          status: eventData.status || "ACTIVE",
        });
      } catch {
        toast.error("Failed to load event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const handleSave = async (data: EventFormSchema) => {
    try {
      setIsSubmitting(true);
      const updateData = {
        eventName: data.eventName,
        description: data.eventDescription,
        category: data.category,
        location: data.location,
        price: data.price,
        totalSeats: data.totalSeats,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      };
      await eventService.updateEvent(
        Number(eventId),
        updateData,
        imageFile || undefined,
        session?.user?.accessToken
      );
      toast.success("Event updated successfully");
      router.push("/dashboard/organizer/events");
    } catch {
      toast.error("Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => router.back();
  const handleCancel = () => router.push("/dashboard/organizer/events");
  const handleRemoveImage = () => {
    form.setValue("eventBanner", undefined);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImageDialogOpen(false);
  };

  return {
    form,
    loading,
    isSubmitting,
    imagePreview,
    setImagePreview,
    imageFile,
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
  };
}
