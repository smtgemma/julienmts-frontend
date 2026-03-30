
// "use client";

// import { Play } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import Cookies from "js-cookie";
// import { toast } from "sonner";
// import { FaUsersGear } from "react-icons/fa6";


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

// // interface Window {
// //   webkitAudioContext?: typeof AudioContext;
// // }

// export default function LiveConversation({ handlePrev }: { handlePrev: () => void }) {
//   // ─── State ─────────────────────────────────────────────
//   // const [meetingId, setMeetingId] = useState("");
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
//   // const volumeIntervalRef = useRef<NodeJS.Timer | null>(null);
//   // const volumeIntervalRef = useRef<number | null>(null);
//   // Node.js/React context: Timeout type use করো
//   const volumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
//               ? "🤖"
//               : "ℹ️"}{" "}
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

//   // async function connectToMeeting() {
//   //   try {
//   //     // 1️⃣ Get meetingId from cookies
//   //     const meetingId = Cookies.get("meetingId")?.trim() || "";

//   //     if (!meetingId) {
//   //       toast.error("⚠️ Meeting ID not found");
//   //       return;
//   //     }

//   //     // 2️⃣ Update UI status
//   //     setStatusBox("disconnected", "Connecting...");

//   //     // 3️⃣ Start meeting API
//   //     const response = await fetch(
//   //       // `http://206.162.244.134:8012/meetings/api/meeting/${meetingId}/start`,
//   //       `http://148.230.93.55:8012/meetings/api/meeting/${meetingId}/start`,
//   //       {
//   //         method: "POST",
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to start meeting");
//   //     }

//   //     toast.success("Meeting started successfully");

//   //     // 4️⃣ Close previous socket if exists
//   //     if (wsRef.current) {
//   //       wsRef.current.close();
//   //     }

//   //     // 5️⃣ Create WebSocket connection
//   //     const ws = new WebSocket(
//   //       `ws://148.230.93.55:8012/conversations/api/conversation/ws/live-conversation/${meetingId}`
//   //     );

//   //     wsRef.current = ws;

//   //     // 6️⃣ WebSocket events
//   //     ws.onopen = () => {
//   //       console.log("✅ WebSocket connected");
//   //       setIsConnected(true);
//   //     };

//   //     ws.onmessage = (event) => {
//   //       const data = JSON.parse(event.data);
//   //       handleMessage(data);
//   //     };

//   //     ws.onerror = () => {
//   //       toast.error("❌ WebSocket connection error");
//   //       setStatusBox("disconnected", "Connection error");
//   //     };

//   //     ws.onclose = () => {
//   //       console.log("❌ WebSocket disconnected");
//   //       setStatusBox("disconnected", "Disconnected");
//   //       setIsConnected(false);
//   //       disableMic();
//   //       toast.error("Connection closed");
//   //     };

//   //   } catch (error: any) {
//   //     console.error("Connect meeting error:", error);
//   //     toast.error(error.detail || "Something went wrong");
//   //   }
//   // }



//   async function connectToMeeting() {
//     try {
//       // 1️⃣ Get meetingId from cookies
//       const meetingId = Cookies.get("meetingId")?.trim() || "";

//       if (!meetingId) {
//         toast.error("⚠️ Meeting ID not found");
//         return;
//       }

//       // 2️⃣ Update UI status
//       setStatusBox("disconnected", "Connecting...");

//       // 3️⃣ Start meeting API
//       const response = await fetch(
//         `http://148.230.93.55:8012/meetings/api/meeting/${meetingId}/start`,
//         { method: "POST" }
//       );

//       if (!response.ok) {
//         // Parse server JSON for detail/message
//         const errData = await response.json().catch(() => null);
//         const message = errData?.detail || errData?.message || "Failed to start meeting";
//         throw new Error(message);
//       }

//       toast.success("✅ Meeting started successfully");

//       // 4️⃣ Close previous socket if exists
//       if (wsRef.current) {
//         wsRef.current.close();
//       }

//       // 5️⃣ Create WebSocket connection
//       const ws = new WebSocket(
//         `ws://148.230.93.55:8012/conversations/api/conversation/ws/live-conversation/${meetingId}`
//       );

//       wsRef.current = ws;

//       // 6️⃣ WebSocket events
//       ws.onopen = () => {
//         console.log("✅ WebSocket connected");
//         setIsConnected(true);
//       };

//       ws.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         handleMessage(data);
//       };

