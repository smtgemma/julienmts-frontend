"use client"

import { useState } from "react"; // 1. Import useState
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";

function CustomPrompt() {
    const [prompt, setPrompt] = useState(""); // 2. Create state

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Your Prompt:", prompt); // 3. Log the state
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mt-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                    <label htmlFor="custom-prompt" className="text-sm font-semibold text-slate-700 ml-1 tracking-tight">
                        Custom Prompt
                    </label>
                    <textarea
                        id="custom-prompt"
                        value={prompt} // 4. Bind value
                        onChange={(e) => setPrompt(e.target.value)} // 5. Update state
                        rows={5}
                        className="w-full p-4 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none placeholder:text-slate-400 resize-none"
                        placeholder="Describe your vision in detail..."
                    />
                </div>
                <PrimaryButton type="submit" text="Submit" />
            </form>
        </div>
    )
}

export default CustomPrompt