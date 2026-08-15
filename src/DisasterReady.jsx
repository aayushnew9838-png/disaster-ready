import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Wifi, WifiOff, RefreshCw, MapPin, Heart, Users, Phone, ChevronRight,
  ChevronLeft, X, Check, CheckCircle2, Clock, Flame, Waves, HelpCircle,
  Zap, Bone, Droplets, Wind, Navigation, Plus, Minus, Locate, Filter,
  Share2, PhoneCall, Send, Loader2, Radio, Home as HomeIcon, Map as MapIcon,
  Bell, User, Settings, ShieldCheck, AlertTriangle, PackageCheck, Tent,
  Cross, ChevronDown, Info
} from "lucide-react";

/* ---------------------------------------------------------------
   DESIGN TOKENS
--------------------------------------------------------------- */
const Tokens = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    .dr-root {
      --bg: #F4F5F2;
      --surface: #FFFFFF;
      --surface-sunk: #ECEEE9;
      --ink: #16232C;
      --ink-soft: #52626C;
      --ink-faint: #8B9AA1;
      --line: #DFE3DD;
      --line-soft: #EAEDE7;
      --red: #B8402C;
      --red-bg: #FBEBE7;
      --red-line: #E7B6A8;
      --green: #2B6E4F;
      --green-bg: #E8F2EA;
      --green-line: #B7D8C2;
      --amber: #9C6B1E;
      --amber-bg: #FBF1DF;
      --amber-line: #E9CD98;
      --blue: #2A5F80;
      --blue-bg: #E9F1F5;
      --blue-line: #B6D2E0;
      --radius-sm: 10px;
      --radius: 16px;
      --radius-lg: 22px;
      --font-display: 'Manrope', sans-serif;
      --font-body: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      font-family: var(--font-body);
      color: var(--ink);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
    }
    .dr-root * { box-sizing: border-box; }
    .dr-display { font-family: var(--font-display); letter-spacing: -0.01em; }
    .dr-mono { font-family: var(--font-mono); letter-spacing: 0; }
    .dr-scroll::-webkit-scrollbar { display: none; }
    .dr-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes dr-pulse-ring {
      0% { transform: scale(0.7); opacity: 0.55; }
      100% { transform: scale(2.1); opacity: 0; }
    }
    @keyframes dr-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.25; }
    }
    @keyframes dr-rise {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes dr-sheet-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    @keyframes dr-spin { to { transform: rotate(360deg); } }
    @keyframes dr-dash {
      to { stroke-dashoffset: -40; }
    }
    .dr-anim-rise { animation: dr-rise 0.35s ease both; }
    .dr-anim-sheet { animation: dr-sheet-up 0.32s cubic-bezier(.2,.8,.3,1) both; }
    .dr-spin { animation: dr-spin 1s linear infinite; }

    .dr-btn {
      font-family: var(--font-body);
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: transform 0.12s ease, background 0.15s ease, opacity 0.15s ease;
    }
    .dr-btn:active { transform: scale(0.97); }
    .dr-tab { transition: color 0.15s ease; }
    .dr-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
    .dr-chip {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 12.5px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
  `}</style>
);

/* ---------------------------------------------------------------
   DEMO DATA
--------------------------------------------------------------- */
const SHELTERS = [
  { id: "sh1", name: "Central Community Shelter", area: "Najafgarh Road", distance: "1.2 km", capacity: 84, status: "Open", x: 46, y: 40, water: true, food: true, aid: true, power: "limited" },
  { id: "sh2", name: "Dwarka Sector 12 Relief Center", area: "Dwarka", distance: "3.6 km", capacity: 41, status: "Open", x: 22, y: 66, water: true, food: true, aid: true, power: true },
  { id: "sh3", name: "Yamuna Vihar Community Hall", area: "Yamuna Vihar", distance: "5.1 km", capacity: 97, status: "Nearly full", x: 74, y: 24, water: true, food: false, aid: true, power: false },
];
const HOSPITALS = [
  { id: "ho1", name: "North Delhi General Hospital (Demo)", distance: "2.0 km", x: 58, y: 55 },
  { id: "ho2", name: "Rohini Emergency Care Center (Demo)", distance: "4.4 km", x: 30, y: 30 },
];
const DANGER_ZONES = [
  { id: "dz1", label: "Flash flood zone", distance: "3 km", x: 62, y: 68, r: 12 },
];
const VOLUNTEER_LOC = [
  { id: "v1", x: 40, y: 52 }, { id: "v2", x: 52, y: 34 }, { id: "v3", x: 66, y: 48 },
  { id: "v4", x: 34, y: 28 }, { id: "v5", x: 70, y: 62 },
];

const FIRST_AID = [
  {
    id: "bleed", title: "Severe bleeding", severity: "Critical", icon: Droplets,
    steps: [
      "Apply firm, direct pressure using a clean cloth or dressing.",
      "Keep the injured area raised above heart level if possible.",
      "Do not repeatedly lift the dressing to check the wound.",
      "Add more layers on top if blood soaks through — don't remove the first layer.",
      "Call for emergency medical help immediately.",
    ],
    warning: "This guide does not replace professional medical care.",
  },
  {
    id: "burns", title: "Burns", severity: "High", icon: Flame,
    steps: [
      "Cool the burn under cool (not icy) running water for 20 minutes.",
      "Remove nearby jewelry or tight clothing before swelling starts.",
      "Cover loosely with a clean, non-fluffy cloth or dressing.",
      "Do not apply ice, butter, or ointments to the burn.",
      "Seek medical care for burns larger than a palm or on the face, hands, or joints.",
    ],
    warning: "Do not burst blisters — this raises infection risk.",
  },
  {
    id: "cpr", title: "CPR (adult)", severity: "Critical", icon: Heart,
    steps: [
      "Check responsiveness and call for emergency help first.",
      "Place the heel of your hand on the center of the chest.",
      "Push hard and fast, about 5–6 cm deep, at 100–120 compressions per minute.",
      "Allow the chest to fully rise between compressions.",
      "Continue until help arrives or the person shows signs of life.",
    ],
    warning: "If trained, add rescue breaths at a 30:2 ratio.",
  },
  {
    id: "choke", title: "Choking", severity: "Critical", icon: Wind,
    steps: [
      "Ask the person to cough forcefully if they can still breathe.",
      "If they cannot breathe, give 5 sharp back blows between the shoulder blades.",
      "Follow with 5 abdominal thrusts (Heimlich maneuver).",
      "Alternate back blows and abdominal thrusts until the object clears.",
      "Call for emergency help if the airway does not clear quickly.",
    ],
    warning: "For infants, use gentler back blows and chest thrusts instead.",
  },
  {
    id: "fracture", title: "Fractures", severity: "Medium", icon: Bone,
    steps: [
      "Keep the injured area still — avoid moving or straightening it.",
      "Support the limb above and below the injury with padding.",
      "Apply a cold pack wrapped in cloth to reduce swelling.",
      "Immobilize with a splint only if trained and help is far away.",
      "Get the person to medical care as soon as possible.",
    ],
    warning: "Do not attempt to push a protruding bone back into place.",
  },
  {
    id: "flood", title: "Flood safety", severity: "High", icon: Waves,
    steps: [
      "Move to higher ground immediately — avoid walking through moving water.",
      "Avoid contact with electrical equipment if you are wet or standing in water.",
      "Do not drive through flooded roads; 30 cm of water can float a car.",
      "Store drinking water and keep emergency contacts accessible.",
      "Follow official evacuation guidance for your area when available.",
    ],
    warning: "Floodwater may be contaminated — avoid contact with open wounds.",
  },
];

const NEED_HELP_DEMO = [
  { id: "hr1", category: "Medical assistance", people: 2, distance: "1.8 km", priority: "High", status: "Waiting for help", time: "6 min ago" },
  { id: "hr2", category: "Flooded road — stranded", people: 5, distance: "3.2 km", priority: "Critical", status: "Volunteer assigned", time: "14 min ago" },
  { id: "hr3", category: "Food and water needed", people: 4, distance: "2.4 km", priority: "Medium", status: "Waiting for help", time: "31 min ago" },
];

const VOLUNTEER_SKILLS = [
  { skill: "Medical / first aid", count: 14, icon: Heart },
  { skill: "Transport", count: 9, icon: Navigation },
  { skill: "Food distribution", count: 8, icon: PackageCheck },
  { skill: "Search and rescue", count: 7, icon: ShieldCheck },
];

const ALERTS_DEMO = [
  { id: "al1", severity: "Critical", title: "Flash flood warning", body: "Rising water levels reported near the Najafgarh drain. Avoid low-lying roads.", distance: "3 km from you", time: "8 min ago" },
  { id: "al2", severity: "Medium", title: "Central Shelter update", body: "Central Community Shelter has reached 84% capacity.", time: "12 min ago" },
  { id: "al3", severity: "Info", title: "Road advisory", body: "Outer Ring Road partially cleared near Dwarka underpass.", time: "47 min ago" },
];

const SOS_TYPES = [
  { id: "medical", label: "Medical emergency", icon: Heart },
  { id: "trapped", label: "Trapped", icon: AlertTriangle },
  { id: "fire", label: "Fire", icon: Flame },
  { id: "flood", label: "Flood", icon: Waves },
  { id: "missing", label: "Missing person", icon: HelpCircle },
  { id: "other", label: "Other", icon: Zap },
];

const sevColors = {
  Critical: { fg: "var(--red)", bg: "var(--red-bg)", line: "var(--red-line)" },
  High: { fg: "var(--red)", bg: "var(--red-bg)", line: "var(--red-line)" },
  Medium: { fg: "var(--amber)", bg: "var(--amber-bg)", line: "var(--amber-line)" },
  Info: { fg: "var(--blue)", bg: "var(--blue-bg)", line: "var(--blue-line)" },
};

const uid = () => Math.random().toString(36).slice(2, 9);
const timeNow = () => "just now";

/* ---------------------------------------------------------------
   SMALL PRIMITIVES
--------------------------------------------------------------- */
function Pulse({ offline, size = 22 }) {
  const color = offline ? "var(--red)" : "var(--green)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="5" fill={color} opacity="0.18">
        <animate attributeName="r" values="5;10;5" dur={offline ? "2.4s" : "1.6s"} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0;0.25" dur={offline ? "2.4s" : "1.6s"} repeatCount="indefinite" />
      </circle>
      <circle cx="12" cy="12" r="4.5" fill={color} />
    </svg>
  );
}

function StatusPill({ offline, queue, onClick }) {
  const pending = queue.filter((q) => q.status !== "SYNCED").length;
  let label = "Online";
  let sub = "Synced just now";
  if (offline && pending > 0) { label = "Offline"; sub = `${pending} item${pending > 1 ? "s" : ""} waiting to sync`; }
  else if (offline) { label = "Offline"; sub = "Using saved emergency data"; }
  else if (pending > 0) { label = "Syncing"; sub = `${pending} item${pending > 1 ? "s" : ""} syncing`; }
  return (
    <button onClick={onClick} className="dr-btn" style={{
      display: "flex", alignItems: "center", gap: 9, background: "var(--surface)",
      border: "1px solid var(--line)", borderRadius: 999, padding: "7px 14px 7px 10px",
    }}>
      <Pulse offline={offline} size={16} />
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.15 }}>{label}</div>
        <div style={{ fontSize: 10.5, color: "var(--ink-faint)", lineHeight: 1.2 }}>{sub}</div>
      </div>
    </button>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="dr-anim-rise" style={{
      position: "absolute", bottom: 84, left: 16, right: 16, zIndex: 60,
      background: "var(--ink)", color: "#fff", borderRadius: 14, padding: "13px 16px",
      display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600,
      boxShadow: "0 8px 24px rgba(16,30,38,0.22)",
    }}>
      <CheckCircle2 size={17} color="#8FD9AE" style={{ flexShrink: 0 }} />
      {toast}
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const map = {
    neutral: { bg: "var(--surface-sunk)", fg: "var(--ink-soft)" },
    red: { bg: "var(--red-bg)", fg: "var(--red)" },
    green: { bg: "var(--green-bg)", fg: "var(--green)" },
    amber: { bg: "var(--amber-bg)", fg: "var(--amber)" },
    blue: { bg: "var(--blue-bg)", fg: "var(--blue)" },
  };
  const c = map[tone];
  return (
    <span style={{
      background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700,
      padding: "3px 9px", borderRadius: 999, letterSpacing: "0.02em",
    }}>{children}</span>
  );
}

function Sheet({ onClose, children, height = "auto" }) {
  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(22,35,44,0.42)", zIndex: 70,
      display: "flex", alignItems: "flex-end",
    }} onClick={onClose}>
      <div className="dr-anim-sheet" onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", width: "100%", borderRadius: "22px 22px 0 0",
        maxHeight: "88%", overflowY: "auto", padding: "10px 20px 22px",
        height,
      }}>
        <div style={{ width: 38, height: 4, background: "var(--line)", borderRadius: 4, margin: "4px auto 14px" }} />
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SOS FLOW
--------------------------------------------------------------- */
function SOSFlow({ offline, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const send = () => {
    setStep(4);
    setSending(true);
    setTimeout(() => {
      const id = "DR-2026-" + Math.floor(1000 + Math.random() * 9000);
      const r = { id, offline };
      setResult(r);
      setSending(false);
      setStep(5);
      onSubmit({ id, type });
    }, 1400);
  };

  return (
    <Sheet onClose={step < 4 ? onClose : undefined}>
      {step === 1 && (
        <div className="dr-anim-rise">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h2 className="dr-display" style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Are you in an emergency?</h2>
            <button onClick={onClose} className="dr-btn" style={{ background: "none", padding: 6 }}><X size={20} color="var(--ink-soft)" /></button>
          </div>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5, margin: "6px 0 18px" }}>
            Your location and emergency type will be shared with the Disaster Ready response network.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SOS_TYPES.map((t) => {
              const Icon = t.icon;
              const active = type === t.id;
              return (
                <button key={t.id} onClick={() => setType(t.id)} className="dr-btn" style={{
                  background: active ? "var(--red-bg)" : "var(--surface-sunk)",
                  border: `1.5px solid ${active ? "var(--red)" : "transparent"}`,
                  borderRadius: 14, padding: "14px 12px", textAlign: "left",
                }}>
                  <Icon size={19} color={active ? "var(--red)" : "var(--ink-soft)"} />
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: active ? "var(--red)" : "var(--ink)" }}>{t.label}</div>
                </button>
              );
            })}
          </div>
          <button disabled={!type} onClick={() => setStep(2)} className="dr-btn" style={{
            width: "100%", marginTop: 18, background: type ? "var(--ink)" : "var(--surface-sunk)",
            color: type ? "#fff" : "var(--ink-faint)", borderRadius: 14, padding: "15px 0", fontSize: 15,
          }}>Continue</button>
        </div>
      )}

      {step === 2 && (
        <div className="dr-anim-rise">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <button onClick={() => setStep(1)} className="dr-btn" style={{ background: "none", padding: 4 }}><ChevronLeft size={20} /></button>
            <h2 className="dr-display" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Confirm your location</h2>
          </div>
          <div className="dr-card" style={{ padding: 16 }}>
            {offline ? (
              <div style={{ display: "flex", gap: 10 }}>
                <MapPin size={18} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Last known location</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>Najafgarh, Delhi NCR · accuracy ~140 m</div>
                  <div style={{ fontSize: 12, color: "var(--amber)", marginTop: 8, lineHeight: 1.4 }}>
                    Location unavailable — you can still save the emergency request.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <MapPin size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Current location</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>Najafgarh, Delhi NCR · accuracy ~12 m</div>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setStep(3)} className="dr-btn" style={{
            width: "100%", marginTop: 18, background: "var(--ink)", color: "#fff", borderRadius: 14, padding: "15px 0", fontSize: 15,
          }}>Continue</button>
        </div>
      )}

      {step === 3 && (
        <div className="dr-anim-rise">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <button onClick={() => setStep(2)} className="dr-btn" style={{ background: "none", padding: 4 }}><ChevronLeft size={20} /></button>
            <h2 className="dr-display" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Review and send</h2>
          </div>
          <div className="dr-card" style={{ padding: 16, marginBottom: 14 }}>
            <Row label="Emergency type" value={SOS_TYPES.find((t) => t.id === type)?.label} />
            <Row label="Location" value={offline ? "Last known — Najafgarh" : "Current — Najafgarh"} />
            <Row label="Network" value={offline ? "Offline — will queue" : "Online"} last />
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-faint)", lineHeight: 1.5, marginBottom: 16 }}>
            Do not rely solely on this demo application for emergency assistance.
          </p>
          <button onClick={send} className="dr-btn" style={{
            width: "100%", background: "var(--red)", color: "#fff", borderRadius: 14,
            padding: "16px 0", fontSize: 15.5, fontWeight: 700, letterSpacing: "0.02em",
          }}>SEND SOS</button>
        </div>
      )}

      {step === 4 && (
        <div className="dr-anim-rise" style={{ padding: "34px 0 24px", textAlign: "center" }}>
          <Loader2 size={30} className="dr-spin" color="var(--ink-soft)" />
          <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-soft)", fontWeight: 600 }}>
            Creating emergency request…<br />Saving location…<br />Checking connection…
          </div>
        </div>
      )}

      {step === 5 && result && (
        <div className="dr-anim-rise" style={{ textAlign: "center", padding: "8px 0 4px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: result.offline ? "var(--amber-bg)" : "var(--green-bg)",
          }}>
            {result.offline ? <Clock size={26} color="var(--amber)" /> : <Check size={26} color="var(--green)" />}
          </div>
          <h2 className="dr-display" style={{ fontSize: 19, fontWeight: 800, margin: "0 0 4px" }}>
            {result.offline ? "SOS saved offline" : "SOS sent"}
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5, margin: "0 0 18px" }}>
            {result.offline
              ? "Your emergency request is safely stored on this device. It will automatically sync when a connection becomes available."
              : "Response network notified."}
          </p>
          <div className="dr-card" style={{ padding: 14, textAlign: "left", marginBottom: 18 }}>
            <Row label="SOS ID" value={<span className="dr-mono">{result.id}</span>} />
            <Row label="Status" value={result.offline ? "Waiting to sync" : "Delivered"} last />
          </div>
          <button onClick={onClose} className="dr-btn" style={{
            width: "100%", background: "var(--ink)", color: "#fff", borderRadius: 14, padding: "15px 0", fontSize: 15,
          }}>Done</button>
        </div>
      )}
    </Sheet>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0", borderBottom: last ? "none" : "1px solid var(--line-soft)",
    }}>
      <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

/* ---------------------------------------------------------------
   HOME
--------------------------------------------------------------- */
function Home({ offline, queue, onSOS, go, alerts }) {
  const pending = queue.filter((q) => q.status !== "SYNCED").length;
  return (
    <div className="dr-scroll" style={{ padding: "18px 18px 100px", overflowY: "auto", height: "100%" }}>
      <div className="dr-anim-rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div className="dr-display" style={{ fontSize: 21, fontWeight: 800 }}>Good morning</div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>Stay safe. We're here when you need us.</div>
        </div>
        <Badge tone="neutral">AlgoNauts</Badge>
      </div>

      {offline && (
        <div className="dr-anim-rise dr-card" style={{
          background: "var(--amber-bg)", border: "1px solid var(--amber-line)",
          padding: "12px 14px", display: "flex", gap: 10, alignItems: "center", marginBottom: 14,
        }}>
          <WifiOff size={17} color="var(--amber)" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--amber)" }}>Offline mode</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Using saved emergency data · last synced 12 min ago</div>
          </div>
        </div>
      )}

      {pending > 0 && (
        <div className="dr-anim-rise dr-card" style={{
          padding: "11px 14px", display: "flex", gap: 10, alignItems: "center", marginBottom: 14,
          background: "var(--blue-bg)", border: "1px solid var(--blue-line)",
        }}>
          <RefreshCw size={15} color="var(--blue)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "var(--blue)", fontWeight: 600 }}>
            {pending} item{pending > 1 ? "s" : ""} waiting to sync — will send automatically when you're back online.
          </div>
        </div>
      )}

      <div className="dr-anim-rise" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "22px 0 18px" }}>
        <button onClick={onSOS} className="dr-btn" style={{
          width: 148, height: 148, borderRadius: "50%", background: "var(--red)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: "0 10px 26px rgba(184,64,44,0.28)", position: "relative",
        }}>
          <span style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1.5px solid var(--red-line)", animation: "dr-pulse-ring 2.2s ease-out infinite" }} />
          <span className="dr-display" style={{ color: "#fff", fontSize: 24, fontWeight: 800, letterSpacing: "0.03em" }}>SOS</span>
        </button>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginTop: 12, letterSpacing: "0.04em" }}>SEND EMERGENCY ALERT</div>
      </div>

      <div className="dr-anim-rise" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <QuickTile icon={Tent} label="Nearby shelters" onClick={() => go("map")} />
        <QuickTile icon={Cross} label="First aid" onClick={() => go("aid")} />
      </div>
      <div className="dr-anim-rise" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        <QuickTile icon={Phone} label="Emergency contacts" onClick={() => go("contacts")} />
        <QuickTile icon={Users} label="Community help" onClick={() => go("community")} />
      </div>

      <SectionLabel>Nearby situation</SectionLabel>
      <div className="dr-anim-rise dr-card" style={{ padding: "4px 16px", marginBottom: 22 }}>
        <Row label="Shelters available" value={SHELTERS.length} />
        <Row label="Active flood warnings" value="1" />
        <Row label="Volunteers nearby" value={VOLUNTEER_LOC.length + 7} last />
      </div>

      <SectionLabel action={<button onClick={() => go("alerts")} className="dr-btn" style={{ background: "none", fontSize: 12, color: "var(--blue)", fontWeight: 700 }}>See all</button>}>
        Recent activity
      </SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {alerts.slice(0, 2).map((a) => <AlertCard key={a.id} a={a} compact />)}
      </div>
    </div>
  );
}

function QuickTile({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="dr-btn dr-card" style={{
      padding: "16px 14px", textAlign: "left", display: "flex", flexDirection: "column", gap: 20,
    }}>
      <Icon size={19} color="var(--ink)" />
      <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
    </button>
  );
}

function SectionLabel({ children, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 10px" }}>
      <div className="dr-display" style={{ fontSize: 14, fontWeight: 800 }}>{children}</div>
      {action}
    </div>
  );
}

function AlertCard({ a, compact }) {
  const c = sevColors[a.severity] || sevColors.Info;
  return (
    <div className="dr-card" style={{ padding: "13px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <span style={{ background: c.bg, color: c.fg, fontSize: 10.5, fontWeight: 800, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.03em" }}>
          {a.severity.toUpperCase()}
        </span>
        <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{a.time}</span>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{a.title}</div>
      {!compact && <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.45 }}>{a.body}</div>}
      {a.distance && <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 4 }}>{a.distance}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------
   MAP
--------------------------------------------------------------- */
function MapScreen({ offline, onOpenShelter }) {
  const [filters, setFilters] = useState({ shelters: true, hospitals: true, danger: true, volunteers: false });
  const [zoom, setZoom] = useState(1);
  const toggle = (k) => setFilters((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, background: "linear-gradient(180deg, #E9EEE6 0%, #E2E9DE 60%, #DCE5D6 100%)",
        transform: `scale(${zoom})`, transition: "transform 0.2s ease",
      }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
          <line x1="0" y1="20" x2="100" y2="16" stroke="#CBD4C4" strokeWidth="0.6" />
          <line x1="0" y1="55" x2="100" y2="60" stroke="#CBD4C4" strokeWidth="0.6" />
          <line x1="15" y1="0" x2="20" y2="100" stroke="#CBD4C4" strokeWidth="0.6" />
          <line x1="60" y1="0" x2="55" y2="100" stroke="#CBD4C4" strokeWidth="0.6" />
          <path d="M0,80 Q30,72 45,85 T100,78" stroke="#AFCBDA" strokeWidth="2.4" fill="none" opacity="0.7" />

          {filters.danger && DANGER_ZONES.map((d) => (
            <g key={d.id}>
              <circle cx={d.x} cy={d.y} r={d.r} fill="#C97B4A" opacity="0.16" />
              <circle cx={d.x} cy={d.y} r={d.r} fill="none" stroke="#B8402C" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
            </g>
          ))}

          {filters.volunteers && VOLUNTEER_LOC.map((v) => (
            <circle key={v.id} cx={v.x} cy={v.y} r="1" fill="#2A5F80" opacity="0.7" />
          ))}

          {filters.hospitals && HOSPITALS.map((h) => (
            <g key={h.id}>
              <circle cx={h.x} cy={h.y} r="2.6" fill="#2A5F80" />
              <rect x={h.x - 0.5} y={h.y - 1.3} width="1" height="2.6" fill="#fff" />
              <rect x={h.x - 1.3} y={h.y - 0.5} width="2.6" height="1" fill="#fff" />
            </g>
          ))}

          {filters.shelters && SHELTERS.map((s) => (
            <g key={s.id} onClick={() => onOpenShelter(s)} style={{ cursor: "pointer" }}>
              <circle cx={s.x} cy={s.y} r="2.8" fill="#2B6E4F" />
              <circle cx={s.x} cy={s.y} r="1" fill="#fff" />
            </g>
          ))}

          <g>
            <circle cx="50" cy="50" r="4.5" fill="#2A5F80" opacity="0.18">
              <animate attributeName="r" values="3.5;6;3.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="2" fill="#2A5F80" stroke="#fff" strokeWidth="0.6" />
          </g>
        </svg>
      </div>

      {offline && (
        <div style={{
          position: "absolute", top: 14, left: 14, background: "var(--ink)", color: "#fff",
          fontSize: 10.5, fontWeight: 700, padding: "5px 10px", borderRadius: 8, letterSpacing: "0.03em",
        }}>OFFLINE MAP</div>
      )}

      <div className="dr-scroll" style={{ position: "absolute", top: 14, left: 0, right: 0, display: "flex", gap: 8, overflowX: "auto", padding: "0 14px" }}>
        <FilterChip active={filters.shelters} onClick={() => toggle("shelters")} label="Shelters" />
        <FilterChip active={filters.hospitals} onClick={() => toggle("hospitals")} label="Hospitals" />
        <FilterChip active={filters.danger} onClick={() => toggle("danger")} label="Danger zones" />
        <FilterChip active={filters.volunteers} onClick={() => toggle("volunteers")} label="Volunteers" />
      </div>

      <div style={{ position: "absolute", right: 14, bottom: 168, display: "flex", flexDirection: "column", gap: 6 }}>
        <MapBtn onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}><Plus size={16} /></MapBtn>
        <MapBtn onClick={() => setZoom((z) => Math.max(0.85, z - 0.15))}><Minus size={16} /></MapBtn>
        <MapBtn onClick={() => setZoom(1)}><Locate size={16} /></MapBtn>
      </div>

      <div className="dr-anim-rise dr-card" style={{
        position: "absolute", bottom: 14, left: 14, right: 14, padding: 16,
      }}>
        <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginBottom: 8 }}>{SHELTERS.length} shelters nearby</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 800 }}>{SHELTERS[0].name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{SHELTERS[0].distance} · Capacity {SHELTERS[0].capacity}%</div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <ResIcon ok={SHELTERS[0].water} label="Water" />
              <ResIcon ok={SHELTERS[0].food} label="Food" />
              <ResIcon ok={SHELTERS[0].aid} label="Aid" />
            </div>
          </div>
          <button onClick={() => onOpenShelter(SHELTERS[0])} className="dr-btn" style={{
            background: "var(--ink)", color: "#fff", borderRadius: 10, padding: "9px 13px", fontSize: 12, whiteSpace: "nowrap",
          }}>View</button>
        </div>
      </div>
    </div>
  );
}

function ResIcon({ ok, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: ok ? "var(--green)" : "var(--ink-faint)" }}>
      {ok ? <Check size={12} /> : <X size={12} />} {label}
    </div>
  );
}

function FilterChip({ active, onClick, label }) {
  return (
    <button onClick={onClick} className="dr-chip" style={{
      background: active ? "var(--ink)" : "var(--surface)", color: active ? "#fff" : "var(--ink-soft)",
      border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`, borderRadius: 999, padding: "7px 13px",
    }}>{label}</button>
  );
}

function MapBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="dr-btn" style={{
      width: 36, height: 36, borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)",
      display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>{children}</button>
  );
}

function ShelterDetail({ shelter, offline, onClose }) {
  return (
    <Sheet onClose={onClose}>
      <div className="dr-anim-rise">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="dr-display" style={{ fontSize: 18, fontWeight: 800 }}>{shelter.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 3 }}>{shelter.area} · {shelter.distance} away</div>
          </div>
          <button onClick={onClose} className="dr-btn" style={{ background: "none", padding: 4 }}><X size={19} color="var(--ink-soft)" /></button>
        </div>
        <div style={{ display: "flex", gap: 8, margin: "12px 0 16px" }}>
          <Badge tone={shelter.status === "Open" ? "green" : "amber"}>{shelter.status.toUpperCase()}</Badge>
          <Badge tone="neutral">{shelter.capacity}% capacity</Badge>
        </div>
        <div className="dr-card" style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-faint)", marginBottom: 8 }}>AVAILABLE RESOURCES</div>
          <ResourceRow label="Water" ok={shelter.water} />
          <ResourceRow label="Food" ok={shelter.food} />
          <ResourceRow label="First aid" ok={shelter.aid} />
          <ResourceRow label="Power" ok={shelter.power === true} limited={shelter.power === "limited"} last />
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginBottom: 16 }}>Last verified 12 minutes ago</div>
        {offline && <div style={{ fontSize: 11.5, color: "var(--amber)", marginBottom: 12 }}>Directions may use cached map data.</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <SheetBtn icon={Navigation} label="Directions" />
          <SheetBtn icon={PhoneCall} label="Call" />
          <SheetBtn icon={Share2} label="Share" />
        </div>
      </div>
    </Sheet>
  );
}

