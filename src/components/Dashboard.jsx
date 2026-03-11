import { useState } from "react";
import { motion } from "framer-motion";
import { useTelemetry } from "@/hooks/useTelemetry";
import { Header } from "@/components/layout/Header";
import { MissionSidebar } from "@/components/layout/MissionSidebar";
import { TelemetryPanel } from "@/components/layout/TelemetryPanel";
import { MissionFooter } from "@/components/layout/MissionFooter";
import { ViewportTabs } from "@/components/viewport/ViewportTabs";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("LIVE");
  const [mlpEnabled, setMlpEnabled] = useState(true);
  const [speedLimit, setSpeedLimit] = useState(10);
  const [altCeiling, setAltCeiling] = useState(50);

  const telemetry = useTelemetry();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "grid",
        gridTemplateRows: "52px 1fr 52px",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Header />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr 220px",
          gap: 14,
          padding: 14,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <MissionSidebar
          mlpEnabled={mlpEnabled}
          onMlpChange={setMlpEnabled}
          speedLimit={speedLimit}
          onSpeedChange={setSpeedLimit}
          altCeiling={altCeiling}
          onAltChange={setAltCeiling}
        />

        <ViewportTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          telemetry={telemetry}
          mlpEnabled={mlpEnabled}
        />

        <TelemetryPanel telemetry={telemetry} />
      </div>

      <MissionFooter
        waypoints={telemetry.waypoints}
        currentWaypointIdx={telemetry.currentWaypointIdx}
        missionProgress={telemetry.missionProgress}
        paused={telemetry.paused}
        togglePause={telemetry.togglePause}
      />
    </motion.div>
  );
};

export default Dashboard;
