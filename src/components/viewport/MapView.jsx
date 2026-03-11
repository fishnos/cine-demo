import React from "react";
import { RAW_PATH, CORRECTED_PATH } from "@/hooks/useTelemetry";

const PADDING = 40;
const MAP_W = 600;
const MAP_H = 340;

function toSVG(pt, bounds) {
  const { minX, maxX, minY, maxY } = bounds;
  const x = PADDING + ((pt.x - minX) / (maxX - minX)) * (MAP_W - PADDING * 2);
  const y =
    MAP_H - PADDING - ((pt.y - minY) / (maxY - minY)) * (MAP_H - PADDING * 2);
  return { x, y };
}

function pathD(points, bounds) {
  return points
    .map((p, i) => {
      const { x, y } = toSVG(p, bounds);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function getBounds(paths) {
  const all = paths.flat();
  return {
    minX: Math.min(...all.map((p) => p.x)) - 5,
    maxX: Math.max(...all.map((p) => p.x)) + 5,
    minY: Math.min(...all.map((p) => p.y)) - 5,
    maxY: Math.max(...all.map((p) => p.y)) + 5,
  };
}

export function MapView({
  position,
  waypoints,
  mlpEnabled,
  currentWaypointIdx,
}) {
  const bounds = getBounds([RAW_PATH, CORRECTED_PATH]);

  const dronePos = position
    ? toSVG({ x: position.x, y: position.y }, bounds)
    : toSVG(RAW_PATH[0], bounds);

  const gridLines = [];
  for (let gx = Math.ceil(bounds.minX / 10) * 10; gx <= bounds.maxX; gx += 10) {
    const { x } = toSVG({ x: gx, y: bounds.minY }, bounds);
    gridLines.push(
      <line
        key={`gx${gx}`}
        x1={x}
        y1={PADDING}
        x2={x}
        y2={MAP_H - PADDING}
        stroke="rgba(139,92,246,0.12)"
        strokeWidth="1"
      />,
      <text
        key={`gxt${gx}`}
        x={x}
        y={MAP_H - 8}
        fill="rgba(170,150,255,0.35)"
        fontSize="9"
        textAnchor="middle"
      >
        {gx}
      </text>,
    );
  }
  for (let gy = Math.ceil(bounds.minY / 5) * 5; gy <= bounds.maxY; gy += 5) {
    const { y } = toSVG({ x: bounds.minX, y: gy }, bounds);
    gridLines.push(
      <line
        key={`gy${gy}`}
        x1={PADDING}
        y1={y}
        x2={MAP_W - PADDING}
        y2={y}
        stroke="rgba(139,92,246,0.12)"
        strokeWidth="1"
      />,
      <text
        key={`gyt${gy}`}
        x={8}
        y={y + 3}
        fill="rgba(170,150,255,0.35)"
        fontSize="9"
        textAnchor="middle"
      >
        {gy}
      </text>,
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 2,
          display: "flex",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font)",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 6,
            background: "rgba(7,5,26,0.80)",
            border: "1px solid rgba(139,92,246,0.35)",
            color: "#8b5cf6",
          }}
        >
          TOP-DOWN VIEW
        </span>
        <span
          style={{
            fontFamily: "var(--font)",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 6,
            background: "rgba(7,5,26,0.80)",
            border: "1px solid rgba(139,92,246,0.18)",
            color: "rgba(170,150,255,0.55)",
          }}
        >
          XY PLANE
        </span>
        {mlpEnabled && (
          <span
            style={{
              fontFamily: "var(--font)",
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.40)",
              color: "#3b82f6",
            }}
          >
            MLP ON
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <filter id="glow-violet">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-cyan">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridLines}

        <path
          d={pathD(RAW_PATH, bounds)}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />

        {mlpEnabled && (
          <path
            d={pathD(CORRECTED_PATH, bounds)}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            filter="url(#glow-violet)"
          />
        )}

        {waypoints.map((wp, i) => {
          const pt = toSVG({ x: wp.coords[0], y: wp.coords[1] }, bounds);
          const done = i < currentWaypointIdx;
          return (
            <g key={wp.id}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="7"
                fill={done ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)"}
                stroke={
                  done ? "rgba(139,92,246,0.80)" : "rgba(255,255,255,0.18)"
                }
                strokeWidth="1.5"
              />
              <text
                x={pt.x}
                y={pt.y + 4}
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill={done ? "#8b5cf6" : "rgba(255,255,255,0.35)"}
              >
                {i}
              </text>
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                fontSize="7.5"
                fill="rgba(170,150,255,0.45)"
              >
                {wp.label}
              </text>
            </g>
          );
        })}

        <circle
          cx={dronePos.x}
          cy={dronePos.y}
          r="9"
          fill="rgba(139,92,246,0.10)"
          stroke="rgba(139,92,246,0.70)"
          strokeWidth="1.5"
          filter="url(#glow-violet)"
        />
        <circle cx={dronePos.x} cy={dronePos.y} r="3.5" fill="white" />

        {/* Compass */}
        <g transform={`translate(${MAP_W - 36}, 36)`}>
          <circle
            r="18"
            fill="rgba(7,5,26,0.80)"
            stroke="rgba(139,92,246,0.25)"
            strokeWidth="1"
          />
          {[
            ["N", 0],
            ["E", 90],
            ["S", 180],
            ["W", 270],
          ].map(([d, deg]) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            return (
              <text
                key={d}
                x={Math.cos(rad) * 12}
                y={Math.sin(rad) * 12 + 4}
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill={d === "N" ? "#8b5cf6" : "rgba(200,190,255,0.55)"}
              >
                {d}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
