import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const StatusBadge = ({ label, dot, dotColor, dimmed }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "5px 12px",
      borderRadius: 99,
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${dimmed ? "rgba(255,255,255,0.07)" : dotColor + "33"}`,
    }}
  >
    {dot && (
      <span
        style={{ position: "relative", display: "flex", width: 7, height: 7 }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: dotColor,
            animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
            opacity: 0.6,
          }}
        />
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: dotColor,
            position: "relative",
          }}
        />
      </span>
    )}
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: dimmed ? "var(--text-3)" : dotColor,
        letterSpacing: "0.08em",
      }}
    >
      {label}
    </span>
  </div>
);

export function Header({ battery, gpsSats }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const batNum = Number(battery);
  const batColor =
    batNum > 50 ? "#4ade80" : batNum > 20 ? "var(--yellow)" : "var(--orange)";

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
        background: "rgba(8,8,16,0.75)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.05em",
            background: "var(--plasma-h)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CINE
        </span>
        <span style={{ color: "var(--border)", fontSize: 16 }}>·</span>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-2)",
            letterSpacing: "0.1em",
          }}
        >
          MISSION CONTROL
        </span>
      </div>

      {/* Status row */}
      <div style={{ display: "flex", gap: 6 }}>
        <StatusBadge label="ARMED" dot dotColor="#4ade80" />
        <StatusBadge
          label={`GPS  ${gpsSats} SAT`}
          dot
          dotColor="var(--purple)"
        />
        <StatusBadge label="LIVE" dot dotColor="var(--orange)" />
        <StatusBadge
          label={`BAT  ${battery}%`}
          dot
          dotColor={batColor}
          dimmed={batNum > 50}
        />
      </div>

      {/* Clock */}
      <span
        style={{
          fontSize: 13,
          color: "var(--text-2)",
          letterSpacing: "0.15em",
        }}
      >
        {time}
      </span>
    </motion.header>
  );
}