//       ws.onerror = (err) => {
//         console.error("WebSocket error:", err);
//         toast.error("❌ WebSocket connection error");
//         setStatusBox("disconnected", "Connection error");
//       };

//       ws.onclose = () => {
//         console.log("❌ WebSocket disconnected");
//         setStatusBox("disconnected", "Disconnected");
//         setIsConnected(false);
//         disableMic();
//         toast.error("❌ Connection closed");
//       };

//     } catch (error: any) {
//       console.error("Connect meeting error:", error);

//       // ✅ Show proper error message from server detail if exists
//       const message = error instanceof Error ? error.message : JSON.stringify(error);
//       toast.error(`❌ ${message}, You have to create new meeting from before step`);
//     }
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

//       // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       // audioContextRef.current = audioContext;
//       const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
//       const audioContext = new AudioContextClass();
//       audioContextRef.current = audioContext;

//       const source = audioContext.createMediaStreamSource(audioStream);
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 512;
//       source.connect(analyser);
//       analyserRef.current = analyser;

//       const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
//         ? "audio/webm;codecs=opus"
//         : MediaRecorder.isTypeSupported("audio/webm")
//           ? "audio/webm"
//           : "";

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
//   // function startVolumeMonitor() {
//   //   if (!analyserRef.current) return;
//   //   const analyser = analyserRef.current;
//   //   const dataArray = new Uint8Array(analyser.frequencyBinCount);
//   //   let silenceStart: number | null = null;

//   //   volumeIntervalRef.current = setInterval(() => {
//   //     analyser.getByteFrequencyData(dataArray);
//   //     const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

//   //     if (avg < SILENCE_THRESHOLD) {
//   //       if (!silenceStart) silenceStart = Date.now();
//   //       else if (Date.now() - silenceStart >= SILENCE_DELAY_MS) {
//   //         silenceStart = null;
//   //         stopVolumeMonitor();
//   //         stopListening();
//   //       }
//   //       setSilenceCountdown(
//   //         `Sending in ${((SILENCE_DELAY_MS - (Date.now() - (silenceStart || 0))) / 1000).toFixed(1)}s...`
//   //       );
//   //     } else {
//   //       silenceStart = null;
//   //       setSilenceCountdown("");
//   //     }
//   //   }, 100);
//   // }

//   let silenceStart: number | null = null;

//   function startVolumeMonitor() {
//     if (!analyserRef.current) return;
//     const analyser = analyserRef.current;
//     const dataArray = new Uint8Array(analyser.frequencyBinCount);

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
//   // function disconnect() {
//   //   stopListening();
//   //   stopVolumeMonitor();
//   //   audioQueueRef.current = [];
//   //   isPlayingAudioRef.current = false;
//   //   wsRef.current?.send(JSON.stringify({ type: "disconnect" }));
//   //   wsRef.current?.close();
//   //   wsRef.current = null;
//   //   setIsConnected(false);
//   //   setIsAIReplying(false);
//   //   setTranscript([]);
//   // }

//   async function disconnect() {
//     try {
//       const meetingId = Cookies.get("meetingId")?.trim() || "";

//       // 1️⃣ End meeting API
//       const response = await fetch(
//         // `http://206.162.244.134:8012/meetings/api/meeting/${meetingId}/end`,
//         `http://148.230.93.55:8012/meetings/api/meeting/${meetingId}/end`,
//         {
//           method: "POST",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to end meeting");
//       }

//       toast.success("Meeting ended successfully");

//       // 2️⃣ Stop voice features
//       stopListening();
//       stopVolumeMonitor();

//       // 3️⃣ Reset audio queue
//       audioQueueRef.current = [];
//       isPlayingAudioRef.current = false;

//       // 4️⃣ Disconnect websocket
//       if (wsRef.current) {
//         wsRef.current.send(JSON.stringify({ type: "disconnect" }));
//         wsRef.current.close();
//         wsRef.current = null;
//       }

//       // 5️⃣ Reset states
//       setIsConnected(false);
//       setIsAIReplying(false);
//       setTranscript([]);

