"use client";

import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch"

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  notifications: {
    emailNotifications: boolean;
    meetingReminders: boolean;
    aiInsights: boolean;
  };
  preferences: {
    salesMethodology: string;
    difficultyLevel: string;
  };
};

export default function SettingPage() {
  const { register, handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john@company.com",
      notifications: {
        emailNotifications: true,
        meetingReminders: true,
        aiInsights: true,
      },
      preferences: {
        salesMethodology: "SPIN",
        difficultyLevel: "Intermediate",
      },
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Saved!");
  };

  return (
    <form
      className="space-y-6 py-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Profile Information */}
      <div className="p-4 border rounded-lg space-y-4 bg-white">
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <p className="text-gray-500 text-sm">Update your personal information</p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            {...register("firstName")}
            placeholder="First Name"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="border p-2 rounded col-span-2 w-full"
          />
        </div>
        <button type="submit" className="bg-[#6E51E0] text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>

      {/* Notifications */}
      <div className="p-4 border rounded-lg space-y-4 bg-white">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="text-gray-500 text-sm">Configure how you receive notifications</p>
        <div className="space-y-3">
          {[
            { name: "emailNotifications", label: "Email Notifications", description: "Receive updates via email" },
            { name: "meetingReminders", label: "Meeting Reminders", description: "Get reminders before meetings" },
            { name: "aiInsights", label: "AI Insights", description: "Receive AI-generated insights" },
          ].map((item) => (
            <Controller
              key={item.name}
              name={`notifications.${item.name}` as any}
              control={control}
              render={({ field }) => (
                <div className="flex justify-between items-center">
                  <div>
                    <p>{item.label}</p>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={item.name}
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="p-4 border rounded-lg space-y-4 bg-white">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <p className="text-gray-500 text-sm">Customize your experience</p>
        <div className="grid grid-cols-2 gap-4">
          <select
            {...register("preferences.salesMethodology")}
            className="border p-2 rounded w-full"
          >
            <option value="SPIN">SPIN</option>
            <option value="BANT">BANT</option>
            <option value="MEDDIC">MEDDIC</option>
          </select>
          <input
            type="text"
            {...register("preferences.difficultyLevel")}
            placeholder="Difficulty Level"
            className="border p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-[#6E51E0] text-white px-4 py-2 rounded">
          Save Preferences
        </button>
      </div>
    </form>
  );
}
