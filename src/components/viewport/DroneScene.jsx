import { useRef, useMemo, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Line,
  Grid,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";
import { ROSContext } from "@/contexts/ROSContext";

// ROS Z-up  →  Three.js Y-up
const r2t = (x, y, z = 0) => new THREE.Vector3(x, z, -y);

function buildCurve(waypoints) {
  if (!waypoints || waypoints.length < 2) return null;
  return new THREE.CatmullRomCurve3(
    waypoints.map((w) => r2t(w.coords[0], w.coords[1], w.coords[2])),
    false,
    "catmullrom",
    0.5,
  );
}

// ── Drone ─────────────────────────────────────────────────────────────────────
const ARM_ENDS = [
  [0.78, 0, 0.78],
  [-0.78, 0, -0.78],
  [0.78, 0, -0.78],
  [-0.78, 0, 0.78],
];

function Drone({ position, facing }) {
  const r = [useRef(), useRef(), useRef(), useRef()];

  useFrame((_, dt) => {
    const spd = dt * 22;
    r.forEach((ref, i) => {
      if (ref.current) ref.current.rotation.y += spd * (i % 2 === 0 ? 1 : -1);
    });
  });

  return (
    <group position={position} rotation={[0, facing, 0]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.36, 0.13, 0.36]} />
        <meshStandardMaterial
          color="#0d1a35"
          emissive="#3b82f6"
          emissiveIntensity={0.65}
        />
      </mesh>

      {/* Arms — two crossed beams */}
      {[Math.PI / 4, -Math.PI / 4].map((rot, i) => (
        <mesh key={i} rotation={[0, rot, 0]}>
          <boxGeometry args={[2.2, 0.06, 0.09]} />
          <meshStandardMaterial
            color="#0f1f40"
            emissive="#3b82f6"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}

      {/* Motors + spinning rotors */}
      {ARM_ENDS.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.09, 10]} />
            <meshStandardMaterial
              color="#0f1f40"
              emissive="#3b82f6"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh ref={r[i]} position={[0, 0.065, 0]}>
            <cylinderGeometry args={[0.44, 0.44, 0.014, 20]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={1.6}
              transparent
              opacity={0.42}
            />
          </mesh>
        </group>
      ))}

      {/* Camera gimbal */}
      <mesh position={[0, -0.13, 0.09]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

// ── Animated drone that follows the curve ─────────────────────────────────────
function AnimatedDrone({ curve, t }) {
  const tClamped = Math.min(Math.max(t, 0), 0.9999);
  const pos = curve.getPoint(tClamped);

  const tangent = curve.getTangent(tClamped);
  const facing = Math.atan2(tangent.x, tangent.z);

  return <Drone position={pos} facing={facing} />;
}

// ── Object of focus ───────────────────────────────────────────────────────────
function FocusObject({ position }) {
  const ringRef = useRef();
  useFrame((_, dt) => {
    if (ringRef.current) ringRef.current.rotation.y += dt * 0.7;
  });

  return (
    <group position={position}>
      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.9}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Rotating equatorial ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.85, 0.03, 8, 56]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Static polar ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.018, 8, 56]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Point light so it illuminates surroundings */}
      <pointLight color="#22d3ee" intensity={2} distance={20} />
    </group>
  );
}

// ── Waypoint markers ──────────────────────────────────────────────────────────
function WaypointMarkers({ waypoints }) {
  return waypoints.map((w, i) => (
    <mesh key={w.id ?? i} position={r2t(w.coords[0], w.coords[1], w.coords[2])}>
      <octahedronGeometry args={[0.42, 0]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={1}
      />
    </mesh>
  ));
}

// ── Raw waypoint polygon ──────────────────────────────────────────────────────
function WaypointPolygon({ waypoints }) {
  const pts = useMemo(
    () => waypoints.map((w) => r2t(w.coords[0], w.coords[1], w.coords[2])),
    [waypoints],
  );
  if (pts.length < 2) return null;
  return (
    <Line
      points={pts}
      color="#3b82f6"
      lineWidth={1.2}
      dashed
      dashSize={0.5}
      gapSize={0.3}
    />
  );
}

// ── Smooth trajectory ─────────────────────────────────────────────────────────
function TrajectoryLine({ curve }) {
  const pts = useMemo(() => curve.getPoints(400), [curve]);
  return <Line points={pts} color="#7c6af0" lineWidth={2.2} />;
}

// ── Scene contents ────────────────────────────────────────────────────────────
function SceneContents({ telemetry }) {
  const { topics } = useContext(ROSContext);
  const trajectoryEntry = topics["/cine/trajectory"];
  const focusEntry = topics["/cine/focus_object"];

  const curve = useMemo(() => {
    const poses = trajectoryEntry?.data?.poses;
    if (poses?.length >= 2) {
      return new THREE.CatmullRomCurve3(
        poses.map((p) => r2t(p.x, p.y, p.z)),
        false,
        "catmullrom",
        0.5,
      );
    }
    return buildCurve(telemetry.waypoints);
  }, [trajectoryEntry, telemetry.waypoints]);

  const sceneCenter = useMemo(() => {
    const wps = telemetry.waypoints;
    if (!wps.length) return [0, 0, 0];
    const cx = wps.reduce((s, w) => s + w.coords[0], 0) / wps.length;
    const cy = wps.reduce((s, w) => s + w.coords[1], 0) / wps.length;
    const cz = wps.reduce((s, w) => s + w.coords[2], 0) / wps.length;
    return [cx, cz, -cy];
  }, [telemetry.waypoints]);

  const focusPos = focusEntry
    ? r2t(focusEntry.data.x, focusEntry.data.y, focusEntry.data.z)
    : null;

  return (
    <>
      <color attach="background" args={["#07051a"]} />
      <fog attach="fog" args={["#07051a", 120, 400]} />

      <ambientLight intensity={0.18} />
      <directionalLight
        position={[20, 50, 20]}
        intensity={0.5}
        color="#a899ff"
      />
      <pointLight
        position={sceneCenter}
        intensity={1.2}
        distance={80}
        color="#7c6af0"
      />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        target={sceneCenter}
        minDistance={2}
        maxDistance={500}
      />

      <Grid
        args={[400, 400]}
        cellSize={5}
        cellThickness={0.4}
        cellColor="#251b55"
        sectionSize={25}
        sectionThickness={0.8}
        sectionColor="#3b2f7a"
        fadeDistance={250}
        fadeStrength={1.8}
        position={[sceneCenter[0], 0, sceneCenter[2]]}
      />

      <WaypointPolygon waypoints={telemetry.waypoints} />
      <WaypointMarkers waypoints={telemetry.waypoints} />

      {curve && <TrajectoryLine curve={curve} />}
      {curve && <AnimatedDrone curve={curve} t={telemetry.t} />}

      {focusPos && <FocusObject position={focusPos} />}

      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport
          axisColors={["#f87171", "#4ade80", "#3b82f6"]}
          labelColor="#ffffff"
        />
      </GizmoHelper>
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function DroneScene({ telemetry }) {
  return (
    <Canvas
      camera={{ position: [40, 30, 40], fov: 52, near: 0.1, far: 2000 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents telemetry={telemetry} />
    </Canvas>
  );
}
