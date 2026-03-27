/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const WS_URL = "ws://localhost:8765";
const RECONNECT_DELAY_MS = 3000;

export const ROSContext = createContext({
  connected: false,
  topics: {},
});

export function ROSProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [topics, setTopics] = useState({});
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const unmounted = useRef(false);
  const connectRef = useRef(null);

  const connect = useCallback(() => {
    if (unmounted.current) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (unmounted.current) return;
      setConnected(true);
    };

    ws.onmessage = (event) => {
      if (unmounted.current) return;
      try {
        const { topic, stamp, data } = JSON.parse(event.data);
        setTopics((prev) => ({ ...prev, [topic]: { stamp, data } }));
      } catch {
        /* ignore */
      }
    };

    ws.onerror = () => {
      if (unmounted.current) return;
      setConnected(false);
    };

    ws.onclose = () => {
      if (unmounted.current) return;
      setConnected(false);
      reconnectTimer.current = setTimeout(
        () => connectRef.current?.(),
        RECONNECT_DELAY_MS,
      );
    };
  }, []);

  useEffect(() => {
    connectRef.current = connect;
    unmounted.current = false;
    connect();
    return () => {
      unmounted.current = true;
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return (
    <ROSContext.Provider value={{ connected, topics }}>
      {children}
    </ROSContext.Provider>
  );
}

export function useROS() {
  return useContext(ROSContext);
}
