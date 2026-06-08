
// "use client";

// import { Play, User } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import Cookies from "js-cookie";
// import { toast } from "sonner";
// import { FaUsersGear } from "react-icons/fa6";
// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// import { useUpdateMeetingMutation } from "@/redux/api/startMettingApi/startMettingApi";
// import { useRouter } from "next/navigation";
// import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
// import Image from "next/image";


// type Rep = {
//   id: string;
//   name: string;
//   role: string;
//   personality: string[] | string;
//   gender?: string; // "male" | "female" — sent from Step2
// };

// // Methodology core fields data (same as Step4)
// const METHODOLOGY_DATA: Record<string, { field: string; definition: string }[]> = {
//   MEDDIC: [
//     { field: "Metrics", definition: "Quantified business impact / ROI" },
//     { field: "Economic Buyer", definition: "Person with final budget authority" },
//     { field: "Decision Criteria", definition: "Factors used to evaluate vendors" },
//     { field: "Decision Process", definition: "Steps to approve purchase" },
//     { field: "Identify Pain", definition: "Main business problem to solve" },
//     { field: "Champion", definition: "Internal advocate pushing your deal" },
//   ],
//   "Challenger Sales": [
//     { field: "Commercial Insight", definition: "New perspective taught to buyer" },
//     { field: "Pain Intensity", definition: "Severity of business issue" },
//     { field: "Change Urgency", definition: "Need to act now" },
//     { field: "Stakeholder Alignment", definition: "Internal agreement across teams" },
//     { field: "Status Quo Cost", definition: "Risk/cost of doing nothing" },
//   ],
//   BANT: [
//     { field: "Budget", definition: "Available spending capacity" },
//     { field: "Authority", definition: "Decision-maker ownership" },
//     { field: "Need", definition: "Clear business requirement" },
//     { field: "Timeline", definition: "Expected buying timeframe" },
//   ],
//   "SPIN Selling": [
//     { field: "Situation", definition: "Current customer environment" },
//     { field: "Problem", definition: "Existing issue/friction" },
//     { field: "Implication", definition: "Business consequences of problem" },
//     { field: "Need-Payoff", definition: "Value of solving the issue" },
//   ],
//   MEDDPICC: [
//     { field: "Metrics", definition: "Quantified business impact" },
//     { field: "Economic Buyer", definition: "Final financial approver" },
//     { field: "Decision Criteria", definition: "Vendor evaluation standards" },
//     { field: "Decision Process", definition: "Internal approval workflow" },
//     { field: "Paper Process", definition: "Procurement/legal contract steps" },
//     { field: "Identify Pain", definition: "Critical business challenge" },
//     { field: "Champion", definition: "Internal supporter influencing deal" },
//     { field: "Competition", definition: "Alternative vendors or status quo" },
//   ],
//   "Value Selling": [
//     { field: "Business Value", definition: "Measurable customer gain" },
//     { field: "ROI", definition: "Financial return expected" },
//     { field: "Customer Goals", definition: "Strategic objectives" },
//     { field: "Pain Cost", definition: "Cost of current problem" },
//     { field: "Success Outcomes", definition: "Desired measurable result" },
//   ],
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

//   const router = useRouter();

//   // get all data form redux 
//   const allData = useSelector((state: RootState) => state.startMeeting);
//   // console.log(allData?.payloadData, "============all data")
//   const { meeting_goal, duration_minutes, sales_methodology, representatives, questions } = allData?.payloadData || {}

//   // ─── User profile for avatar ───────────────────────────
//   const { data: getMeData } = useGetMeQuery("");
//   const userProfile = getMeData?.data;
//   const userDisplayName = userProfile?.firstName
//     ? `${userProfile.firstName} ${userProfile.lastName || ""}`.trim()
//     : "You";
//   const userImage = userProfile?.profileImage || null;

//   // ─── Name→gender map from Step2 cookie ────────────────
//   const participantGenderMap: Record<string, string> = (() => {
//     try {
//       return JSON.parse(Cookies.get("participantGenderMap") || "{}");
//     } catch { return {}; }
//   })();

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
//   const [timeRemaining, setTimeRemaining] = useState<number>(0); // seconds
//   const [meetingDuration, setMeetingDuration] = useState<number>(0); // total seconds
//   // ─── Gamified countdown state ─────────────────────────
//   const [countdown, setCountdown] = useState<number | "GO!" | null>(null);

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
//   // ─── AI Audio lip-sync refs ────────────────────────────
//   const aiAudioCtxRef = useRef<AudioContext | null>(null);
//   const aiAnalyserRef = useRef<AnalyserNode | null>(null);
//   const aiAnimFrameRef = useRef<number | null>(null);
//   const currentSpeakingRepIdRef = useRef<string | null>(null);
//   // canvas refs for each rep mouth (direct DOM draw — no React setState at 60fps)
//   const mouthCanvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
//   // smoothed amplitude per rep (lerped, not React state)
//   const smoothedAmpRef = useRef<Record<string, number>>({});

//   // ─── AI Response Buffer (accumulates streaming words into one message) ───
//   const aiResponseBufferRef = useRef<{
//     speaker: string;
//     text: string;
//     type: TranscriptMessage['type'];
//   } | null>(null);

//   const silenceStartRef = useRef<number | null>(null);
//   const isRecordingRef = useRef(false);
//   const isAIReplyingRef = useRef(false);
//   const isConnectedRef = useRef(false);
//   const isNewUserTurnRef = useRef(true);
//   const hasDetectedVoiceRef = useRef(false);
//   const startTimeRef = useRef<number | null>(null);
//   const meetingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // Silence detection: 800ms after voice stops → send audio (faster than old 3s)
//   const SILENCE_DELAY_MS = 800;
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
//     console.log("🧑 Rep data from backend:", JSON.stringify(reps, null, 2));
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
//       stopLipSync();
//       onAllAudioFinished();
//       return;
//     }
//     isPlayingAudioRef.current = true;

//     const { base64, mimeType, repId, speakerName } = audioQueueRef.current.shift()!;
//     setRepSpeakingState(repId, true);
//     currentSpeakingRepIdRef.current = repId;
//     setStatusBox("playing", `🔊 ${speakerName} is speaking...`);
//     setMicLabel(`${speakerName} is speaking...`);

//     // ✅ Stop mic while AI is speaking
//     if (isRecordingRef.current) stopListening();

//     // ─── Pipe audio through AudioContext for real lip sync ───
//     const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
//     const ctx = new AudioContextClass();
//     aiAudioCtxRef.current = ctx;

//     const analyser = ctx.createAnalyser();
//     analyser.fftSize = 256;
//     aiAnalyserRef.current = analyser;

//     // Decode base64 → ArrayBuffer → AudioBuffer
//     const binary = atob(base64);
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

//     ctx.decodeAudioData(bytes.buffer, (audioBuffer) => {
//       const source = ctx.createBufferSource();
//       source.buffer = audioBuffer;

//       // Connect: source → analyser → speakers
//       source.connect(analyser);
//       analyser.connect(ctx.destination);
//       source.start();

//       // Start RAF lip-sync loop
//       startLipSyncLoop(repId, analyser);

//       source.onended = () => {
//         setRepSpeakingState(repId, false);
//         stopLipSync();
//         playNextInQueue();
//       };
//     }, () => {
//       // Decode failed — fallback to plain Audio element
//       setRepSpeakingState(repId, false);
//       stopLipSync();
//       playNextInQueue();
//     });
//   }

//   // ─── Lip-sync RAF loop ─────────────────────────────────
//   // ─── Lip-sync RAF loop — canvas-based, no React setState ─
//   function startLipSyncLoop(repId: string, analyser: AnalyserNode) {
//     const fftSize = analyser.fftSize;                 // 256
//     const sampleRate = aiAudioCtxRef.current?.sampleRate ?? 44100;
//     const binCount = analyser.frequencyBinCount;      // 128
//     const dataArray = new Uint8Array(binCount);

//     // Voice fundamental + harmonics: ~85 Hz – 3000 Hz
//     // Map to FFT bins: binIndex = freq * fftSize / sampleRate
//     const binLow = Math.floor(85 * fftSize / sampleRate);
//     const binHigh = Math.ceil(3000 * fftSize / sampleRate);

//     if (!smoothedAmpRef.current[repId]) smoothedAmpRef.current[repId] = 0;

//     const tick = () => {
//       analyser.getByteFrequencyData(dataArray);

//       // 1. Sum only voice-band bins
//       let sum = 0;
//       const count = binHigh - binLow + 1;
//       for (let i = binLow; i <= binHigh && i < binCount; i++) sum += dataArray[i];
//       const raw = sum / (count * 255); // 0–1

//       // 2. Lerp for smoothing: fast attack (0.45), slow decay (0.25)
//       const prev = smoothedAmpRef.current[repId];
//       const lerpFactor = raw > prev ? 0.45 : 0.25;
//       const amp = prev + (raw - prev) * lerpFactor;
//       smoothedAmpRef.current[repId] = amp;

//       // 3. Draw directly to canvas — zero React re-render
//       const canvas = mouthCanvasRefs.current[repId];
//       if (canvas) drawMouth(canvas, amp, repId);

//       aiAnimFrameRef.current = requestAnimationFrame(tick);
//     };

//     aiAnimFrameRef.current = requestAnimationFrame(tick);
//   }

//   function drawMouth(canvas: HTMLCanvasElement, amp: number, repId: string) {
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     const W = canvas.width;   // 80
//     const H = canvas.height;  // 40

//     ctx.clearRect(0, 0, W, H);

//     const cx = W / 2;
//     const cy = H / 2;
//     const mouthW = 22;
//     // mouth height: 1px (closed smile) → 16px (wide open)
//     const mouthH = 1 + amp * 15;