//     } catch (error) {
//       console.error("Disconnect error:", error);
//     }
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
//     <div className="flex justify-center items-center">
//       <div className="bg-white w-full border border-[#6E51E0] rounded-xl p-6">
//         {/* Setup */}
//         {!isConnected && (
//           <div>
//             {/* Play Icon */}
//             <div className="flex justify-center mb-6">
//               <div className="w-20 h-20 bg-[#6E51E0] rounded-full flex items-center justify-center">
//                 <Play className="w-8 h-8 text-white" />
//               </div>
//             </div>
//             {/* Header */}
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-medium text-[#2D2D2D] mb-2">
//                 Ready to Start Simulation?
//               </h1>
//               <p className="text-[#636F85] text-[16px]">
//                 Your AI-powered meeting is configured and ready to begin
//               </p>
//             </div>
//             <div className="max-w-2xl mx-auto">
//               {/* meeting summery  */}
//               <div className="bg-[#F9FAFB] rounded-lg shadow-sm p-6 mb-6">
//                 {/* কার্ডের হেডার */}
//                 <h2 className="text-xl font-semibold text-[#2D2D2D] mb-5">
//                   Meeting Summary
//                 </h2>

//                 {/* বিস্তারিত তথ্য */}
//                 <div className="space-y-3">
//                   {/* Goal */}
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#636F85]">Goal:</span>
//                     <span className="text-[#2D2D2D] text-[16px]">Book a Demo</span>
//                   </div>

//                   {/* Methodology */}
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#636F85]">Methodology:</span>
//                     <span className="text-[#2D2D22] text-[16px]">SPIN</span>
//                   </div>

//                   {/* Duration */}
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#636F85]">Duration:</span>
//                     <span className="text-[#2D2D2D] text-[16px]">30 minutes</span>
//                   </div>

//                   {/* Participants */}
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#636F85]">Participants:</span>
//                     <span className="text-[#2D2D2D] text-[16px]">2</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-between">
//                 <button
//                   onClick={handlePrev}
//                   className="px-6 py-2 border border-gray-300 rounded-md cursor-pointer"
//                 >
//                   Back
//                 </button>

//                 <button
//                   // onClick={handleStartMeeting}
//                   onClick={connectToMeeting}
//                   className="px-6 py-2 bg-[#6E51E0] text-white rounded-md cursor-pointer"
//                 >
//                   Start Meeting
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Content */}
//         <div className="p-8 space-y-6">
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
//               <div className="flex items-center gap-2">
//                 <FaUsersGear size={20} className="text-[#6E51E0] -mt-4" />
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#6E51E0]"> AI Representatives</h2>
//               </div>
//               <div className="flex flex-wrap gap-3">
//                 {reps.map((rep) => (
//                   <div
//                     key={rep.id}
//                     className={`p-3 rounded-lg flex-1 min-w-[180px] 
//         ${repSpeaking[rep.id]
//                         ? "border-4 border-purple-600 bg-purple-200 animate-pulse shadow-lg shadow-purple-400/50"
//                         : "border-l-4 border-orange-500 bg-orange-100"
//                       } transition-all duration-300 ease-in-out`}
//                   >
//                     <h3 className={`${repSpeaking[rep.id] ? "text-purple-800 font-bold" : "text-orange-700"} mb-1`}>
//                       {rep.name}
//                     </h3>
//                     <p><strong>Role:</strong> {rep.role}</p>
//                     <p>
//                       <strong>Personality:</strong> {Array.isArray(rep.personality) ? rep.personality.join(", ") : rep.personality}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Mic */}
//           {isConnected && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2"> Voice Conversation</h2>
//               <div className="flex flex-col items-center gap-4">
//                 <button
//                   className={`w-20 h-20 rounded-full text-white text-2xl flex items-center justify-center shadow-lg cursor-pointer 
//     ${isRecording
//                       ? "bg-red-600 animate-pulse shadow-red-400/50" // when recording/speaking
//                       : "bg-gradient-to-br from-indigo-500 to-purple-600" // idle state
//                     } transition-all duration-300 ease-in-out`}
//                   onClick={toggleRecording}
//                 >
//                   🎤
//                 </button>
//                 <div>{micLabel}</div>
//                 <div>{silenceCountdown}</div>
//                 <button className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer" onClick={disconnect}>
//                   End Conversation
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Transcript */}
//           {isConnected && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">Conversation Transcript</h2>
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

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { FaUsersGear } from "react-icons/fa6";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";


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
  console.log(allData?.payloadData, "============all data")
  const { meeting_goal, duration_minutes, sales_methodology, representatives } = allData?.payloadData || {}

  // ─── State ─────────────────────────────────────────────
  // const [meetingId, setMeetingId] = useState("");
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

  async function connectToMeeting() {
    try {
      // 1️⃣ Get meetingId from cookies
      const meetingId = Cookies.get("meetingId")?.trim() || "";
      console.log(meetingId, "=================meeting id in connect to meeting function");

      if (!meetingId) {
        toast.error("⚠️ Meeting ID not found");
        return;
      }

      // 2️⃣ Update UI status
      setStatusBox("disconnected", "Connecting...");

      // 3️⃣ Start meeting API
      const response = await fetch(
        // `http://148.230.93.55:8012/meetings/api/meeting/${meetingId}/start`,
        // `https://richelle-nonfictive-derivationally.ngrok-free.dev/meetings/api/meeting/${meetingId}/start`,
        // `http://206.162.244.134:8012/meetings/api/meeting/${meetingId}/start`,
        `https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/start`,
        { method: "POST" }
      );

      if (!response.ok) {
        // Parse server JSON for detail/message
        const errData = await response.json().catch(() => null);
        const message = errData?.detail || errData?.message || "Failed to start meeting";
        throw new Error(message);
      }

      toast.success("✅ Meeting started successfully");

      // 4️⃣ Close previous socket if exists
      if (wsRef.current) {
        wsRef.current.close();
      }

      // 5️⃣ Create WebSocket connection
      const ws = new WebSocket(
        // `ws://148.230.93.55:8012/conversations/api/conversation/ws/live-conversation/${meetingId}`
        // `https://richelle-nonfictive-derivationally.ngrok-free.dev/conversations/api/conversation/ws/live-conversation/${meetingId}`
        // `http://206.162.244.134:8012/conversations/api/conversation/ws/live-conversation/${meetingId}`
        `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
      );

      wsRef.current = ws;

      // 6️⃣ WebSocket events
      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        setIsConnected(true);
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
        disableMic();
        toast.error("❌ Connection closed");
      };

    } catch (error: any) {
      console.error("Connect meeting error:", error);

      // ✅ Show proper error message from server detail if exists
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

  async function disconnect() {
    try {
      const meetingId = Cookies.get("meetingId")?.trim() || "";

      // 1️⃣ End meeting API
      const response = await fetch(
        // `http://206.162.244.134:8012/meetings/api/meeting/${meetingId}/end`,
        // `http://148.230.93.55:8012/meetings/api/meeting/${meetingId}/end`,
        // `https://richelle-nonfictive-derivationally.ngrok-free.dev/meetings/api/meeting/${meetingId}/end`,
        // `http://206.162.244.134:8012/meetings/api/meeting/${meetingId}/end`,
        `https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/end`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to end meeting");
      }

      // toast.success("Meeting ended successfully");

      // 2️⃣ Stop voice features
      stopListening();
      stopVolumeMonitor();

      // 3️⃣ Reset audio queue
      audioQueueRef.current = [];
      isPlayingAudioRef.current = false;

      // 4️⃣ Disconnect websocket
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: "disconnect" }));
        wsRef.current.close();
        wsRef.current = null;
      }

      // 5️⃣ Reset states
      setIsConnected(false);
      setIsAIReplying(false);
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
                {/* কার্ডের হেডার */}
                <h2 className="text-xl font-semibold text-[#2D2D2D] mb-5">
                  Meeting Summary
                </h2>

                {/* বিস্তারিত তথ্য */}
                <div className="space-y-3">
                  {/* Goal */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#636F85]">Goal:</span>
                    <span className="text-[#2D2D2D] text-[16px]">{meeting_goal || "N/A"}</span>
                  </div>

                  {/* Methodology */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#636F85]">Methodology:</span>
                    <span className="text-[#2D2D22] text-[16px]">{sales_methodology || "N/A"}</span>
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#636F85]">Duration:</span>
                    <span className="text-[#2D2D2D] text-[16px]">{duration_minutes || "0"} minutes</span>
                  </div>

                  {/* Participants */}
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
                  // onClick={handleStartMeeting}
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
                <button
                  className={`w-20 h-20 rounded-full text-white text-2xl flex items-center justify-center shadow-lg cursor-pointer 
    ${isRecording
                      ? "bg-red-600 animate-pulse shadow-red-400/50" // when recording/speaking
                      : "bg-gradient-to-br from-indigo-500 to-purple-600" // idle state
                    } transition-all duration-300 ease-in-out`}
                  onClick={toggleRecording}
                >
                  🎤
                </button>
                <div>{micLabel}</div>
                <div>{silenceCountdown}</div>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer" onClick={disconnect}>
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