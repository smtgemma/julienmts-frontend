

// "use client";

// import { Play, User } from "lucide-react";
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

// type TranscriptMessage = {
//   id: number;
//   speaker: string;
//   text: string;
//   type: 'user' | 'ai-primary' | 'ai-secondary' | 'system';
//   timestamp: string;
// };

// export default function LiveConversation({ handlePrev }: { handlePrev: () => void }) {

//   // get all data form redux 
//   const allData = useSelector((state: RootState) => state.startMeeting);
//   // console.log(allData?.payloadData, "============all data")
//   const { meeting_goal, duration_minutes, sales_methodology, representatives } = allData?.payloadData || {}

//   const [updateMeeting] = useUpdateMeetingMutation()

//   // ─── State ─────────────────────────────────────────────
//   const [isConnected, setIsConnected] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isAIReplying, setIsAIReplying] = useState(false);
//   const [status, setStatus] = useState({ type: "disconnected", text: "Disconnected" });
//   const [micLabel, setMicLabel] = useState("Connecting...");
//   const [silenceCountdown, setSilenceCountdown] = useState("");
//   const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
//   const [reps, setReps] = useState<Rep[]>([]);
//   const [repSpeaking, setRepSpeaking] = useState<{ [key: string]: boolean }>({});

//   // ─── Refs ─────────────────────────────────────────────
//   const wsRef = useRef<WebSocket | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioStreamRef = useRef<MediaStream | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const volumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const audioQueueRef = useRef<AudioQueueItem[]>([]);
//   const isPlayingAudioRef = useRef(false);
//   const transcriptEndRef = useRef<HTMLDivElement | null>(null);

//   // ─── AI Response Buffer (accumulates streaming words into one message) ───
//   const aiResponseBufferRef = useRef<{
//     speaker: string;
//     text: string;
//     type: TranscriptMessage['type'];
//   } | null>(null);

//   // ✅ FIX: silenceStart as a ref to avoid closure bug
//   const silenceStartRef = useRef<number | null>(null);

//   const isRecordingRef = useRef(false);
//   const isAIReplyingRef = useRef(false);
//   const isConnectedRef = useRef(false);
//   const isNewUserTurnRef = useRef(true);
//   const hasDetectedVoiceRef = useRef(false);
//   const startTimeRef = useRef<number | null>(null);

//   const SILENCE_DELAY_MS = 3000;
//   const SILENCE_THRESHOLD = 10;

//   // ─── Sync refs with state ─────────────────────────────
//   useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);
//   useEffect(() => { isAIReplyingRef.current = isAIReplying; }, [isAIReplying]);
//   useEffect(() => { isConnectedRef.current = isConnected; }, [isConnected]);

//   // ─── Auto-scroll transcript to bottom ─────────────────
//   useEffect(() => {
//     if (transcriptEndRef.current) {
//       transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [transcript]);

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
//     flushAIBuffer();
//     const msgType: TranscriptMessage['type'] =
//       cssClass === "message-user" ? "user"
//         : cssClass === "message-ai-primary" ? "ai-primary"
//           : cssClass === "message-ai-secondary" ? "ai-secondary"
//             : "system";

//     setTranscript((prev) => [
//       ...prev,
//       {
//         id: prev.length,
//         speaker,
//         text,
//         type: msgType,
//         timestamp: getRelativeTimestamp(),
//       },
//     ]);
//   }

//   function getRelativeTimestamp() {
//     return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }

//   // Flush the AI response buffer into the transcript (Updates last message if same speaker)
//   function flushAIBuffer() {
//     const buf = aiResponseBufferRef.current;
//     if (!buf || !buf.text.trim()) return;

//     setTranscript((prev) => {
//       const lastMsg = prev[prev.length - 1];
//       // If the last message was from the same AI speaker, update its text instead of adding a new bubble
//       if (lastMsg && lastMsg.speaker === buf.speaker && lastMsg.type === buf.type) {
//         const updated = [...prev];
//         updated[updated.length - 1] = {
//           ...lastMsg,
//           text: buf.text.trim(),
//         };
//         return updated;
//       }