//     if (amp < 0.05) {
//       // ── Closed: gentle smile curve ──
//       ctx.beginPath();
//       ctx.moveTo(cx - mouthW / 2, cy);
//       ctx.quadraticCurveTo(cx, cy + 5, cx + mouthW / 2, cy);
//       ctx.strokeStyle = "#C0525A";
//       ctx.lineWidth = 2.5;
//       ctx.lineCap = "round";
//       ctx.stroke();
//     } else {
//       // ── Open: outer lips ──
//       ctx.beginPath();
//       ctx.ellipse(cx, cy, mouthW / 2, mouthH / 2 + 3, 0, 0, Math.PI * 2);
//       ctx.fillStyle = "#C0525A";
//       ctx.fill();

//       // ── Inner mouth (dark) ──
//       ctx.beginPath();
//       ctx.ellipse(cx, cy + 1, (mouthW / 2) - 3, mouthH / 2, 0, 0, Math.PI * 2);
//       ctx.fillStyle = "#3B0A14";
//       ctx.fill();

//       // ── Teeth — only when sufficiently open ──
//       if (amp > 0.2) {
//         const teethH = Math.min((amp - 0.2) * 10, 5);
//         ctx.beginPath();
//         ctx.ellipse(cx, cy - 1, (mouthW / 2) - 5, teethH, 0, 0, Math.PI * 2);
//         ctx.fillStyle = "#FFFFFF";
//         ctx.fill();
//       }

//       // ── Gloss highlight ──
//       ctx.beginPath();
//       ctx.ellipse(cx - 4, cy - mouthH / 4, 4, 2, -0.3, 0, Math.PI * 2);
//       ctx.fillStyle = "rgba(255,255,255,0.25)";
//       ctx.fill();
//     }
//   }

//   function stopLipSync() {
//     if (aiAnimFrameRef.current) {
//       cancelAnimationFrame(aiAnimFrameRef.current);
//       aiAnimFrameRef.current = null;
//     }
//     // Draw closed mouth on the speaking rep's canvas
//     if (currentSpeakingRepIdRef.current) {
//       smoothedAmpRef.current[currentSpeakingRepIdRef.current] = 0;
//       const canvas = mouthCanvasRefs.current[currentSpeakingRepIdRef.current];
//       if (canvas) drawMouth(canvas, 0, currentSpeakingRepIdRef.current);
//       currentSpeakingRepIdRef.current = null;
//     }
//     if (aiAudioCtxRef.current) {
//       aiAudioCtxRef.current.close().catch(() => { });
//       aiAudioCtxRef.current = null;
//     }
//     aiAnalyserRef.current = null;
//   }

//   // ✅ Auto-restart listening after AI finishes — natural conversation flow
//   function onAllAudioFinished() {
//     flushAIBuffer();
//     // ✅ Clear buffer after AI turn ends — prevents duplicate bubbles on next turn
//     aiResponseBufferRef.current = null;
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

//   // ─── Gamified countdown before meeting starts ─────────
//   // function startCountdown() {
//   //   connectToMeeting();
//   //   const steps: (number | "GO!")[] = [5, 4, 3, 2, 1, "GO!"];
//   //   let i = 0;
//   //   setCountdown(steps[i]);
//   //   const timer = setInterval(() => {
//   //     i++;
//   //     if (i < steps.length) {
//   //       setCountdown(steps[i]);
//   //     } else {
//   //       clearInterval(timer);
//   //       setCountdown(null);
//   //       // connectToMeeting();
//   //     }
//   //   }, 900);
//   // }

//   const delay = (ms: number) =>
//     new Promise(resolve => setTimeout(resolve, ms));

//   async function startCountdown() {
//     const steps: (number | "GO!")[] = [5, 4, 3, 2, 1, "GO!"];
//     let i = 0;

//     setCountdown(steps[i]);

//     const timer = setInterval(() => {
//       i++;

//       if (i < steps.length) {
//         setCountdown(steps[i]);
//       } else {
//         clearInterval(timer);
//         setCountdown(null);
//       }
//     }, 900);

//     // startCountdown call হওয়ার 5 second পর
//     await delay(3000);
//     connectToMeeting();
//   }

//   async function connectToMeeting() {
//     try {
//       const meetingId = Cookies.get("meetingId")?.trim() || "";
//       // console.log(meetingId, "=================meeting id in connect to meeting function");

//       if (!meetingId) {
//         toast.error("⚠️ Meeting ID not found");
//         return;
//       }

//       setStatusBox("disconnected", "Connecting...");

//       const response = await fetch(
//         // `https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/start`,
//         `https://8d73-137-59-180-177.ngrok-free.app/api/meeting/${meetingId}/start`,
//         // `https://ai-julientmts.aiteamtwo.com/api/meeting/${meetingId}/start`,
//         { method: "POST" }
//       );

//       if (!response.ok) {
//         const errData = await response.json().catch(() => null);
//         const message = errData?.detail || errData?.message || "Failed to start meeting";
//         throw new Error(message);
//       }

//       if (wsRef.current) {
//         wsRef.current.close();
//       }

//       const ws = new WebSocket(
//         // `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
//         `https://8d73-137-59-180-177.ngrok-free.app/api/conversation/ws/live-conversation/${meetingId}`
//         // `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
//         // `ws://localhost:8000/conversations/api/conversation/ws/realtime/${meetingId}`
//       );

//       wsRef.current = ws;

//       ws.onopen = () => {
//         // console.log("✅ WebSocket connected");
//         startTimeRef.current = Date.now();
//         setIsConnected(true);
//         isConnectedRef.current = true;
//       };

//       // ws.onmessage = (event) => {
//       //   console.log(event, "===================event========================")
//       //   const data = JSON.parse(event.data);
//       //   handleMessage(data);
//       // };

//       ws.onmessage = (event) => {
//         // console.log(event, "===================event========================")
//         const data = JSON.parse(event.data);

//         // 👇 EXACT LINES ADDED HERE 👇
//         if (data.type === 'transcription') console.log(`👤 User: ${data.text}`);
//         if (data.type === 'ai_response_text') console.log(`🤖 AI: ${data.text}`);

//         handleMessage(data);
//       };





//       ws.onerror = (err) => {
//         // console.error("WebSocket error:", err);
//         toast.error("❌ WebSocket connection error");
//         setStatusBox("disconnected", "Connection error");
//       };

//       ws.onclose = () => {
//         flushAIBuffer();
//         setStatusBox("disconnected", "Disconnected");
//         setIsConnected(false);
//         isConnectedRef.current = false;
//         disableMic();
//       };

//     } catch (error: any) {
//       // console.error("Connect meeting error:", error);
//       const message = error instanceof Error ? error.message : JSON.stringify(error);
//       toast.error(`❌ ${message}, You have to create new meeting from before step`);
//     }
//   }

//   // ─── WS Handler ───────────────────────────────────────
//   function handleMessage(data: any) {
//     // console.log(data, "==========data================")
//     // console.log("📨", data.type, data);

//     switch (data.type) {
//       case "connected":
//         startTimeRef.current = Date.now();
//         flushAIBuffer();
//         setIsConnected(true);
//         isConnectedRef.current = true;
//         setStatusBox("connected", "✅ Connected — start speaking!");
//         if (data.representatives) displayReps(data.representatives);
//         // ✅ Start auto-end timer if duration_minutes provided
//         if (data.duration_minutes && data.duration_minutes > 0) {
//           startMeetingTimer(data.duration_minutes);
//         }
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
//         // ✅ Clear buffer so old AI text doesn't leak into the new turn as a duplicate
//         aiResponseBufferRef.current = null;
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

//   // ─── Mic + fast silence detection ─────────────────────
//   async function startListening() {
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
//           if (isConnectedRef.current && !isAIReplyingRef.current) {
//             setTimeout(() => startListening(), 300);
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
//       setMicLabel("Listening...");
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
//     mediaRecorderRef.current?.stop();
//     setStatusBox("thinking", "⏳ Processing...");
//     setMicLabel("Processing...");
//   }

//   function toggleRecording() {
//     if (isAIReplyingRef.current || isPlayingAudioRef.current) return;
//     if (isRecordingRef.current) stopListening();
//     else startListening();
//   }

//   // ─── Volume monitor (fast silence: 800ms) ─────────────
//   function startVolumeMonitor() {
//     if (!analyserRef.current) return;
//     const analyser = analyserRef.current;
//     const dataArray = new Uint8Array(analyser.frequencyBinCount);

//     volumeIntervalRef.current = setInterval(() => {
//       analyser.getByteFrequencyData(dataArray);
//       const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

//       if (avg > SILENCE_THRESHOLD) {
//         hasDetectedVoiceRef.current = true;
//         silenceStartRef.current = null;
//         setSilenceCountdown("");
//       } else {
//         if (!silenceStartRef.current) {
//           silenceStartRef.current = Date.now();
//         } else {
//           const elapsed = Date.now() - silenceStartRef.current;
//           if (elapsed >= SILENCE_DELAY_MS) {
//             silenceStartRef.current = null;
//             stopVolumeMonitor();
//             stopListening();
//           } else {
//             const remaining = ((SILENCE_DELAY_MS - elapsed) / 1000).toFixed(1);
//             setSilenceCountdown(`Sending in ${remaining}s...`);
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
//     // ── Stop everything IMMEDIATELY on click ──
//     stopListening();
//     stopVolumeMonitor();
//     stopMeetingTimer();
//     stopLipSync();
//     audioQueueRef.current = [];
//     isPlayingAudioRef.current = false;
//     setSilenceCountdown("");
//     setMicLabel("Ending...");

//     if (wsRef.current) {
//       wsRef.current.send(JSON.stringify({ type: "disconnect" }));
//       wsRef.current.close();
//       wsRef.current = null;
//     }

//     setIsConnected(false);
//     isConnectedRef.current = false;
//     setIsAIReplying(false);
//     isAIReplyingRef.current = false;
//     flushAIBuffer();

