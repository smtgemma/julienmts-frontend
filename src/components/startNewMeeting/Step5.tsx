// "use client";

// import { Play } from "lucide-react";
// import Link from "next/link";
// import Cookies from "js-cookie";

// export default function Step5(
//   { handlePrev }: { handlePrev: () => void }
// ) {
//   const meetingData = {
//     goal: "Book a Demo",
//     methodology: "SPIN",
//     duration: "30 minutes",
//     participantsName: "Mikkle",
//   };

//   const handleBack = () => {
//     console.log("Back clicked");
//     handlePrev();
//   };

//   const handleStartMeeting = async () => {
//     try {
//       const meetingId = Cookies.get("meetingId");

//       console.log(meetingId, "===================");

//       if (!meetingId) {
//         console.error("Meeting ID not found in cookies");
//         return;
//       }

//       const response = await fetch(
//         `http://206.162.244.134:8012/meetings/api/meeting/${meetingId}/start`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to start meeting");
//       }

//       console.log("Meeting Started:", data);
//     } catch (error: any) {
//       console.error("Start Meeting Error:", error.message);
//     }
//   };

//   return (
//     <div className="bg-white flex items-center justify-center py-6 border border-[#6E51E0] rounded-lg">
//       <div className="max-w-xl w-full">

//         {/* Play Icon */}
//         <div className="flex justify-center mb-6">
//           <div className="w-20 h-20 bg-[#6E51E0] rounded-full flex items-center justify-center">
//             <Play className="w-8 h-8 text-white" />
//           </div>
//         </div>

//         {/* Heading */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-medium text-[#2D2D2D] mb-2">
//             Ready to Start Simulation?
//           </h1>
//           <p className="text-[#636F85] text-[16px]">
//             Your AI-powered meeting is configured and ready to begin
//           </p>
//         </div>

//         {/* Meeting Summary */}
//         <div className="bg-[#F9FAFB] rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#2D2D2D] mb-5">
//             Meeting Summary
//           </h2>

//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-[#636F85]">Goal:</span>
//               <span className="text-[#2D2D2D] text-[16px]">
//                 {meetingData.goal}
//               </span>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-[#636F85]">Methodology:</span>
//               <span className="text-[#2D2D22] text-[16px]">
//                 {meetingData.methodology}
//               </span>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-[#636F85]">Duration:</span>
//               <span className="text-[#2D2D2D] text-[16px]">
//                 {meetingData.duration}
//               </span>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-[#636F85]">Participants:</span>
//               <span className="text-[#2D2D2D] text-[16px]">
//                 {meetingData.participantsName}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-between">
//           <button
//             onClick={handleBack}
//             className="px-6 py-2 border border-gray-300 rounded-md"
//           >
//             Back
//           </button>

//           <button
//             onClick={handleStartMeeting}
//             className="px-6 py-2 bg-[#6E51E0] text-white rounded-md"
//           >
//             Start Meeting
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useRef, useState } from "react";

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

// export default function LiveConversation() {
//   // ─── State ─────────────────────────────────────────────
//   const [meetingId, setMeetingId] = useState("");
//   const [isConnected, setIsConnected] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isAIReplying, setIsAIReplying] = useState(false);
//   const [status, setStatus] = useState({ type: "disconnected", text: "Disconnected" });
//   const [micLabel, setMicLabel] = useState("Connecting...");
//   const [silenceCountdown, setSilenceCountdown] = useState("");
//   // const [transcript, setTranscript] = useState<JSX.Element[]>([]);
//   const [transcript, setTranscript] = useState<React.ReactElement[]>([]);
//   const [reps, setReps] = useState<Rep[]>([]);
//   const [repSpeaking, setRepSpeaking] = useState<{ [key: string]: boolean }>({});

//   // ─── Refs ─────────────────────────────────────────────
//   const wsRef = useRef<WebSocket | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioStreamRef = useRef<MediaStream | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const volumeIntervalRef = useRef<NodeJS.Timer | null>(null);
//   const audioQueueRef = useRef<AudioQueueItem[]>([]);
//   const isPlayingAudioRef = useRef(false);

//   const SILENCE_DELAY_MS = 1500;
//   const SILENCE_THRESHOLD = 8;

//   // ─── Status Helpers ───────────────────────────────────
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
//           {cssClass === "message-user"
//             ? "🧑‍💼"
//             : cssClass.includes("ai")
//             ? "🤖"
//             : "ℹ️"}{" "}
//           {speaker}
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

