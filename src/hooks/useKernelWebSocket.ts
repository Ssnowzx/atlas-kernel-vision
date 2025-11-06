import { useEffect, useState } from "react";
import { SystemState } from "../types";

export const useKernelWebSocket = () => {
  const WS_URL = (import.meta as any).env?.VITE_WS_URL ?? "ws://localhost:3001";

  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("✅ Conectado ao AtlasOS Kernel");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "STATE_UPDATE") {
          const data = message.data;
          // Normalize IPC messages shape (server may use source/destination)
          if (data && Array.isArray(data.ipcMessages)) {
            data.ipcMessages = data.ipcMessages.map((m: any) => {
              if (m.source && m.destination && !m.from && !m.to) {
                return { ...m, from: m.source, to: m.destination };
              }
              return m;
            });
          }
          setSystemState(data);
        }
      } catch (e) {
        console.error("Erro ao parsear mensagem WS:", e);
      }
    };

    ws.onclose = () => {
      console.log("❌ Desconectado do Kernel");
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("Erro WebSocket:", error);
    };

    return () => {
      ws.close();
    };
  }, [WS_URL]);

  const simulateFailure = (processName: string) => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "SIMULATE_FAILURE", processName }));
      ws.close();
    };
  };

  return { systemState, connected, simulateFailure };
};
