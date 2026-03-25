import Dashboard from "./components/Dashboard";
import { WaypointProvider } from "./contexts/WaypointContext";

function App() {
  return (
    <WaypointProvider>
        <Dashboard />
    </WaypointProvider>
  )
}

export default App;