//   // ─── Audio Queue ───────────────────────────────────────
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

//     if (isRecording) stopListening(); // stop mic while AI speaking

//     const audio = new Audio(`data:${mimeType};base64,${base64}`);
//     audio.onended = () => {
//       setRepSpeakingState(repId, false);
//       playNextInQueue();
//     };
//     audio.onerror = () => {
//       setRepSpeakingState(repId, false);
//       playNextInQueue();
//     };
//     audio.play().catch(() => {
//       setRepSpeakingState(repId, false);
//       playNextInQueue();
//     });
//   }

//   function onAllAudioFinished() {
//     setIsAIReplying(false);
//     setStatusBox("connected", "✅ Your turn — speak now");
//     setMicLabel("Your turn — speak now");
//     setSilenceCountdown("");
//     setTimeout(() => startListening(), 800);
//   }

//   // ─── Connect ──────────────────────────────────────────
//   function connectToMeeting() {
//     if (!meetingId.trim()) {
//       alert("⚠️ Please enter a Meeting ID");
//       return;
//     }

//     setStatusBox("disconnected", "Connecting...");
//     const ws = new WebSocket(
//       `ws://206.162.244.134:8012/conversations/api/conversation/ws/live-conversation/${meetingId}`
//     );
//     wsRef.current = ws;

//     ws.onopen = () => console.log("WS connected");
//     ws.onmessage = (e) => handleMessage(JSON.parse(e.data));
//     ws.onerror = () => {
//       setStatusBox("disconnected", "Connection error");
//       alert("❌ Failed to connect. Is server running?");
//     };
//     ws.onclose = () => {
//       setStatusBox("disconnected", "Disconnected");
//       setIsConnected(false);
//       disableMic();
//     };
//   }

//   // ─── WS Handler ───────────────────────────────────────
//   function handleMessage(data: any) {
//     console.log("📨", data.type, data);

//     switch (data.type) {
//       case "connected":
//         setIsConnected(true);
//         setStatusBox("connected", "✅ Connected — start speaking!");
//         if (data.representatives) displayReps(data.representatives);
//         addMessage("System", data.message || "Connected.", "message-system");
//         enableMic();
//         setTimeout(() => startListening(), 500);
//         break;

//       case "transcription":
//         addMessage("You 🎙️", data.text, "message-user");
//         break;

//       case "ai_thinking":
//         setStatusBox("thinking", "💭 AI is thinking...");
//         setMicLabel("AI is thinking...");
//         setIsAIReplying(true);
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
//         addMessage("System", `⚠️ ${data.message}`, "message-system");
//         onAllAudioFinished();
//         break;

//       case "no_audio":
//         onAllAudioFinished();
//         break;
//     }
//   }

//   // ─── Mic ──────────────────────────────────────────────
//   function enableMic() {
//     setMicLabel("Your turn — speak now");
//   }

//   function disableMic() {
//     setIsRecording(false);
//   }

//   async function startListening() {
//     if (isRecording || isAIReplying || !isConnected || isPlayingAudioRef.current) return;
//     try {
//       const audioStream = await navigator.mediaDevices.getUserMedia({
//         audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
//       });
//       audioStreamRef.current = audioStream;

//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       audioContextRef.current = audioContext;

//       const source = audioContext.createMediaStreamSource(audioStream);
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 512;
//       source.connect(analyser);
//       analyserRef.current = analyser;

//       const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
//         ? "audio/webm;codecs=opus"
//         : MediaRecorder.isTypeSupported("audio/webm")
//         ? "audio/webm"
//         : "";

//       const mediaRecorder = mimeType
//         ? new MediaRecorder(audioStream, { mimeType })
//         : new MediaRecorder(audioStream);
//       mediaRecorderRef.current = mediaRecorder;

//       let hasSentAudio = false;

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
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
//       setStatusBox("recording", "🎙️ Listening...");
//       setMicLabel("Listening... (auto-stops on silence)");
//       startVolumeMonitor();
//     } catch (err) {
//       console.error("Mic error:", err);
//       addMessage("System", "⚠️ Microphone access denied.", "message-system");
//     }
//   }

//   function stopListening() {
//     if (!isRecording) return;
//     setIsRecording(false);
//     setSilenceCountdown("");
//     mediaRecorderRef.current?.stop();
//     setStatusBox("thinking", "⏳ Processing...");
//     setMicLabel("Processing...");
//   }