function ResourceRow({ label, ok, limited, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: last ? "none" : "1px solid var(--line-soft)" }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      {limited ? <span style={{ fontSize: 12, fontWeight: 700, color: "var(--amber)" }}>Limited</span>
        : ok ? <Check size={16} color="var(--green)" /> : <X size={16} color="var(--ink-faint)" />}
    </div>
  );
}

function SheetBtn({ icon: Icon, label }) {
  return (
    <button className="dr-btn dr-card" style={{ padding: "12px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <Icon size={17} color="var(--ink)" />
      <span style={{ fontSize: 11.5, fontWeight: 700 }}>{label}</span>
    </button>
  );
}

/* ---------------------------------------------------------------
   FIRST AID
--------------------------------------------------------------- */
function FirstAid({ back }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="dr-scroll" style={{ padding: "18px 18px 100px", overflowY: "auto", height: "100%" }}>
      <ScreenHeader title="First aid" back={back} />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, color: "var(--green)" }}>
        <CheckCircle2 size={14} /> <span style={{ fontSize: 12, fontWeight: 700 }}>All guides available offline</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FIRST_AID.map((g) => {
          const Icon = g.icon;
          const c = sevColors[g.severity] || sevColors.Info;
          return (
            <button key={g.id} onClick={() => setOpen(g)} className="dr-btn dr-card" style={{
              display: "flex", alignItems: "center", gap: 13, padding: "14px 15px", textAlign: "left",
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color={c.fg} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{g.title}</div>
                <div style={{ fontSize: 11.5, color: c.fg, fontWeight: 700, marginTop: 2 }}>{g.severity}</div>
              </div>
              <ChevronRight size={17} color="var(--ink-faint)" />
            </button>
          );
        })}
      </div>
      {open && <FirstAidDetail guide={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function FirstAidDetail({ guide, onClose }) {
  const Icon = guide.icon;
  const c = sevColors[guide.severity] || sevColors.Info;
  return (
    <Sheet onClose={onClose}>
      <div className="dr-anim-rise">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={19} color={c.fg} />
            </div>
            <div>
              <div className="dr-display" style={{ fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.01em" }}>{guide.title}</div>
              <Badge tone={guide.severity === "Medium" ? "amber" : "red"}>{guide.severity.toUpperCase()}</Badge>
            </div>
          </div>
          <button onClick={onClose} className="dr-btn" style={{ background: "none", padding: 4 }}><X size={19} color="var(--ink-soft)" /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "18px 0" }}>
          {guide.steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div className="dr-display" style={{
                width: 26, height: 26, borderRadius: "50%", background: "var(--surface-sunk)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, paddingTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>
        <div className="dr-card" style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-line)", padding: 13, marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--amber)", marginBottom: 3 }}>IMPORTANT</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{guide.warning}</div>
        </div>
        <button className="dr-btn" style={{
          width: "100%", background: "var(--red)", color: "#fff", borderRadius: 14, padding: "14px 0",
          fontSize: 14.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}><PhoneCall size={16} /> Call emergency services</button>
      </div>
    </Sheet>
  );
}

/* ---------------------------------------------------------------
   COMMUNITY
--------------------------------------------------------------- */
function Community({ offline, back, requests, addRequest }) {
  const [tab, setTab] = useState("need");
  const [form, setForm] = useState(false);
  return (
    <div className="dr-scroll" style={{ padding: "18px 18px 100px", overflowY: "auto", height: "100%" }}>
      <ScreenHeader title="Community help" back={back} />
      <div style={{ display: "flex", gap: 6, background: "var(--surface-sunk)", borderRadius: 12, padding: 4, marginBottom: 16 }}>
        <SegBtn active={tab === "need"} onClick={() => setTab("need")}>Need help</SegBtn>
        <SegBtn active={tab === "vol"} onClick={() => setTab("vol")}>Volunteers</SegBtn>
      </div>

      {tab === "need" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {requests.map((r) => <HelpCard key={r.id} r={r} />)}
          </div>
          <button onClick={() => setForm(true)} className="dr-btn" style={{
            width: "100%", background: "var(--ink)", color: "#fff", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 700,
          }}>Request help</button>
        </>
      )}

      {tab === "vol" && (
        <>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>Available volunteers nearby</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {VOLUNTEER_SKILLS.map((v) => (
              <div key={v.skill} className="dr-card" style={{ padding: 14 }}>
                <v.icon size={18} color="var(--blue)" />
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10 }}>{v.skill}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 2 }}>{v.count} nearby</div>
              </div>
            ))}
          </div>
          <button onClick={() => setForm("offer")} className="dr-btn" style={{
            width: "100%", background: "var(--green)", color: "#fff", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 700,
          }}>I want to volunteer</button>
        </>
      )}

      {form && (
        <RequestForm
          offline={offline}
          mode={form === "offer" ? "offer" : "need"}
          onClose={() => setForm(false)}
          onSubmit={(payload) => { addRequest(payload); setForm(false); }}
        />
      )}
    </div>
  );
}

function SegBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className="dr-btn" style={{
      flex: 1, background: active ? "var(--surface)" : "transparent", borderRadius: 9,
      padding: "9px 0", fontSize: 12.5, fontWeight: 700, color: active ? "var(--ink)" : "var(--ink-faint)",
      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
    }}>{children}</button>
  );
}

function HelpCard({ r }) {
  const c = sevColors[r.priority] || sevColors.Medium;
  return (
    <div className="dr-card" style={{ padding: "14px 15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <span style={{ background: c.bg, color: c.fg, fontSize: 10.5, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
          {r.priority.toUpperCase()} PRIORITY
        </span>
        <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{r.time}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{r.category}</div>
      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 3 }}>
        {r.people} {r.people === 1 ? "person" : "people"} · {r.distance} away
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 9 }}>
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{r.status}</span>
        {r.syncStatus && <SyncBadge status={r.syncStatus} />}
      </div>
    </div>
  );
}

function SyncBadge({ status }) {
  const map = {
    PENDING: { label: "Waiting to sync", fg: "var(--amber)", bg: "var(--amber-bg)" },
    SYNCING: { label: "Syncing…", fg: "var(--blue)", bg: "var(--blue-bg)" },
    SYNCED: { label: "Synced", fg: "var(--green)", bg: "var(--green-bg)" },
  };
  const c = map[status] || map.PENDING;
  return <span style={{ fontSize: 10.5, fontWeight: 700, color: c.fg, background: c.bg, padding: "3px 8px", borderRadius: 6 }}>{c.label}</span>;
}