//     // ── API calls in background (don't block UI) ──
//     const meetingId = Cookies.get("meetingId")?.trim() || "";
//     try {
//       const response = await fetch(
//         `https://8d73-137-59-180-177.ngrok-free.app/api/meeting/${meetingId}/end`,
//         // `https://ai-julientmts.aiteamtwo.com/api/meeting/${meetingId}/end`,
//         { method: "POST" }
//       );
//       if (response) {
//         await updateMeeting({ meetingId, playload: { status: "completed" } }).unwrap();
//       }
//     } catch {
//       // silent — UI already cleaned up
//     }

//     setTranscript([]);
//     setReps([]);
//     setRepSpeaking({});
//     setTimeRemaining(0);
//     setMeetingDuration(0);
//     toast.success("✅ Meeting ended successfully");
//   }

//   // ─── Meeting Timer (auto-end) ─────────────────────────
//   function startMeetingTimer(minutes: number) {
//     // Clear any existing timer
//     if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
//     const totalSeconds = minutes * 60;
//     setMeetingDuration(totalSeconds);
//     setTimeRemaining(totalSeconds);

//     meetingTimerRef.current = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           // Time's up — auto disconnect
//           if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
//           meetingTimerRef.current = null;
//           disconnect();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   }

//   function stopMeetingTimer() {
//     if (meetingTimerRef.current) {
//       clearInterval(meetingTimerRef.current);
//       meetingTimerRef.current = null;
//     }
//     setTimeRemaining(0);
//   }

//   function formatTime(seconds: number): string {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
//       stopMeetingTimer();
//       stopLipSync();
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div className="flex justify-center items-center">
//       <div className="bg-white w-full border border-[#6E51E0] rounded-xl p-2 relative overflow-hidden">

//         {/* ── Gamified Countdown Overlay ── */}
//         {countdown !== null && (
//           <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0533] via-[#2d1b69] to-[#0f0c29] rounded-xl overflow-hidden">
//             {/* animated radial pulse rings */}
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//               <span className="absolute w-72 h-72 rounded-full border-4 border-[#6E51E0]/30 animate-ping" />
//               <span className="absolute w-52 h-52 rounded-full border-4 border-[#a78bfa]/40 animate-ping [animation-delay:0.3s]" />
//               <span className="absolute w-36 h-36 rounded-full border-4 border-[#c4b5fd]/50 animate-ping [animation-delay:0.6s]" />
//             </div>

//             {/* particle dots */}
//             <div className="absolute inset-0 pointer-events-none overflow-hidden">
//               {[...Array(12)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="absolute w-2 h-2 rounded-full bg-[#a78bfa] opacity-70 animate-bounce"
//                   style={{
//                     left: `${8 + i * 7.5}%`,
//                     top: `${10 + (i % 4) * 22}%`,
//                     animationDelay: `${i * 0.15}s`,
//                     animationDuration: `${0.8 + (i % 3) * 0.4}s`,
//                   }}
//                 />
//               ))}
//             </div>

//             {/* main number / GO! */}
//             <div className="relative flex flex-col items-center gap-4">
//               <div
//                 key={String(countdown)}
//                 className={`
//                   font-black select-none leading-none
//                   transition-all duration-150
//                   ${countdown === "GO!"
//                     ? "text-[9rem] text-emerald-400 drop-shadow-[0_0_60px_rgba(52,211,153,0.9)] scale-125 animate-[pulse_0.4s_ease-out]"
//                     : "text-[11rem] text-white drop-shadow-[0_0_80px_rgba(167,139,250,0.9)] animate-[ping_0.15s_ease-out_1]"
//                   }
//                 `}
//                 style={{
//                   textShadow:
//                     countdown === "GO!"
//                       ? "0 0 40px #34d399, 0 0 80px #10b981"
//                       : "0 0 40px #a78bfa, 0 0 80px #6E51E0",
//                   animation: "countPop 0.45s cubic-bezier(0.175,0.885,0.32,1.275)",
//                 }}
//               >
//                 {countdown}
//               </div>

//               {/* sub-label */}
//               <p className="text-[#c4b5fd] text-lg font-semibold tracking-widest uppercase">
//                 {countdown === "GO!" ? "🚀 Launching your meeting!" : "Get ready..."}
//               </p>

//               {/* progress dots */}
//               <div className="flex gap-3 mt-2">
//                 {[5, 4, 3, 2, 1].map((n) => (
//                   <div
//                     key={n}
//                     className={`w-3 h-3 rounded-full transition-all duration-300 ${typeof countdown === "number" && n >= countdown
//                       ? "bg-[#6E51E0] scale-125 shadow-[0_0_8px_#6E51E0]"
//                       : countdown === "GO!"
//                         ? "bg-emerald-400 scale-125"
//                         : "bg-white/20"
//                       }`}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* keyframe injection via style tag */}
//             <style>{`
//               @keyframes countPop {
//                 0%   { transform: scale(0.4) rotate(-8deg); opacity: 0; }
//                 60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
//                 100% { transform: scale(1) rotate(0deg); opacity: 1; }
//               }
//             `}</style>
//           </div>
//         )}
//         {/* Setup — Pre-meeting screen */}
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
//                   onClick={startCountdown}
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

//           {/* AI Reps with lip-sync avatars */}
//           {isConnected && reps.length > 0 && (
//             <div>
//               <div className="flex items-center gap-2">
//                 <FaUsersGear size={20} className="text-[#6E51E0] -mt-4" />
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#6E51E0]"> AI Representatives</h2>
//               </div>
//               <div className="flex flex-wrap gap-4 justify-center">
//                 {reps.map((rep, repIndex) => {
//                   const speaking = repSpeaking[rep.id];

//                   // ── Gender: backend field → cookie map → fallback ──
//                   const genderRaw = (
//                     rep.gender ||
//                     (rep as any).gender_type ||
//                     (rep as any).voice_gender ||
//                     participantGenderMap[rep.name.toLowerCase().trim()] ||
//                     ""
//                   ).toLowerCase();
//                   const isFemale = genderRaw === "female" || genderRaw === "f";

//                   // ── Unique face variant per same-gender rep ──
//                   const sameGenderBefore = reps.slice(0, repIndex).filter(r => {
//                     const g = (
//                       r.gender ||
//                       (r as any).gender_type ||
//                       (r as any).voice_gender ||
//                       participantGenderMap[r.name.toLowerCase().trim()] ||
//                       ""
//                     ).toLowerCase();
//                     return (g === "female" || g === "f") === isFemale;
//                   }).length;
//                   const variant = sameGenderBefore % 3;

//                   const femaleVariants = [
//                     { skin: "#FDDBB4", hair: "#4A2C0A", shirt: "#E879A0", hairStyle: "long" },
//                     { skin: "#F5C5A3", hair: "#1A1A2E", shirt: "#A855F7", hairStyle: "bun" },
//                     { skin: "#EAD5C4", hair: "#C67C3B", shirt: "#EC4899", hairStyle: "long" },
//                   ];
//                   const maleVariants = [
//                     { skin: "#F4C38A", hair: "#2C1810", shirt: "#6E51E0", hairStyle: "short" },
//                     { skin: "#FDDBB4", hair: "#5C4033", shirt: "#3B82F6", hairStyle: "short" },
//                     { skin: "#D4956A", hair: "#1C1C1C", shirt: "#10B981", hairStyle: "short" },
//                   ];
//                   const face = isFemale ? femaleVariants[variant] : maleVariants[variant];

//                   // personality string
//                   const personalityStr = Array.isArray(rep.personality)
//                     ? rep.personality.map((p: string) => p.toUpperCase()).join(", ")
//                     : (rep.personality || "N/A").toString().toUpperCase();

//                   return (
//                     <div
//                       key={rep.id}
//                       className={`flex flex-col items-center p-4 rounded-xl flex-1 min-w-[160px] max-w-[220px]
//                         ${speaking
//                           ? "border-2 border-purple-500 bg-purple-50 shadow-lg shadow-purple-300/40"
//                           : "border border-gray-200 bg-white"
//                         } transition-all duration-200`}
//                     >
//                       <div className="relative mb-2">
//                         {speaking && (
//                           <div className="absolute inset-0 rounded-full animate-ping bg-purple-400/30 scale-110" />
//                         )}
//                         <svg width="90" height="108" viewBox="0 0 90 108" xmlns="http://www.w3.org/2000/svg">
//                           {/* Shirt / body */}
//                           <ellipse cx="45" cy="100" rx="30" ry="12" fill={face.shirt} />
//                           {isFemale && <ellipse cx="45" cy="92" rx="22" ry="16" fill={face.shirt} />}

//                           {/* Neck */}
//                           <rect x="39" y="72" width="12" height="14" rx="4" fill={face.skin} />

//                           {/* Head — female rounder/taller */}
//                           <ellipse
//                             cx="45" cy={isFemale ? "50" : "52"}
//                             rx={isFemale ? "22" : "23"}
//                             ry={isFemale ? "28" : "25"}
//                             fill={face.skin}
//                           />

//                           {/* ── HAIR ── */}
//                           {isFemale && face.hairStyle === "long" && <>
//                             {/* top cap */}
//                             <ellipse cx="45" cy="28" rx="22" ry="11" fill={face.hair} />
//                             {/* long sides */}
//                             <rect x="22" y="26" width="9" height="38" rx="5" fill={face.hair} />
//                             <rect x="59" y="26" width="9" height="38" rx="5" fill={face.hair} />
//                             {/* back fill */}
//                             <rect x="23" y="24" width="44" height="12" rx="4" fill={face.hair} />
//                           </>}
//                           {isFemale && face.hairStyle === "bun" && <>
//                             <ellipse cx="45" cy="28" rx="22" ry="11" fill={face.hair} />
//                             {/* bun */}
//                             <ellipse cx="45" cy="16" rx="11" ry="9" fill={face.hair} />
//                             <rect x="22" y="26" width="8" height="22" rx="4" fill={face.hair} />
//                             <rect x="60" y="26" width="8" height="22" rx="4" fill={face.hair} />
//                           </>}
//                           {!isFemale && <>
//                             <ellipse cx="45" cy="30" rx="23" ry="10" fill={face.hair} />
//                             <rect x="22" y="28" width="8" height="14" rx="3" fill={face.hair} />
//                             <rect x="60" y="28" width="8" height="14" rx="3" fill={face.hair} />
//                           </>}

