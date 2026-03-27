import { motion } from "framer-motion";

const MetricCard = ({ label, value, unit, primary }) => (
  <div
    style={{
      padding: "10px 12px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}
  >
    <span
      style={{
        fontSize: 9,
        color: "var(--text-3)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
          color: primary ? "var(--text)" : "var(--text-2)",
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 10, color: "var(--text-3)" }}>{unit}</span>
    </div>
  </div>
);

const AttitudeBar = ({ label, value, min, max }) => {
  const pct = Math.max(
    0,
    Math.min(100, ((Number(value) - min) / (max - min)) * 100),
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 10,
            color: "var(--text-3)",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>
          {value}°
        </span>
      </div>
      <div
        style={{
          height: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.08 }}
          style={{
            height: "100%",
            background: "var(--violet)",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};

export function TelemetryPanel({ telemetry }) {
  const { speed, altitude, attitude } = telemetry;

  return (
    <motion.aside
      className="glass-panel"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.15 }}
      style={{
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 2,
            letterSpacing: "0.06em",
          }}
        >
          Telemetry
        </h2>
        <p
          style={{
            fontSize: 10,
            color: "var(--text-3)",
            letterSpacing: "0.1em",
          }}
        >
          LIVE · 60 FPS
        </p>
      </div>

      <div className="divider" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        <MetricCard label="ALT" value={altitude} unit="m" primary />
        <MetricCard label="SPD" value={speed} unit="m/s" />
      </div>

      <div className="divider" />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p className="section-label">Attitude</p>
        <AttitudeBar label="ROLL" value={attitude.roll} min={-30} max={30} />
        <AttitudeBar label="PITCH" value={attitude.pitch} min={-30} max={30} />
        <AttitudeBar label="YAW" value={attitude.yaw} min={0} max={360} />
      </div>
    </motion.aside>
  );
}