function RequestForm({ offline, mode, onClose, onSubmit }) {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const skillOpts = ["Medical / first aid", "Transport", "Food", "Water", "Search and rescue", "Shelter support"];

  const toggleSkill = (s) => setSkills((arr) => arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]);

  const submit = () => {
    if (mode === "need" && !category.trim()) { setError("Describe what help is needed"); return; }
    if (mode === "offer" && skills.length === 0) { setError("Select at least one way you can help"); return; }
    onSubmit({
      id: uid(),
      category: mode === "need" ? category.trim() : `Volunteer: ${skills.join(", ")}`,
      people: 1,
      distance: "0.4 km",
      priority,
      status: offline ? "Saved on this device" : "Posted",
      time: timeNow(),
      syncStatus: offline ? "PENDING" : "SYNCED",
      isSync: true,
    });
  };

  return (
    <Sheet onClose={onClose}>
      <div className="dr-anim-rise">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 className="dr-display" style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
            {mode === "need" ? "Request help" : "Offer to volunteer"}
          </h2>
          <button onClick={onClose} className="dr-btn" style={{ background: "none", padding: 4 }}><X size={19} color="var(--ink-soft)" /></button>
        </div>

        {mode === "need" ? (
          <>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-faint)" }}>What do you need?</label>
            <input value={category} onChange={(e) => { setCategory(e.target.value); setError(""); }} placeholder="e.g. Medical assistance for 2 people"
              style={{ width: "100%", marginTop: 6, padding: "12px 13px", borderRadius: 12, border: "1px solid var(--line)", fontSize: 13.5, fontFamily: "var(--font-body)", marginBottom: 14 }} />
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-faint)" }}>Priority</label>
            <div style={{ display: "flex", gap: 8, marginTop: 8, marginBottom: 6 }}>
              {["Medium", "High", "Critical"].map((p) => (
                <button key={p} onClick={() => setPriority(p)} className="dr-btn" style={{
                  flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 12.5,
                  background: priority === p ? "var(--ink)" : "var(--surface-sunk)",
                  color: priority === p ? "#fff" : "var(--ink-soft)",
                }}>{p}</button>
              ))}
            </div>
          </>
        ) : (
          <>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-faint)" }}>I can help with</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8, marginBottom: 6 }}>
              {skillOpts.map((s) => (
                <label key={s} className="dr-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", cursor: "pointer", border: skills.includes(s) ? "1.5px solid var(--green)" : "1px solid var(--line)" }}>
                  <input type="checkbox" checked={skills.includes(s)} onChange={() => { toggleSkill(s); setError(""); }} style={{ accentColor: "#2B6E4F" }} />
                  <span style={{ fontSize: 13 }}>{s}</span>
                </label>
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-soft)", margin: "10px 0 4px" }}>
          <MapPin size={14} /> Use my current location
        </div>
        {error && <div style={{ fontSize: 12, color: "var(--red)", marginTop: 6 }}>{error}</div>}
        {offline && <div style={{ fontSize: 11.5, color: "var(--amber)", marginTop: 10 }}>You're offline — this will be saved on this device and sent when you're back online.</div>}

        <button onClick={submit} className="dr-btn" style={{
          width: "100%", marginTop: 16, background: "var(--ink)", color: "#fff", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 700,
        }}>{offline ? "Save request" : "Post request"}</button>
      </div>
    </Sheet>
  );
}