//       // Otherwise, create a new AI message bubble
//       return [
//         ...prev,
//         {
//           id: prev.length,
//           speaker: buf.speaker,
//           text: buf.text.trim(),
//           type: buf.type,
//           timestamp: getRelativeTimestamp(),
//         },
//       ];
//     });
//     // We clear the buffer so next text segments start fresh if speaker changes,
//     // but the next turn's ai_response_text will repopulate it.
//     // Actually, to keep accumulating across ALL chunks of one turn, we should only clear on turn change.
//     // But since we UPSERT into the transcript, it's safe to clear here as long as ai_response_text 
//     // for the next chunk includes the full text (if cumulative) or we keep it.
//     // Let's keep the buffer until a non-AI event happens.
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

//     // ✅ Stop mic while AI is speaking
//     if (isRecordingRef.current) stopListening();

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

//   // ✅ Auto-restart listening after AI finishes — natural conversation flow
//   function onAllAudioFinished() {
//     flushAIBuffer();
//     isNewUserTurnRef.current = true;
//     setIsAIReplying(false);
//     isAIReplyingRef.current = false;
//     setStatusBox("connected", "✅ Your turn — speak now");
//     setMicLabel("Your turn — speak now");
//     setSilenceCountdown("");
//     // Auto-start listening so user doesn't need to click anything
//     setTimeout(() => {
//       if (isConnectedRef.current && !isRecordingRef.current) {
//         startListening();
//       }
//     }, 800);
//   }

//   async function connectToMeeting() {
//     try {
//       const meetingId = Cookies.get("meetingId")?.trim() || "";
//       console.log(meetingId, "=================meeting id in connect to meeting function");

//       if (!meetingId) {
//         toast.error("⚠️ Meeting ID not found");
//         return;
//       }

//       setStatusBox("disconnected", "Connecting...");

//       const response = await fetch(
//         // `https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/start`,
//         // `http://206.162.244.175:8012/meetings/api/meeting/${meetingId}/start`,
//         `https://ai-julientmts.aiteamtwo.com/api/meeting/${meetingId}/start`,
//         { method: "POST" }
//       );

//       if (!response.ok) {
//         const errData = await response.json().catch(() => null);
//         const message = errData?.detail || errData?.message || "Failed to start meeting";
//         throw new Error(message);
//       }

//       toast.success("✅ Meeting started successfully");

//       if (wsRef.current) {
//         wsRef.current.close();
//       }

//       const ws = new WebSocket(
//         // `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
//         // `http://206.162.244.175:8012/conversations/api/conversation/ws/live-conversation/${meetingId}`
//         `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
//         // `ws://localhost:8000/conversations/api/conversation/ws/realtime/${meetingId}`
//       );

//       wsRef.current = ws;

//       ws.onopen = () => {
//         console.log("✅ WebSocket connected");
//         startTimeRef.current = Date.now();
//         setIsConnected(true);
//         isConnectedRef.current = true;
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
//         flushAIBuffer();
//         console.log("❌ WebSocket disconnected");
//         setStatusBox("disconnected", "Disconnected");
//         setIsConnected(false);
//         isConnectedRef.current = false;
//         disableMic();
//         // toast.error("❌ Connection closed");
//         toast.success("✅ Meeting ended successfully");
//       };

//     } catch (error: any) {
//       console.error("Connect meeting error:", error);
//       const message = error instanceof Error ? error.message : JSON.stringify(error);
//       toast.error(`❌ ${message}, You have to create new meeting from before step`);
//     }
//   }

//   // ─── WS Handler ───────────────────────────────────────
//   function handleMessage(data: any) {
//     console.log("📨", data.type, data);

//     switch (data.type) {
//       case "connected":
//         startTimeRef.current = Date.now();
//         flushAIBuffer();
//         setIsConnected(true);
//         isConnectedRef.current = true;
//         setStatusBox("connected", "✅ Connected — start speaking!");
//         if (data.representatives) displayReps(data.representatives);
//         addMessage("System", data.message || "Connected.", "message-system");
//         enableMic();
//         // ✅ Auto-start listening immediately on connect
//         setTimeout(() => startListening(), 500);
//         break;

//       case "transcription":
//         // Live-update the user message bubble
//         const cleanText = data.text?.trim() || "";
//         if (!cleanText) break;

//         setTranscript((prev) => {
//           const lastMsg = prev[prev.length - 1];

