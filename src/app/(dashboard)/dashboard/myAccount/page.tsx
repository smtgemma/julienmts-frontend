
// "use client";

// import { useEffect, useState } from "react";
// import { Search, Calendar, ExternalLink, LayoutGrid, List } from "lucide-react";
// import Link from "next/link";
// import { CiFilter } from "react-icons/ci";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useMyAccountListQuery } from "@/redux/api/myAccountApi/myAccountApi";
// import { format } from 'date-fns';
// import Loading from "@/components/Others/Loading";

// function MyAccount() {
//   const [view, setView] = useState("grid");
//   const [search, setSearch] = useState("");

//   const { data: myAcount, isLoading, refetch } = useMyAccountListQuery("");
//   // console.log(myAcount, "==================myaccount")
//   const accounts = myAcount?.data || []

//   useEffect(() => {
//     refetch();
//   }, []);

//   if (isLoading) {
//     return (
//       <p>
//         <Loading />
//       </p>
//     )
//   }
//   return (
//     <div>
//       {/* Top Bar */}
//       <div className="py-6 flex justify-between items-center gap-3">
//         {/* Search */}
//         <div className="flex-1 bg-white rounded-lg border border-[#D1D6DB] p-2">
//           <div className="flex items-center gap-2 px-2">
//             <Search className="w-4 h-4 text-[#636F85]" />
//             <input
//               type="text"
//               placeholder="Search accounts..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="flex-1 outline-none text-sm text-[#636F85] bg-transparent"
//             />
//           </div>
//         </div>

//         {/* Filter + Toggle */}
//         <div className="flex items-center gap-2">
//           {/* Filter */}
//           <Select>
//             <SelectTrigger className="flex items-center gap-2 border border-[#D1D6DB] px-3 py-2 rounded-sm">
//               <CiFilter size={20} />
//               <SelectValue placeholder="Filter" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="high">High Revenue</SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>

//           {/* Single Toggle Button */}
//           <button
//             onClick={() =>
//               setView((prev) => (prev === "grid" ? "list" : "grid"))
//             }
//             className="p-2 border border-[#D1D6DB] rounded bg-white hover:bg-gray-50"
//             title="Toggle view"
//           >
//             {view === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
//           </button>
//         </div>
//       </div>

//       {/* Cards */}
//       <div
//         className={`gap-6 ${view === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
//           }`}
//       >
//         {accounts.map((account: any) => (
//           <div
//             key={account.id}
//             className={`bg-white rounded-lg border border-[#D1D6DB] p-5 shadow-sm hover:shadow-md transition
//     ${view === "list" ? "flex items-center justify-between gap-6" : ""}
//   `}
//           >
//             {/* Left / Header */}
//             <div
//               className={`flex items-start gap-3  ${view === "grid" ? "mb-10" : ""
//                 }`}
//             >
//               <div
//                 className={`bg-[#6E51E0] w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg`}
//               >
//                 {account.companyName?.charAt(0).toUpperCase()}
//               </div>

//               <div className={`${view === "grid" ? "" : "ml-3"}`}>
//                 <h3 className="text-[#2D2D2D] font-semibold text-lg">
//                   {account.companyName}
//                 </h3>
//                 <div className="flex items-center gap-1 text-sm text-[#636F85]">
//                   <Calendar className="w-4 h-4" />
//                   <p>
//                     Last Meeting: {account.lastMeetingAt ? format(new Date(account.lastMeetingAt || "N/A"), "dd MMM yyyy, hh:mm a") : "N/A"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className={`grid grid-cols-3 gap-3 text-center mb-6`}>
//               <div>
//                 <div className="text-xl font-medium">{account.totalMeetings || "0"}</div>
//                 <div className="text-sm text-[#636F85]">Meetings</div>
//               </div>
//               <div>
//                 <div className="text-xl font-medium">
//                   {/* {account.opportunities} */}
//                 </div>
//                 {/* <div className="text-sm text-[#636F85]">Opportunities</div> */}
//               </div>
//               <div>
//                 <div className="text-sm font-medium">{account.revenue || "0"}</div>
//                 <div className="text-sm text-[#636F85]">Revenue</div>
//               </div>
//             </div>

//             {/* Open Account Button */}
//             <Link href={`/dashboard/myAccount/${account.aiCompanyId}`}>
//               <button
//                 className={`bg-[#6E51E0] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer
//         ${view === "grid" ? "w-full" : ""}
//       `}
//               >
//                 <ExternalLink size={16} />
//                 Open Account
//               </button>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MyAccount;



"use client";

import { useEffect, useState } from "react";
import { Search, Calendar, ExternalLink, LayoutGrid, List, Building2, Trash2 } from "lucide-react";
import Link from "next/link";
import { CiFilter } from "react-icons/ci";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteAccountMutation, useMyAccountListQuery } from "@/redux/api/myAccountApi/myAccountApi";
import { format } from 'date-fns';
import Loading from "@/components/Others/Loading";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

