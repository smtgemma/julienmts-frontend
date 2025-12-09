"use client"
import { MessageSquare, Check } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function TalkTimeDistribution() {
    const yourTalkTime = 48
    const otherTalkTime = 52

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Talk-Time Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
                {/* Circular Progress Chart */}
                <div className="relative w-64 h-64">
                    {/* Background circle (light gray) */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: 'conic-gradient(from 0deg, #E5E7EB 0%, #E5E7EB 100%)'
                        }}
                    ></div>

                    {/* Progress circle (purple for "You") */}
                    <div
                        className="absolute inset-0 rounded-full transition-all duration-500"
                        style={{
                            background: `conic-gradient(from -90deg, #7C3AED 0%, #7C3AED ${yourTalkTime}%, transparent ${yourTalkTime}%, transparent 100%)`
                        }}
                    ></div>

                    {/* Inner white circle */}
                    <div className="absolute inset-12 bg-white rounded-full flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-gray-900">{yourTalkTime}%</span>
                        <span className="text-sm text-gray-600 mt-1">Your Talk Time</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="w-full space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            <span className="text-sm text-gray-700">You</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{yourTalkTime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                            <span className="text-sm text-gray-700">Sarah Miller</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{otherTalkTime}%</span>
                    </div>
                </div>

                {/* Success Message */}
                <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">
                            Excellent ratio! You listened more than you talked, which is ideal for discovery calls.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}