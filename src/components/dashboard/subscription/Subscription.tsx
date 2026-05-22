


// "use client"

// import { useActiveSubscriptionQuery, useGetAllSubscriptionsQuery } from "@/redux/api/subscriptionApi/subscriptionApi";
// import { usePathname } from "next/navigation";
// import Loading from "@/components/Others/Loading";
// import { useState } from "react";
// import PassPayment from "./payment/PassPayment";
// // import { useSelector } from "react-redux";
// // import { RootState } from "@/redux/store";
// import LoginRequiredModal from "./payment/LoginRequiredModal";
// import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";

// interface Plan {
//   name: string;
//   highlighted: boolean;
//   description: string;
//   price: number;
//   features: string[];
//   id: string;
//   meetingMode: string;
//   interval: string;
// }

// const SubscriptionPlan: React.FC = () => {
//   const [planType, setPlanType] = useState<"monthly" | "yearly">("monthly");
//   const togglePlan = () => {
//     setPlanType((prev) => (prev === "monthly" ? "yearly" : "monthly"));
//   };


//   const [planId, setPlanId] = useState<string | null>(null)
//   const [showLoginModal, setShowLoginModal] = useState(false)
//   const pathName = usePathname()

//   // const user = useSelector((state: RootState) => state.user.token);
//   // const isLoggedIn = Boolean(user);
//   const { data: getMe } = useGetMeQuery("")
//   const isLoggedIn = getMe;
//   console.log(getMe)

//   const { data: getAllSubscriptions, isLoading } = useGetAllSubscriptionsQuery({
//     interval: planType,
//   })
//   // console.log(getAllSubscriptions, "=================")
//   const { data: activeSubcripiton } = useActiveSubscriptionQuery("");
//   // console.log(activeSubcripiton?.data?.plan?.id, "=================active subscription")

//   const plans = getAllSubscriptions?.data || [];

//   const handlePurchase = (id: string) => {
//     if (!isLoggedIn) {
//       setShowLoginModal(true)

//       return;
//     }
//     setPlanId(id);
//   };

//   const handleClosePayment = () => {
//     setPlanId(null);
//   };

//   if (isLoading) {
//     return (
//       <div>
//         <Loading title="Loading subscription plan" />
//       </div>
//     );
//   }

//   if (!getAllSubscriptions || getAllSubscriptions.length === 0) {
//     return <p className="text-5xl text-center font-semibold my-12 text-red-400">Don't have data</p>;
//   }

//   return (
//     // <div className="min-h-screen">
//     <div>
//       <div className="">
//         <div className="mb-8">
//           {/* Header */}
//           {
//             pathName === "/dashboard/subscriptions" && (
//               <div className="mb-8 flex items-start justify-between">
//                 <div className="mt-6">
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     Subscription Management
//                   </h1>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Manage your plan
//                   </p>
//                 </div>
//               </div>
//             )
//           }

//           <div className='my-6 flex items-center justify-center gap-4'>
//             <p className='text-[16px] text-[#2D2D2D]'>Monthly</p>

//             <button
//               onClick={togglePlan}
//               className='w-14 h-8 rounded-full relative flex items-center p-1 bg-primaryBgColor transition-all cursor-pointer'
//             >
//               <span
//                 className={`w-6 h-6 bg-white rounded-full transition-all duration-300
//                             ${planType === "yearly" ? "translate-x-6" : ""}`}
//               ></span>
//             </button>

