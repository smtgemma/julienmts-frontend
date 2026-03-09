
"use client"

import { useGetAllSubscriptionsQuery } from "@/redux/api/subscriptionApi/subscriptionApi";
import { useRouter } from "next/navigation";
import Loading from "@/components/Others/Loading";
import { useState } from "react";
import PassPayment from "./payment/PassPayment";

interface Plan {
  name: string;
  highlighted: boolean;
  description: string;
  price: number;
  features: string[];
  id: string;
}

const SubscriptionPlan: React.FC = () => {
  const [planId, setPlanId] = useState<string | null>(null)
  const router = useRouter()

  const { data: getAllSubscriptions, isLoading } = useGetAllSubscriptionsQuery("")
  console.log(getAllSubscriptions, "=================")

  const plans = getAllSubscriptions?.data || [];

  const handlePurchase = (id: string) => {
    setPlanId(id);
  };

  const handleClosePayment = () => {
    setPlanId(null);
  };

  if (isLoading) {
    return (
      <p>
        <Loading />
      </p>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="mb-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Subscription Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your plan
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan: Plan, index: number) => (
              <div
                key={index}
                className={`flex h-full flex-col rounded-lg bg-white p-6 shadow-sm ${plan.highlighted ? "ring-2 ring-indigo-600" : ""
                  }`}
              >
                <div className="mb-4 rounded-xl bg-gray-2 p-4">
                  <div
                    className={`mb-4 inline-block rounded-full px-4 py-1 text-sm font-medium bg-gray-100 text-[#6E51E0] hover:bg-[#6E51E0] hover:text-white`}>
                    {plan.name}
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-sm leading-relaxed text-gray-600">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-gray-900 xl:text-3xl">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="ml-2 text-gray-500">/Month</span>
                  </div>
                </div>

                {/* Features - flex-grow keeps bottom button aligned */}
                <div className="mb-6 flex-grow">
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Featured Include :
                  </p>

                  <ul className="space-y-2.5">
                    {plan.features.map((feature: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <svg
                          className="mt-0.5 h-7 w-7 flex-shrink-0 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Button */}
                <div className="flex items-center gap-2 w-full">
                  {/* Edit Plan Link */}
                  <button
                    onClick={() => handlePurchase(plan.id)}
                    className={`flex-1 bg-[rgba(255, 255, 255, 0.20)] flex items-center justify-center gap-3 rounded-full border py-2 text-sm font-medium ${plan.name === "Free" ? " bg-gray-100 cursor-pointer" : "bg-[#6E51E0] text-white cursor-pointer"}`}
                  >
                    {
                      plan?.name === "Free" ? "Current plan" : "Upgrade plan"
                    }
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {planId && (
        <PassPayment planId={planId} onClose={handleClosePayment} />
      )}
    </div>
  );
};

export default SubscriptionPlan;
