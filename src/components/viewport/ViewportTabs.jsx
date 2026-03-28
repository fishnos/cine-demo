import { motion, AnimatePresence } from "framer-motion";
import { VideoFeed } from "./VideoFeed";
import { DroneScene } from "./DroneScene";

const TABS = ["LIVE", "SPLIT", "3D VIZ"];

export function ViewportTabs({ activeTab, onTabChange, telemetry }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 3,
          padding: 3,
          flexShrink: 0,
          background: "rgba(139,92,246,0.06)",
          border: "1px solid var(--border)",
          borderRadius: 10,
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              style={{
                flex: 1,
                padding: "7px 0",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "all 0.18s ease",
                background: active ? "rgba(139,92,246,0.18)" : "transparent",
                border: active
                  ? "1px solid var(--border-purple)"
                  : "1px solid transparent",
                color: active ? "var(--violet)" : "var(--text-3)",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="glass-panel"
          style={{ flex: 1, minHeight: 0 }}
        >
          {activeTab === "LIVE" && <VideoFeed />}

          {activeTab === "SPLIT" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div style={{ flex: 1, overflow: "hidden" }}>
                <VideoFeed />
              </div>
              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <DroneScene telemetry={telemetry} />
              </div>
            </div>
          )}

          {activeTab === "3D VIZ" && <DroneScene telemetry={telemetry} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
