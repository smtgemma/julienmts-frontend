

// "use client";

// import React from "react";
// import { Target } from "lucide-react";

// export default function OpportunitiesSection({ opportunitiesData }: { opportunitiesData: any }) {
//     return (
//         <div className="w-full p-6 bg-white mt-7 rounded-xl">
//             {/* Header */}
//             <div className="mb-6">
//                 <h2 className="text-lg font-semibold text-[#101010] flex items-center gap-2">
//                     <Target className="w-5 h-5" />
//                     Opportunities
//                 </h2>
//             </div>

//             {/* Opportunities Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {opportunitiesData && opportunitiesData.length > 0 ? (
//                     opportunitiesData.map((opportunity: any) => (
//                         <div
//                             key={opportunity.id}
//                             className="rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow"
//                         >
//                             {/* Header */}
//                             <div className="flex items-start justify-between mb-4 gap-2">
//                                 <h3 className="text-[16px] font-medium text-[#2D2D2D]">
//                                     {opportunity.name}
//                                 </h3>

//                                 <span className="text-[16px] text-[#34A853]">
//                                     {opportunity.value}
//                                 </span>
//                             </div>

//                             {/* Status & Close Date */}
//                             <div className="flex items-center justify-between mb-4 gap-2">
//                                 <span className="px-2.5 py-1 bg-[#34A8531A] text-[#016630] text-sm font-medium rounded">
//                                     {opportunity.stage}
//                                 </span>

//                                 <span className="text-[16px] text-[#636F85]">
//                                     Close:{" "}
//                                     {new Date(opportunity.close_date).toLocaleDateString()}
//                                 </span>
//                             </div>

//                             {/* Probability */}
//                             <div className="space-y-2">
//                                 <div className="text-sm text-[#636F85] text-right">
//                                     {opportunity.probability}% probability
//                                 </div>

//                                 <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                                     <div
//                                         className="h-full rounded-full bg-[#101010]"
//                                         style={{ width: `${opportunity.probability}%` }}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     // No data UI
//                     <div className="col-span-full text-center py-10">
//                         <p className="text-gray-500 text-lg">
//                             There are no opportunities available
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }





"use client";

import React, { useEffect, useState } from "react";
import { Target, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/modal/Modal";
import { format } from "date-fns";
import { toast } from "sonner";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-julientmts.aiteamtwo.com/api/v1";

const getAuthHeaders = () => {
  const token = Cookies.get("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

interface Opportunity {
  company_id: string;
  name: string;
  value: string;
  close_date: string;
  created_at: string;
  updated_at: string;
  id: string;
}

interface OpportunitiesResponse {
  success: boolean;
  message: string;
  data: {
    company_id: string;
    opportunities: Opportunity[];
    total: number;
  };
}

interface CreateOpportunityResponse {
  success: boolean;
  message: string;
  data: Opportunity;
}

interface DeleteOpportunityResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    timestamp: string;
    message: string;
  };
}

const opportunitySchema = z.object({
  name: z.string().min(3, "Opportunity name is required."),
  value: z
    .string()
    .min(1, "Value is required.")
    .regex(/^[0-9]+$/, "Value must be a valid whole number."),
  close_date: z.string().min(1, "Close date is required."),
});

type OpportunityFormValues = z.infer<typeof opportunitySchema>;

export default function OpportunitiesSection({ accountDetailsId }: { accountDetailsId?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      name: "",
      value: "",
      close_date: "",
    },
  });

  useEffect(() => {
    if (!accountDetailsId) return;
    fetchOpportunities();
  }, [accountDetailsId]);

  const fetchOpportunities = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/opportunities/company/${accountDetailsId}`, {
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const data: OpportunitiesResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load opportunities.");
      }

      setOpportunities(data.data?.opportunities || []);
    } catch (error) {
      console.error("Opportunities fetch error:", error);
      toast.error("Unable to load opportunities.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: OpportunityFormValues) => {
    if (!accountDetailsId) {
      toast.error("No company selected.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/opportunities`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          company_id: accountDetailsId,
          name: values.name,
          value: values.value,
          close_date: values.close_date,
        }),
      });

      const data: CreateOpportunityResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create opportunity.");
      }

      setOpportunities((current) => [data.data, ...current]);
      setIsModalOpen(false);
      reset();
      toast.success(data.message || "Opportunity created successfully.");
    } catch (error) {
      console.error("Create opportunity error:", error);
      toast.error((error as Error).message || "Failed to create opportunity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    setDeletingId(opportunityId);

    try {
      const response = await fetch(`${API_BASE_URL}/opportunities/${opportunityId}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      const data: DeleteOpportunityResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete opportunity.");
      }

      setOpportunities((current) => current.filter((item) => item.id !== opportunityId));
      toast.success(data.message || "Opportunity deleted successfully.");
    } catch (error) {
      console.error("Delete opportunity error:", error);
      toast.error((error as Error).message || "Unable to delete opportunity.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full p-6 bg-white mt-7 rounded-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#101010] flex items-center gap-2">
            <Target className="w-5 h-5" />
            Opportunities
          </h2>
          <p className="text-sm text-[#636F85] mt-1">
            Manage opportunity records for this company.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#6E51E0] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#5a42c9] transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Opportunity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-[#636F85]">
            Loading opportunities...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-[#636F85]">
            No opportunities found. Click "Create Opportunity" to add one.
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="rounded-xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1F2937]">{opportunity.name}</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Close by {format(new Date(opportunity.close_date), "dd MMM yyyy")}</p>
                </div>

                <button
                  onClick={() => handleDeleteOpportunity(opportunity.id)}
                  disabled={deletingId === opportunity.id}
                  className="text-red-500 hover:text-red-700 transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-sm text-[#4B5563]">
                <div className="flex items-center justify-between rounded-lg bg-[#F3F4F6] px-3 py-2">
                  <span>Value</span>
                  <span className="font-semibold text-[#111827]">${Number(opportunity.value).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#F3F4F6] px-3 py-2">
                  <span>Created</span>
                  <span>{format(new Date(opportunity.created_at), "dd MMM yyyy")}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-w-xl mx-auto">
          <div className="mb-4 border-b border-[#E5E7EB] pb-4">
            <h3 className="text-xl font-semibold text-[#111827]">New Opportunity</h3>
            <p className="text-sm text-[#6B7280] mt-1">Add opportunity details and save to the pipeline.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#374151]">Opportunity Name</label>
              <input
                type="text"
                {...register("name", { required: "Opportunity name is required." })}
                className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#6E51E0] focus:ring-2 focus:ring-[#6E51E01A]"
                placeholder="Q3 Enterprise Software Deal"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#374151]">Value</label>
              <input
                type="number"                inputMode="numeric"
                pattern="[0-9]*"                {...register("value")}
                className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#6E51E0] focus:ring-2 focus:ring-[#6E51E01A]"
                placeholder="1000"
              />
              {errors.value && <p className="text-xs text-red-600">{errors.value.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#374151]">Close Date</label>
              <input
                type="date"
                {...register("close_date", { required: "Close date is required." })}
                className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#6E51E0] focus:ring-2 focus:ring-[#6E51E01A]"
              />
              {errors.close_date && <p className="text-xs text-red-600">{errors.close_date.message}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full sm:w-auto rounded-lg bg-[#6E51E0] px-4 py-3 text-sm font-medium text-white hover:bg-[#5a42c9] transition disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Create Opportunity"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