/* ---------------------------------------------------------------
   CONTACTS / ALERTS / PROFILE
--------------------------------------------------------------- */
function Contacts({ back }) {
  const services = [
    { label: "Police", num: "100" }, { label: "Fire", num: "101" },
    { label: "Ambulance", num: "102" }, { label: "Disaster helpline", num: "108" },
  ];
  const personal = ["Mom", "Dad", "Emergency contact"];
  return (
    <div className="dr-scroll" style={{ padding: "18px 18px 100px", overflowY: "auto", height: "100%" }}>
      <ScreenHeader title="Emergency contacts" back={back} />
      <SectionLabel>Emergency services</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
        {services.map((s) => (
          <a key={s.label} href={`tel:${s.num}`} className="dr-btn dr-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 15px", textDecoration: "none", color: "var(--ink)" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--red)", fontSize: 12.5, fontWeight: 700 }}><PhoneCall size={15} /> Call</span>
          </a>
        ))}
      </div>
      <SectionLabel>My emergency contacts</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {personal.map((p) => (
          <div key={p} className="dr-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 15px" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{p}</span>
            <Phone size={15} color="var(--ink-faint)" />
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 14, lineHeight: 1.5 }}>
        Calling behavior depends on your device and browser.
      </div>
    </div>
  );
}