//   function toggleRecording() {
//     if (isAIReplying) return;
//     if (isRecording) stopListening();
//     else startListening();
//   }

//   // ─── Volume Monitor ────────────────────────────────────
//   function startVolumeMonitor() {
//     if (!analyserRef.current) return;
//     const analyser = analyserRef.current;
//     const dataArray = new Uint8Array(analyser.frequencyBinCount);
//     let silenceStart: number | null = null;

//     volumeIntervalRef.current = setInterval(() => {
//       analyser.getByteFrequencyData(dataArray);
//       const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

//       if (avg < SILENCE_THRESHOLD) {
//         if (!silenceStart) silenceStart = Date.now();
//         else if (Date.now() - silenceStart >= SILENCE_DELAY_MS) {
//           silenceStart = null;
//           stopVolumeMonitor();
//           stopListening();
//         }
//         setSilenceCountdown(
//           `Sending in ${((SILENCE_DELAY_MS - (Date.now() - (silenceStart || 0))) / 1000).toFixed(1)}s...`
//         );
//       } else {
//         silenceStart = null;
//         setSilenceCountdown("");
//       }
//     }, 100);
//   }

//   function stopVolumeMonitor() {
//     if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
//     volumeIntervalRef.current = null;
//   }

//   // ─── Disconnect ───────────────────────────────────────
//   function disconnect() {
//     stopListening();
//     stopVolumeMonitor();
//     audioQueueRef.current = [];
//     isPlayingAudioRef.current = false;
//     wsRef.current?.send(JSON.stringify({ type: "disconnect" }));
//     wsRef.current?.close();
//     wsRef.current = null;
//     setIsConnected(false);
//     setIsAIReplying(false);
//     setTranscript([]);
//   }

//   // ─── Heartbeat ───────────────────────────────────────
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         wsRef.current.send(JSON.stringify({ type: "ping" }));
//       }
//     }, 25000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center p-8">
//           <h1 className="text-3xl mb-2">🎙️ AI Sales Training</h1>
//           <p className="opacity-90">Speak naturally — AI representatives will auto-detect and reply with voice</p>
//         </div>

//         {/* Content */}
//         <div className="p-8 space-y-6">

//           {/* Setup */}
//           {!isConnected && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">🔌 Connection Setup</h2>
//               <input
//                 type="text"
//                 placeholder="Enter meeting ID..."
//                 className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
//                 value={meetingId}
//                 onChange={(e) => setMeetingId(e.target.value)}
//               />
//               <button
//                 className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
//                 onClick={connectToMeeting}
//               >
//                 🚀 Connect & Start
//               </button>
//             </div>
//           )}

//           {/* Status */}
//           {isConnected && (
//             <div className={`p-4 rounded-lg border-l-4 ${statusColors[status.type]} flex items-center gap-3 font-medium`}>
//               <div className={`w-3 h-3 rounded-full ${status.type === "disconnected" ? "bg-red-600" : "bg-green-600"} animate-pulse`}></div>
//               {status.text}
//             </div>
//           )}

//           {/* Reps */}
//           {isConnected && reps.length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">👥 AI Representatives</h2>
//               <div className="flex flex-wrap gap-3">
//                 {reps.map((rep) => (
//                   <div
//                     key={rep.id}
//                     className={`p-3 rounded-lg border-l-4 flex-1 min-w-[180px] ${
//                       repSpeaking[rep.id] ? "border-purple-600 bg-purple-100 animate-pulse" : "border-orange-500 bg-orange-100"
//                     }`}
//                   >
//                     <h3 className="text-orange-700 mb-1">{rep.name}</h3>
//                     <p><strong>Role:</strong> {rep.role}</p>
//                     <p><strong>Personality:</strong> {Array.isArray(rep.personality) ? rep.personality.join(", ") : rep.personality}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Mic */}
//           {isConnected && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">🎤 Voice Conversation</h2>
//               <div className="flex flex-col items-center gap-4">
//                 <button
//                   className={`w-20 h-20 rounded-full text-white text-2xl flex items-center justify-center shadow-lg ${
//                     isRecording ? "bg-red-600" : "bg-gradient-to-br from-indigo-500 to-purple-600"
//                   }`}
//                   onClick={toggleRecording}
//                 >
//                   🎤
//                 </button>
//                 <div>{micLabel}</div>
//                 <div>{silenceCountdown}</div>
//                 <button className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg" onClick={disconnect}>
//                   ⏹️ End Conversation
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Transcript */}
//           {isConnected && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">📜 Conversation Transcript</h2>
//               <div className="bg-gray-100 rounded-lg p-4 max-h-[420px] overflow-y-auto space-y-3">
//                 {transcript.length === 0 && <div className="text-gray-400 text-center italic">Start speaking — transcript will appear here.</div>}
//                 {transcript}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";