//             <p className='text-[16px] text-[#2D2D2D]'>Yearly</p>
//             <p className='text-[#6E51E0] text-sm border rounded-full px-3 py-1'>
//               30% Off
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {plans.map((plan: Plan, index: number) => (
//               <div
//                 key={index}
//                 className={`group flex h-full flex-col rounded-lg bg-white p-6 shadow-sm ${plan.highlighted ? "ring-2 ring-indigo-600" : ""}`}
//               >
//                 <div className="mb-4 rounded-xl bg-gray-2 p-4 bg-gray-100">
//                   <div className="flex justify-between items-center">
//                     <div
//                       className={`mb-4 inline-block rounded-full px-4 py-1 text-sm font-medium transition-colors 
//                      ${plan.id === String(activeSubcripiton?.data?.plan?.id)
//                           ? "bg-primaryBgColor text-white"
//                           : plan.highlighted
//                             ? "bg-primaryBgColor text-white"
//                             : "bg-white text-primaryBgColor hover:bg-primaryBgColor hover:text-white group-hover:bg-primaryBgColor group-hover:text-white"
//                         }`}
//                     >
//                       {plan.name}
//                     </div>
//                     <p className="text-sm text-indigo-600">
//                       {plan?.meetingMode === "1-on-1"
//                         ? "1 to 1"
//                         : plan?.meetingMode === "1-on-2"
//                           ? "1 to 2"
//                           : plan?.meetingMode === "1-on-3"
//                             ? "1 to 3"
//                             : "N/A"} 
//                     </p>
//                   </div>

//                   {/* Description */}
//                   <p className="mb-6 text-sm leading-relaxed text-gray-600">
//                     {plan.description}
//                   </p>

//                   {/* Price */}
//                   <div className="mb-6">
//                     <span className="text-2xl font-bold text-gray-900 xl:text-3xl">
//                       ${plan.price.toFixed(2)}
//                     </span>
//                     <span className="ml-2 text-gray-500">/{plan.interval || "N/A"}</span>
//                   </div>
//                 </div>

//                 {/* Features - flex-grow keeps bottom button aligned */}
//                 <div className="mb-6 flex-grow">
//                   <p className="mb-3 text-sm font-semibold text-gray-900">
//                     Featured Include :
//                   </p>

//                   <ul className="space-y-2.5">
//                     {plan.features.map((feature: string, idx: number) => (
//                       <li
//                         key={idx}
//                         className="flex items-start gap-2 text-sm text-gray-600"
//                       >
//                         <svg
//                           className="mt-0.5 h-7 w-7 flex-shrink-0 text-green-500"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Bottom Button */}
//                 <div className="flex items-center gap-2 w-full">
//                   {/* Edit Plan Link */}
//                   <button
//                     onClick={() => handlePurchase(plan.id)}
//                     disabled={plan.id === String(activeSubcripiton?.data?.plan?.id)}
//                     className={`w-full py-2 border text-sm font-medium rounded-full flex items-center justify-center transition-colors
//                     ${plan.id === String(activeSubcripiton?.data?.plan?.id)
//                         ? "bg-primaryBgColor text-white cursor-not-allowed"
//                         : "bg-[#FBFBFB] border-gray-200 text-[#2D2D2D] hover:bg-primaryBgColor hover:text-white group-hover:bg-primaryBgColor group-hover:text-white cursor-pointer"
//                       }`}
//                     style={{
//                       boxShadow:
//                         "inset 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 -1px 2px rgba(255, 255, 255, 0.5)",
//                     }}
//                   >
//                     {plan?.id === activeSubcripiton?.data?.plan?.id
//                       ? "Current plan"
//                       : "Upgrade plan"}

//                     <svg
//                       className="h-4 w-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       {planId && (
//         <PassPayment planId={planId} onClose={handleClosePayment} />
//       )}
//       {
//         showLoginModal && (
//           <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
//         )
//       }
//     </div>
//   );
// };

// export default SubscriptionPlan;







"use client"

import { useActiveSubscriptionQuery, useGetAllSubscriptionsQuery } from "@/redux/api/subscriptionApi/subscriptionApi";
import { usePathname } from "next/navigation";
import Loading from "@/components/Others/Loading";
import { useState } from "react";
import PassPayment from "./payment/PassPayment";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
import LoginRequiredModal from "./payment/LoginRequiredModal";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";

interface Plan {
  name: string;
  highlighted: boolean;
  description: string;
  price: number;
  features: string[];
  id: string;
  meetingMode: string;
  interval: string;
}

const SubscriptionPlan: React.FC = () => {
  const [planType, setPlanType] = useState<"monthly" | "yearly">("monthly");
  const togglePlan = () => {
    setPlanType((prev) => (prev === "monthly" ? "yearly" : "monthly"));
  };


  const [planId, setPlanId] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const pathName = usePathname()

  // const user = useSelector((state: RootState) => state.user.token);
  // const isLoggedIn = Boolean(user);
  const { data: getMe } = useGetMeQuery("")
  const isLoggedIn = getMe;
  console.log(getMe)

  const { data: getAllSubscriptions, isLoading } = useGetAllSubscriptionsQuery({
    interval: planType,
  })
  console.log(getAllSubscriptions, "=================dsdsfdsfdsf")
  const { data: activeSubcripiton } = useActiveSubscriptionQuery("");
  // console.log(activeSubcripiton?.data?.plan?.id, "=================active subscription")

  const plans = getAllSubscriptions?.data || [];

  const handlePurchase = (id: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)

      return;
    }
    setPlanId(id);
  };

  const handleClosePayment = () => {
    setPlanId(null);
  };

  if (isLoading) {
    return (
      <div>
        <Loading title="Loading subscription plan" />
      </div>
    );
  }

  if (!getAllSubscriptions || getAllSubscriptions.length === 0) {
    return <p className="text-5xl text-center font-semibold my-12 text-red-400">Don't have data</p>;
  }

  return (
    // <div className="min-h-screen">
    <div>
      <div className="">
        <div className="mb-8">
          {/* Header */}
          {
            pathName === "/dashboard/subscriptions" && (
              <div className="mb-8 flex items-start justify-between">
                <div className="mt-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Subscription Management
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your plan
                  </p>
                </div>
              </div>
            )
          }

          <div className='my-6 flex items-center justify-center gap-4'>
            <p className='text-[16px] text-[#2D2D2D]'>Monthly</p>

            <button
              onClick={togglePlan}
              className='w-14 h-8 rounded-full relative flex items-center p-1 bg-primaryBgColor transition-all cursor-pointer'
            >
              <span
                className={`w-6 h-6 bg-white rounded-full transition-all duration-300
                            ${planType === "yearly" ? "translate-x-6" : ""}`}
              ></span>
            </button>

            <p className='text-[16px] text-[#2D2D2D]'>Yearly</p>
            <p className='text-[#6E51E0] text-sm border rounded-full px-3 py-1'>
              30% Off
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan: Plan, index: number) => (
              <div
                key={index}
                className={`group flex h-full flex-col rounded-lg bg-white p-6 shadow-sm ${plan.highlighted ? "ring-2 ring-indigo-600" : ""}`}
              >
                <div className="mb-4 rounded-xl bg-gray-2 p-4 bg-gray-100">
                  <div className="flex justify-between items-center">
                    <div
                      className={`mb-4 inline-block rounded-full px-4 py-1 text-sm font-medium transition-colors 
                     ${plan.id === String(activeSubcripiton?.data?.plan?.id)
                          ? "bg-primaryBgColor text-white"
                          : plan.highlighted
                            ? "bg-primaryBgColor text-white"
                            : "bg-white text-primaryBgColor hover:bg-primaryBgColor hover:text-white group-hover:bg-primaryBgColor group-hover:text-white"
                        }`}
                    >
                      {plan.name}
                    </div>
                    <p className="text-sm text-indigo-600">
                      {plan?.meetingMode === "1-on-1"
                        ? "1 to 1"
                        : plan?.meetingMode === "1-on-2"
                          ? "1 to 2"
                          : plan?.meetingMode === "1-on-3"
                            ? "1 to 3"
                            : "N/A"} 
                    </p>
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
                    <span className="ml-2 text-gray-500">/{plan.interval || "N/A"}</span>
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
                    disabled={plan.id === String(activeSubcripiton?.data?.plan?.id)}
                    className={`w-full py-2 border text-sm font-medium rounded-full flex items-center justify-center transition-colors
                    ${plan.id === String(activeSubcripiton?.data?.plan?.id)
                        ? "bg-primaryBgColor text-white cursor-not-allowed"
                        : "bg-[#FBFBFB] border-gray-200 text-[#2D2D2D] hover:bg-primaryBgColor hover:text-white group-hover:bg-primaryBgColor group-hover:text-white cursor-pointer"
                      }`}
                    style={{
                      boxShadow:
                        "inset 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 -1px 2px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {plan?.id === activeSubcripiton?.data?.plan?.id
                      ? "Current plan"
                      : "Upgrade plan"}

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
      {
        showLoginModal && (
          <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
        )
      }
    </div>
  );
};

export default SubscriptionPlan;

