import Dashboard from "./components/Dashboard";
import { WaypointProvider } from "./contexts/WaypointContext";
import { ROSProvider } from "./contexts/ROSContext";

function App() {
  return (
    <ROSProvider>
      <WaypointProvider>
        <Dashboard />
      </WaypointProvider>
    </ROSProvider>
  );
}

export default App;