import { useEffect, useRef, useState } from "react";

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

// interface Window {
//   webkitAudioContext?: typeof AudioContext;
// }

export default function LiveConversation() {
  // ─── State ─────────────────────────────────────────────
  const [meetingId, setMeetingId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAIReplying, setIsAIReplying] = useState(false);
  const [status, setStatus] = useState({ type: "disconnected", text: "Disconnected" });
  const [micLabel, setMicLabel] = useState("Connecting...");
  const [silenceCountdown, setSilenceCountdown] = useState("");
  // const [transcript, setTranscript] = useState<JSX.Element[]>([]);
  const [transcript, setTranscript] = useState<React.ReactElement[]>([]);
  const [reps, setReps] = useState<Rep[]>([]);
  const [repSpeaking, setRepSpeaking] = useState<{ [key: string]: boolean }>({});

  // ─── Refs ─────────────────────────────────────────────
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // const volumeIntervalRef = useRef<NodeJS.Timer | null>(null);
  // const volumeIntervalRef = useRef<number | null>(null);
  // Node.js/React context: Timeout type use করো
  const volumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioQueueRef = useRef<AudioQueueItem[]>([]);
  const isPlayingAudioRef = useRef(false);

  const SILENCE_DELAY_MS = 1500;
  const SILENCE_THRESHOLD = 8;

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

    if (isRecording) stopListening(); // stop mic while AI speaking

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

  function onAllAudioFinished() {
    setIsAIReplying(false);
    setStatusBox("connected", "✅ Your turn — speak now");
    setMicLabel("Your turn — speak now");
    setSilenceCountdown("");
    setTimeout(() => startListening(), 800);
  }

  // ─── Connect ──────────────────────────────────────────
  function connectToMeeting() {
    if (!meetingId.trim()) {
      alert("⚠️ Please enter a Meeting ID");
      return;
    }

    setStatusBox("disconnected", "Connecting...");
    const ws = new WebSocket(
      `ws://206.162.244.134:8012/conversations/api/conversation/ws/live-conversation/${meetingId}`
    );
    wsRef.current = ws;

    ws.onopen = () => console.log("WS connected");
    ws.onmessage = (e) => handleMessage(JSON.parse(e.data));
    ws.onerror = () => {
      setStatusBox("disconnected", "Connection error");
      alert("❌ Failed to connect. Is server running?");
    };
    ws.onclose = () => {
      setStatusBox("disconnected", "Disconnected");
      setIsConnected(false);
      disableMic();
    };
  }

  // ─── WS Handler ───────────────────────────────────────
  function handleMessage(data: any) {
    console.log("📨", data.type, data);

    switch (data.type) {
      case "connected":
        setIsConnected(true);
        setStatusBox("connected", "✅ Connected — start speaking!");
        if (data.representatives) displayReps(data.representatives);
        addMessage("System", data.message || "Connected.", "message-system");
        enableMic();
        setTimeout(() => startListening(), 500);
        break;

      case "transcription":
        addMessage("You 🎙️", data.text, "message-user");
        break;

      case "ai_thinking":
        setStatusBox("thinking", "💭 AI is thinking...");
        setMicLabel("AI is thinking...");
        setIsAIReplying(true);
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
  }

  async function startListening() {
    if (isRecording || isAIReplying || !isConnected || isPlayingAudioRef.current) return;
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      audioStreamRef.current = audioStream;

      // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // audioContextRef.current = audioContext;
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
      setStatusBox("recording", "🎙️ Listening...");
      setMicLabel("Listening... (auto-stops on silence)");
      startVolumeMonitor();
    } catch (err) {
      console.error("Mic error:", err);
      addMessage("System", "⚠️ Microphone access denied.", "message-system");
    }
  }

  function stopListening() {
    if (!isRecording) return;
    setIsRecording(false);
    setSilenceCountdown("");
    mediaRecorderRef.current?.stop();
    setStatusBox("thinking", "⏳ Processing...");
    setMicLabel("Processing...");
  }

  function toggleRecording() {
    if (isAIReplying) return;
    if (isRecording) stopListening();
    else startListening();
  }

  // ─── Volume Monitor ────────────────────────────────────
  // function startVolumeMonitor() {
  //   if (!analyserRef.current) return;
  //   const analyser = analyserRef.current;
  //   const dataArray = new Uint8Array(analyser.frequencyBinCount);
  //   let silenceStart: number | null = null;

  //   volumeIntervalRef.current = setInterval(() => {
  //     analyser.getByteFrequencyData(dataArray);
  //     const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  //     if (avg < SILENCE_THRESHOLD) {
  //       if (!silenceStart) silenceStart = Date.now();
  //       else if (Date.now() - silenceStart >= SILENCE_DELAY_MS) {
  //         silenceStart = null;
  //         stopVolumeMonitor();
  //         stopListening();
  //       }
  //       setSilenceCountdown(
  //         `Sending in ${((SILENCE_DELAY_MS - (Date.now() - (silenceStart || 0))) / 1000).toFixed(1)}s...`
  //       );
  //     } else {
  //       silenceStart = null;
  //       setSilenceCountdown("");
  //     }
  //   }, 100);
  // }

  let silenceStart: number | null = null;

  function startVolumeMonitor() {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    volumeIntervalRef.current = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (avg < SILENCE_THRESHOLD) {
        if (!silenceStart) silenceStart = Date.now();
        else if (Date.now() - silenceStart >= SILENCE_DELAY_MS) {
          silenceStart = null;
          stopVolumeMonitor();
          stopListening();
        }
        setSilenceCountdown(
          `Sending in ${((SILENCE_DELAY_MS - (Date.now() - (silenceStart || 0))) / 1000).toFixed(1)}s...`
        );
      } else {
        silenceStart = null;
        setSilenceCountdown("");
      }
    }, 100);
  }

  function stopVolumeMonitor() {
    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    volumeIntervalRef.current = null;
  }

  // ─── Disconnect ───────────────────────────────────────
  function disconnect() {
    stopListening();
    stopVolumeMonitor();
    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;
    wsRef.current?.send(JSON.stringify({ type: "disconnect" }));
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
    setIsAIReplying(false);
    setTranscript([]);
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center p-8">
          <h1 className="text-3xl mb-2">🎙️ AI Sales Training</h1>
          <p className="opacity-90">Speak naturally — AI representatives will auto-detect and reply with voice</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">

          {/* Setup */}
          {!isConnected && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">🔌 Connection Setup</h2>
              <input
                type="text"
                placeholder="Enter meeting ID..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
              />
              <button
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                onClick={connectToMeeting}
              >
                🚀 Connect & Start
              </button>
            </div>
          )}

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
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">👥 AI Representatives</h2>
              <div className="flex flex-wrap gap-3">
                {reps.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-3 rounded-lg border-l-4 flex-1 min-w-[180px] ${repSpeaking[rep.id] ? "border-purple-600 bg-purple-100 animate-pulse" : "border-orange-500 bg-orange-100"
                      }`}
                  >
                    <h3 className="text-orange-700 mb-1">{rep.name}</h3>
                    <p><strong>Role:</strong> {rep.role}</p>
                    <p><strong>Personality:</strong> {Array.isArray(rep.personality) ? rep.personality.join(", ") : rep.personality}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mic */}
          {isConnected && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">🎤 Voice Conversation</h2>
              <div className="flex flex-col items-center gap-4">
                <button
                  className={`w-20 h-20 rounded-full text-white text-2xl flex items-center justify-center shadow-lg ${isRecording ? "bg-red-600" : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    }`}
                  onClick={toggleRecording}
                >
                  🎤
                </button>
                <div>{micLabel}</div>
                <div>{silenceCountdown}</div>
                <button className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg" onClick={disconnect}>
                  ⏹️ End Conversation
                </button>
              </div>
            </div>
          )}

          {/* Transcript */}
          {isConnected && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">📜 Conversation Transcript</h2>
              <div className="bg-gray-100 rounded-lg p-4 max-h-[420px] overflow-y-auto space-y-3">
                {transcript.length === 0 && <div className="text-gray-400 text-center italic">Start speaking — transcript will appear here.</div>}
                {transcript}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}