export type ProcessPriority = "P1" | "P2" | "P3" | "P4";
export type ProcessState = "Running" | "Waiting" | "Crashed";
export type EventSeverity = "info" | "warning" | "error" | "success";

export interface Process {
  id: string;
  name: string;
  priority: ProcessPriority;
  state: ProcessState;
  cpu: number;
  layer: number;
}

export interface IPCMessage {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  type: string;
}

export interface EventLog {
  id: string;
  timestamp: string;
  message: string;
  severity: EventSeverity;
}

export interface CapturedImage {
  id: string;
  filename: string;
  timestamp: string;
  coordinates: {
    lat: number;
    long: number;
  };
  altitude: string;
  status: "Processada" | "Aguardando análise";
  url: string;
}

export interface SystemStats {
  totalProcesses: number;
  ipcPerSecond: number;
  uptime: number;
  cpuUsage: number;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
}

export interface MicrokernelStats {
  schedulerQueueSize: number;
  ipcHubMessages: number;
  mmuMemorySpaces: number;
  lastIRQ: string;
}

export interface CPUHistory {
  timestamp: number;
  cpu: number;
}
