import { motion, AnimatePresence } from "framer-motion";
import { VideoFeed } from "./VideoFeed";
import { MapView } from "./MapView";

const VizPlaceholder = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      position: "relative",
    }}
  >
    {[
      {
        top: 14,
        left: 14,
        borderTop: "1.5px solid var(--border-purple)",
        borderLeft: "1.5px solid var(--border-purple)",
      },
      {
        top: 14,
        right: 14,
        borderTop: "1.5px solid var(--border-purple)",
        borderRight: "1.5px solid var(--border-purple)",
      },
      {
        bottom: 14,
        left: 14,
        borderBottom: "1.5px solid var(--border-purple)",
        borderLeft: "1.5px solid var(--border-purple)",
      },
      {
        bottom: 14,
        right: 14,
        borderBottom: "1.5px solid var(--border-purple)",
        borderRight: "1.5px solid var(--border-purple)",
      },
    ].map((s, i) => (
      <div
        key={i}
        style={{ position: "absolute", width: 16, height: 16, ...s }}
      />
    ))}

    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(139,92,246,0.10)",
        border: "1px solid var(--border-purple)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "var(--violet)",
      }}
    >
      ◈
    </div>
    <p
      style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.15em" }}
    >
      3D VISUALIZATION
    </p>
    <p style={{ fontSize: 9, color: "var(--text-3)", opacity: 0.5 }}>
      Three.js · Coming soon
    </p>
  </div>
);

const TABS = ["LIVE", "SPLIT", "3D VIZ"];

export function ViewportTabs({
  activeTab,
  onTabChange,
  telemetry,
  mlpEnabled,
}) {
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
                <VizPlaceholder />
              </div>
            </div>
          )}

          {activeTab === "3D VIZ" && <VizPlaceholder />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
