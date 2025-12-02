import { create } from "zustand";
import { Process, IPCMessage, EventLog, CapturedImage, SystemStats, Alert, MicrokernelStats, CPUHistory } from "@/types/dashboard";

interface DashboardState {
  processes: Process[];
  ipcMessages: IPCMessage[];
  eventLogs: EventLog[];
  capturedImages: CapturedImage[];
  stats: SystemStats;
  alerts: Alert[];
  microkernelStats: MicrokernelStats;
  cpuHistory: CPUHistory[];
  isBootSequenceRunning: boolean;
  isDemoMode: boolean;
  
  updateProcess: (id: string, updates: Partial<Process>) => void;
  addIPCMessage: (message: Omit<IPCMessage, "id">) => void;
  addEventLog: (log: Omit<EventLog, "id">) => void;
  addCapturedImage: (image: Omit<CapturedImage, "id">) => void;
  updateCapturedImage: (id: string, updates: Partial<CapturedImage>) => void;
  simulateFailure: (processId: string) => void;
  updateStats: (updates: Partial<SystemStats>) => void;
  addAlert: (alert: Omit<Alert, "id">) => void;
  clearAlert: (id: string) => void;
  updateMicrokernelStats: (updates: Partial<MicrokernelStats>) => void;
  addCPUHistory: (data: CPUHistory) => void;
  setBootSequenceRunning: (running: boolean) => void;
  setDemoMode: (active: boolean) => void;
  exportSystemData: () => string;
}

const initialProcesses: Process[] = [
  { id: "1", name: "Controle de Voo", priority: "P1", state: "Running", cpu: 45, layer: 1 },
  { id: "2", name: "Navegação IA", priority: "P2", state: "Running", cpu: 67, layer: 3 },
  { id: "3", name: "Driver Câmera", priority: "P3", state: "Running", cpu: 23, layer: 2 },
  { id: "4", name: "Driver NPU", priority: "P3", state: "Waiting", cpu: 15, layer: 2 },
  { id: "5", name: "Gerência Arquivos", priority: "P3", state: "Running", cpu: 12, layer: 2 },
  { id: "6", name: "Analisar Composição", priority: "P4", state: "Waiting", cpu: 8, layer: 4 },
  { id: "7", name: "Gerência Memória", priority: "P3", state: "Running", cpu: 18, layer: 2 },
  { id: "8", name: "Gerência Dispositivos", priority: "P3", state: "Running", cpu: 14, layer: 2 },
  { id: "9", name: "Comunicação DSN", priority: "P3", state: "Running", cpu: 22, layer: 3 },
  { id: "10", name: "Gerência Energia", priority: "P3", state: "Running", cpu: 9, layer: 3 },
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
    totalProcesses: 10,
    ipcPerSecond: 0,
    uptime: 0,
    cpuUsage: 35,
  },
  alerts: [],
  microkernelStats: {
    schedulerQueueSize: 3,
    ipcHubMessages: 0,
    mmuMemorySpaces: 10,
    lastIRQ: "Timer",
  },
  cpuHistory: [],
  isBootSequenceRunning: false,
  isDemoMode: false,

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

  addAlert: (alert) =>
    set((state) => {
      const newAlert = { ...alert, id: Date.now().toString() };
      return {
        alerts: [newAlert, ...state.alerts].slice(0, 10),
      };
    }),

  clearAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  updateMicrokernelStats: (updates) =>
    set((state) => ({
      microkernelStats: { ...state.microkernelStats, ...updates },
    })),

  addCPUHistory: (data) =>
    set((state) => ({
      cpuHistory: [...state.cpuHistory, data].slice(-30),
    })),

  setBootSequenceRunning: (running) =>
    set({ isBootSequenceRunning: running }),

  setDemoMode: (active) =>
    set({ isDemoMode: active }),

  updateCapturedImage: (id, updates) =>
    set((state) => ({
      capturedImages: state.capturedImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })),

  exportSystemData: () => {
    const state = get();
    return JSON.stringify({
      processes: state.processes,
      stats: state.stats,
      alerts: state.alerts,
      microkernelStats: state.microkernelStats,
      eventLogs: state.eventLogs.slice(0, 20),
      ipcMessages: state.ipcMessages.slice(0, 20),
      capturedImages: state.capturedImages,
      timestamp: new Date().toISOString(),
    }, null, 2);
  },
}));
