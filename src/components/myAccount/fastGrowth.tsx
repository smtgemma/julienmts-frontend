import React from 'react';
import { Briefcase, MapPin, Users } from 'lucide-react';
import { Separator } from "@/components/ui/separator"

export default function FastGrowth({ singleData }: { singleData: any }) {
  const representatives = singleData?.data?.representatives || []
  return (
    <div className="w-full bg-gray-50 hover:shadow-sm transition-shadow">
      <div className="bg-white rounded-lg border border-[#D1D6DB] hover:shadow-sm transition-shadow">
        {/* Header */}
        <div className="flex items-start gap-4 p-5">
          <div className="bg-[#6E51E0] w-12 h-12 rounded-[10px] flex items-center justify-center text-white font-semibold text-xl">
            {singleData?.data?.company_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-[#2D2D2D] font-medium text-xl mb-2">
              {singleData?.company_name}
            </h2>
            <div className="flex items-center gap-3 text-sm text-[#636F85]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{singleData?.data?.company?.company_data?.industry || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{singleData?.data?.company?.company_data?.headquarters || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{singleData?.data?.company?.company_data?.company_size || "N/A"} employees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 p-5">
          <div>
            <div className="text-[16px] text-[#636F85] mb-1">Annual Revenue</div>
            <div className="text-xl font-medium text-[#2D2D2D]">{singleData?.data?.company?.company_data?.revenue || "N/A"}</div>
          </div>
          <div>
            <div className="text-[16px] text-[#636F85] mb-1">Total Meetings</div>
            <div className="text-xl font-medium text-[#2D2D2D]">{singleData?.data?.total_meetings || "N/A"}</div>
          </div>
          <div>
            <div className="text-[16px] text-[#636F85] mb-1">Active Opportunities</div>
            <div className="text-xl font-medium text-[#2D2D2D]">{singleData?.data?.ai_insights?.upsell_opportunities?.length || "0"}</div>
          </div>
          <div>
            <div className="text-[16px] text-[#636F85] mb-1">Potential Value</div>
            <div className="text-xl font-medium text-[#2D2D2D]">{singleData?.data?.ai_insights?.opportunities?.[0]?.value || "0"}</div>
          </div>
        </div>

        <Separator className='bg-[#D1D6DB] mx-5' />

        {/* Key Stakeholders */}
        <div className="p-6">
          <h3 className="text-[16px] font-medium text-[#636F85] mb-4">Key Stakeholders</h3>
          <div className="flex items-center gap-6">
            {representatives?.map((stakeholder: any) => (
              <div key={stakeholder.id} className="flex items-center gap-3">
                <div className="bg-[#6E51E0] text-white h-10 w-10 rounded-full flex items-center justify-center text-xl">
                  {stakeholder?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text[16px] font-medium text-[#101010]">
                    {stakeholder.name}
                  </div>
                  <div className="text-sm text-[#636F85]">
                    {stakeholder.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}