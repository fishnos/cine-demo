import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const StatusBadge = ({ label, dot, dotColor, dimmed }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 99,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    {dot && (
      <span
        style={{
          position: "relative",
          display: "flex",
          width: 6,
          height: 6,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: dimmed ? "rgba(255,255,255,0.25)" : dotColor,
            animation: dimmed
              ? "none"
              : "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
            opacity: 0.5,
          }}
        />
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: dimmed ? "rgba(255,255,255,0.25)" : dotColor,
            position: "relative",
          }}
        />
      </span>
    )}
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: dimmed ? "var(--text-3)" : "var(--text-2)",
      }}
    >
      {label}
    </span>
  </div>
);

export function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "52px",
        background: "rgba(7,5,26,0.82)",
        backdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.06em",
            background: "var(--plasma-h)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CINE
        </span>
        <span style={{ color: "var(--border)", fontSize: 14 }}>·</span>
        <span
          style={{
            fontSize: 11,
            color: "var(--text-3)",
            letterSpacing: "0.12em",
          }}
        >
          MISSION CONTROL
        </span>
      </div>

      <div style={{ display: "flex", gap: 5 }}>
        <StatusBadge label="ARMED" dot dotColor="var(--white)" />
        <StatusBadge label="LIVE" dot dotColor="var(--violet)" />
      </div>

      {/* Clock */}
      <span
        style={{
          fontSize: 12,
          color: "var(--text-3)",
          letterSpacing: "0.15em",
        }}
      >
        {time}
      </span>
    </motion.header>
  );
}