//                           {/* ── EYES ── */}
//                           {/* whites */}
//                           <ellipse cx="34" cy={isFemale ? "49" : "51"} rx="5" ry="4" fill="white" />
//                           <ellipse cx="56" cy={isFemale ? "49" : "51"} rx="5" ry="4" fill="white" />
//                           {/* pupils */}
//                           <ellipse cx="34" cy={isFemale ? "49" : "51"} rx="3" ry={speaking ? "3.5" : "3"} fill="#2D2D2D" />
//                           <ellipse cx="56" cy={isFemale ? "49" : "51"} rx="3" ry={speaking ? "3.5" : "3"} fill="#2D2D2D" />
//                           {/* shine */}
//                           <circle cx="35.5" cy={isFemale ? "47.5" : "49.5"} r="1.2" fill="white" />
//                           <circle cx="57.5" cy={isFemale ? "47.5" : "49.5"} r="1.2" fill="white" />

//                           {/* ── EYELASHES (female only) ── */}
//                           {isFemale && <>
//                             <line x1="29" y1="45" x2="27" y2="42" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
//                             <line x1="32" y1="44" x2="31" y2="41" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
//                             <line x1="35" y1="44" x2="35" y2="41" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
//                             <line x1="38" y1="45" x2="39" y2="42" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
//                             <line x1="51" y1="45" x2="51" y2="42" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
//                             <line x1="54" y1="44" x2="53" y2="41" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
//                             <line x1="57" y1="44" x2="57" y2="41" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
//                             <line x1="60" y1="45" x2="62" y2="42" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
//                           </>}

//                           {/* ── EYEBROWS ── */}
//                           {isFemale ? <>
//                             {/* thin arched female brows */}
//                             <path d="M29 42 Q34 38 39 42" stroke={face.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
//                             <path d="M51 42 Q56 38 61 42" stroke={face.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
//                           </> : variant === 0 ? <>
//                             <path d="M29 45 Q33 42 38 45" stroke={face.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
//                             <path d="M52 45 Q56 42 61 45" stroke={face.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
//                           </> : variant === 1 ? <>
//                             <path d="M29 44 Q33 41 38 44" stroke={face.hair} strokeWidth="2" fill="none" strokeLinecap="round" />
//                             <path d="M52 44 Q56 41 61 44" stroke={face.hair} strokeWidth="2" fill="none" strokeLinecap="round" />
//                           </> : <>
//                             <path d="M30 45 Q33 43 38 46" stroke={face.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
//                             <path d="M52 46 Q56 43 60 45" stroke={face.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
//                           </>}

//                           {/* Nose */}
//                           <path
//                             d={isFemale ? "M45 55 Q44 59 45 60 Q46 59 45 55" : "M45 56 Q43 61 45 62 Q47 61 45 56"}
//                             stroke="#C8956C" strokeWidth="1" fill="none"
//                           />

//                           {/* ── Blush (female only) ── */}
//                           {isFemale && <>
//                             <ellipse cx="28" cy="58" rx="6" ry="4" fill="#FFB3C1" opacity="0.45" />
//                             <ellipse cx="62" cy="58" rx="6" ry="4" fill="#FFB3C1" opacity="0.45" />
//                           </>}

//                           {/* Canvas mouth for lip sync */}
//                           <foreignObject x="23" y="62" width="44" height="24">
//                             <canvas
//                               ref={(el) => { mouthCanvasRefs.current[rep.id] = el; }}
//                               width={80}
//                               height={40}
//                               style={{ width: "44px", height: "24px", display: "block" }}
//                             />
//                           </foreignObject>
//                         </svg>
//                       </div>

//                       {/* Rep info */}
//                       <div className="text-center mt-1">
//                         {/* Name */}
//                         <p className={`font-bold text-sm mb-1.5 ${speaking ? "text-purple-700" : "text-[#2D2D2D]"}`}>
//                           {rep.name.toUpperCase()}
//                         </p>
//                         {/* Role · Personality · Gender — side by side */}
//                         <div className="flex flex-wrap items-center justify-center gap-1">
//                           <span className="text-[9px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                             {rep.role.toUpperCase()}
//                           </span>
//                           <span className="text-[9px] font-semibold bg-[#EEF2FF] text-indigo-600 px-2 py-0.5 rounded-full">
//                             {personalityStr}
//                           </span>
//                           <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full
//                             ${isFemale ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
//                             {isFemale ? "♀ F" : "♂ M"}
//                           </span>
//                         </div>
//                         {/* Speaking indicator */}
//                         {speaking && (
//                           <div className="mt-1.5 flex items-center justify-center gap-1">
//                             <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0s]" />
//                             <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.15s]" />
//                             <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.3s]" />
//                             <span className="ml-1 text-[10px] text-purple-600 font-medium">Speaking</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* ── User (You) card — shows when user is speaking ── */}
//                 <div
//                   className={`flex flex-col items-center p-4 rounded-xl flex-1 min-w-[160px] max-w-[220px] transition-all duration-200
//                     ${isRecording
//                       ? "border-2 border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-300/40"
//                       : "border border-gray-200 bg-white"
//                     }`}
//                 >
//                   <div className="relative mb-2">
//                     {/* Speaking glow ring when recording */}
//                     {isRecording && (
//                       <div className="absolute inset-0 rounded-full animate-ping bg-indigo-400/30 scale-110" />
//                     )}
//                     {/* Profile image or initials fallback */}
//                     <div className={`w-[90px] h-[90px] rounded-full overflow-hidden border-4 transition-all duration-200
//                       ${isRecording ? "border-indigo-500 shadow-md shadow-indigo-300/50" : "border-gray-200"}`}
//                     >
//                       {userImage ? (
//                         <Image
//                           src={userImage}
//                           width={90}
//                           height={90}
//                           alt={userDisplayName}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className={`w-full h-full flex items-center justify-center text-2xl font-bold
//                           ${isRecording ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-600"}`}
//                         >
//                           {userDisplayName.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* User info */}
//                   <div className="text-center">
//                     <p className={`font-bold text-sm ${isRecording ? "text-indigo-700" : "text-[#2D2D2D]"}`}>
//                       {userDisplayName.toUpperCase()}
//                     </p>
//                     <p className="text-xs text-[#636F85]">Sales Rep (You)</p>
//                     {/* Speaking indicator */}
//                     {isRecording && (
//                       <div className="mt-2 flex items-center justify-center gap-1">
//                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0s]" />
//                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.15s]" />
//                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.3s]" />
//                         <span className="ml-1 text-[10px] text-indigo-600 font-medium">Speaking</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//               </div>
//             </div>
//           )}

//           {/* Methodology & Questions Reference Panel */}
//           {/* ── Two-column layout ── */}
//           {isConnected && (
//             <div className="flex flex-col lg:flex-row gap-6 items-start">

//               {/* ── LEFT: Core Fields + Discovery Questions ── */}
//               <div className="flex flex-col gap-4 lg:w-[45%] w-full">
//                 {sales_methodology && METHODOLOGY_DATA[sales_methodology] && (
//                   <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl p-4">
//                     <h3 className="text-sm font-semibold text-[#6E51E0] mb-3 flex items-center gap-2">
//                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
//                       {sales_methodology} — Core Fields
//                     </h3>
//                     <div className="space-y-1.5">
//                       {METHODOLOGY_DATA[sales_methodology].map((item) => (
//                         <div key={item.field} className="flex items-start gap-2">
//                           <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#6E51E0] mt-1.5" />
//                           <div className="flex flex-wrap gap-x-1.5 text-xs leading-relaxed">
//                             <span className="font-semibold text-[#2D2D2D]">{item.field}</span>
//                             <span className="text-[#636F85]">— {item.definition}</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {questions && questions.length > 0 && (
//                   <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
//                     <h3 className="text-sm font-semibold text-[#16A34A] mb-3 flex items-center gap-2">
//                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
//                       Discovery Questions
//                     </h3>
//                     <ol className="space-y-1.5">
//                       {questions.map((q: string, i: number) => (
//                         <li key={i} className="flex gap-2 items-start text-xs">
//                           <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[9px] font-bold flex items-center justify-center mt-0.5">
//                             {i + 1}
//                           </span>
//                           <span className="text-[#2D2D2D] leading-relaxed">{q}</span>
//                         </li>
//                       ))}
//                     </ol>
//                   </div>
//                 )}
//               </div>

//               {/* ── RIGHT: Voice Conversation + Transcript ── */}
//               <div className="flex flex-col gap-4 lg:w-[55%] w-full">

//                 {/* Voice Conversation (mic + timer) — top of right column */}
//                 <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
//                   <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2 text-[#2D2D2D]">Voice Conversation</h2>