function AlertsScreen({ back }) {
  return (
    <div className="dr-scroll" style={{ padding: "18px 18px 100px", overflowY: "auto", height: "100%" }}>
      <ScreenHeader title="Alerts" back={back} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ALERTS_DEMO.map((a) => <AlertCard key={a.id} a={a} />)}
      </div>
    </div>
  );
}

function Profile({ offline, setOffline, queue, onSyncNow, lastSync }) {
  return (
    <div className="dr-scroll" style={{ padding: "18px 18px 100px", overflowY: "auto", height: "100%" }}>
      <ScreenHeader title="Profile" />
      <div className="dr-card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--blue-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={20} color="var(--blue)" />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700 }}>Demo user</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Najafgarh, Delhi NCR</div>
          </div>
        </div>
      </div>

      <SectionLabel>Offline & sync</SectionLabel>
      <div className="dr-card" style={{ padding: "4px 16px", marginBottom: 16 }}>
        <Row label="Offline storage" value="82 MB used" />
        <Row label="Last successful sync" value={lastSync} />
        <Row label="Emergency data" value={<Check size={15} color="var(--green)" />} />
        <Row label="First-aid guides" value={<Check size={15} color="var(--green)" />} />
        <Row label="Emergency map" value="Delhi NCR cached" last />
      </div>

      <div className="dr-card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>Simulate offline</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>Demo the offline experience without disconnecting</div>
          </div>
          <Toggle checked={offline} onChange={() => setOffline((o) => !o)} />
        </div>
      </div>

      {queue.length > 0 && (
        <>
          <SectionLabel action={!offline && queue.some(q => q.status === "PENDING") && (
            <button onClick={onSyncNow} className="dr-btn" style={{ background: "none", fontSize: 12, color: "var(--blue)", fontWeight: 700 }}>Sync now</button>
          )}>Sync queue</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {queue.map((q) => (
              <div key={q.id} className="dr-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{q.entityType}</div>
                  <div className="dr-mono" style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>{q.id}</div>
                </div>
                <SyncBadge status={q.status} />
              </div>
            ))}
          </div>
        </>
      )}

      <SectionLabel>About</SectionLabel>
      <div className="dr-card" style={{ padding: "4px 16px" }}>
        <Row label="Language" value="English" />
        <Row label="Notifications" value="Enabled" />
        <Row label="Ayush" value={<Badge tone="neutral">ON</Badge>} last />
      </div>
      <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 16, lineHeight: 1.6, textAlign: "center" }}>
        Disaster Ready is a prototype. It is not connected to real emergency<br />authorities, volunteers, or live disaster data.
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={onChange} className="dr-btn" style={{
      width: 44, height: 26, borderRadius: 999, background: checked ? "var(--red)" : "var(--line)",
      position: "relative", padding: 0, flexShrink: 0,
    }}>
      <span style={{
        position: "absolute", top: 2, left: checked ? 20 : 2, width: 22, height: 22, borderRadius: "50%",
        background: "#fff", transition: "left 0.18s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function ScreenHeader({ title, back }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      {back && <button onClick={back} className="dr-btn" style={{ background: "none", padding: 4 }}><ChevronLeft size={21} /></button>}
      <div className="dr-display" style={{ fontSize: 19, fontWeight: 800 }}>{title}</div>
    </div>
  );
}

