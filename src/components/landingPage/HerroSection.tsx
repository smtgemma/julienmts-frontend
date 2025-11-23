import Container from "@/lib/Container"
import { FiArrowRight } from "react-icons/fi"

function HerroSection() {
    return (
        <Container>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                {/* Hero Section */}
                <main className="px-6 py-20">
                    <div className="max-w-5xl mx-auto">
                        {/* Top Banner */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <div className="bg-white rounded-full px-4 py-2 shadow-sm flex items-center gap-2">
                                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">🎯</span>
                                </div>
                                <span className="text-sm font-medium">Get Pro 15%</span>
                                <span className="text-sm text-gray-600">Join the waitlist for an instant offer</span>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl font-bold text-center text-gray-900 mb-6 leading-tight">
                            Prepare for Every Sales Meeting<br />
                            Like a Top 1% Sales Rep.
                        </h1>

                        {/* Subheading */}
                        <p className="text-center text-gray-600 text-lg mb-10 max-w-3xl mx-auto">
                            AI-powered pre-call research, realistic meeting simulations, and instant coaching — so
                            you walk into every conversation confident, informed, and ready to win.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                            <button className="bg-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition flex items-center gap-2 shadow-lg">
                                Prepare My Meeting
                                <FiArrowRight className="w-4 h-4" />
                            </button>
                            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2 border border-gray-200 shadow-sm">
                                <FiArrowRight className="w-4 h-4" />
                                See How It Works
                            </button>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-purple-100">
                                <div className="text-4xl font-bold text-gray-900 mb-2">100k+</div>
                                <div className="text-sm text-gray-600">User</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-purple-100">
                                <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
                                <div className="text-sm text-gray-600">Meetings Prepared</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-purple-100">
                                <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
                                <div className="text-sm text-gray-600">Success Rate</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-purple-100">
                                <div className="text-4xl font-bold text-gray-900 mb-2">10 min</div>
                                <div className="text-sm text-gray-600">Average Prep Time</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </Container>
    )
}

export default HerroSection