//                   {meetingDuration > 0 && (
//                     <div className="mb-5">
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-sm font-medium text-[#636F85]">⏱ Time Remaining</span>
//                         <span className={`text-sm font-bold font-mono ${timeRemaining <= 60 ? "text-red-600 animate-pulse" : timeRemaining <= 120 ? "text-orange-500" : "text-[#6E51E0]"}`}>
//                           {formatTime(timeRemaining)}
//                         </span>
//                       </div>
//                       <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                         <div
//                           className={`h-2 rounded-full transition-all duration-1000 ${timeRemaining <= 60 ? "bg-red-500" : timeRemaining <= 120 ? "bg-orange-400" : "bg-[#6E51E0]"}`}
//                           style={{ width: `${(timeRemaining / meetingDuration) * 100}%` }}
//                         />
//                       </div>
//                       {timeRemaining <= 60 && (
//                         <p className="text-xs text-red-500 mt-1 text-center animate-pulse">⚠️ Meeting ending soon...</p>
//                       )}
//                     </div>
//                   )}

//                   <div className="flex flex-col items-center gap-4">
//                     <button
//                       title={isAIReplying || isPlayingAudioRef.current ? "AI is speaking..." : isRecording ? "Click to stop" : "Click to speak"}
//                       className={`w-20 h-20 rounded-full text-white text-2xl flex items-center justify-center shadow-lg cursor-pointer
//                         ${isRecording
//                           ? "bg-red-600 animate-pulse shadow-red-400/50"
//                           : isAIReplying || isPlayingAudioRef.current
//                             ? "bg-purple-500 animate-pulse"
//                             : "bg-gradient-to-br from-indigo-500 to-purple-600"
//                         } transition-all duration-300 ease-in-out`}
//                       onClick={toggleRecording}
//                     >
//                       {isAIReplying || isPlayingAudioRef.current ? "🔊" : "🎤"}
//                     </button>
//                     <div className="h-5 flex items-center justify-center">
//                       <span className="text-sm text-gray-600">{micLabel}</span>
//                     </div>
//                     {/* Fixed height so layout never shifts */}
//                     <div className="h-4 flex items-center justify-center">
//                       {silenceCountdown && (
//                         <span className="text-xs text-orange-500 font-medium">{silenceCountdown}</span>
//                       )}
//                     </div>
//                     <button
//                       className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer w-full"
//                       onClick={disconnect}
//                     >
//                       End Conversation
//                     </button>
//                   </div>
//                 </div>

//                 {/* Conversation Transcript — below mic */}
//                 <div>
//                   <h2 className="text-xl font-semibold mb-3 text-[#2D2D2D]">Conversation Transcript</h2>
//                   <div className="bg-[#F8F9FC] rounded-xl p-5 overflow-y-auto space-y-4 border border-gray-200" style={{ maxHeight: "420px" }}>
//                     {transcript.length === 0 && (
//                       <div className="text-gray-400 text-center italic py-10">
//                         Start speaking — transcript will appear here.
//                       </div>
//                     )}
//                     {transcript.map((msg, index) => {
//                       const isLast = index === transcript.length - 1;
//                       const isUser = msg.type === 'user';
//                       const isSystem = msg.type === 'system';

//                       if (isSystem) {
//                         return (
//                           <div key={msg.id} className="flex justify-center py-2">
//                             <div className="text-gray-400 text-[11px] italic px-4 py-1 bg-gray-50/50 rounded-full border border-gray-100">
//                               {msg.text}
//                             </div>
//                           </div>
//                         );
//                       }

//                       return (
//                         <div
//                           key={msg.id}
//                           className={`flex gap-5 p-5 transition-all duration-300 relative ${isLast ? "bg-blue-50/40 border-l-[5px] border-blue-500 rounded-lg bg-blue-100" : "border-l-[5px] border-transparent"}`}
//                         >
//                           <div className="shrink-0 pt-1">
//                             <div className="bg-white border border-gray-200 rounded-[6px] px-2 py-0.5 text-[11px] font-medium text-gray-500">
//                               {msg.timestamp}
//                             </div>
//                           </div>
//                           <div className="flex flex-col gap-1.5 w-full">
//                             <div className="flex items-center gap-3">
//                               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isUser ? "bg-purple-100 border-purple-200 text-purple-600" : "bg-orange-100 border-orange-200 text-orange-600"}`}>
//                                 <User size={16} />
//                               </div>
//                               <span className="text-sm font-bold text-gray-900">{isUser ? "You" : msg.speaker}</span>
//                             </div>
//                             <div className="text-[14px] text-gray-700 leading-relaxed pl-11 -mt-1.5">
//                               {msg.text}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}

//                     {isAIReplying && (
//                       <div className="flex justify-start animate-[fadeIn_0.3s_ease-in]">
//                         <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm flex items-center gap-2">
//                           <div className="flex gap-1">
//                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
//                           </div>
//                           <span className="text-xs text-emerald-600 font-medium italic">AI is thinking...</span>
//                         </div>
//                       </div>
//                     )}

//                     <div ref={transcriptEndRef} />
//                   </div>
//                 </div>

//               </div>
//               {/* ── end right column ── */}

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
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import Image from "next/image";


type Rep = {
  id: string;
  name: string;
  role: string;
  personality: string[] | string;
  gender?: string; // "male" | "female" — sent from Step2
};

// Methodology core fields data (same as Step4)
const METHODOLOGY_DATA: Record<string, { field: string; definition: string }[]> = {
  MEDDIC: [
    { field: "Metrics", definition: "Quantified business impact / ROI" },
    { field: "Economic Buyer", definition: "Person with final budget authority" },
    { field: "Decision Criteria", definition: "Factors used to evaluate vendors" },
    { field: "Decision Process", definition: "Steps to approve purchase" },
    { field: "Identify Pain", definition: "Main business problem to solve" },
    { field: "Champion", definition: "Internal advocate pushing your deal" },
  ],
  "Challenger Sales": [
    { field: "Commercial Insight", definition: "New perspective taught to buyer" },
    { field: "Pain Intensity", definition: "Severity of business issue" },
    { field: "Change Urgency", definition: "Need to act now" },
    { field: "Stakeholder Alignment", definition: "Internal agreement across teams" },
    { field: "Status Quo Cost", definition: "Risk/cost of doing nothing" },
  ],
  BANT: [
    { field: "Budget", definition: "Available spending capacity" },
    { field: "Authority", definition: "Decision-maker ownership" },
    { field: "Need", definition: "Clear business requirement" },
    { field: "Timeline", definition: "Expected buying timeframe" },
  ],
  "SPIN Selling": [
    { field: "Situation", definition: "Current customer environment" },
    { field: "Problem", definition: "Existing issue/friction" },
    { field: "Implication", definition: "Business consequences of problem" },
    { field: "Need-Payoff", definition: "Value of solving the issue" },
  ],
  MEDDPICC: [
    { field: "Metrics", definition: "Quantified business impact" },
    { field: "Economic Buyer", definition: "Final financial approver" },
    { field: "Decision Criteria", definition: "Vendor evaluation standards" },
    { field: "Decision Process", definition: "Internal approval workflow" },
    { field: "Paper Process", definition: "Procurement/legal contract steps" },
    { field: "Identify Pain", definition: "Critical business challenge" },
    { field: "Champion", definition: "Internal supporter influencing deal" },
    { field: "Competition", definition: "Alternative vendors or status quo" },
  ],
  "Value Selling": [
    { field: "Business Value", definition: "Measurable customer gain" },
    { field: "ROI", definition: "Financial return expected" },
    { field: "Customer Goals", definition: "Strategic objectives" },
    { field: "Pain Cost", definition: "Cost of current problem" },
    { field: "Success Outcomes", definition: "Desired measurable result" },
  ],
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

  const [showMeetingUi, setShowMeetingUi] = useState(false);

  const router = useRouter();

  // get all data form redux 
  const allData = useSelector((state: RootState) => state.startMeeting);
  // console.log(allData?.payloadData, "============all data")
  const { meeting_goal, duration_minutes, sales_methodology, representatives, questions } = allData?.payloadData || {}

  // ─── User profile for avatar ───────────────────────────
  const { data: getMeData } = useGetMeQuery("");
  const userProfile = getMeData?.data;
  const userDisplayName = userProfile?.firstName
    ? `${userProfile.firstName} ${userProfile.lastName || ""}`.trim()
    : "You";
  const userImage = userProfile?.profileImage || null;

  // ─── Name→gender map from Step2 cookie ────────────────
  const participantGenderMap: Record<string, string> = (() => {
    try {
      return JSON.parse(Cookies.get("participantGenderMap") || "{}");
    } catch { return {}; }
  })();

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
  // ─── Gamified countdown state ─────────────────────────
  const [countdown, setCountdown] = useState<number | "GO!" | null>(null);

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
  // ─── AI Audio lip-sync refs ────────────────────────────
  const aiAudioCtxRef = useRef<AudioContext | null>(null);
  const aiAnalyserRef = useRef<AnalyserNode | null>(null);
  const aiAnimFrameRef = useRef<number | null>(null);
  const currentSpeakingRepIdRef = useRef<string | null>(null);
  // canvas refs for each rep mouth (direct DOM draw — no React setState at 60fps)
  const mouthCanvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  // smoothed amplitude per rep (lerped, not React state)
  const smoothedAmpRef = useRef<Record<string, number>>({});

  // ─── AI Response Buffer (accumulates streaming words into one message) ───
  const aiResponseBufferRef = useRef<{
    speaker: string;
    text: string;
    type: TranscriptMessage['type'];
  } | null>(null);

  const silenceStartRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);
  const isAIReplyingRef = useRef(false);
  const isConnectedRef = useRef(false);
  const isNewUserTurnRef = useRef(true);
  const hasDetectedVoiceRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const meetingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Silence detection: 800ms after voice stops → send audio (faster than old 3s)
  const SILENCE_DELAY_MS = 800;
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
    console.log("🧑 Rep data from backend:", JSON.stringify(reps, null, 2));
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
      stopLipSync();
      onAllAudioFinished();
      return;
    }
    isPlayingAudioRef.current = true;

    const { base64, mimeType, repId, speakerName } = audioQueueRef.current.shift()!;
    setRepSpeakingState(repId, true);
    currentSpeakingRepIdRef.current = repId;
    setStatusBox("playing", `🔊 ${speakerName} is speaking...`);
    setMicLabel(`${speakerName} is speaking...`);

    // ✅ Stop mic while AI is speaking
    if (isRecordingRef.current) stopListening();

    // ─── Pipe audio through AudioContext for real lip sync ───
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    aiAudioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    aiAnalyserRef.current = analyser;

    // Decode base64 → ArrayBuffer → AudioBuffer
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    ctx.decodeAudioData(bytes.buffer, (audioBuffer) => {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;

      // Connect: source → analyser → speakers
      source.connect(analyser);
      analyser.connect(ctx.destination);
      source.start();

      // Start RAF lip-sync loop
      startLipSyncLoop(repId, analyser);

      source.onended = () => {
        setRepSpeakingState(repId, false);
        stopLipSync();
        playNextInQueue();
      };
    }, () => {
      // Decode failed — fallback to plain Audio element
      setRepSpeakingState(repId, false);
      stopLipSync();
      playNextInQueue();
    });
  }

  // ─── Lip-sync RAF loop ─────────────────────────────────
  // ─── Lip-sync RAF loop — canvas-based, no React setState ─
  function startLipSyncLoop(repId: string, analyser: AnalyserNode) {
    const fftSize = analyser.fftSize;                 // 256
    const sampleRate = aiAudioCtxRef.current?.sampleRate ?? 44100;
    const binCount = analyser.frequencyBinCount;      // 128
    const dataArray = new Uint8Array(binCount);

    // Voice fundamental + harmonics: ~85 Hz – 3000 Hz
    // Map to FFT bins: binIndex = freq * fftSize / sampleRate
    const binLow = Math.floor(85 * fftSize / sampleRate);
    const binHigh = Math.ceil(3000 * fftSize / sampleRate);

    if (!smoothedAmpRef.current[repId]) smoothedAmpRef.current[repId] = 0;

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);

      // 1. Sum only voice-band bins
      let sum = 0;
      const count = binHigh - binLow + 1;
      for (let i = binLow; i <= binHigh && i < binCount; i++) sum += dataArray[i];
      const raw = sum / (count * 255); // 0–1

      // 2. Lerp for smoothing: fast attack (0.45), slow decay (0.25)
      const prev = smoothedAmpRef.current[repId];
      const lerpFactor = raw > prev ? 0.45 : 0.25;
      const amp = prev + (raw - prev) * lerpFactor;
      smoothedAmpRef.current[repId] = amp;

      // 3. Draw directly to canvas — zero React re-render
      const canvas = mouthCanvasRefs.current[repId];
      if (canvas) drawMouth(canvas, amp, repId);

      aiAnimFrameRef.current = requestAnimationFrame(tick);
    };

    aiAnimFrameRef.current = requestAnimationFrame(tick);
  }

  function drawMouth(canvas: HTMLCanvasElement, amp: number, repId: string) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;   // 80
    const H = canvas.height;  // 40

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const mouthW = 22;
    // mouth height: 1px (closed smile) → 16px (wide open)
    const mouthH = 1 + amp * 15;

    if (amp < 0.05) {
      // ── Closed: gentle smile curve ──
      ctx.beginPath();
      ctx.moveTo(cx - mouthW / 2, cy);
      ctx.quadraticCurveTo(cx, cy + 5, cx + mouthW / 2, cy);
      ctx.strokeStyle = "#C0525A";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
    } else {
      // ── Open: outer lips ──
      ctx.beginPath();
      ctx.ellipse(cx, cy, mouthW / 2, mouthH / 2 + 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#C0525A";
      ctx.fill();

      // ── Inner mouth (dark) ──
      ctx.beginPath();
      ctx.ellipse(cx, cy + 1, (mouthW / 2) - 3, mouthH / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#3B0A14";
      ctx.fill();

      // ── Teeth — only when sufficiently open ──
      if (amp > 0.2) {
        const teethH = Math.min((amp - 0.2) * 10, 5);
        ctx.beginPath();
        ctx.ellipse(cx, cy - 1, (mouthW / 2) - 5, teethH, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // ── Gloss highlight ──
      ctx.beginPath();
      ctx.ellipse(cx - 4, cy - mouthH / 4, 4, 2, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fill();
    }
  }

  function stopLipSync() {
    if (aiAnimFrameRef.current) {
      cancelAnimationFrame(aiAnimFrameRef.current);
      aiAnimFrameRef.current = null;
    }
    // Draw closed mouth on the speaking rep's canvas
    if (currentSpeakingRepIdRef.current) {
      smoothedAmpRef.current[currentSpeakingRepIdRef.current] = 0;
      const canvas = mouthCanvasRefs.current[currentSpeakingRepIdRef.current];
      if (canvas) drawMouth(canvas, 0, currentSpeakingRepIdRef.current);
      currentSpeakingRepIdRef.current = null;
    }
    if (aiAudioCtxRef.current) {
      aiAudioCtxRef.current.close().catch(() => { });
      aiAudioCtxRef.current = null;
    }
    aiAnalyserRef.current = null;
  }

  // ✅ Auto-restart listening after AI finishes — natural conversation flow
  function onAllAudioFinished() {
    flushAIBuffer();
    // ✅ Clear buffer after AI turn ends — prevents duplicate bubbles on next turn
    aiResponseBufferRef.current = null;
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

  // ─── Gamified countdown before meeting starts ─────────
  // function startCountdown() {
  //   connectToMeeting();
  //   const steps: (number | "GO!")[] = [5, 4, 3, 2, 1, "GO!"];
  //   let i = 0;
  //   setCountdown(steps[i]);
  //   const timer = setInterval(() => {
  //     i++;
  //     if (i < steps.length) {
  //       setCountdown(steps[i]);
  //     } else {
  //       clearInterval(timer);
  //       setCountdown(null);
  //       // connectToMeeting();
  //     }
  //   }, 900);
  // }

  const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  async function startCountdown() {
    const steps: (number | "GO!")[] = [5, 4, 3, 2, 1, "GO!"];
    let i = 0;

    setCountdown(steps[i]);

    const timer = setInterval(() => {
      i++;

      if (i < steps.length) {
        setCountdown(steps[i]);
      } else {
        clearInterval(timer);
        setCountdown(null);
      }
    }, 900);

    // startCountdown call হওয়ার 5 second পর
    await delay(3000);
    connectToMeeting();
  }

  async function connectToMeeting() {
    try {
      const meetingId = Cookies.get("meetingId")?.trim() || "";
      // console.log(meetingId, "=================meeting id in connect to meeting function");

      if (!meetingId) {
        toast.error("⚠️ Meeting ID not found");
        return;
      }

      setStatusBox("disconnected", "Connecting...");

      const response = await fetch(
        // `https://ai-julientmts.aiteamtwo.com/meetings/api/meeting/${meetingId}/start`,
        `https://8d73-137-59-180-177.ngrok-free.app/api/meeting/${meetingId}/start`,
        // `https://ai-julientmts.aiteamtwo.com/api/meeting/${meetingId}/start`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const message = errData?.detail || errData?.message || "Failed to start meeting";
        throw new Error(message);
      }

      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(
        // `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
        `https://8d73-137-59-180-177.ngrok-free.app/api/conversation/ws/live-conversation/${meetingId}`
        // `https://ai-julientmts.aiteamtwo.com/conversations/api/conversation/ws/live-conversation/${meetingId}`
        // `ws://localhost:8000/conversations/api/conversation/ws/realtime/${meetingId}`
      );

      wsRef.current = ws;

      ws.onopen = () => {
        // console.log("✅ WebSocket connected");
        startTimeRef.current = Date.now();
        setIsConnected(true);
        isConnectedRef.current = true;
      };

      // ws.onmessage = (event) => {
      //   console.log(event, "===================event========================")
      //   const data = JSON.parse(event.data);
      //   handleMessage(data);
      // };

      ws.onmessage = (event) => {
        // console.log(event, "===================event========================")
        const data = JSON.parse(event.data);

        // 👇 EXACT LINES ADDED HERE 👇
        if (data.type === 'transcription') console.log(`👤 User: ${data.text}`);
        if (data.type === 'ai_response_text') console.log(`🤖 AI: ${data.text}`);

        handleMessage(data);
      };





      ws.onerror = (err) => {
        // console.error("WebSocket error:", err);
        toast.error("❌ WebSocket connection error");
        setStatusBox("disconnected", "Connection error");
      };

      ws.onclose = () => {
        flushAIBuffer();
        setStatusBox("disconnected", "Disconnected");
        setIsConnected(false);
        isConnectedRef.current = false;
        disableMic();
      };

    } catch (error: any) {
      // console.error("Connect meeting error:", error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      toast.error(`❌ ${message}, You have to create new meeting from before step`);
    }
  }

  // ─── WS Handler ───────────────────────────────────────
  function handleMessage(data: any) {
    // console.log(data, "==========data================")
    // console.log("📨", data.type, data);

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
        // ✅ Clear buffer so old AI text doesn't leak into the new turn as a duplicate
        aiResponseBufferRef.current = null;
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

  // ─── Mic + fast silence detection ─────────────────────
  async function startListening() {
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
          if (isConnectedRef.current && !isAIReplyingRef.current) {
            setTimeout(() => startListening(), 300);
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
      setMicLabel("Listening...");
      startVolumeMonitor();

    } catch (err) {
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

  function toggleRecording() {
    if (isAIReplyingRef.current || isPlayingAudioRef.current) return;
    if (isRecordingRef.current) stopListening();
    else startListening();
  }

  // ─── Volume monitor (fast silence: 800ms) ─────────────
  function startVolumeMonitor() {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    volumeIntervalRef.current = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (avg > SILENCE_THRESHOLD) {
        hasDetectedVoiceRef.current = true;
        silenceStartRef.current = null;
        setSilenceCountdown("");
      } else {
        if (!silenceStartRef.current) {
          silenceStartRef.current = Date.now();
        } else {
          const elapsed = Date.now() - silenceStartRef.current;
          if (elapsed >= SILENCE_DELAY_MS) {
            silenceStartRef.current = null;
            stopVolumeMonitor();
            stopListening();
          } else {
            const remaining = ((SILENCE_DELAY_MS - elapsed) / 1000).toFixed(1);
            setSilenceCountdown(`Sending in ${remaining}s...`);
          }
        }
      }
    }, 100);
  }

  function stopVolumeMonitor() {
    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    volumeIntervalRef.current = null;
  }

  async function disconnect() {
    // ── Stop everything IMMEDIATELY on click ──
    stopListening();
    stopVolumeMonitor();
    stopMeetingTimer();
    stopLipSync();
    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;
    setSilenceCountdown("");
    setMicLabel("Ending...");

    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: "disconnect" }));
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    isConnectedRef.current = false;
    setIsAIReplying(false);
    isAIReplyingRef.current = false;
    flushAIBuffer();

    // ── API calls in background (don't block UI) ──
    const meetingId = Cookies.get("meetingId")?.trim() || "";
    try {
      const response = await fetch(
        `https://8d73-137-59-180-177.ngrok-free.app/api/meeting/${meetingId}/end`,
        // `https://ai-julientmts.aiteamtwo.com/api/meeting/${meetingId}/end`,
        { method: "POST" }
      );
      if (response) {
        await updateMeeting({ meetingId, playload: { status: "completed" } }).unwrap();
      }
    } catch {
      // silent — UI already cleaned up
    }

    setTranscript([]);
    setReps([]);
    setRepSpeaking({});
    setTimeRemaining(0);
    setMeetingDuration(0);
    toast.success("✅ Meeting ended successfully");
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
      stopLipSync();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white w-full border border-[#6E51E0] rounded-xl p-2 relative overflow-hidden">

        {/* ── Gamified Countdown Overlay ── */}
        {countdown !== null && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0533] via-[#2d1b69] to-[#0f0c29] rounded-xl overflow-hidden">
            {/* animated radial pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="absolute w-72 h-72 rounded-full border-4 border-[#6E51E0]/30 animate-ping" />
              <span className="absolute w-52 h-52 rounded-full border-4 border-[#a78bfa]/40 animate-ping [animation-delay:0.3s]" />
              <span className="absolute w-36 h-36 rounded-full border-4 border-[#c4b5fd]/50 animate-ping [animation-delay:0.6s]" />
            </div>

            {/* particle dots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#a78bfa] opacity-70 animate-bounce"
                  style={{
                    left: `${8 + i * 7.5}%`,
                    top: `${10 + (i % 4) * 22}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: `${0.8 + (i % 3) * 0.4}s`,
                  }}
                />
              ))}
            </div>

            {/* main number / GO! */}
            <div className="relative flex flex-col items-center gap-4">
              <div
                key={String(countdown)}
                className={`
                  font-black select-none leading-none
                  transition-all duration-150
                  ${countdown === "GO!"
                    ? "text-[9rem] text-emerald-400 drop-shadow-[0_0_60px_rgba(52,211,153,0.9)] scale-125 animate-[pulse_0.4s_ease-out]"
                    : "text-[11rem] text-white drop-shadow-[0_0_80px_rgba(167,139,250,0.9)] animate-[ping_0.15s_ease-out_1]"
                  }
                `}
                style={{
                  textShadow:
                    countdown === "GO!"
                      ? "0 0 40px #34d399, 0 0 80px #10b981"
                      : "0 0 40px #a78bfa, 0 0 80px #6E51E0",
                  animation: "countPop 0.45s cubic-bezier(0.175,0.885,0.32,1.275)",
                }}
              >
                {countdown}
              </div>

              {/* sub-label */}
              <p className="text-[#c4b5fd] text-lg font-semibold tracking-widest uppercase">
                {countdown === "GO!" ? "🚀 Launching your meeting!" : "Get ready..."}
              </p>

              {/* progress dots */}
              <div className="flex gap-3 mt-2">
                {[5, 4, 3, 2, 1].map((n) => (
                  <div
                    key={n}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${typeof countdown === "number" && n >= countdown
                      ? "bg-[#6E51E0] scale-125 shadow-[0_0_8px_#6E51E0]"
                      : countdown === "GO!"
                        ? "bg-emerald-400 scale-125"
                        : "bg-white/20"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* keyframe injection via style tag */}
            <style>{`
              @keyframes countPop {
                0%   { transform: scale(0.4) rotate(-8deg); opacity: 0; }
                60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
            `}</style>
          </div>
        )}
        {/* Setup — Pre-meeting screen */}
        {!showMeetingUi && (
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
                  onClick={() => {
                    startCountdown();
                    setShowMeetingUi(true);
                  }}
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
          {showMeetingUi && (
            <div className={`p-4 rounded-lg border-l-4 ${statusColors[status.type]} flex items-center gap-3 font-medium`}>
              <div className={`w-3 h-3 rounded-full ${status.type === "disconnected" ? "bg-red-600" : "bg-green-600"} animate-pulse`}></div>
              {status.text}
            </div>
          )}

          {/* AI Reps with lip-sync avatars */}
          {showMeetingUi && reps.length > 0 && (
            <div>
              <div className="flex items-center gap-2">
                <FaUsersGear size={20} className="text-[#6E51E0] -mt-4" />
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#6E51E0]"> AI Representatives</h2>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {reps.map((rep, repIndex) => {
                  const speaking = repSpeaking[rep.id];

                  // ── Gender: backend field → cookie map → fallback ──
                  const genderRaw = (
                    rep.gender ||
                    (rep as any).gender_type ||
                    (rep as any).voice_gender ||
                    participantGenderMap[rep.name.toLowerCase().trim()] ||
                    ""
                  ).toLowerCase();
                  const isFemale = genderRaw === "female" || genderRaw === "f";

                  // ── Unique face variant per same-gender rep ──
                  const sameGenderBefore = reps.slice(0, repIndex).filter(r => {
                    const g = (
                      r.gender ||
                      (r as any).gender_type ||
                      (r as any).voice_gender ||
                      participantGenderMap[r.name.toLowerCase().trim()] ||
                      ""
                    ).toLowerCase();
                    return (g === "female" || g === "f") === isFemale;
                  }).length;
                  const variant = sameGenderBefore % 3;

                  const femaleVariants = [
                    { skin: "#FDDBB4", hair: "#4A2C0A", shirt: "#E879A0", hairStyle: "long" },
                    { skin: "#F5C5A3", hair: "#1A1A2E", shirt: "#A855F7", hairStyle: "bun" },
                    { skin: "#EAD5C4", hair: "#C67C3B", shirt: "#EC4899", hairStyle: "long" },
                  ];
                  const maleVariants = [
                    { skin: "#F4C38A", hair: "#2C1810", shirt: "#6E51E0", hairStyle: "short" },
                    { skin: "#FDDBB4", hair: "#5C4033", shirt: "#3B82F6", hairStyle: "short" },
                    { skin: "#D4956A", hair: "#1C1C1C", shirt: "#10B981", hairStyle: "short" },
                  ];
                  const face = isFemale ? femaleVariants[variant] : maleVariants[variant];

                  // personality string
                  const personalityStr = Array.isArray(rep.personality)
                    ? rep.personality.map((p: string) => p.toUpperCase()).join(", ")
                    : (rep.personality || "N/A").toString().toUpperCase();

                  return (
                    <div
                      key={rep.id}
                      className={`flex flex-col items-center p-4 rounded-xl flex-1 min-w-[160px] max-w-[220px]
                        ${speaking
                          ? "border-2 border-purple-500 bg-purple-50 shadow-lg shadow-purple-300/40"
                          : "border border-gray-200 bg-white"
                        } transition-all duration-200`}
                    >
                      <div className="relative mb-2">
                        {speaking && (
                          <div className="absolute inset-0 rounded-full animate-ping bg-purple-400/30 scale-110" />
                        )}
                        <svg width="90" height="108" viewBox="0 0 90 108" xmlns="http://www.w3.org/2000/svg">
                          {/* Shirt / body */}
                          <ellipse cx="45" cy="100" rx="30" ry="12" fill={face.shirt} />
                          {isFemale && <ellipse cx="45" cy="92" rx="22" ry="16" fill={face.shirt} />}

                          {/* Neck */}
                          <rect x="39" y="72" width="12" height="14" rx="4" fill={face.skin} />

                          {/* Head — female rounder/taller */}
                          <ellipse
                            cx="45" cy={isFemale ? "50" : "52"}
                            rx={isFemale ? "22" : "23"}
                            ry={isFemale ? "28" : "25"}
                            fill={face.skin}
                          />

                          {/* ── HAIR ── */}
                          {isFemale && face.hairStyle === "long" && <>
                            {/* top cap */}
                            <ellipse cx="45" cy="28" rx="22" ry="11" fill={face.hair} />
                            {/* long sides */}
                            <rect x="22" y="26" width="9" height="38" rx="5" fill={face.hair} />
                            <rect x="59" y="26" width="9" height="38" rx="5" fill={face.hair} />
                            {/* back fill */}
                            <rect x="23" y="24" width="44" height="12" rx="4" fill={face.hair} />
                          </>}
                          {isFemale && face.hairStyle === "bun" && <>
                            <ellipse cx="45" cy="28" rx="22" ry="11" fill={face.hair} />
                            {/* bun */}
                            <ellipse cx="45" cy="16" rx="11" ry="9" fill={face.hair} />
                            <rect x="22" y="26" width="8" height="22" rx="4" fill={face.hair} />
                            <rect x="60" y="26" width="8" height="22" rx="4" fill={face.hair} />
                          </>}
                          {!isFemale && <>
                            <ellipse cx="45" cy="30" rx="23" ry="10" fill={face.hair} />
                            <rect x="22" y="28" width="8" height="14" rx="3" fill={face.hair} />
                            <rect x="60" y="28" width="8" height="14" rx="3" fill={face.hair} />
                          </>}

                          {/* ── EYES ── */}
                          {/* whites */}
                          <ellipse cx="34" cy={isFemale ? "49" : "51"} rx="5" ry="4" fill="white" />
                          <ellipse cx="56" cy={isFemale ? "49" : "51"} rx="5" ry="4" fill="white" />
                          {/* pupils */}
                          <ellipse cx="34" cy={isFemale ? "49" : "51"} rx="3" ry={speaking ? "3.5" : "3"} fill="#2D2D2D" />
                          <ellipse cx="56" cy={isFemale ? "49" : "51"} rx="3" ry={speaking ? "3.5" : "3"} fill="#2D2D2D" />
                          {/* shine */}
                          <circle cx="35.5" cy={isFemale ? "47.5" : "49.5"} r="1.2" fill="white" />
                          <circle cx="57.5" cy={isFemale ? "47.5" : "49.5"} r="1.2" fill="white" />

                          {/* ── EYELASHES (female only) ── */}
                          {isFemale && <>
                            <line x1="29" y1="45" x2="27" y2="42" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="32" y1="44" x2="31" y2="41" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="35" y1="44" x2="35" y2="41" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="38" y1="45" x2="39" y2="42" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="51" y1="45" x2="51" y2="42" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="54" y1="44" x2="53" y2="41" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="57" y1="44" x2="57" y2="41" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="60" y1="45" x2="62" y2="42" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
                          </>}

                          {/* ── EYEBROWS ── */}
                          {isFemale ? <>
                            {/* thin arched female brows */}
                            <path d="M29 42 Q34 38 39 42" stroke={face.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                            <path d="M51 42 Q56 38 61 42" stroke={face.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                          </> : variant === 0 ? <>
                            <path d="M29 45 Q33 42 38 45" stroke={face.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            <path d="M52 45 Q56 42 61 45" stroke={face.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                          </> : variant === 1 ? <>
                            <path d="M29 44 Q33 41 38 44" stroke={face.hair} strokeWidth="2" fill="none" strokeLinecap="round" />
                            <path d="M52 44 Q56 41 61 44" stroke={face.hair} strokeWidth="2" fill="none" strokeLinecap="round" />
                          </> : <>
                            <path d="M30 45 Q33 43 38 46" stroke={face.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            <path d="M52 46 Q56 43 60 45" stroke={face.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                          </>}

                          {/* Nose */}
                          <path
                            d={isFemale ? "M45 55 Q44 59 45 60 Q46 59 45 55" : "M45 56 Q43 61 45 62 Q47 61 45 56"}
                            stroke="#C8956C" strokeWidth="1" fill="none"
                          />

                          {/* ── Blush (female only) ── */}
                          {isFemale && <>
                            <ellipse cx="28" cy="58" rx="6" ry="4" fill="#FFB3C1" opacity="0.45" />
                            <ellipse cx="62" cy="58" rx="6" ry="4" fill="#FFB3C1" opacity="0.45" />
                          </>}

                          {/* Canvas mouth for lip sync */}
                          <foreignObject x="23" y="62" width="44" height="24">
                            <canvas
                              ref={(el) => { mouthCanvasRefs.current[rep.id] = el; }}
                              width={80}
                              height={40}
                              style={{ width: "44px", height: "24px", display: "block" }}
                            />
                          </foreignObject>
                        </svg>
                      </div>

                      {/* Rep info */}
                      <div className="text-center mt-1">
                        {/* Name */}
                        <p className={`font-bold text-sm mb-1.5 ${speaking ? "text-purple-700" : "text-[#2D2D2D]"}`}>
                          {rep.name.toUpperCase()}
                        </p>
                        {/* Role · Personality · Gender — side by side */}
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          <span className="text-[9px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {rep.role.toUpperCase()}
                          </span>
                          <span className="text-[9px] font-semibold bg-[#EEF2FF] text-indigo-600 px-2 py-0.5 rounded-full">
                            {personalityStr}
                          </span>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full
                            ${isFemale ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                            {isFemale ? "♀ F" : "♂ M"}
                          </span>
                        </div>
                        {/* Speaking indicator */}
                        {speaking && (
                          <div className="mt-1.5 flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.3s]" />
                            <span className="ml-1 text-[10px] text-purple-600 font-medium">Speaking</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* ── User (You) card — shows when user is speaking ── */}
                <div
                  className={`flex flex-col items-center p-4 rounded-xl flex-1 min-w-[160px] max-w-[220px] transition-all duration-200
                    ${isRecording
                      ? "border-2 border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-300/40"
                      : "border border-gray-200 bg-white"
                    }`}
                >
                  <div className="relative mb-2">
                    {/* Speaking glow ring when recording */}
                    {isRecording && (
                      <div className="absolute inset-0 rounded-full animate-ping bg-indigo-400/30 scale-110" />
                    )}
                    {/* Profile image or initials fallback */}
                    <div className={`w-[90px] h-[90px] rounded-full overflow-hidden border-4 transition-all duration-200
                      ${isRecording ? "border-indigo-500 shadow-md shadow-indigo-300/50" : "border-gray-200"}`}
                    >
                      {userImage ? (
                        <Image
                          src={userImage}
                          width={90}
                          height={90}
                          alt={userDisplayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-2xl font-bold
                          ${isRecording ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-600"}`}
                        >
                          {userDisplayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User info */}
                  <div className="text-center">
                    <p className={`font-bold text-sm ${isRecording ? "text-indigo-700" : "text-[#2D2D2D]"}`}>
                      {userDisplayName.toUpperCase()}
                    </p>
                    <p className="text-xs text-[#636F85]">Sales Rep (You)</p>
                    {/* Speaking indicator */}
                    {isRecording && (
                      <div className="mt-2 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.3s]" />
                        <span className="ml-1 text-[10px] text-indigo-600 font-medium">Speaking</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Methodology & Questions Reference Panel */}
          {/* ── Two-column layout ── */}
          {showMeetingUi && (
            <div className="flex flex-col lg:flex-row gap-6 items-start">

              {/* ── LEFT: Core Fields + Discovery Questions ── */}
              <div className="flex flex-col gap-4 lg:w-[45%] w-full">
                {sales_methodology && METHODOLOGY_DATA[sales_methodology] && (
                  <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-[#6E51E0] mb-3 flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                      {sales_methodology} — Core Fields
                    </h3>
                    <div className="space-y-1.5">
                      {METHODOLOGY_DATA[sales_methodology].map((item) => (
                        <div key={item.field} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#6E51E0] mt-1.5" />
                          <div className="flex flex-wrap gap-x-1.5 text-xs leading-relaxed">
                            <span className="font-semibold text-[#2D2D2D]">{item.field}</span>
                            <span className="text-[#636F85]">— {item.definition}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {questions && questions.length > 0 && (
                  <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-[#16A34A] mb-3 flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                      Discovery Questions
                    </h3>
                    <ol className="space-y-1.5">
                      {questions.map((q: string, i: number) => (
                        <li key={i} className="flex gap-2 items-start text-xs">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[9px] font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-[#2D2D2D] leading-relaxed">{q}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Voice Conversation + Transcript ── */}
              <div className="flex flex-col gap-4 lg:w-[55%] w-full">

                {/* Voice Conversation (mic + timer) — top of right column */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2 text-[#2D2D2D]">Voice Conversation</h2>

                  {meetingDuration > 0 && (
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#636F85]">⏱ Time Remaining</span>
                        <span className={`text-sm font-bold font-mono ${timeRemaining <= 60 ? "text-red-600 animate-pulse" : timeRemaining <= 120 ? "text-orange-500" : "text-[#6E51E0]"}`}>
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${timeRemaining <= 60 ? "bg-red-500" : timeRemaining <= 120 ? "bg-orange-400" : "bg-[#6E51E0]"}`}
                          style={{ width: `${(timeRemaining / meetingDuration) * 100}%` }}
                        />
                      </div>
                      {timeRemaining <= 60 && (
                        <p className="text-xs text-red-500 mt-1 text-center animate-pulse">⚠️ Meeting ending soon...</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-4">
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
                    <div className="h-5 flex items-center justify-center">
                      <span className="text-sm text-gray-600">{micLabel}</span>
                    </div>
                    {/* Fixed height so layout never shifts */}
                    <div className="h-4 flex items-center justify-center">
                      {silenceCountdown && (
                        <span className="text-xs text-orange-500 font-medium">{silenceCountdown}</span>
                      )}
                    </div>
                    {
                      isConnected ? (
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer w-full"
                          onClick={disconnect}
                        >
                          End Conversation
                        </button>
                      ) : (
                        <button
                          className="bg-primaryBgColor text-white px-4 py-2 rounded-lg cursor-pointer w-full"
                          onClick={() => setShowMeetingUi(false)}
                        >
                          Start Again
                        </button>
                        // <button
                        //   onClick={() => {
                        //     startCountdown();
                        //     setShowMeetingUi(true);
                        //   }}
                        //   className="px-6 py-2 bg-[#6E51E0] text-white rounded-md cursor-pointer"
                        // >
                        //   Start Meeting
                        // </button>
                      )
                    }
                  </div>
                </div>

                {/* Conversation Transcript — below mic */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-[#2D2D2D]">Conversation Transcript</h2>
                  <div className="bg-[#F8F9FC] rounded-xl p-5 overflow-y-auto space-y-4 border border-gray-200" style={{ maxHeight: "420px" }}>
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
                          className={`flex gap-5 p-5 transition-all duration-300 relative ${isLast ? "bg-blue-50/40 border-l-[5px] border-blue-500 rounded-lg bg-blue-100" : "border-l-[5px] border-transparent"}`}
                        >
                          <div className="shrink-0 pt-1">
                            <div className="bg-white border border-gray-200 rounded-[6px] px-2 py-0.5 text-[11px] font-medium text-gray-500">
                              {msg.timestamp}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isUser ? "bg-purple-100 border-purple-200 text-purple-600" : "bg-orange-100 border-orange-200 text-orange-600"}`}>
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

              </div>
              {/* ── end right column ── */}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}









