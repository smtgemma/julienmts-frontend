

// "use client";

// import { useState } from "react";
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

// function MyAccount() {
//   const [view, setView] = useState("grid");
//   const [search, setSearch] = useState("");

//   const {data: myAcount, isLoading} = useMyAccountListQuery("");
//   console.log(myAcount, "==================myaccount")

//   const accounts = [
//     {
//       id: 1,
//       name: "FastGrowth Inc.",
//       initial: "F",
//       lastUpdated: "3 days ago",
//       meetings: 7,
//       opportunities: 3,
//       revenue: "$55M",
//       color: "bg-[#6E51E0]",
//     },
//     {
//       id: 2,
//       name: "BlueWave Retail",
//       initial: "B",
//       lastUpdated: "2 days ago",
//       meetings: 4,
//       opportunities: 2,
//       revenue: "$120M",
//       color: "bg-[#6E51E0]",
//     },
//     {
//       id: 3,
//       name: "PixelCore Software",
//       initial: "P",
//       lastUpdated: "1 week ago",
//       meetings: 3,
//       opportunities: 1,
//       revenue: "$25M",
//       color: "bg-[#6E51E0]",
//     },
//     {
//       id: 4,
//       name: "NovaTech Labs",
//       initial: "N",
//       lastUpdated: "3 days ago",
//       meetings: 9,
//       opportunities: 4,
//       revenue: "$78M",
//       color: "bg-[#6E51E0]",
//     },
//   ];

//   const filteredAccounts = accounts.filter((account) =>
//     account.name.toLowerCase().includes(search.toLowerCase())
//   );

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
//         className={`gap-6 ${
//           view === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
//         }`}
//       >
//         {filteredAccounts.map((account) => (
//           <div
//             key={account.id}
//             className={`bg-white rounded-lg border border-[#D1D6DB] p-5 shadow-sm hover:shadow-md transition
//     ${view === "list" ? "flex items-center justify-between gap-6" : ""}
//   `}
//           >
//             {/* Left / Header */}
//             <div
//               className={`flex items-start gap-3  ${
//                 view === "grid" ? "mb-10" : ""
//               }`}
//             >
//               <div
//                 className={`${account.color} w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg`}
//               >
//                 {account.initial}
//               </div>

//               <div className={`${view === "grid" ? "" : "ml-3"}`}>
//                 <h3 className="text-[#2D2D2D] font-semibold text-lg">
//                   {account.name}
//                 </h3>
//                 <div className="flex items-center gap-1 text-sm text-[#636F85]">
//                   <Calendar className="w-4 h-4" />
//                   Last updated: {account.lastUpdated}
//                 </div>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className={`grid grid-cols-3 gap-6 text-center mb-6`}>
//               <div>
//                 <div className="text-xl font-medium">{account.meetings}</div>
//                 <div className="text-sm text-[#636F85]">Meetings</div>
//               </div>
//               <div>
//                 <div className="text-xl font-medium">
//                   {account.opportunities}
//                 </div>
//                 <div className="text-sm text-[#636F85]">Opportunities</div>
//               </div>
//               <div>
//                 <div className="text-xl font-medium">{account.revenue}</div>
//                 <div className="text-sm text-[#636F85]">Revenue</div>
//               </div>
//             </div>

//             {/* Open Account Button */}
//             <Link href={`/dashboard/myAccount/${account.id}`}>
//               <button
//                 className={`bg-[#6E51E0] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm
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

import { useState } from "react";
import { Search, Calendar, ExternalLink, LayoutGrid, List } from "lucide-react";
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
import { useMyAccountListQuery } from "@/redux/api/myAccountApi/myAccountApi";
import { format } from 'date-fns';
import Loading from "@/components/Others/Loading";

function MyAccount() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");

  const { data: myAcount, isLoading } = useMyAccountListQuery("");
  // console.log(myAcount, "==================myaccount")
  const accounts = myAcount?.data || []

  if (isLoading) {
    return (
      <p>
        <Loading />
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
        {accounts.map((account: any) => (
          <div
            key={account.id}
            className={`bg-white rounded-lg border border-[#D1D6DB] p-5 shadow-sm hover:shadow-md transition
    ${view === "list" ? "flex items-center justify-between gap-6" : ""}
  `}
          >
            {/* Left / Header */}
            <div
              className={`flex items-start gap-3  ${view === "grid" ? "mb-10" : ""
                }`}
            >
              <div
                className={`bg-[#6E51E0] w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg`}
              >
                {account.companyName?.charAt(0).toUpperCase()}
              </div>

              <div className={`${view === "grid" ? "" : "ml-3"}`}>
                <h3 className="text-[#2D2D2D] font-semibold text-lg">
                  {account.companyName}
                </h3>
                <div className="flex items-center gap-1 text-sm text-[#636F85]">
                  <Calendar className="w-4 h-4" />
                  <p>
                    Last Meeting: {account.lastMeetingAt ? format(new Date(account.lastMeetingAt || "N/A"), "dd MMM yyyy, hh:mm a") : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-3 text-center mb-6`}>
              <div>
                <div className="text-xl font-medium">{account.totalMeetings || "0"}</div>
                <div className="text-sm text-[#636F85]">Meetings</div>
              </div>
              <div>
                <div className="text-xl font-medium">
                  {/* {account.opportunities} */}
                </div>
                {/* <div className="text-sm text-[#636F85]">Opportunities</div> */}
              </div>
              <div>
                <div className="text-lg font-medium">{account.revenue || "0"}</div>
                <div className="text-sm text-[#636F85]">Revenue</div>
              </div>
            </div>

            {/* Open Account Button */}
            <Link href={`/dashboard/myAccount/${account.aiCompanyId}`}>
              <button
                className={`bg-[#6E51E0] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer
        ${view === "grid" ? "w-full" : ""}
      `}
              >
                <ExternalLink size={16} />
                Open Account
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAccount;