/* ---------------------------------------------------------------
   APP SHELL
--------------------------------------------------------------- */
const NAV = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "map", label: "Map", icon: MapIcon },
  { id: "community", label: "Community", icon: Users },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

export default function DisasterReady() {
  const [view, setView] = useState("home");
  const [offline, setOffline] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [shelter, setShelter] = useState(null);
  const [queue, setQueue] = useState([]);
  const [requests, setRequests] = useState(NEED_HELP_DEMO);
  const [toast, setToast] = useState(null);
  const [lastSync, setLastSync] = useState("12 min ago");
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const enqueue = useCallback((entityType) => {
    const id = "SQ-" + uid();
    setQueue((q) => [...q, { id, entityType, status: "PENDING", createdAt: Date.now() }]);
    return id;
  }, []);

  const handleSOSSubmit = ({ id, type }) => {
    if (offline) {
      enqueue("SOS request");
      showToast("Emergency saved locally");
    } else {
      showToast("SOS sent — response network notified");
    }
  };

  const addCommunityRequest = (payload) => {
    setRequests((r) => [payload, ...r]);
    if (offline) enqueue(payload.category.startsWith("Volunteer") ? "Volunteer offer" : "Help request");
    showToast(offline ? "Saved on this device" : "Request posted");
  };

  const syncNow = () => {
    const pending = queue.filter((q) => q.status === "PENDING");
    if (pending.length === 0) return;
    setQueue((q) => q.map((item) => item.status === "PENDING" ? { ...item, status: "SYNCING" } : item));
    setTimeout(() => {
      setQueue((q) => q.map((item) => item.status === "SYNCING" ? { ...item, status: "SYNCED" } : item));
      setRequests((r) => r.map((req) => req.syncStatus && req.syncStatus !== "SYNCED" ? { ...req, syncStatus: "SYNCED", status: "Posted" } : req));
      setLastSync("just now");
      showToast(`${pending.length} item${pending.length > 1 ? "s" : ""} synced`);
    }, 1300);
  };

  useEffect(() => {
    if (!offline && queue.some((q) => q.status === "PENDING")) {
      const t = setTimeout(syncNow, 500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line
  }, [offline]);

  const go = (v) => setView(v);

  return (
    <div className="dr-root" style={{
      width: "100%", maxWidth: 430, margin: "0 auto", height: 780, position: "relative",
      borderRadius: 28, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 20px 50px rgba(20,30,38,0.14)",
    }}>
      <Tokens />

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 40,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px 10px", background: "linear-gradient(180deg, var(--bg) 70%, transparent)",
      }}>
        <div className="dr-display" style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
          <ShieldCheck size={17} color="var(--ink)" /> Disaster Ready
        </div>
        <StatusPill offline={offline} queue={queue} onClick={() => setView("profile")} />
      </div>

      <div style={{ position: "absolute", inset: 0, top: 0 }}>
        <div style={{ position: "absolute", inset: 0, paddingTop: view === "map" ? 0 : 56 }}>
          {view === "home" && <Home offline={offline} queue={queue} onSOS={() => setSosOpen(true)} go={go} alerts={ALERTS_DEMO} />}
          {view === "map" && <div style={{ position: "absolute", inset: 0, top: 56 }}><MapScreen offline={offline} onOpenShelter={setShelter} /></div>}
          {view === "aid" && <FirstAid back={() => setView("home")} />}
          {view === "community" && <Community offline={offline} back={() => setView("home")} requests={requests} addRequest={addCommunityRequest} />}
          {view === "contacts" && <Contacts back={() => setView("home")} />}
          {view === "alerts" && <AlertsScreen back={() => setView("home")} />}
          {view === "profile" && <Profile offline={offline} setOffline={setOffline} queue={queue} onSyncNow={syncNow} lastSync={lastSync} />}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--surface)",
        borderTop: "1px solid var(--line)", display: "flex", padding: "8px 6px 12px", zIndex: 50,
      }}>
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = view === n.id;
          return (
            <button key={n.id} onClick={() => setView(n.id)} className="dr-btn dr-tab" style={{
              flex: 1, background: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0",
              color: active ? "var(--red)" : "var(--ink-faint)",
            }}>
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              <span style={{ fontSize: 10, fontWeight: 700 }}>{n.label}</span>
            </button>
          );
        })}
      </div>

      <Toast toast={toast} />
      {sosOpen && <SOSFlow offline={offline} onClose={() => setSosOpen(false)} onSubmit={handleSOSSubmit} />}
      {shelter && <ShelterDetail shelter={shelter} offline={offline} onClose={() => setShelter(null)} />}
    </div>
  );
}
