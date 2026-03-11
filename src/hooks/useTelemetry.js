import { useState, useEffect, useRef } from "react";

// TODO: replace with real evaluations later. also not sure how this will work as a demo
const WAYPOINTS = [
  { id: 0, label: "Takeoff", coords: [0, 0, 0] },
  { id: 1, label: "WP1", coords: [20, 10, 15] },
  { id: 2, label: "WP2", coords: [45, -5, 20] },
  { id: 3, label: "WP3", coords: [70, 15, 12] },
  { id: 4, label: "Land", coords: [90, 0, 0] },
];

export const RAW_PATH = WAYPOINTS.map((w) => ({
  x: w.coords[0],
  y: w.coords[1],
}));

export const CORRECTED_PATH = RAW_PATH.map((p, i) => ({
  x: p.x + (i === 0 || i === RAW_PATH.length - 1 ? 0 : Math.sin(i * 1.8) * 2.5),
  y: p.y + (i === 0 || i === RAW_PATH.length - 1 ? 0 : Math.cos(i * 1.4) * 2.0),
}));

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function noise(scale = 1) {
  return (Math.random() - 0.5) * scale;
}

export function useTelemetry() {
  const [t, setT] = useState(0);
  const [events, setEvents] = useState([
    { id: 1, time: "00:00", text: "Mission armed", type: "info" },
    {
      id: 2,
      time: "00:03",
      text: "GPS lock acquired (12 sats)",
      type: "success",
    },
    { id: 3, time: "00:07", text: "Takeoff complete", type: "success" },
  ]);
  const eventId = useRef(4);
  const lastWP = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setT((prev) => (prev >= 1 ? 0 : prev + 0.001));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const wpIdx = Math.min(
      Math.floor(t * WAYPOINTS.length),
      WAYPOINTS.length - 1,
    );

    if (wpIdx > lastWP.current) {
      lastWP.current = wpIdx;
      const wp = WAYPOINTS[wpIdx];
      const mins = String(Math.floor(t * 10)).padStart(2, "0");
      setEvents((prev) => [
        {
          id: eventId.current++,
          time: `00:${mins}`,
          text: `Reached ${wp.label}`,
          type: "success",
        },
        ...prev.slice(0, 19),
      ]);
    }
  }, [t]);

  const segCount = WAYPOINTS.length - 1;
  const rawSegT = t * segCount;
  const segIdx = Math.min(Math.floor(rawSegT), segCount - 1);
  const segFrac = rawSegT - segIdx;
  const wpA = WAYPOINTS[segIdx];
  const wpB = WAYPOINTS[segIdx + 1] ?? wpA;

  const pos = {
    x: lerp(wpA.coords[0], wpB.coords[0], segFrac),
    y: lerp(wpA.coords[1], wpB.coords[1], segFrac),
    z: lerp(wpA.coords[2], wpB.coords[2], segFrac),
  };

  const dx = wpB.coords[0] - wpA.coords[0];
  const dy = wpB.coords[1] - wpA.coords[1];
  const dz = wpB.coords[2] - wpA.coords[2];
  const yaw = Math.atan2(dy, dx) * (180 / Math.PI);
  const speed = Math.sqrt(dx * dx + dy * dy + dz * dz) * 0.8 + noise(0.3);
  const pitch = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy)) * (180 / Math.PI);
  const roll = Math.sin(t * Math.PI * 8) * 8 + noise(1);

  return {
    t,
    position: pos,
    speed: Math.max(0, speed).toFixed(1),
    altitude: Math.max(0, pos.z + noise(0.2)).toFixed(1),
    attitude: {
      roll: roll.toFixed(1),
      pitch: pitch.toFixed(1),
      yaw: ((yaw + 360) % 360).toFixed(1),
    },
    battery: Math.max(0, 100 - t * 35).toFixed(0),
    gpsSats: 12 + Math.round(noise(1)),
    signalStrength: -65 + Math.round(noise(4)),
    missionProgress: t,
    currentWaypointIdx: segIdx,
    waypoints: WAYPOINTS,
    events,
  };
}
