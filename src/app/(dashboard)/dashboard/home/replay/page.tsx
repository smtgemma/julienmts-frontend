"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';

function Replay() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(42 * 60); // 42:00 in seconds
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const formatTime = (seconds : any) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSkipBack = () => {
        setCurrentTime(Math.max(0, currentTime - 10));
    };

    const handleSkipForward = () => {
        setCurrentTime(Math.min(duration, currentTime + 10));
    };

    const handleSeek = (e : any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        setCurrentTime(percentage * duration);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        return duration;
                    }
                    return prev + 0.1;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isPlaying, duration]);

    const progress = (currentTime / duration) * 100;
    return (
        <div>
            {/* title part  */}
            <div className="bg-white border border-[#6E51E0] rounded-[12px] p-6 my-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-medium text-[#2D2D2D] mb-4">
                            Discovery Call with CMO
                        </h1>
                        <p className='text-[#4A5565] text-[16px]'>FastGrowth Inc. • Jan 23 • 42 minutes</p>
                    </div>

                    <div className="ml-6">
                        <div className="bg-[#6E51E0]/10 text-[#6E51E0] p-3 rounded-[8px] font-medium text-sm whitespace-nowrap">
                            Overall Score: 78/100
                        </div>
                    </div>
                </div>
            </div>
            {/* video player part  */}
            <div
                className="relative w-full h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col my-6"
                onMouseMove={handleMouseMove}
            >
                {/* Video Area */}
                <div className="flex-1 flex items-center justify-center relative">
                    {/* Time Display - Top Left */}
                    <div className={`absolute top-6 left-6 bg-black bg-opacity-80 px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>

                    {/* Center Play Button */}
                    <button
                        onClick={handlePlayPause}
                        className="group flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105"
                    >
                        <div className="w-24 h-24 rounded-full bg-slate-700 bg-opacity-80 flex items-center justify-center group-hover:bg-opacity-100 transition-all">
                            {isPlaying ? (
                                <Pause className="w-12 h-12 text-white ml-0" fill="white" />
                            ) : (
                                <Play className="w-12 h-12 text-white ml-1" fill="white" />
                            )}
                        </div>
                        <span className="text-slate-300 text-lg font-medium">
                            Meeting Recording
                        </span>
                    </button>
                </div>

                {/* Controls Bar */}
                <div className={`bg-white p-4 transition-all duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
                    {/* Progress Bar */}
                    <div
                        className="relative w-full h-1.5 bg-slate-200 rounded-full cursor-pointer mb-4 group"
                        onClick={handleSeek}
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                        />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Skip Back */}
                            <button
                                onClick={handleSkipBack}
                                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                <SkipBack className="w-5 h-5 text-slate-700" fill="currentColor" />
                            </button>

                            {/* Play/Pause */}
                            <button
                                onClick={handlePlayPause}
                                className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 text-white" fill="white" />
                                ) : (
                                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                )}
                            </button>

                            {/* Skip Forward */}
                            <button
                                onClick={handleSkipForward}
                                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                <SkipForward className="w-5 h-5 text-slate-700" fill="currentColor" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Volume */}
                            <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
                                <Volume2 className="w-5 h-5 text-slate-700" />
                            </button>

                            {/* Fullscreen */}
                            <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
                                <Maximize2 className="w-5 h-5 text-slate-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Replay