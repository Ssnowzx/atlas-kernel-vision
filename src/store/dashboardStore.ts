import { create } from "zustand";
import { Process, IPCMessage, EventLog, CapturedImage, SystemStats } from "@/types/dashboard";

interface DashboardState {
  processes: Process[];
  ipcMessages: IPCMessage[];
  eventLogs: EventLog[];
  capturedImages: CapturedImage[];
  stats: SystemStats;
  
  updateProcess: (id: string, updates: Partial<Process>) => void;
  addIPCMessage: (message: Omit<IPCMessage, "id">) => void;
  addEventLog: (log: Omit<EventLog, "id">) => void;
  addCapturedImage: (image: Omit<CapturedImage, "id">) => void;
  simulateFailure: (processId: string) => void;
  updateStats: (updates: Partial<SystemStats>) => void;
}

const initialProcesses: Process[] = [
  { id: "1", name: "Controle de Voo", priority: "P1", state: "Running", cpu: 45 },
  { id: "2", name: "Navegação IA", priority: "P2", state: "Running", cpu: 67 },
  { id: "3", name: "Driver Câmera", priority: "P3", state: "Running", cpu: 23 },
  { id: "4", name: "Driver NPU", priority: "P3", state: "Waiting", cpu: 15 },
  { id: "5", name: "Gerência Arquivos", priority: "P3", state: "Running", cpu: 12 },
  { id: "6", name: "Analisar Composição", priority: "P4", state: "Waiting", cpu: 8 },
];

export const useDashboardStore = create<DashboardState>((set, get) => ({
  processes: initialProcesses,
  ipcMessages: [],
  eventLogs: [
    {
      id: "1",
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      message: "Sistema AtlasOS iniciado com sucesso",
      severity: "success",
    },
  ],
  capturedImages: [],
  stats: {
    totalProcesses: 6,
    ipcPerSecond: 0,
    uptime: 0,
    cpuUsage: 35,
  },

  updateProcess: (id, updates) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  addIPCMessage: (message) =>
    set((state) => {
      const newMessage = { ...message, id: Date.now().toString() };
      return {
        ipcMessages: [newMessage, ...state.ipcMessages].slice(0, 10),
      };
    }),

  addEventLog: (log) =>
    set((state) => {
      const newLog = { ...log, id: Date.now().toString() };
      return {
        eventLogs: [newLog, ...state.eventLogs].slice(0, 50),
      };
    }),

  addCapturedImage: (image) =>
    set((state) => {
      const newImage = { ...image, id: Date.now().toString() };
      return {
        capturedImages: [newImage, ...state.capturedImages],
      };
    }),

  simulateFailure: (processId) => {
    const process = get().processes.find((p) => p.id === processId);
    if (!process) return;

    // Set to Crashed
    get().updateProcess(processId, { state: "Crashed", cpu: 0 });
    get().addEventLog({
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      message: `⚠️ Processo ${process.name} falhou`,
      severity: "error",
    });

    // Recovery Agent
    setTimeout(() => {
      get().addEventLog({
        timestamp: new Date().toLocaleTimeString("pt-BR"),
        message: `🔧 Recovery Agent detectou falha em ${process.name}`,
        severity: "warning",
      });

      setTimeout(() => {
        get().updateProcess(processId, { state: "Running", cpu: Math.floor(Math.random() * 50) + 20 });
        get().addEventLog({
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          message: `✅ ${process.name} reiniciado com sucesso`,
          severity: "success",
        });
      }, 1500);
    }, 2000);
  },

  updateStats: (updates) =>
    set((state) => ({
      stats: { ...state.stats, ...updates },
    })),
}));