//           // If it's a new turn or the last message isn't from the user, create a new bubble
//           if (isNewUserTurnRef.current || !lastMsg || lastMsg.type !== "user") {
//             isNewUserTurnRef.current = false;
//             return [
//               ...prev,
//               {
//                 id: prev.length,
//                 speaker: "You",
//                 text: cleanText,
//                 type: "user",
//                 timestamp: getRelativeTimestamp(),
//               },
//             ];
//           }

//           // Otherwise, update the current bubble
//           const updated = [...prev];
//           updated[updated.length - 1] = {
//             ...lastMsg,
//             text: cleanText, // Cumulative text
//           };
//           return updated;
//         });
//         break;

//       case "ai_thinking":
//         // Flush any AI buffer before AI turn starts
//         isNewUserTurnRef.current = true;
//         flushAIBuffer();
//         setStatusBox("thinking", "💭 AI is thinking...");
//         setMicLabel("AI is thinking...");
//         setIsAIReplying(true);
//         isAIReplyingRef.current = true;
//         // ✅ Stop mic while AI thinks
//         if (isRecordingRef.current) stopListening();
//         break;

//       case "ai_response_text": {
//         isNewUserTurnRef.current = true;
//         const aiMsgType: TranscriptMessage['type'] = data.is_primary ? "ai-primary" : "ai-secondary";
//         const currentBuf = aiResponseBufferRef.current;

//         // If speaker changed, flush and clear first
//         if (currentBuf && (currentBuf.speaker !== data.speaker_name || currentBuf.type !== aiMsgType)) {
//           flushAIBuffer();
//           aiResponseBufferRef.current = null;
//         }

//         // Accumulate text into buffer
//         if (aiResponseBufferRef.current) {
//           aiResponseBufferRef.current.text += " " + data.text;
//         } else {
//           aiResponseBufferRef.current = {
//             speaker: data.speaker_name,
//             text: data.text,
//             type: aiMsgType,
//           };
//         }

//         // Live-flush to UI so user can read while AI speaks
//         flushAIBuffer();
//         break;
//       }

//       case "ai_audio_complete":
//         // Final flush for this audio segment
//         flushAIBuffer();
//         enqueueAudio({
//           base64: data.audio_data,
//           mimeType: data.audio_mime_type || "audio/mpeg",
//           repId: data.speaker_id,
//           speakerName: data.speaker_name,
//           isPrimary: data.is_primary,
//         });
//         break;

//       case "error":
//         flushAIBuffer();
//         addMessage("System", `⚠️ ${data.message}`, "message-system");
//         onAllAudioFinished();
//         break;

//       case "no_audio":
//         flushAIBuffer();
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
//     isRecordingRef.current = false;
//   }

//   async function startListening() {
//     // ✅ Use refs for reliable state check inside async/callbacks
//     if (isRecordingRef.current || isAIReplyingRef.current || !isConnectedRef.current || isPlayingAudioRef.current) return;

//     isNewUserTurnRef.current = true;
//     hasDetectedVoiceRef.current = false;
//     try {
//       const audioStream = await navigator.mediaDevices.getUserMedia({
//         audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 48000 },
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
//         if (wsRef.current?.readyState === WebSocket.OPEN && hasSentAudio && hasDetectedVoiceRef.current) {
//           wsRef.current.send(JSON.stringify({ type: "audio_chunk", data: "", is_speaking: false }));
//         } else {
//           // If no voice was detected, don't trigger AI, just reset for next try
//           if (isConnectedRef.current && !isAIReplyingRef.current) {
//             setTimeout(() => startListening(), 500);
//           }
//         }
//         audioStream.getTracks().forEach((t) => t.stop());
//         audioContext.close();
//         stopVolumeMonitor();
//       };

//       mediaRecorder.start(100);
//       setIsRecording(true);
//       isRecordingRef.current = true;
//       setStatusBox("recording", "🎙️ Listening...");
//       setMicLabel("Listening... (auto-stops on silence)");
//       startVolumeMonitor();
//     } catch (err) {
//       console.error("Mic error:", err);
//       addMessage("System", "⚠️ Microphone access denied.", "message-system");
//     }
//   }

//   function stopListening() {
//     if (!isRecordingRef.current) return;
//     setIsRecording(false);
//     isRecordingRef.current = false;
//     setSilenceCountdown("");
//     silenceStartRef.current = null;
//     mediaRecorderRef.current?.stop();
//     setStatusBox("thinking", "⏳ Processing...");
//     setMicLabel("Processing...");
//   }

