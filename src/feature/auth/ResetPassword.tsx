/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AuthBackground from "@/components/shared/AuthBackground/AuthBackground";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import { useResetPasswordMutation } from "@/redux/api/auth/authApi";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { toast } from "sonner";
import * as z from "zod";

// Define Zod schema for validation
const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long" })
      .min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const userId = searchParams.get("userId") || "";
  const token = searchParams.get("token") || "";

  // Use React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  console.log(userId, token);
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await resetPassword({
        userId,
        password: data.password,
        token,
      }).unwrap();

      if (response?.success) {
        console.log("Password reset successfully");
        toast.success("Password reset successfully");
        router.push("/signIn");
      } else {
        console.error("Failed to reset password");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthBackground>
      <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-6 rounded-2xl">
        <div className="flex flex-col mt-8 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/signIn" className="mb-4">
              <img src="/authImage/arrowIcon.png" alt="icon" className="w-4 h-4" />
            </Link>
            <h3 className="font-bold text-3xl mb-6 text-[#2D2D2D]">Enter OTP Code</h3>
          </div>
          <p className="text-gray-500 text-center text-[18px]">
            Please create a new password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Password Input */}
          <CustomInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            showPasswordToggle={true}
            error={errors.password?.message}
            leftIcon={<img src="/authImage/passwordIcon.png" alt="icon" className="w-5 h-5" />}
            {...register("password")}
          />

          {/* Confirm Password Input */}
          <CustomInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Enter your password"
            showPasswordToggle={true}
            error={
              typeof errors.confirmPassword?.message === "string"
                ? errors.confirmPassword.message
                : "Password confirmation does not match the password."
            }
            leftIcon={<img src="/authImage/passwordIcon.png" alt="icon" className="w-5 h-5" />}
            {...register("confirmPassword")}
          />

          {/* Sign Up Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Reset Password" />
        </form>
        <div className="text-center mb-3 mt-3 text-[16px] text-gray-600">
          Remember your password? Sign in{" "}
          <Link href="/signIn" className="text-[#00695C] text-[16px] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </AuthBackground>
  );
}
