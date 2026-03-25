import { createContext, useState } from "react";

export const DEFAULT_WAYPOINTS = [
  { id: 0, label: "Takeoff", coords: [0, 0, 0] },
  { id: 1, label: "WP1", coords: [20, 10, 15] },
  { id: 2, label: "WP2", coords: [45, -5, 20] },
  { id: 3, label: "WP3", coords: [70, 15, 12] },
  { id: 4, label: "Land", coords: [90, 0, 0] },
];

export const WaypointContext = createContext();

export const WaypointProvider = ({ children }) => {
  const [waypoints, setWaypoints] = useState(DEFAULT_WAYPOINTS);

  const addWaypoint = (newPoint) => {
    setWaypoints((prev) => [...prev, newPoint]);
  };

  const removeWaypoint = (id) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  };

  const updateWaypoint = (id, coordIndex, value) => {
    setWaypoints((prev) =>
      prev.map((wp) => {
        if (wp.id !== id) return wp;
        const coords = [...wp.coords];
        coords[coordIndex] = value;
        return { ...wp, coords };
      }),
    );
  };

  return (
    <WaypointContext.Provider
      value={{
        waypoints,
        setWaypoints,
        addWaypoint,
        removeWaypoint,
        updateWaypoint,
      }}
    >
      {children}
    </WaypointContext.Provider>
  );
};
