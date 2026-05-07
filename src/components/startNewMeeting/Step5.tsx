// "before codes"

"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { FaUsersGear } from "react-icons/fa6";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useUpdateMeetingMutation } from "@/redux/api/startMettingApi/startMettingApi";


type Rep = {
  id: string;
  name: string;
  role: string;
  personality: string[] | string;
};

type AudioQueueItem = {
  base64: string;
  mimeType: string;
  repId: string;
  speakerName: string;
  isPrimary: boolean;
};

export default function LiveConversation({ handlePrev }: { handlePrev: () => void }) {

  // get all data form redux 
  const allData = useSelector((state: RootState) => state.startMeeting);
  // console.log(allData?.payloadData, "============all data")
  const { meeting_goal, duration_minutes, sales_methodology, representatives } = allData?.payloadData || {}

  const [updateMeeting] = useUpdateMeetingMutation()

  // ─── State ─────────────────────────────────────────────
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAIReplying, setIsAIReplying] = useState(false);
  const [status, setStatus] = useState({ type: "disconnected", text: "Disconnected" });
  const [micLabel, setMicLabel] = useState("Connecting...");
  const [silenceCountdown, setSilenceCountdown] = useState("");
  const [transcript, setTranscript] = useState<React.ReactElement[]>([]);
  const [reps, setReps] = useState<Rep[]>([]);
  const [repSpeaking, setRepSpeaking] = useState<{ [key: string]: boolean }>({});

  // ─── Refs ─────────────────────────────────────────────
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioQueueRef = useRef<AudioQueueItem[]>([]);
  const isPlayingAudioRef = useRef(false);

  // ✅ FIX: silenceStart as a ref to avoid closure bug
  const silenceStartRef = useRef<number | null>(null);

  // ✅ Track recording/AI state in refs for use inside callbacks
  const isRecordingRef = useRef(false);
  const isAIReplyingRef = useRef(false);
  const isConnectedRef = useRef(false);

  const SILENCE_DELAY_MS = 1500;
  const SILENCE_THRESHOLD = 8;

  // ─── Sync refs with state ─────────────────────────────
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);
  useEffect(() => { isAIReplyingRef.current = isAIReplying; }, [isAIReplying]);
  useEffect(() => { isConnectedRef.current = isConnected; }, [isConnected]);

  // ─── Status Helpers ───────────────────────────────────
  const statusColors: Record<string, string> = {
    disconnected: "bg-red-100 border-red-500 text-red-700",
    connected: "bg-green-100 border-green-500 text-green-700",
    recording: "bg-orange-100 border-orange-500 text-orange-700",
    thinking: "bg-blue-100 border-blue-500 text-blue-700",
    playing: "bg-purple-100 border-purple-500 text-purple-700",
  };

  function setStatusBox(type: string, text: string) {
    setStatus({ type, text });
  }

  function addMessage(speaker: string, text: string, cssClass: string) {
    setTranscript((prev) => [
      ...prev,
      <div key={prev.length} className={`message ${cssClass}`}>
        <div className="message-speaker">
          {cssClass === "message-user"
            ? "🧑‍💼"
            : cssClass.includes("ai")
              ? "🤖"
              : "ℹ️"}{" "}
          {speaker}
        </div>
        <div className="message-text">{text}</div>
        <div className="message-meta">{new Date().toLocaleTimeString()}</div>
      </div>,
    ]);
  }

  function displayReps(reps: Rep[]) {
    setReps(reps);
    const speakingState: Record<string, boolean> = {};
    reps.forEach((r) => (speakingState[r.id] = false));
    setRepSpeaking(speakingState);
  }

  function setRepSpeakingState(repId: string, speaking: boolean) {
    setRepSpeaking((prev) => ({ ...prev, [repId]: speaking }));
  }

  // ─── Audio Queue ───────────────────────────────────────
  function enqueueAudio(item: AudioQueueItem) {
    audioQueueRef.current.push(item);
    if (!isPlayingAudioRef.current) playNextInQueue();
  }

  function playNextInQueue() {
    if (audioQueueRef.current.length === 0) {
      isPlayingAudioRef.current = false;
      onAllAudioFinished();
      return;
    }
    isPlayingAudioRef.current = true;

    const { base64, mimeType, repId, speakerName } = audioQueueRef.current.shift()!;
    setRepSpeakingState(repId, true);
    setStatusBox("playing", `🔊 ${speakerName} is speaking...`);
    setMicLabel(`${speakerName} is speaking...`);

    // ✅ Stop mic while AI is speaking
    if (isRecordingRef.current) stopListening();

    const audio = new Audio(`data:${mimeType};base64,${base64}`);
    audio.onended = () => {
      setRepSpeakingState(repId, false);
      playNextInQueue();
    };
    audio.onerror = () => {
      setRepSpeakingState(repId, false);
      playNextInQueue();
    };
    audio.play().catch(() => {
      setRepSpeakingState(repId, false);
      playNextInQueue();
    });
  }

  // ✅ Auto-restart listening after AI finishes — natural conversation flow
  function onAllAudioFinished() {
    setIsAIReplying(false);
    isAIReplyingRef.current = false;
    setStatusBox("connected", "✅ Your turn — speak now");
    setMicLabel("Your turn — speak now");
    setSilenceCountdown("");
    // Auto-start listening so user doesn't need to click anything
    setTimeout(() => {
      if (isConnectedRef.current && !isRecordingRef.current) {
        startListening();
      }
    }, 800);
  }

  async function connectToMeeting() {
    try {
      const meetingId = Cookies.get("meetingId")?.trim() || "";
      console.log(meetingId, "=================meeting id in connect to meeting function");

      if (!meetingId) {
        toast.error("⚠️ Meeting ID not found");
        return;
      }

      setStatusBox("disconnected", "Connecting...");

      const response = await fetch(
        // `https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/start`,
        // `http://206.162.244.175:8012/meetings/api/meeting/${meetingId}/start`,
        `https://ai-julientmts.aiteamtwo.com/api/meeting/${meetingId}/start`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const message = errData?.detail || errData?.message || "Failed to start meeting";
        throw new Error(message);
      }

      toast.success("✅ Meeting started successfully");

      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(
        // `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
        // `http://206.162.244.175:8012/conversations/api/conversation/ws/live-conversation/${meetingId}`
        `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
        // `ws://localhost:8000/conversations/api/conversation/ws/realtime/${meetingId}`
      );

      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        setIsConnected(true);
        isConnectedRef.current = true;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMessage(data);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        toast.error("❌ WebSocket connection error");
        setStatusBox("disconnected", "Connection error");
      };

      ws.onclose = () => {
        console.log("❌ WebSocket disconnected");
        setStatusBox("disconnected", "Disconnected");
        setIsConnected(false);
        isConnectedRef.current = false;
        disableMic();
        // toast.error("❌ Connection closed");
        toast.success("✅ Meeting ended successfully");
      };

    } catch (error: any) {
      console.error("Connect meeting error:", error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      toast.error(`❌ ${message}, You have to create new meeting from before step`);
    }
  }

  // ─── WS Handler ───────────────────────────────────────
  function handleMessage(data: any) {
    console.log("📨", data.type, data);

    switch (data.type) {
      case "connected":
        setIsConnected(true);
        isConnectedRef.current = true;
        setStatusBox("connected", "✅ Connected — start speaking!");
        if (data.representatives) displayReps(data.representatives);
        addMessage("System", data.message || "Connected.", "message-system");
        enableMic();
        // ✅ Auto-start listening immediately on connect
        setTimeout(() => startListening(), 500);
        break;

      case "transcription":
        addMessage("Me 🎙️", data.text, "message-user");
        break;

      case "ai_thinking":
        setStatusBox("thinking", "💭 AI is thinking...");
        setMicLabel("AI is thinking...");
        setIsAIReplying(true);
        isAIReplyingRef.current = true;
        // ✅ Stop mic while AI thinks
        if (isRecordingRef.current) stopListening();
        break;

      case "ai_response_text":
        const cssClass = data.is_primary ? "message-ai-primary" : "message-ai-secondary";
        addMessage(data.speaker_name, data.text, cssClass);
        break;

      case "ai_audio_complete":
        enqueueAudio({
          base64: data.audio_data,
          mimeType: data.audio_mime_type || "audio/mpeg",
          repId: data.speaker_id,
          speakerName: data.speaker_name,
          isPrimary: data.is_primary,
        });
        break;

      case "error":
        addMessage("System", `⚠️ ${data.message}`, "message-system");
        onAllAudioFinished();
        break;

      case "no_audio":
        onAllAudioFinished();
        break;
    }
  }

  // ─── Mic ──────────────────────────────────────────────
  function enableMic() {
    setMicLabel("Your turn — speak now");
  }

  function disableMic() {
    setIsRecording(false);
    isRecordingRef.current = false;
  }

  async function startListening() {
    // ✅ Use refs for reliable state check inside async/callbacks
    if (isRecordingRef.current || isAIReplyingRef.current || !isConnectedRef.current || isPlayingAudioRef.current) return;

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      audioStreamRef.current = audioStream;

      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(audioStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const mediaRecorder = mimeType
        ? new MediaRecorder(audioStream, { mimeType })
        : new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;

      let hasSentAudio = false;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          const reader = new FileReader();
          reader.readAsDataURL(event.data);
          reader.onloadend = () => {
            const b64 = (reader.result as string).split(",")[1];
            wsRef.current?.send(JSON.stringify({ type: "audio_chunk", data: b64, is_speaking: true }));
            hasSentAudio = true;
          };
        }
      };

      mediaRecorder.onstop = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN && hasSentAudio) {
          wsRef.current.send(JSON.stringify({ type: "audio_chunk", data: "", is_speaking: false }));
        }
        audioStream.getTracks().forEach((t) => t.stop());
        audioContext.close();
        stopVolumeMonitor();
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      isRecordingRef.current = true;
      setStatusBox("recording", "🎙️ Listening...");
      setMicLabel("Listening... (auto-stops on silence)");
      startVolumeMonitor();
    } catch (err) {
      console.error("Mic error:", err);
      addMessage("System", "⚠️ Microphone access denied.", "message-system");
    }
  }

  function stopListening() {
    if (!isRecordingRef.current) return;
    setIsRecording(false);
    isRecordingRef.current = false;
    setSilenceCountdown("");
    silenceStartRef.current = null;
    mediaRecorderRef.current?.stop();
    setStatusBox("thinking", "⏳ Processing...");
    setMicLabel("Processing...");
  }

  // ✅ Manual toggle still works if user wants to click
  function toggleRecording() {
    if (isAIReplyingRef.current || isPlayingAudioRef.current) return;
    if (isRecordingRef.current) stopListening();
    else startListening();
  }

  function startVolumeMonitor() {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    volumeIntervalRef.current = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (avg < SILENCE_THRESHOLD) {
        if (!silenceStartRef.current) {
          // ✅ FIX: use ref instead of local variable — no closure bug
          silenceStartRef.current = Date.now();
        } else {
          const elapsed = Date.now() - silenceStartRef.current;
          if (elapsed >= SILENCE_DELAY_MS) {
            silenceStartRef.current = null;
            stopVolumeMonitor();
            stopListening();
          } else {
            setSilenceCountdown(
              `Sending in ${((SILENCE_DELAY_MS - elapsed) / 1000).toFixed(1)}s...`
            );
          }
        }
      } else {
        // ✅ Voice detected — reset silence timer
        silenceStartRef.current = null;
        setSilenceCountdown("");
      }
    }, 100);
  }

  function stopVolumeMonitor() {
    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    volumeIntervalRef.current = null;
  }

  async function disconnect() {
    const meetingId = Cookies.get("meetingId")?.trim() || "";
    try {

      const response = await fetch(
        // `https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/end`,
        // `http://206.162.244.175:8012/meetings/api/meeting/${meetingId}/end`,
        `https://ai-julientmts.aiteamtwo.com/api/meeting/${meetingId}/end`,
        { method: "POST" }
      );

      if (response) {
        // after end meeting this api will be called 
        const playload = {
          status: "completed"
        }
        const responseData = await updateMeeting({ meetingId, playload }).unwrap();
        console.log(responseData, "end meeting responseData")
      }

      // jamil vai api

      if (!response.ok) {
        throw new Error("Failed to end meeting");
      }

      stopListening();
      stopVolumeMonitor();

      audioQueueRef.current = [];
      isPlayingAudioRef.current = false;

      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: "disconnect" }));
        wsRef.current.close();
        wsRef.current = null;
      }

      setIsConnected(false);
      isConnectedRef.current = false;
      setIsAIReplying(false);
      isAIReplyingRef.current = false;
      setTranscript([]);

    } catch (error) {
      console.error("Disconnect error:", error);
    }
  }

  // ─── Heartbeat ───────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // ─── Cleanup on unmount ───────────────────────────────
  useEffect(() => {
    return () => {
      stopVolumeMonitor();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white w-full border border-[#6E51E0] rounded-xl p-6">
        {/* Setup */}
        {!isConnected && (
          <div>
            {/* Play Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#6E51E0] rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-medium text-[#2D2D2D] mb-2">
                Ready to Start Simulation?
              </h1>
              <p className="text-[#636F85] text-[16px]">
                Your AI-powered meeting is configured and ready to begin
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              {/* meeting summery  */}
              <div className="bg-[#F9FAFB] rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#2D2D2D] mb-5">
                  Meeting Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#636F85]">Goal:</span>
                    <span className="text-[#2D2D2D] text-[16px]">{meeting_goal || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#636F85]">Methodology:</span>
                    <span className="text-[#2D2D22] text-[16px]">{sales_methodology || "N/A"}</span>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span className="text-[#636F85]">Duration:</span>
                    <span className="text-[#2D2D2D] text-[16px]">{duration_minutes || "0"} minutes</span>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#636F85]">Participants:</span>
                    <span className="text-[#2D2D2D] text-[16px]">{representatives?.length || "0"}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handlePrev}
                  className="px-6 py-2 border border-gray-300 rounded-md cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={connectToMeeting}
                  className="px-6 py-2 bg-[#6E51E0] text-white rounded-md cursor-pointer"
                >
                  Start Meeting
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Status */}
          {isConnected && (
            <div className={`p-4 rounded-lg border-l-4 ${statusColors[status.type]} flex items-center gap-3 font-medium`}>
              <div className={`w-3 h-3 rounded-full ${status.type === "disconnected" ? "bg-red-600" : "bg-green-600"} animate-pulse`}></div>
              {status.text}
            </div>
          )}

          {/* Reps */}
          {isConnected && reps.length > 0 && (
            <div>
              <div className="flex items-center gap-2">
                <FaUsersGear size={20} className="text-[#6E51E0] -mt-4" />
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#6E51E0]"> AI Representatives</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {reps.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-3 rounded-lg flex-1 min-w-[180px] 
                      ${repSpeaking[rep.id]
                        ? "border-4 border-purple-600 bg-purple-200 animate-pulse shadow-lg shadow-purple-400/50"
                        : "border-l-4 border-orange-500 bg-orange-100"
                      } transition-all duration-300 ease-in-out`}
                  >
                    <h3 className={`${repSpeaking[rep.id] ? "text-purple-800 font-bold" : "text-orange-700"} mb-1`}>
                      {rep.name}
                    </h3>
                    <p><strong>Role:</strong> {rep.role}</p>
                    <p>
                      <strong>Personality:</strong> {Array.isArray(rep.personality) ? rep.personality.join(", ") : rep.personality}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mic */}
          {isConnected && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2"> Voice Conversation</h2>
              <div className="flex flex-col items-center gap-4">
                {/* ✅ Mic button still clickable as manual override, but not required */}
                <button
                  title={isAIReplying || isPlayingAudioRef.current ? "AI is speaking..." : isRecording ? "Click to stop" : "Click to speak"}
                  className={`w-20 h-20 rounded-full text-white text-2xl flex items-center justify-center shadow-lg cursor-pointer 
                    ${isRecording
                      ? "bg-red-600 animate-pulse shadow-red-400/50"
                      : isAIReplying || isPlayingAudioRef.current
                        ? "bg-purple-500 animate-pulse"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    } transition-all duration-300 ease-in-out`}
                  onClick={toggleRecording}
                >
                  {isAIReplying || isPlayingAudioRef.current ? "🔊" : "🎤"}
                </button>
                <div className="text-sm text-gray-600">{micLabel}</div>
                {silenceCountdown && (
                  <div className="text-xs text-orange-500 font-medium">{silenceCountdown}</div>
                )}
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                  onClick={disconnect}
                >
                  End Conversation
                </button>
              </div>
            </div>
          )}

          {/* Transcript */}
          {isConnected && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">Conversation Transcript</h2>
              <div className="bg-gray-100 rounded-lg p-4 max-h-[420px] overflow-y-auto space-y-3">
                {transcript.length === 0 && (
                  <div className="text-gray-400 text-center italic">
                    Start speaking — transcript will appear here.
                  </div>
                )}
                {transcript}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { Play } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import Cookies from "js-cookie";
// import { toast } from "sonner";
// import { FaUsersGear } from "react-icons/fa6";
// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// import { useUpdateMeetingMutation } from "@/redux/api/startMettingApi/startMettingApi";

// type Rep = {
//   id: string;
//   name: string;
//   role: string;
//   personality: string[] | string;
// };

// type AudioQueueItem = {
//   base64: string;
//   mimeType: string;
//   repId: string;
//   speakerName: string;
//   isPrimary: boolean;
// };

// export default function LiveConversation({ handlePrev }: { handlePrev: () => void }) {
//   // --- Redux ---
//   const allData = useSelector((state: RootState) => state.startMeeting);
//   const { meeting_goal, duration_minutes, sales_methodology, representatives } = allData?.payloadData || {};
//   const [updateMeeting] = useUpdateMeetingMutation();

//   // --- State ---
//   const [isConnected, setIsConnected] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isAIReplying, setIsAIReplying] = useState(false);
//   const [status, setStatus] = useState({ type: "disconnected", text: "Disconnected" });
//   const [micLabel, setMicLabel] = useState("Connecting...");
//   const [silenceCountdown, setSilenceCountdown] = useState("");
//   const [transcript, setTranscript] = useState<React.ReactElement[]>([]);
//   const [reps, setReps] = useState<Rep[]>([]);
//   const [repSpeaking, setRepSpeaking] = useState<{ [key: string]: boolean }>({});

//   // --- Refs ---
//   const wsRef = useRef<WebSocket | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioStreamRef = useRef<MediaStream | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const volumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const audioQueueRef = useRef<AudioQueueItem[]>([]);
//   const isPlayingAudioRef = useRef(false);

//   // VAD Refs
//   const silenceStartRef = useRef<number | null>(null);
//   const speechStartRef = useRef<number | null>(null); // Tracks when actual speech begins
//   const isRecordingRef = useRef(false);
//   const isAIReplyingRef = useRef(false);
//   const isConnectedRef = useRef(false);

//   // --- Constants ---
//   const SILENCE_DELAY_MS = 1500;
//   const SILENCE_THRESHOLD = 15;   // Increased threshold to ignore low background hum
//   const SPEECH_MINIMUM_MS = 450;  // Sound must last this long to be considered "Human Speech"

//   // --- Sync refs ---
//   useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);
//   useEffect(() => { isAIReplyingRef.current = isAIReplying; }, [isAIReplying]);
//   useEffect(() => { isConnectedRef.current = isConnected; }, [isConnected]);

//   const statusColors: Record<string, string> = {
//     disconnected: "bg-red-100 border-red-500 text-red-700",
//     connected: "bg-green-100 border-green-500 text-green-700",
//     recording: "bg-orange-100 border-orange-500 text-orange-700",
//     thinking: "bg-blue-100 border-blue-500 text-blue-700",
//     playing: "bg-purple-100 border-purple-500 text-purple-700",
//   };

//   function setStatusBox(type: string, text: string) {
//     setStatus({ type, text });
//   }

//   function addMessage(speaker: string, text: string, cssClass: string) {
//     setTranscript((prev) => [
//       ...prev,
//       <div key={prev.length} className={`message ${cssClass}`}>
//         <div className="message-speaker">
//           {cssClass === "message-user" ? "🧑‍💼" : cssClass.includes("ai") ? "🤖" : "ℹ️"} {speaker}
//         </div>
//         <div className="message-text">{text}</div>
//         <div className="message-meta">{new Date().toLocaleTimeString()}</div>
//       </div>,
//     ]);
//   }

//   function displayReps(reps: Rep[]) {
//     setReps(reps);
//     const speakingState: Record<string, boolean> = {};
//     reps.forEach((r) => (speakingState[r.id] = false));
//     setRepSpeaking(speakingState);
//   }

//   function setRepSpeakingState(repId: string, speaking: boolean) {
//     setRepSpeaking((prev) => ({ ...prev, [repId]: speaking }));
//   }

//   // --- Audio Queue Logic ---
//   function enqueueAudio(item: AudioQueueItem) {
//     audioQueueRef.current.push(item);
//     if (!isPlayingAudioRef.current) playNextInQueue();
//   }

//   function playNextInQueue() {
//     if (audioQueueRef.current.length === 0) {
//       isPlayingAudioRef.current = false;
//       onAllAudioFinished();
//       return;
//     }
//     isPlayingAudioRef.current = true;

//     const { base64, mimeType, repId, speakerName } = audioQueueRef.current.shift()!;
//     setRepSpeakingState(repId, true);
//     setStatusBox("playing", `🔊 ${speakerName} is speaking...`);
//     setMicLabel(`${speakerName} is speaking...`);

//     if (isRecordingRef.current) stopListening();

//     const audio = new Audio(`data:${mimeType};base64,${base64}`);
//     const handleAudioEnd = () => {
//       setRepSpeakingState(repId, false);
//       playNextInQueue();
//     };
//     audio.onended = handleAudioEnd;
//     audio.onerror = handleAudioEnd;
//     audio.play().catch(handleAudioEnd);
//   }

//   function onAllAudioFinished() {
//     setIsAIReplying(false);
//     isAIReplyingRef.current = false;
//     setStatusBox("connected", "✅ Your turn — speak now");
//     setMicLabel("Your turn — speak now");
//     setSilenceCountdown("");
//     setTimeout(() => {
//       if (isConnectedRef.current && !isRecordingRef.current) {
//         startListening();
//       }
//     }, 800);
//   }

//   // --- Connection ---
//   async function connectToMeeting() {
//     try {
//       const meetingId = Cookies.get("meetingId")?.trim() || "";
//       if (!meetingId) {
//         toast.error("⚠️ Meeting ID not found");
//         return;
//       }

//       setStatusBox("disconnected", "Connecting...");
//       const response = await fetch(`https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/start`, { method: "POST" });

//       if (!response.ok) throw new Error("Failed to start meeting");

//       toast.success("✅ Meeting started successfully");
//       if (wsRef.current) wsRef.current.close();

//       const ws = new WebSocket(`https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`);
//       wsRef.current = ws;

//       ws.onopen = () => {
//         setIsConnected(true);
//         isConnectedRef.current = true;
//       };

//       ws.onmessage = (event) => handleMessage(JSON.parse(event.data));
//       ws.onerror = () => setStatusBox("disconnected", "Connection error");
//       ws.onclose = () => {
//         setStatusBox("disconnected", "Disconnected");
//         setIsConnected(false);
//         isConnectedRef.current = false;
//         disableMic();
//         toast.success("✅ Meeting ended successfully");
//       };
//     } catch (error: any) {
//       toast.error(`❌ ${error.message}`);
//     }
//   }

//   function handleMessage(data: any) {
//     switch (data.type) {
//       case "connected":
//         setIsConnected(true);
//         isConnectedRef.current = true;
//         setStatusBox("connected", "✅ Connected — start speaking!");
//         if (data.representatives) displayReps(data.representatives);
//         addMessage("System", data.message || "Connected.", "message-system");
//         enableMic();
//         setTimeout(() => startListening(), 500);
//         break;

//       case "transcription":
//         addMessage("Me 🎙️", data.text, "message-user");
//         break;

//       case "ai_thinking":
//         setStatusBox("thinking", "💭 AI is thinking...");
//         setIsAIReplying(true);
//         isAIReplyingRef.current = true;
//         if (isRecordingRef.current) stopListening();
//         break;

//       case "ai_response_text":
//         const cssClass = data.is_primary ? "message-ai-primary" : "message-ai-secondary";
//         addMessage(data.speaker_name, data.text, cssClass);
//         break;

//       case "ai_audio_complete":
//         enqueueAudio({
//           base64: data.audio_data,
//           mimeType: data.audio_mime_type || "audio/mpeg",
//           repId: data.speaker_id,
//           speakerName: data.speaker_name,
//           isPrimary: data.is_primary,
//         });
//         break;

//       case "error":
//       case "no_audio":
//         onAllAudioFinished();
//         break;
//     }
//   }

//   // --- Microphone & VAD Logic ---
//   function enableMic() { setMicLabel("Your turn — speak now"); }
//   function disableMic() { setIsRecording(false); isRecordingRef.current = false; }

//   async function startListening() {
//     if (isRecordingRef.current || isAIReplyingRef.current || !isConnectedRef.current || isPlayingAudioRef.current) return;

//     try {
//       const audioStream = await navigator.mediaDevices.getUserMedia({
//         audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
//       });
//       audioStreamRef.current = audioStream;

//       const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
//       const audioContext = new AudioContextClass();
//       audioContextRef.current = audioContext;

//       const source = audioContext.createMediaStreamSource(audioStream);
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 512;
//       source.connect(analyser);
//       analyserRef.current = analyser;

//       const mediaRecorder = new MediaRecorder(audioStream);
//       mediaRecorderRef.current = mediaRecorder;

//       let hasSentAudio = false;

//       mediaRecorder.ondataavailable = (event) => {
//         // ONLY send if we have detected actual human speech (based on duration and threshold)
//         const isHumanSpeech = speechStartRef.current && (Date.now() - speechStartRef.current > SPEECH_MINIMUM_MS);

//         if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN && isHumanSpeech) {
//           const reader = new FileReader();
//           reader.readAsDataURL(event.data);
//           reader.onloadend = () => {
//             const b64 = (reader.result as string).split(",")[1];
//             wsRef.current?.send(JSON.stringify({ type: "audio_chunk", data: b64, is_speaking: true }));
//             hasSentAudio = true;
//           };
//         }
//       };

//       mediaRecorder.onstop = () => {
//         if (wsRef.current?.readyState === WebSocket.OPEN && hasSentAudio) {
//           wsRef.current.send(JSON.stringify({ type: "audio_chunk", data: "", is_speaking: false }));
//         }
//         audioStream.getTracks().forEach((t) => t.stop());
//         audioContext.close();
//         stopVolumeMonitor();
//       };

//       mediaRecorder.start(100);
//       setIsRecording(true);
//       isRecordingRef.current = true;
//       setStatusBox("recording", "🎙️ Listening...");
//       startVolumeMonitor();
//     } catch (err) {
//       addMessage("System", "⚠️ Microphone access denied.", "message-system");
//     }
//   }

//   function stopListening() {
//     if (!isRecordingRef.current) return;
//     setIsRecording(false);
//     isRecordingRef.current = false;
//     setSilenceCountdown("");
//     silenceStartRef.current = null;
//     speechStartRef.current = null; // Reset speech flag
//     mediaRecorderRef.current?.stop();
//     setStatusBox("thinking", "⏳ Processing...");
//   }

//   function toggleRecording() {
//     if (isAIReplyingRef.current || isPlayingAudioRef.current) return;
//     isRecordingRef.current ? stopListening() : startListening();
//   }

//   function startVolumeMonitor() {
//     if (!analyserRef.current) return;
//     const analyser = analyserRef.current;
//     const dataArray = new Uint8Array(analyser.frequencyBinCount);

//     volumeIntervalRef.current = setInterval(() => {
//       analyser.getByteFrequencyData(dataArray);
//       const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

//       if (avg > SILENCE_THRESHOLD) {
//         // Sound detected
//         if (!speechStartRef.current) speechStartRef.current = Date.now();
//         silenceStartRef.current = null;
//         setSilenceCountdown("");
//         setMicLabel("Voice Detected...");
//       } else {
//         // Silence detected
//         // If sound was too short, reset speech flag (ignores background pops)
//         if (speechStartRef.current && (Date.now() - speechStartRef.current < SPEECH_MINIMUM_MS)) {
//           speechStartRef.current = null;
//           setMicLabel("Listening...");
//         }

//         if (speechStartRef.current) {
//           if (!silenceStartRef.current) {
//             silenceStartRef.current = Date.now();
//           } else {
//             const elapsed = Date.now() - silenceStartRef.current;
//             if (elapsed >= SILENCE_DELAY_MS) {
//               stopListening();
//             } else {
//               setSilenceCountdown(`Sending in ${((SILENCE_DELAY_MS - elapsed) / 1000).toFixed(1)}s...`);
//             }
//           }
//         }
//       }
//     }, 100);
//   }

//   function stopVolumeMonitor() {
//     if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
//     volumeIntervalRef.current = null;
//   }

//   async function disconnect() {
//     const meetingId = Cookies.get("meetingId")?.trim() || "";
//     try {
//       const response = await fetch(`https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/end`, { method: "POST" });
//       if (response.ok) {
//         await updateMeeting({ meetingId, playload: { status: "completed" } }).unwrap();
//       }
//       stopListening();
//       if (wsRef.current) wsRef.current.close();
//       setIsConnected(false);
//       setTranscript([]);
//     } catch (error) { console.error(error); }
//   }

//   // Heartbeat & Cleanup
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify({ type: "ping" }));
//     }, 25000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     return () => {
//       stopVolumeMonitor();
//       if (wsRef.current) wsRef.current.close();
//     };
//   }, []);

//   return (
//     <div className="flex justify-center items-center">
//       <div className="bg-white w-full border border-[#6E51E0] rounded-xl p-6">
//         {!isConnected ? (
//           <div className="max-w-2xl mx-auto">
//             <div className="flex justify-center mb-6">
//               <div className="w-20 h-20 bg-[#6E51E0] rounded-full flex items-center justify-center">
//                 <Play className="w-8 h-8 text-white" />
//               </div>
//             </div>
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-medium text-[#2D2D2D] mb-2">Ready to Start Simulation?</h1>
//               <p className="text-[#636F85]">Your AI-powered meeting is configured and ready to begin</p>
//             </div>
//             <div className="bg-[#F9FAFB] rounded-lg p-6 mb-6">
//               <h2 className="text-xl font-semibold mb-5">Meeting Summary</h2>
//               <div className="space-y-3 text-[16px]">
//                 <div className="flex justify-between"><span>Goal:</span><span className="font-medium">{meeting_goal || "N/A"}</span></div>
//                 <div className="flex justify-between"><span>Methodology:</span><span className="font-medium">{sales_methodology || "N/A"}</span></div>
//                 <div className="flex justify-between"><span>Duration:</span><span className="font-medium">{duration_minutes || "0"} mins</span></div>
//                 <div className="flex justify-between"><span>Participants:</span><span className="font-medium">{representatives?.length || "0"}</span></div>
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <button onClick={handlePrev} className="px-6 py-2 border rounded-md">Back</button>
//               <button onClick={connectToMeeting} className="px-6 py-2 bg-[#6E51E0] text-white rounded-md cursor-pointer">Start Meeting</button>
//             </div>
//           </div>
//         ) : (
//           <div className="p-4 space-y-6">
//             <div className={`p-4 rounded-lg border-l-4 ${statusColors[status.type]} flex items-center gap-3`}>
//               <div className={`w-3 h-3 rounded-full ${status.type === "disconnected" ? "bg-red-600" : "bg-green-600"} animate-pulse`}></div>
//               {status.text}
//             </div>

//             {reps.length > 0 && (
//               <div className="flex flex-wrap gap-3">
//                 {reps.map((rep) => (
//                   <div key={rep.id} className={`p-3 rounded-lg flex-1 min-w-[180px] transition-all duration-300 ${repSpeaking[rep.id] ? "border-4 border-purple-600 bg-purple-200 animate-pulse scale-105" : "border-l-4 border-orange-500 bg-orange-100"}`}>
//                     <h3 className="font-bold">{rep.name}</h3>
//                     <p className="text-sm"><strong>Role:</strong> {rep.role}</p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="flex flex-col items-center gap-4 py-6">
//               <button
//                 onClick={toggleRecording}
//                 className={`w-20 h-20 rounded-full text-white text-2xl flex items-center justify-center shadow-lg transition-all ${isRecording ? "bg-red-600 animate-pulse" : isAIReplying || isPlayingAudioRef.current ? "bg-purple-500 animate-pulse" : "bg-gradient-to-br from-indigo-500 to-purple-600"}`}
//               >
//                 {isAIReplying || isPlayingAudioRef.current ? "🔊" : "🎤"}
//               </button>
//               <div className="text-sm font-medium text-gray-600">{micLabel}</div>
//               {silenceCountdown && <div className="text-xs text-orange-500 animate-bounce">{silenceCountdown}</div>}
//               <button className="bg-red-500 text-white px-6 py-2 rounded-lg cursor-pointer" onClick={disconnect}>End Conversation</button>
//             </div>

//             <div className="bg-gray-100 rounded-lg p-4 max-h-[300px] overflow-y-auto space-y-3">
//               {transcript.length === 0 ? <p className="text-center text-gray-400 italic">Listening for speech...</p> : transcript}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }