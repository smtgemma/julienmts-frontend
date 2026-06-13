"use client";

import ChangePasswordForm from "@/components/dashboard/settingSection/ChangePasswordForm";
import { useUpdateProfileMutation } from "@/redux/api/auth/authApi";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function SettingPage() {
  const { data: getMe } = useGetMeQuery("");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState<File | null>(null);

  const profileImageSrc =
    profileImagePreview || getMe?.data?.profileImage || "/dashboardImage/profileImage.svg";

  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    if (getMe) {
      reset({
        firstName: getMe?.data?.firstName || "",
        lastName: getMe?.data?.lastName || "",
        email: getMe?.data?.email || "",
      });
    }
  }, [getMe, reset]);

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);

      if (selectedProfileImageFile) {
        formData.append("profileImage", selectedProfileImageFile);
      }

      const response = await updateProfile(formData).unwrap();
      if (response) {
        toast.success(response?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
    setSelectedProfileImageFile(file);
  };

  return (
    <div>
      <form className="space-y-6 py-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 border border-[#D1D6DB] rounded-lg bg-white shadow-sm hover:shadow-md transition">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 text-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-[#D1D6DB] bg-white shadow-sm">
              <img
                src={profileImageSrc}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2D2D2D]">Profile photo</p>
              <p className="text-sm text-[#636F85]">Upload a new image below</p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#D1D6DB] bg-white px-4 py-2 text-sm font-medium text-[#2D2D2D] shadow-sm transition hover:bg-[#F3F4F6]">
              Upload image
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#2D2D2D]">Profile Information</h2>
            <p className="text-[#636F85] text-[16px] mb-4">Update your personal information</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-[16px] text-[#2D2D2D] font-medium">First Name</label>
                <input
                  {...register("firstName")}
                  className="border border-[#D1D6DB] px-3 py-1.5 rounded w-full mt-1 text-[#636F85]"
                />
              </div>

              <div>
                <label className="text-[16px] text-[#2D2D2D] font-medium">Last Name</label>
                <input
                  {...register("lastName")}
                  className="border border-[#D1D6DB] px-3 py-1.5 rounded w-full mt-1 text-[#636F85]"
                />
              </div>
            </div>

            <div className="my-6">
              <label className="text-[16px] text-[#2D2D2D] font-medium">Email</label>
              <input
                type="email"
                readOnly
                {...register("email")}
                className="border border-[#D1D6DB] px-3 py-1.5 rounded w-full mt-1 text-[#636F85] bg-[#F8F9FB]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#6E51E0] text-white px-4 py-2 rounded font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
      <ChangePasswordForm />
    </div>
  );
}

