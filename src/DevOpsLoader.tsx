import React, { useEffect, useState } from "react";

const MESSAGES: string[] = [
  "Spinning up containers...",
  "Deploying to cluster...",
  "Running pipelines...",
  "Syncing infrastructure...",
  "Provisioning nodes...",
  "Scaling services...",
];

const DURATION = 3000;

interface DevOpsLoaderProps {
  onComplete: () => void;
}

export default function DevOpsLoader({ onComplete }: DevOpsLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(10);
  const [visible, setVisible] = useState(true);

  // Message rotation
  useEffect(() => {
    const t = setInterval(
      () => setMsgIndex((i) => (i + 1) % MESSAGES.length),
      1800,
    );
    return () => clearInterval(t);
  }, []);

  // 10-second countdown + auto-dismiss
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      const rem = Math.max(0, Math.ceil((DURATION - elapsed) / 1000));
      setProgress(pct);
      setRemaining(rem);
      if (elapsed >= DURATION) {
        clearInterval(t);
        setVisible(false);
        onComplete();
      }
    }, 80);
    return () => clearInterval(t);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        {/* ── Spinner ── */}
        <div style={s.spinWrap}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            {/* Navy arc */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="90 174"
              style={s.spinA}
            />
            {/* Green arc */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="60 204"
              style={s.spinB}
            />
          </svg>

          {/* Centre infinity logo */}
          <div style={s.centerLogo}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 32 C30 26,24 22,20 23 C14 25,12 31,12 32 C12 33,14 39,20 41 C24 42,30 38,32 32 Z"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M32 32 C34 26,40 22,44 23 C50 25,52 31,52 32 C52 33,50 39,44 41 C40 42,34 38,32 32 Z"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M29 29 Q32 32 35 29"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M29 35 Q32 32 35 35"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Brand */}
        <div style={s.brand}>
          DevOps <span style={s.accent}>CMD</span> Reference
        </div>
        <div style={s.tagline}>
          Docker · Kubernetes · Terraform · Linux · AWS
        </div>

        {/* Terminal message */}
        <div style={s.msgRow}>
          <span style={s.cursor}>▋</span>
          <span style={s.msg} key={msgIndex}>
            {MESSAGES[msgIndex]}
          </span>
        </div>

        {/* Progress bar + timer */}
        <div style={s.barWrap}>
          <div style={s.track}>
            <div style={{ ...s.bar, width: `${progress}%` }} />
          </div>
          <div style={s.barMeta}>
            <span style={s.meta}>{progress}%</span>
            <span style={s.meta}>{remaining}s</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spinA    { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
        @keyframes spinB    { from{transform:rotate(180deg)} to{transform:rotate(540deg)} }
        @keyframes fadeMsg  {
          0%  {opacity:0;transform:translateY(5px)}
          15% {opacity:1;transform:translateY(0)}
          85% {opacity:1;transform:translateY(0)}
          100%{opacity:0;transform:translateY(-5px)}
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    fontFamily: "'Courier New', monospace",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "18px",
    padding: "44px 52px",
    background: "#0d1526",
    border: "1px solid rgba(34,197,94,0.15)",
    borderRadius: "20px",
    boxShadow: "0 0 60px rgba(34,197,94,0.06)",
    maxWidth: "340px",
    width: "90%",
  },
  spinWrap: {
    position: "relative",
    width: "100px",
    height: "100px",
  },
  spinA: {
    animation: "spinA 1.4s linear infinite",
    transformOrigin: "50px 50px",
  },
  spinB: {
    animation: "spinB 1.4s linear infinite",
    transformOrigin: "50px 50px",
  },
  centerLogo: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#f1f5f9",
    letterSpacing: "0.04em",
  },
  accent: { color: "#22c55e" },
  tagline: { fontSize: "11px", color: "#475569", letterSpacing: "0.12em" },
  msgRow: { display: "flex", alignItems: "center", gap: "7px", height: "22px" },
  cursor: {
    color: "#22c55e",
    fontSize: "14px",
    animation: "blink 1s step-end infinite",
  },
  msg: {
    color: "#64748b",
    fontSize: "13px",
    animation: "fadeMsg 1.8s ease-in-out",
  },
  barWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: "100%",
  },
  track: {
    width: "100%",
    height: "3px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "999px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    background: "linear-gradient(90deg, #1d4ed8, #22c55e)",
    borderRadius: "999px",
    transition: "width 0.1s linear",
  },
  barMeta: { display: "flex", justifyContent: "space-between" },
  meta: { fontSize: "11px", color: "#334155" },
  skip: {
    background: "none",
    border: "none",
    color: "#334155",
    fontSize: "11px",
    cursor: "pointer",
    letterSpacing: "0.08em",
    padding: "4px 8px",
    fontFamily: "'Courier New', monospace",
  },
};
