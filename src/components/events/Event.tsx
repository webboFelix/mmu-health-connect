"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import CustomFormField, { FormFieldType } from "../ui/CustomFormField";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "../ui/form";
import SubmitButton from "../ui/SubmitButton";
import { useDropzone } from "react-dropzone";
import { createEvent } from "@/lib/actions";
import { showToast } from "../react_toastfy/showToast";

const formSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  schedule: z.date(),
  details: z.string().min(5, "Event details are required"),
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      {
        message: "Only image files are allowed",
      }
    ),
});

export function EventForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [open, setOpen] = useState(false); // <-- NEW

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      schedule: new Date(),
      details: "",
      image: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const onDrop = (acceptedFiles: File[]) => {
    const imageFile = acceptedFiles[0];
    if (imageFile && imageFile.type.startsWith("image/")) {
      setSelectedImage(imageFile);
      setValue("image", imageFile, { shouldValidate: true });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
    multiple: false,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("schedule", data.schedule.toISOString());
      formData.append("details", data.details);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await createEvent(formData);
      showToast("success", <strong>Creates Successfully.</strong>);

      form.reset(); // Clear form fields
      setSelectedImage(null); // Clear selected image
      router.refresh(); // Refresh page
      setOpen(false); // Close dialog
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonLabel = "Create Event";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {" "}
      {/* Updated to control dialog */}
      <DialogTrigger asChild>
        <Button variant="outline">Add Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule an Event</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule your event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={control}
              name="name"
              label="Event Name"
              placeholder="Event Name"
            />

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={control}
              name="schedule"
              label="Expected Event Date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={control}
              name="details"
              label="Event Details"
              placeholder="Details about the event..."
            />

            <div className="space-y-2">
              <Label>Event Image (optional)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {selectedImage ? (
                  <div className="flex flex-col items-center">
                    <Image
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <span className="text-sm mt-2">{selectedImage.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Drag & drop an image, or click to browse
                  </p>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm">
                  {errors.image.message as string}
                </p>
              )}
            </div>

            <DialogFooter>
              <SubmitButton isLoading={isLoading} className="shad-primary-btn">
                {buttonLabel}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