//   // ✅ Manual toggle still works if user wants to click
//   function toggleRecording() {
//     if (isAIReplyingRef.current || isPlayingAudioRef.current) return;
//     if (isRecordingRef.current) stopListening();
//     else startListening();
//   }

//   function startVolumeMonitor() {
//     if (!analyserRef.current) return;
//     const analyser = analyserRef.current;
//     const dataArray = new Uint8Array(analyser.frequencyBinCount);

//     volumeIntervalRef.current = setInterval(() => {
//       analyser.getByteFrequencyData(dataArray);
//       const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

//       // Track if we hear anything significant (above noise floor)
//       if (avg > SILENCE_THRESHOLD) {
//         hasDetectedVoiceRef.current = true;
//       }

//       if (avg < SILENCE_THRESHOLD) {
//         if (!silenceStartRef.current) {
//           // ✅ FIX: use ref instead of local variable — no closure bug
//           silenceStartRef.current = Date.now();
//         } else {
//           const elapsed = Date.now() - silenceStartRef.current;
//           if (elapsed >= SILENCE_DELAY_MS) {
//             silenceStartRef.current = null;
//             stopVolumeMonitor();
//             stopListening();
//           } else {
//             setSilenceCountdown(
//               `Sending in ${((SILENCE_DELAY_MS - elapsed) / 1000).toFixed(1)}s...`
//             );
//           }
//         }
//       } else {
//         // ✅ Voice detected — reset silence timer
//         silenceStartRef.current = null;
//         setSilenceCountdown("");
//       }
//     }, 100);
//   }

//   function stopVolumeMonitor() {
//     if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
//     volumeIntervalRef.current = null;
//   }

//   async function disconnect() {
//     flushAIBuffer();
//     const meetingId = Cookies.get("meetingId")?.trim() || "";
//     try {

//       const response = await fetch(
//         // `https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/end`,
//         // `http://206.162.244.175:8012/meetings/api/meeting/${meetingId}/end`,
//         `https://ai-julientmts.aiteamtwo.com/api/meeting/${meetingId}/end`,
//         { method: "POST" }
//       );

//       if (response) {
//         // after end meeting this api will be called 
//         const playload = {
//           status: "completed"
//         }
//         const responseData = await updateMeeting({ meetingId, playload }).unwrap();
//         console.log(responseData, "end meeting responseData")
//       }

//       // jamil vai api

//       if (!response.ok) {
//         throw new Error("Failed to end meeting");
//       }

//       stopListening();
//       stopVolumeMonitor();

//       audioQueueRef.current = [];
//       isPlayingAudioRef.current = false;

//       if (wsRef.current) {
//         wsRef.current.send(JSON.stringify({ type: "disconnect" }));
//         wsRef.current.close();
//         wsRef.current = null;
//       }

//       setIsConnected(false);
//       isConnectedRef.current = false;
//       setIsAIReplying(false);
//       isAIReplyingRef.current = false;
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

