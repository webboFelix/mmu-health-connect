"use client";

import { updateProfile } from "@/lib/actions";
import { User } from "@prisma/client";
import Image from "next/image";
import { useActionState, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import UpdateButton from "./UpdateButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";
import { showToast } from "../react_toastfy/showToast";

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<any>(false);
  const [phone, setPhone] = useState<string | undefined>(
    user.phone?.replace(/\s+/g, "") || ""
  );
  const [isStudent, setIsStudent] = useState<boolean>(!!user.course);

  const [state, formAction] = useActionState(updateProfile, {
    success: false,
    error: false,
  });

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    state.success && router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="text-blue-500 text-xs cursor-pointer">Update</span>
      </DialogTrigger>

      <DialogContent className="w-full h-full max-w-4xl sm:max-h-[90vh] overflow-y-auto">
        <form
          action={(formData) =>
            formAction({
              formData,
              cover: cover?.secure_url || "",
              phone,
            })
          }
          className="flex flex-col gap-4 p-4 sm:p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl">Update Profile</DialogTitle>
            <p className="text-xs text-gray-500">
              Use the navbar profile to change the avatar or username.
            </p>
          </DialogHeader>

          {/* COVER UPLOAD */}
          <CldUploadWidget
            uploadPreset="mmu-users-images"
            onSuccess={(result) => setCover(result.info)}
          >
            {({ open }) => (
              <div onClick={() => open()} className="cursor-pointer">
                <Label>Cover Picture</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Image
                    src={user.cover || "/noCover.png"}
                    alt=""
                    width={48}
                    height={32}
                    className="w-12 h-8 rounded-md object-cover"
                  />
                  <span className="text-xs underline text-gray-600">
                    Change
                  </span>
                </div>
              </div>
            )}
          </CldUploadWidget>

          {/* PHONE */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput
              id="phone"
              name="phone"
              value={phone?.replace(/\s+/g, "")}
              onChange={setPhone}
              placeholder="Enter phone number"
              className="mt-2 ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
            />
          </div>

          {/* GENERAL PROFILE FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "name",
                label: "First Name",
                placeholder: user.name || "John",
              },
              {
                name: "surname",
                label: "Surname",
                placeholder: user.surname || "Doe",
              },
              {
                name: "description",
                label: "Description",
                placeholder: user.description || "Life is beautiful...",
              },
              {
                name: "city",
                label: "City",
                placeholder: user.city || "Nairobi",
              },
              {
                name: "school",
                label: "School",
                placeholder: user.school || "MMU",
              },
              {
                name: "website",
                label: "Website",
                placeholder: user.website || "https://example.com",
              },
            ].map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  defaultValue={user[field.name as keyof User] as string}
                  className="mt-1"
                />
              </div>
            ))}
          </div>

          {/* OCCUPATION FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="occupation">Are you a student?</Label>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className={`${
                    isStudent ? "bg-blue-500 text-white" : "bg-gray-200"
                  } p-2 rounded-md`}
                  onClick={() => setIsStudent(true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`${
                    !isStudent ? "bg-blue-500 text-white" : "bg-gray-200"
                  } p-2 rounded-md`}
                  onClick={() => setIsStudent(false)}
                >
                  No
                </button>
              </div>
            </div>

            {/* CONDITIONAL FIELDS */}
            {isStudent ? (
              <>
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    name="course"
                    placeholder={user.course || "Computer Science"}
                    defaultValue={user.course || ""}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="regNo">Registration Number</Label>
                  <Input
                    id="regNo"
                    name="regNo"
                    placeholder={user.regNo || "SCT-253-000/yyyy"}
                    defaultValue={user.regNo || ""}
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="work">Work</Label>
                <Input
                  id="work"
                  name="work"
                  placeholder={user.work || "Apple Inc."}
                  defaultValue={user.work || ""}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* FEEDBACK */}
          {state.success &&
            showToast("success", <p>Your Profile is updated Successfully</p>)}
          {state.error &&
            showToast(
              "warning",
              <p>There was a problem updating your profile</p>
            )}

          <DialogFooter>
            <UpdateButton />
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUser;
