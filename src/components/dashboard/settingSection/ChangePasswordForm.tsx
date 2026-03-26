"use client";
import { useChangePasswordMutation } from "@/redux/api/auth/authApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
    oldPassword: string;
    newPassword: string;
};

export default function ChangePasswordForm() {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [changePassword, { isLoading }] = useChangePasswordMutation()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        // console.log("Change Password:", data);

        const payLoad = {
            oldPassword: data?.oldPassword,
            newPassword: data?.newPassword,
        }

        try {
            const response = await changePassword(payLoad).unwrap();
            if (response) {
                toast.success(response?.message);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    };

    const EyeIcon = ({ show }: { show: boolean }) => (
        show ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        )
    );

    const inputWrapClass = (error?: any) =>
        `flex items-center w-full px-4 py-2.5 bg-transparent border border-[#D1D6DB] ${error ? "border-red-500" : "border-[#3a3a3a]"
        } rounded-lg focus-within:border-[#D1D6DB] transition-colors`;

    return (
        <div className="p-4 border border-[#D1D6DB] rounded-lg bg-white shadow-sm hover:shadow-md transition">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                    {/* Label */}
                    <p className="text-lg font-semibold text-[#2D2D2D] mb-2">Change Password</p>

                    {/* Fields */}
                    <div className="flex gap-3 flex-1">
                        {/* Old Password */}
                        <div className="flex-1">
                            <label className="text-[16px] text-[#2D2D2D] font-medium">Old Password</label>
                            <div className={inputWrapClass(errors.oldPassword)}>
                                <input
                                    type={showOld ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="flex-1 bg-transparent text-sm placeholder-gray-500 outline-none"
                                    {...register("oldPassword", { required: "Old password is required" })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOld(!showOld)}
                                    className="text-gray-400 transition-colors cursor-pointer ml-2"
                                >
                                    <EyeIcon show={showOld} />
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="flex-1">
                            <label className="text-[16px] text-[#2D2D2D] font-medium">New Password</label>
                            <div className={inputWrapClass(errors.newPassword)}>
                                <input
                                    type={showNew ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="flex-1 bg-transparent text-sm placeholder-gray-500 outline-none"
                                    {...register("newPassword", {
                                        required: "New password is required",
                                        minLength: { value: 6, message: "Minimum 6 characters" },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="text-gray-400 transition-colors cursor-pointer ml-2"
                                >
                                    <EyeIcon show={showNew} />
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        type="submit"
                        className="bg-[#6E51E0] text-white px-4 py-2 rounded font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        )}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}