//   // ─── Cleanup on unmount ───────────────────────────────
//   useEffect(() => {
//     return () => {
//       stopVolumeMonitor();
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div className="flex justify-center items-center">
//       <div className="bg-white w-full border border-[#6E51E0] rounded-xl">
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
//                 <h2 className="text-xl font-semibold text-[#2D2D2D] mb-5">
//                   Meeting Summary
//                 </h2>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#636F85]">Goal:</span>
//                     <span className="text-[#2D2D2D] text-[16px]">{meeting_goal || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#636F85]">Methodology:</span>
//                     <span className="text-[#2D2D22] text-[16px]">{sales_methodology || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#636F85]">Duration:</span>
//                     <span className="text-[#2D2D2D] text-[16px]">{duration_minutes || "0"} minutes</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#636F85]">Participants:</span>
//                     <span className="text-[#2D2D2D] text-[16px]">{representatives?.length || "0"}</span>
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
//                       ${repSpeaking[rep.id]
//                         ? "border-4 border-purple-600 bg-purple-200 animate-pulse shadow-lg shadow-purple-400/50"
//                         : "border-l-4 border-orange-500 bg-orange-100"
//                       } transition-all duration-300 ease-in-out`}
//                   >
//                     <h3 className={`${repSpeaking[rep.id] ? "text-purple-800 font-bold" : "text-orange-700"} mb-1`}>
//                       {rep.name.toUpperCase()}
//                     </h3>
//                     <p><strong>Role:</strong> {rep.role.toUpperCase()}</p>
//                     <p>
//                       <strong>Personality:</strong> {Array.isArray(rep.personality) ? rep.personality.join(", ") : rep.personality.toUpperCase()}
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
//                 {/* ✅ Mic button still clickable as manual override, but not required */}
//                 <button
//                   title={isAIReplying || isPlayingAudioRef.current ? "AI is speaking..." : isRecording ? "Click to stop" : "Click to speak"}
//                   className={`w-20 h-20 rounded-full text-white text-2xl flex items-center justify-center shadow-lg cursor-pointer 
//                     ${isRecording
//                       ? "bg-red-600 animate-pulse shadow-red-400/50"
//                       : isAIReplying || isPlayingAudioRef.current
//                         ? "bg-purple-500 animate-pulse"
//                         : "bg-gradient-to-br from-indigo-500 to-purple-600"
//                     } transition-all duration-300 ease-in-out`}
//                   onClick={toggleRecording}
//                 >
//                   {isAIReplying || isPlayingAudioRef.current ? "🔊" : "🎤"}
//                 </button>
//                 <div className="text-sm text-gray-600">{micLabel}</div>
//                 {silenceCountdown && (
//                   <div className="text-xs text-orange-500 font-medium">{silenceCountdown}</div>
//                 )}
//                 <button
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
//                   onClick={disconnect}
//                 >
//                   End Conversation
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Transcript */}
//           {isConnected && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">Conversation Transcript</h2>
//               <div className="bg-[#F8F9FC] rounded-xl p-5 max-h-[480px] overflow-y-auto space-y-4 border border-gray-200">
//                 {transcript.length === 0 && (
//                   <div className="text-gray-400 text-center italic py-10">
//                     Start speaking — transcript will appear here.
//                   </div>
//                 )}
//                 {transcript.map((msg, index) => {
//                   const isLast = index === transcript.length - 1;
//                   const isUser = msg.type === 'user';
//                   const isSystem = msg.type === 'system';

//                   if (isSystem) {
//                     return (
//                       <div key={msg.id} className="flex justify-center py-2">
//                         <div className="text-gray-400 text-[11px] italic px-4 py-1 bg-gray-50/50 rounded-full border border-gray-100">
//                           {msg.text}
//                         </div>
//                       </div>
//                     );
//                   }

//                   return (
//                     <div 
//                       key={msg.id} 
//                       className={`flex gap-5 p-5 transition-all duration-300 relative ${
//                         isLast ? "bg-blue-50/40 border-l-[5px] border-blue-500 rounded-lg bg-blue-100" : "border-l-[5px] border-transparent"
//                       }`}
//                     >
//                       {/* Left: Timestamp Pill */}
//                       <div className="shrink-0 pt-1">
//                         <div className="bg-white border border-gray-200 rounded-[6px] px-2 py-0.5 text-[11px] font-medium text-gray-500">
//                           {msg.timestamp}
//                         </div>
//                       </div>

//                       {/* Right: Content */}
//                       <div className="flex flex-col gap-1.5 w-full">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
//                             isUser ? "bg-purple-100 border-purple-200 text-purple-600" : "bg-orange-100 border-orange-200 text-orange-600"
//                           }`}>
//                             <User size={16} />
//                           </div>
//                           <span className="text-sm font-bold text-gray-900">{isUser ? "You" : msg.speaker}</span>
//                         </div>
//                         <div className="text-[14px] text-gray-700 leading-relaxed pl-11 -mt-1.5">
//                           {msg.text}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* AI Typing Indicator */}
//                 {isAIReplying && (
//                   <div className="flex justify-start animate-[fadeIn_0.3s_ease-in]">
//                     <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm flex items-center gap-2">
//                       <div className="flex gap-1">
//                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
//                       </div>
//                       <span className="text-xs text-emerald-600 font-medium italic">AI is thinking...</span>
//                     </div>
//                   </div>
//                 )}