function MyAccount() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: myAcount, isLoading, refetch } = useMyAccountListQuery("");
  // console.log(myAcount, "==================myaccount")
  const accounts = myAcount?.data || []

  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  useEffect(() => {
    refetch();
  }, []);

  const handleDeleteAccount = async (aiCompanyId: string) => {
    setDeletingId(aiCompanyId);
    try {
      const response = await deleteAccount(aiCompanyId).unwrap();

      if (response.success) {
        // toast.success(response.message || "Account deleted successfully");
        // 2. Refetch the data
        refetch();
      }
    } catch (error) {
      toast.error("Failed to delete the account. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <p>
        <Loading title="Loading account" />
      </p>
    )
  }
  return (
    <div>
      {/* Top Bar */}
      <div className="py-6 flex justify-between items-center gap-3">
        {/* Search */}
        <div className="flex-1 bg-white rounded-lg border border-[#D1D6DB] p-2">
          <div className="flex items-center gap-2 px-2">
            <Search className="w-4 h-4 text-[#636F85]" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm text-[#636F85] bg-transparent"
            />
          </div>
        </div>

        {/* Filter + Toggle */}
        <div className="flex items-center gap-2">
          {/* Filter */}
          <Select>
            <SelectTrigger className="flex items-center gap-2 border border-[#D1D6DB] px-3 py-2 rounded-sm">
              <CiFilter size={20} />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High Revenue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Single Toggle Button */}
          <button
            onClick={() =>
              setView((prev) => (prev === "grid" ? "list" : "grid"))
            }
            className="p-2 border border-[#D1D6DB] rounded bg-white hover:bg-gray-50"
            title="Toggle view"
          >
            {view === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        className={`gap-6 ${view === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
          }`}
      >
        {accounts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-[#D1D6DB] rounded-xl py-14 bg-white">

            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F4F6FA] mb-4">
              <Building2 className="w-6 h-6 text-[#6E51E0]" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
              No Accounts Found
            </h3>

            {/* Description */}
            <p className="text-sm text-[#636F85] text-center max-w-xs mb-5">
              You haven’t added any accounts yet. Start by creating a new account to manage your companies.
            </p>

            {/* CTA Button */}
            <Link href="/dashboard/startNewMeeting">
              <button className="px-5 py-2 bg-[#6E51E0] text-white rounded-md text-sm font-medium hover:bg-[#5a42c9] transition cursor-pointer">
                + Add New Account
              </button>
            </Link>
          </div>
        ) : (
          accounts.map((account: any) => (
            <div
              key={account.aiCompanyId}
              className={`bg-white rounded-lg border border-[#D1D6DB] p-5 shadow-sm hover:shadow-md transition ${view === "list" ? "flex items-center justify-between gap-6" : ""
                }`}
            >
              {/* Left / Header */}
              <div
                className={`flex items-start gap-3 ${view === "grid" ? "mb-10" : ""
                  }`}
              >
                <div className="bg-[#6E51E0] w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                  {account.companyName?.charAt(0).toUpperCase()}
                </div>

                <div className={view === "grid" ? "" : "ml-3"}>
                  <h3 className="text-[#2D2D2D] font-semibold text-lg">
                    {account.companyName}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-[#636F85]">
                    <Calendar className="w-4 h-4" />
                    <p>
                      Last Meeting:{" "}
                      {account.lastMeetingAt
                        ? format(new Date(account.lastMeetingAt), "dd MMM yyyy, hh:mm a")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center mb-6">
                <div>
                  <div className="text-xl font-medium">
                    {account.totalMeetings ?? 0}
                  </div>
                  <div className="text-sm text-[#636F85]">Meetings</div>
                </div>

                <div>
                  <div className="text-xl font-medium">
                    {account.opportunities ?? 0}
                  </div>
                  <div className="text-sm text-[#636F85]">Opportunities</div>
                </div>

                <div>
                  <div className="text-xl font-medium">
                    {account.revenue ?? 0}
                  </div>
                  <div className="text-sm text-[#636F85]">Revenue</div>
                </div>
              </div>

              {/* Open Account Button */}
              <div className="flex items-center gap-2 w-full">
                {/* Open Account Link/Button - Full Width */}
                <Link href={`/dashboard/myAccount/${account.aiCompanyId}`} className="flex-1 w-full">
                  <button
                    className="w-full bg-[#6E51E0] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <ExternalLink size={16} />
                    Open Account
                  </button>
                </Link>

                {/* Delete Icon - Placed on the right side */}
                <button
                  onClick={() => handleDeleteAccount(account.aiCompanyId)}
                  disabled={isDeleting && deletingId === account.aiCompanyId}
                  className="flex-shrink-0 text-red-500 p-2 rounded-full hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting && deletingId === account.aiCompanyId ? (
                    <LuLoader className="animate-spin" size={25} />
                  ) : (
                    <MdDeleteOutline size={25} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyAccount;

