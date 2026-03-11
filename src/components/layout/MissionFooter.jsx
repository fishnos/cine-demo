import { motion } from "framer-motion";
import { FiPause, FiPlay } from "react-icons/fi";

export function MissionFooter({
  waypoints,
  currentWaypointIdx,
  missionProgress,
  paused,
  togglePause,
}) {
  const currentLabel = waypoints[currentWaypointIdx]?.label ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.35 }}
      style={{
        background: "rgba(7,5,26,0.82)",
        backdropFilter: "blur(24px) saturate(180%)",
        borderTop: "1px solid var(--border)",
        padding: "0 20px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
      }}
    >
      {/* Pause / Play */}
      <button
        onClick={togglePause}
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          flexShrink: 0,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-3)",
          transition: "border-color 0.15s, color 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--violet)";
          e.currentTarget.style.color = "var(--violet)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--text-3)";
        }}
      >
        {paused ? <FiPlay size={10} /> : <FiPause size={10} />}
      </button>

      {/* Track */}
      <div style={{ flex: 1, position: "relative", height: 16, flexShrink: 0 }}>
        {/* Background track */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            height: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Filled track */}
        <motion.div
          animate={{ width: `${missionProgress * 100}%` }}
          transition={{ duration: 0.25, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            height: 1,
            background: "var(--violet)",
            boxShadow: "0 0 6px rgba(139,92,246,0.55)",
          }}
        />

        {/* Dots — 14x14 fixed wrapper prevents any jitter when dot size changes */}
        {waypoints.map((wp, i) => {
          const pct = (i / (waypoints.length - 1)) * 100;
          const passed = i < currentWaypointIdx;
          const active = i === currentWaypointIdx;

          return (
            <div
              key={wp.id}
              style={{
                position: "absolute",
                left: `${pct}%`,
                top: "50%",
                /* translate is always exactly -7px since wrapper is fixed 14x14 */
                transform: "translate(-50%, -50%)",
                width: 14,
                height: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: active ? 8 : passed ? 6 : 5,
                  height: active ? 8 : passed ? 6 : 5,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: active
                    ? "var(--white)"
                    : passed
                      ? "var(--violet)"
                      : "rgba(255,255,255,0.20)",
                  boxShadow: active
                    ? "0 0 0 2px rgba(139,92,246,0.25), 0 0 10px rgba(139,92,246,0.55)"
                    : "none",
                  transition:
                    "width 0.3s ease, height 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Current waypoint label */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          whiteSpace: "nowrap",
          flexShrink: 0,
          color: "var(--text-3)",
          letterSpacing: "0.08em",
          minWidth: 48,
          textAlign: "right",
        }}
      >
        {currentLabel}
      </span>

      {/* Progress % */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
          flexShrink: 0,
          color: "var(--violet)",
          minWidth: 36,
          textAlign: "right",
        }}
      >
        {Math.round(missionProgress * 100)}%
      </span>
    </motion.div>
  );
}
