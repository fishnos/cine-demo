import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { WaypointContext } from "../contexts/WaypointContext";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function useTelemetry() {
  const {
    waypoints,
    setWaypoints,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
  } = useContext(WaypointContext);

  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, time: "00:00", text: "Mission armed", type: "info" },
    { id: 2, time: "00:03", text: "GPS lock acquired", type: "success" },
    { id: 3, time: "00:07", text: "Takeoff complete", type: "success" },
  ]);
  const eventId = useRef(4);
  const lastWP = useRef(0);

  const sensorNoise = useRef({
    altOff: 0,
    speedOff: 0,
    rollOff: 0,
    gpsSats: 12,
    signal: -65,
  });
  useEffect(() => {
    const id = setInterval(() => {
      sensorNoise.current = {
        altOff: (Math.random() - 0.5) * 0.4,
        speedOff: (Math.random() - 0.5) * 0.6,
        rollOff: (Math.random() - 0.5) * 2,
        gpsSats: 12 + Math.round((Math.random() - 0.5) * 2),
        signal: -65 + Math.round((Math.random() - 0.5) * 8),
      };
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setT((prev) => (prev >= 1 ? 0 : prev + 0.001));
    }, 16);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (!waypoints.length) return;
    const wpIdx = Math.min(
      Math.floor(t * waypoints.length),
      waypoints.length - 1,
    );
    if (wpIdx > lastWP.current) {
      lastWP.current = wpIdx;
      const wp = waypoints[wpIdx];
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
  }, [t, waypoints]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  const rawPath = useMemo(
    () => waypoints.map((w) => ({ x: w.coords[0], y: w.coords[1] })),
    [waypoints],
  );

  const correctedPath = useMemo(
    () =>
      rawPath.map((p, i) => ({
        x:
          p.x +
          (i === 0 || i === rawPath.length - 1 ? 0 : Math.sin(i * 1.8) * 2.5),
        y:
          p.y +
          (i === 0 || i === rawPath.length - 1 ? 0 : Math.cos(i * 1.4) * 2.0),
      })),
    [rawPath],
  );

  const segCount = Math.max(waypoints.length - 1, 1);
  const rawSegT = t * segCount;
  const segIdx = Math.min(Math.floor(rawSegT), segCount - 1);
  const segFrac = rawSegT - segIdx;
  const wpA = waypoints[segIdx] ?? { coords: [0, 0, 0] };
  const wpB = waypoints[segIdx + 1] ?? wpA;

  const pos = {
    x: lerp(wpA.coords[0], wpB.coords[0], segFrac),
    y: lerp(wpA.coords[1], wpB.coords[1], segFrac),
    z: lerp(wpA.coords[2], wpB.coords[2], segFrac),
  };

  const dx = wpB.coords[0] - wpA.coords[0];
  const dy = wpB.coords[1] - wpA.coords[1];
  const dz = wpB.coords[2] - wpA.coords[2];
  const sn = sensorNoise.current;
  const yaw = Math.atan2(dy, dx) * (180 / Math.PI);
  const speed = Math.sqrt(dx * dx + dy * dy + dz * dz) * 0.8 + sn.speedOff;
  const pitch = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy)) * (180 / Math.PI);
  const roll = Math.sin(t * Math.PI * 8) * 8 + sn.rollOff;

  return {
    t,
    paused,
    togglePause,
    position: pos,
    speed: Math.max(0, speed).toFixed(1),
    altitude: Math.max(0, pos.z + sn.altOff).toFixed(1),
    attitude: {
      roll: roll.toFixed(1),
      pitch: pitch.toFixed(1),
      yaw: ((yaw + 360) % 360).toFixed(1),
    },
    gpsSats: sn.gpsSats,
    signalStrength: sn.signal,
    missionProgress: t,
    currentWaypointIdx: segIdx,
    events,
    waypoints,
    rawPath,
    correctedPath,
    setWaypoints,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
  };
}
