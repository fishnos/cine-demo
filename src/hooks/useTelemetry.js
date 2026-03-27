import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { WaypointContext } from "../contexts/WaypointContext";
import { ROSContext } from "../contexts/ROSContext";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function quatToEuler(q) {
  const { x, y, z, w } = q;
  const sinr = 2 * (w * x + y * z);
  const cosr = 1 - 2 * (x * x + y * y);
  const roll = Math.atan2(sinr, cosr) * (180 / Math.PI);
  const sinp = 2 * (w * y - z * x);
  const pitch =
    Math.abs(sinp) >= 1
      ? Math.sign(sinp) * 90
      : Math.asin(sinp) * (180 / Math.PI);
  const siny = 2 * (w * z + x * y);
  const cosy = 1 - 2 * (y * y + z * z);
  const yaw = Math.atan2(siny, cosy) * (180 / Math.PI);
  return { roll, pitch, yaw };
}

export function useTelemetry() {
  const {
    waypoints,
    setWaypoints,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
  } = useContext(WaypointContext);

  const { connected: rosConnected, topics } = useContext(ROSContext);
  const imuEntry = topics["/mavros/imu/data_raw"];
  const poseEntry = topics["/mavros/local_position/pose"];
  const velEntry = topics["/mavros/local_position/velocity_local"];
  const hasLiveIMU = rosConnected && imuEntry !== undefined;

  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);

  const [sensorNoise, setSensorNoise] = useState({
    altOff: 0,
    speedOff: 0,
    rollOff: 0,
  });
  useEffect(() => {
    const id = setInterval(() => {
      setSensorNoise({
        altOff: (Math.random() - 0.5) * 0.4,
        speedOff: (Math.random() - 0.5) * 0.6,
        rollOff: (Math.random() - 0.5) * 2,
      });
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
  const sn = sensorNoise;
  const yaw = Math.atan2(dy, dx) * (180 / Math.PI);
  const speed = Math.sqrt(dx * dx + dy * dy + dz * dz) * 0.8 + sn.speedOff;
  const pitch = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy)) * (180 / Math.PI);
  const roll = Math.sin(t * Math.PI * 8) * 8 + sn.rollOff;

  if (hasLiveIMU) {
    const imuData = imuEntry.data;
    const euler = quatToEuler(imuData.orientation);

    const livePos = poseEntry
      ? {
          x: poseEntry.data.position.x,
          y: poseEntry.data.position.y,
          z: poseEntry.data.position.z,
        }
      : pos;

    const liveAlt = poseEntry
      ? Math.max(0, poseEntry.data.position.z).toFixed(1)
      : Math.max(0, pos.z + sn.altOff).toFixed(1);

    const liveSpeed = velEntry
      ? Math.sqrt(
          velEntry.data.linear.x ** 2 +
            velEntry.data.linear.y ** 2 +
            velEntry.data.linear.z ** 2,
        ).toFixed(1)
      : Math.max(0, speed).toFixed(1);

    return {
      t,
      paused,
      togglePause,
      position: livePos,
      speed: liveSpeed,
      altitude: liveAlt,
      attitude: {
        roll: euler.roll.toFixed(1),
        pitch: euler.pitch.toFixed(1),
        yaw: ((euler.yaw + 360) % 360).toFixed(1),
      },
      missionProgress: t,
      currentWaypointIdx: segIdx,
      waypoints,
      rawPath,
      correctedPath,
      setWaypoints,
      addWaypoint,
      removeWaypoint,
      updateWaypoint,
      rosConnected: true,
      imu: {
        orientation: imuData.orientation,
        angular_velocity: imuData.angular_velocity,
        linear_acceleration: imuData.linear_acceleration,
      },
    };
  }

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
    missionProgress: t,
    currentWaypointIdx: segIdx,
    waypoints,
    rawPath,
    correctedPath,
    setWaypoints,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
    rosConnected: false,
    imu: null,
  };
}
