export type Priority = "P1" | "P2" | "P3" | "P4";

export type ProcessStatus = "Running" | "Waiting" | "Blocked" | "Crashed";

export interface Process {
  pid: number;
  name: string;
  priority: Priority;
  status: ProcessStatus;
  cpu: number;
  startTime: number;
  lastHeartbeat: number;
}

export interface IPCMessage {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  type: string;
  payload?: any;
}

export interface SystemEvent {
  timestamp: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
}

export interface CometImage {
  id: string;
  filename: string;
  timestamp: string;
  description: string;
}

export interface MMUMetrics {
  usedPages: number;
  totalPages: number;
  pageFaults: number;
}

export interface SystemState {
  processes: Process[];
  ipcMessages: IPCMessage[];
  events: SystemEvent[];
  cometImages: CometImage[];
  mmu?: MMUMetrics;
  uptime: number;
  totalCpu: number;
}
