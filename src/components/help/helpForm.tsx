

// 'use client';

// import { useContactSupportMutation } from '@/redux/api/auth/authApi';
// import { useForm } from 'react-hook-form';

// type FormData = {
//     subject: string;
//     message: string;
// };

// export default function HelpForm() {

//     const [contactSupport, { isLoading }] = useContactSupportMutation()

//     const { register, handleSubmit, reset } = useForm<FormData>();

//     const onSubmit = async (data: FormData) => {
//         console.log('Form Data:', data);
//         const payload = {
//             subject: data?.subject,
//             message: data?.message,
//         }
//         try {
//             const response = await contactSupport(payload).unwrap();
//             console.log(response, "===================")
//         } catch (error) {

//         }
//         reset();
//     };

//     return (
//         <div className="py-6">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

//                 <div className="mb-6">
//                     <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-1">
//                         Contact Support
//                     </h2>
//                     <p className="text-sm text-[#636F85]">
//                         Can't find what you're looking for? Send us a message.
//                     </p>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//                     {/* Subject */}
//                     <div>
//                         <label className="block text-[16px] font-medium text-[#2D2D2D] mb-2">
//                             Subject
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="Briefly describe your issue"
//                             {...register('subject')}
//                             className="w-full px-3 py-2 text-sm text-[#636F85] border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
//                         />
//                     </div>

//                     {/* Message */}
//                     <div>
//                         <label className="block text-[16px] font-medium text-[#2D2D2D] mb-2">
//                             Message
//                         </label>
//                         <textarea
//                             rows={5}
//                             placeholder="Briefly describe your issue"
//                             {...register('message')}
//                             className="w-full px-3 py-2 text-sm text-[#636F85] border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
//                         />
//                     </div>

//                     {/* Button */}
//                     <button
//                         type="submit"
//                         className="bg-[#6E51E0] text-white px-4 py-2 rounded font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer"
//                     >
//                         {isLoading && (
//                             <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                         )}
//                         {isLoading ? "Sending..." : "Send"}
//                     </button>

//                 </form>
//             </div>
//         </div>
//     );
// }


'use client';

import { useContactSupportMutation } from '@/redux/api/auth/authApi';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormData = {
    subject: string;
    message: string;
};

export default function HelpForm() {

    const [contactSupport, { isLoading }] = useContactSupportMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        const payload = {
            subject: data.subject,
            message: data.message,
        };

        try {
            const response = await contactSupport(payload).unwrap();

            if (response?.success) {
                toast.success(response.message || "Message sent successfully");
                reset();
            } else {
                toast.error(response?.message || "Something went wrong");
            }

        } catch (error: any) {
            toast.error(
                error?.data?.message || error?.message || "Failed to send message"
            );
        }
    };
    return (
        <div className="py-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-1">
                        Contact Support
                    </h2>
                    <p className="text-sm text-[#636F85]">
                        Can't find what you're looking for? Send us a message.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Subject */}
                    <div>
                        <label className="block text-[16px] font-medium text-[#2D2D2D] mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            placeholder="Briefly describe your issue"
                            {...register('subject', {
                                required: 'Subject is required',
                                minLength: {
                                    value: 3,
                                    message: 'Subject must be at least 3 characters'
                                }
                            })}
                            className="w-full px-3 py-2 text-sm text-[#636F85] border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        {errors.subject && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.subject.message}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-[16px] font-medium text-[#2D2D2D] mb-2">
                            Message
                        </label>
                        <textarea
                            rows={5}
                            placeholder="Briefly describe your issue"
                            {...register('message', {
                                required: 'Message is required',
                                minLength: {
                                    value: 10,
                                    message: 'Message must be at least 10 characters'
                                }
                            })}
                            className="w-full px-3 py-2 text-sm text-[#636F85] border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                        />
                        {errors.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="bg-[#6E51E0] text-white px-4 py-2 rounded font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        )}
                        {isLoading ? "Sending..." : "Send"}
                    </button>

                </form>
            </div>
        </div>
    );
}