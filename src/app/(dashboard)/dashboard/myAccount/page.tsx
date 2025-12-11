
import { Search } from 'lucide-react';
import { Calendar, ExternalLink } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CiFilter } from 'react-icons/ci';
import Link from 'next/link';

function MyAccount() {
    const accounts = [
        {
            id: 1,
            name: 'FastGrowth Inc.',
            initial: 'F',
            lastUpdated: '3 days ago',
            meetings: 7,
            opportunities: 3,
            revenue: '$55M',
            color: 'bg-[#6E51E0]'
        },
        {
            id: 2,
            name: 'BlueWave Retail',
            initial: 'B',
            lastUpdated: '2 days ago',
            meetings: 4,
            opportunities: 2,
            revenue: '$120M',
            color: 'bg-[#6E51E0]'
        },
        {
            id: 3,
            name: 'PixelCore Software',
            initial: 'P',
            lastUpdated: '1 week ago',
            meetings: 3,
            opportunities: 1,
            revenue: '$25M',
            color: 'bg-[#6E51E0]'
        },
        {
            id: 4,
            name: 'NovaTech Labs',
            initial: 'N',
            lastUpdated: '3 days ago',
            meetings: 9,
            opportunities: 4,
            revenue: '$78M',
            color: 'bg-[#6E51E0]'
        }
    ];
    return (
        <div>
            <div className='py-6 flex justify-between items-center gap-2.5'>
                <div className="flex-1 bg-white rounded-lg border border-[#D1D6DB] hover:border-[#6E51E0] p-2">
                    {/* Search Section */}
                    <div className="flex items-center gap-2 flex-1 px-2">
                        <Search className="w-4 h-4 text-[#636F85]" />
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="flex-1 outline-none text-sm text-[#636F85] placeholder-gray-400 bg-transparent"
                        />
                    </div>
                </div>

                <div>
                    <Select>
                        <SelectTrigger className="flex items-center gap-2 border border-[#D1D6DB] px-1 lg:px-4 py-2 rounded-sm text-[#2D2D2D] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#D1D6DB]
                      focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">

                            {/* Globe icon on left */}
                            <CiFilter size={24} className="text-[#2D2D2D]" />

                            {/* Placeholder with black color */}
                            <SelectValue placeholder="FastGrowth" className="text-black" />

                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="English">FastGrowth</SelectItem>
                                <SelectItem value="Bangla">Fast</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* car design  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((account) => (
                    <div
                        key={account.id}
                        className="bg-white rounded-lg border border-[#D1D6DB] p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-6">
                            <div className={`${account.color} w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg`}>
                                {account.initial}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[#2D2D2D] font-semibold text-xl mb-1">
                                    {account.name}
                                </h3>
                                <div className="flex items-center gap-1 text-[#636F85] text-sm">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Last updated: {account.lastUpdated}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <div className="text-2xl font-medium text-[#2D2D2D] mb-1">
                                    {account.meetings}
                                </div>
                                <div className="text-[16px] text-[#636F85]">Meetings</div>
                            </div>
                            <div>
                                <div className="text-2xl font-medium text-[#2D2D2D] mb-1">
                                    {account.opportunities}
                                </div>
                                <div className="text-[16px] text-[#636F85]">Opportunities</div>
                            </div>
                            <div>
                                <div className="text-2xl font-medium text-[#2D2D2D] mb-1">
                                    {account.revenue}
                                </div>
                                <div className="text-[16px] text-[#636F85]">Revenue</div>
                            </div>
                        </div>

                        {/* Button */}
                        <Link href={`/dashboard/myAccount/${account.id}`}>
                            <button className="w-full bg-[#6E51E0] hover:bg-[#6E51E0] text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                <ExternalLink className="w-4 h-4" />
                                Open Account
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAccount