import React from 'react';
import { Target } from 'lucide-react';

export default function OpportunitiesSection() {
    const opportunities = [
        {
            id: 1,
            title: "Enterprise CRM Platform",
            value: "$125,000",
            status: "Negotiation",
            closeDate: "Mar 15, 2025",
            probability: 75
        },
        {
            id: 2,
            title: "Enterprise CRM Platform",
            value: "$125,000",
            status: "Negotiation",
            closeDate: "Mar 15, 2025",
            probability: 75
        }
    ];

    return (
        <div className="w-full p-6 bg-white mt-7 rounded-xl">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-[18px] text-[#101010] flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Opportunities
                </h2>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opportunities.map((opportunity) => (
                    <div
                        key={opportunity.id}
                        className="rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-[16px] font-medium text-[#2D2D2D] flex-1">
                                {opportunity.title}
                            </h3>
                            <span className="text-[16px] text-[#34A853] ml-2">
                                {opportunity.value}
                            </span>
                        </div>

                        {/* Status and Close Date */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-2.5 py-1 bg-[#34A8531A] text-[#016630] text-sm font-medium rounded">
                                {opportunity.status}
                            </span>
                            <span className="text-[16px] text-[#636F85]">
                                Close: {opportunity.closeDate}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="text-sm text-[#636F85] text-right">
                                {opportunity.probability}% probability
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-[#101010] h-full rounded-full transition-all"
                                    style={{ width: `${opportunity.probability}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}