//                 <div ref={transcriptEndRef} />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { Play, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { FaUsersGear } from "react-icons/fa6";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useUpdateMeetingMutation } from "@/redux/api/startMettingApi/startMettingApi";
import { useRouter } from "next/navigation";


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

type TranscriptMessage = {
  id: number;
  speaker: string;
  text: string;
  type: 'user' | 'ai-primary' | 'ai-secondary' | 'system';
  timestamp: string;
};

export default function LiveConversation({ handlePrev }: { handlePrev: () => void }) {

  const router = useRouter();

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
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [reps, setReps] = useState<Rep[]>([]);
  const [repSpeaking, setRepSpeaking] = useState<{ [key: string]: boolean }>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // seconds
  const [meetingDuration, setMeetingDuration] = useState<number>(0); // total seconds

  // ─── Refs ─────────────────────────────────────────────
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioQueueRef = useRef<AudioQueueItem[]>([]);
  const isPlayingAudioRef = useRef(false);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // ─── AI Response Buffer (accumulates streaming words into one message) ───
  const aiResponseBufferRef = useRef<{
    speaker: string;
    text: string;
    type: TranscriptMessage['type'];
  } | null>(null);

  // ✅ FIX: silenceStart as a ref to avoid closure bug
  const silenceStartRef = useRef<number | null>(null);

  const isRecordingRef = useRef(false);
  const isAIReplyingRef = useRef(false);
  const isConnectedRef = useRef(false);
  const isNewUserTurnRef = useRef(true);
  const hasDetectedVoiceRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const meetingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SILENCE_DELAY_MS = 3000;
  const SILENCE_THRESHOLD = 10;

  // ─── Sync refs with state ─────────────────────────────
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);
  useEffect(() => { isAIReplyingRef.current = isAIReplying; }, [isAIReplying]);
  useEffect(() => { isConnectedRef.current = isConnected; }, [isConnected]);

  // ─── Auto-scroll transcript to bottom ─────────────────
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

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
    flushAIBuffer();
    const msgType: TranscriptMessage['type'] =
      cssClass === "message-user" ? "user"
        : cssClass === "message-ai-primary" ? "ai-primary"
          : cssClass === "message-ai-secondary" ? "ai-secondary"
            : "system";

    setTranscript((prev) => [
      ...prev,
      {
        id: prev.length,
        speaker,
        text,
        type: msgType,
        timestamp: getRelativeTimestamp(),
      },
    ]);
  }

  function getRelativeTimestamp() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Flush the AI response buffer into the transcript (Updates last message if same speaker)
  function flushAIBuffer() {
    const buf = aiResponseBufferRef.current;
    if (!buf || !buf.text.trim()) return;

    setTranscript((prev) => {
      const lastMsg = prev[prev.length - 1];
      // If the last message was from the same AI speaker, update its text instead of adding a new bubble
      if (lastMsg && lastMsg.speaker === buf.speaker && lastMsg.type === buf.type) {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...lastMsg,
          text: buf.text.trim(),
        };
        return updated;
      }

      // Otherwise, create a new AI message bubble
      return [
        ...prev,
        {
          id: prev.length,
          speaker: buf.speaker,
          text: buf.text.trim(),
          type: buf.type,
          timestamp: getRelativeTimestamp(),
        },
      ];
    });
    // We clear the buffer so next text segments start fresh if speaker changes,
    // but the next turn's ai_response_text will repopulate it.
    // Actually, to keep accumulating across ALL chunks of one turn, we should only clear on turn change.
    // But since we UPSERT into the transcript, it's safe to clear here as long as ai_response_text 
    // for the next chunk includes the full text (if cumulative) or we keep it.
    // Let's keep the buffer until a non-AI event happens.
  }

  function displayReps(reps: Rep[]) {
    console.log(reps, "=======================================resps")
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
    flushAIBuffer();
    isNewUserTurnRef.current = true;
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
        startTimeRef.current = Date.now();
        setIsConnected(true);
        isConnectedRef.current = true;
      };

      ws.onmessage = (event) => {
        console.log(event, "===================event========================")
        const data = JSON.parse(event.data);
        handleMessage(data);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        toast.error("❌ WebSocket connection error");
        setStatusBox("disconnected", "Connection error");
      };

      ws.onclose = () => {
        flushAIBuffer();
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
    console.log(data, "==========data================")
    console.log("📨", data.type, data);

    switch (data.type) {
      case "connected":
        startTimeRef.current = Date.now();
        flushAIBuffer();
        setIsConnected(true);
        isConnectedRef.current = true;
        setStatusBox("connected", "✅ Connected — start speaking!");
        if (data.representatives) displayReps(data.representatives);
        // ✅ Start auto-end timer if duration_minutes provided
        if (data.duration_minutes && data.duration_minutes > 0) {
          startMeetingTimer(data.duration_minutes);
        }
        addMessage("System", data.message || "Connected.", "message-system");
        enableMic();
        // ✅ Auto-start listening immediately on connect
        setTimeout(() => startListening(), 500);
        break;

      case "transcription":
        // Live-update the user message bubble
        const cleanText = data.text?.trim() || "";
        if (!cleanText) break;

        setTranscript((prev) => {
          const lastMsg = prev[prev.length - 1];

          // If it's a new turn or the last message isn't from the user, create a new bubble
          if (isNewUserTurnRef.current || !lastMsg || lastMsg.type !== "user") {
            isNewUserTurnRef.current = false;
            return [
              ...prev,
              {
                id: prev.length,
                speaker: "You",
                text: cleanText,
                type: "user",
                timestamp: getRelativeTimestamp(),
              },
            ];
          }

          // Otherwise, update the current bubble
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...lastMsg,
            text: cleanText, // Cumulative text
          };
          return updated;
        });
        break;

      case "ai_thinking":
        // Flush any AI buffer before AI turn starts
        isNewUserTurnRef.current = true;
        flushAIBuffer();
        setStatusBox("thinking", "💭 AI is thinking...");
        setMicLabel("AI is thinking...");
        setIsAIReplying(true);
        isAIReplyingRef.current = true;
        // ✅ Stop mic while AI thinks
        if (isRecordingRef.current) stopListening();
        break;

      case "ai_response_text": {
        isNewUserTurnRef.current = true;
        const aiMsgType: TranscriptMessage['type'] = data.is_primary ? "ai-primary" : "ai-secondary";
        const currentBuf = aiResponseBufferRef.current;

        // If speaker changed, flush and clear first
        if (currentBuf && (currentBuf.speaker !== data.speaker_name || currentBuf.type !== aiMsgType)) {
          flushAIBuffer();
          aiResponseBufferRef.current = null;
        }

        // Accumulate text into buffer
        if (aiResponseBufferRef.current) {
          aiResponseBufferRef.current.text += " " + data.text;
        } else {
          aiResponseBufferRef.current = {
            speaker: data.speaker_name,
            text: data.text,
            type: aiMsgType,
          };
        }

        // Live-flush to UI so user can read while AI speaks
        flushAIBuffer();
        break;
      }

      case "ai_audio_complete":
        // Final flush for this audio segment
        flushAIBuffer();
        enqueueAudio({
          base64: data.audio_data,
          mimeType: data.audio_mime_type || "audio/mpeg",
          repId: data.speaker_id,
          speakerName: data.speaker_name,
          isPrimary: data.is_primary,
        });
        break;

      case "error":
        flushAIBuffer();
        addMessage("System", `⚠️ ${data.message}`, "message-system");
        onAllAudioFinished();
        break;

      case "no_audio":
        flushAIBuffer();
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

    isNewUserTurnRef.current = true;
    hasDetectedVoiceRef.current = false;
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 48000 },
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
        if (wsRef.current?.readyState === WebSocket.OPEN && hasSentAudio && hasDetectedVoiceRef.current) {
          wsRef.current.send(JSON.stringify({ type: "audio_chunk", data: "", is_speaking: false }));
        } else {
          // If no voice was detected, don't trigger AI, just reset for next try
          if (isConnectedRef.current && !isAIReplyingRef.current) {
            setTimeout(() => startListening(), 500);
          }
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

      // Track if we hear anything significant (above noise floor)
      if (avg > SILENCE_THRESHOLD) {
        hasDetectedVoiceRef.current = true;
      }

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
    flushAIBuffer();
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
      stopMeetingTimer();

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
      setReps([]);
      setRepSpeaking({});
      setTimeRemaining(0);
      setMeetingDuration(0);

      toast.success("✅ Meeting ended successfully");

    } catch (error) {
      console.error("Disconnect error:", error);
      // Reset state even on error
      setIsConnected(false);
      isConnectedRef.current = false;
      setTimeRemaining(0);
      setMeetingDuration(0);
    }
  }

  // ─── Meeting Timer (auto-end) ─────────────────────────
  function startMeetingTimer(minutes: number) {
    // Clear any existing timer
    if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
    const totalSeconds = minutes * 60;
    setMeetingDuration(totalSeconds);
    setTimeRemaining(totalSeconds);

    meetingTimerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up — auto disconnect
          if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
          meetingTimerRef.current = null;
          disconnect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopMeetingTimer() {
    if (meetingTimerRef.current) {
      clearInterval(meetingTimerRef.current);
      meetingTimerRef.current = null;
    }
    setTimeRemaining(0);
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
      stopMeetingTimer();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white w-full border border-[#6E51E0] rounded-xl">
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
                  <div className="flex justify-between items-center">
                    <span className="text-[#636F85]">Duration:</span>
                    <span className="text-[#2D2D2D] text-[16px]">{duration_minutes || "0"} minutes</span>
                  </div>
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
                      <strong>Name: </strong>{rep.name.toUpperCase()}
                    </h3>
                    <p><strong>Role:</strong> {rep.role.toUpperCase()}</p>
                    <p>
                      <strong>Personality:</strong>{" "}
                      {Array.isArray(rep.personality)
                        ? rep.personality.map(p => p.toUpperCase()).join(", ")
                        : typeof rep.personality === "string"
                          ? rep.personality.toUpperCase()
                          : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mic + Timer */}
          {isConnected && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2"> Voice Conversation</h2>

              {/* ⏱ Meeting Timer */}
              {meetingDuration > 0 && (
                <div className="mb-4 px-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#636F85]">⏱ Time Remaining</span>
                    <span
                      className={`text-sm font-bold font-mono ${timeRemaining <= 60
                        ? "text-red-600 animate-pulse"
                        : timeRemaining <= 120
                          ? "text-orange-500"
                          : "text-[#6E51E0]"
                        }`}
                    >
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${timeRemaining <= 60
                        ? "bg-red-500"
                        : timeRemaining <= 120
                          ? "bg-orange-400"
                          : "bg-[#6E51E0]"
                        }`}
                      style={{ width: `${(timeRemaining / meetingDuration) * 100}%` }}
                    />
                  </div>
                  {timeRemaining <= 60 && (
                    <p className="text-xs text-red-500 mt-1 text-center animate-pulse">
                      ⚠️ Meeting ending soon...
                    </p>
                  )}
                </div>
              )}

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
              <div className="bg-[#F8F9FC] rounded-xl p-5 max-h-[480px] overflow-y-auto space-y-4 border border-gray-200">
                {transcript.length === 0 && (
                  <div className="text-gray-400 text-center italic py-10">
                    Start speaking — transcript will appear here.
                  </div>
                )}
                {transcript.map((msg, index) => {
                  const isLast = index === transcript.length - 1;
                  const isUser = msg.type === 'user';
                  const isSystem = msg.type === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center py-2">
                        <div className="text-gray-400 text-[11px] italic px-4 py-1 bg-gray-50/50 rounded-full border border-gray-100">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-5 p-5 transition-all duration-300 relative ${isLast ? "bg-blue-50/40 border-l-[5px] border-blue-500 rounded-lg bg-blue-100" : "border-l-[5px] border-transparent"
                        }`}
                    >
                      {/* Left: Timestamp Pill */}
                      <div className="shrink-0 pt-1">
                        <div className="bg-white border border-gray-200 rounded-[6px] px-2 py-0.5 text-[11px] font-medium text-gray-500">
                          {msg.timestamp}
                        </div>
                      </div>

                      {/* Right: Content */}
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isUser ? "bg-purple-100 border-purple-200 text-purple-600" : "bg-orange-100 border-orange-200 text-orange-600"
                            }`}>
                            <User size={16} />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{isUser ? "You" : msg.speaker}</span>
                        </div>
                        <div className="text-[14px] text-gray-700 leading-relaxed pl-11 -mt-1.5">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* AI Typing Indicator */}
                {isAIReplying && (
                  <div className="flex justify-start animate-[fadeIn_0.3s_ease-in]">
                    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium italic">AI is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={transcriptEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}










