import { Scheduler } from "./Scheduler.js";
import { IPCHub } from "./IPC.js";
import { SystemEvent } from "../types.js";

export class RecoveryAgent {
  private scheduler: Scheduler;
  private ipc: IPCHub;
  private eventLog: SystemEvent[] = [];
  private watchdogInterval: NodeJS.Timeout | null = null;

  constructor(scheduler: Scheduler, ipc: IPCHub) {
    this.scheduler = scheduler;
    this.ipc = ipc;
  }

  start() {
    this.watchdogInterval = setInterval(() => {
      this.checkProcessHealth();
    }, 3000);

    this.logEvent("Recovery Agent iniciado", "success");
  }

  private checkProcessHealth() {
    const now = Date.now();
    const processes = this.scheduler.getAllProcesses();

    processes.forEach((proc) => {
      if (proc.status === "Crashed") {
        this.restartProcess(proc.pid);
      } else if (now - proc.lastHeartbeat > 5000 && proc.status === "Running") {
        this.logEvent(
          `${proc.name} não responde - simulando travamento`,
          "warning"
        );
        this.scheduler.updateProcessStatus(proc.pid, "Crashed");
      }
    });
  }

  restartProcess(pid: number) {
    const process = this.scheduler.getProcess(pid);
    if (!process) return;

    this.logEvent(`Reiniciando ${process.name}...`, "warning");
    this.ipc.send("recovery_agent", process.name, "RESTART", { pid });

    setTimeout(() => {
      this.scheduler.updateProcessStatus(pid, "Running");
      this.scheduler.updateHeartbeat(pid);
      this.logEvent(`${process.name} reiniciado com sucesso`, "success");
    }, 2000);
  }

  logEvent(message: string, type: SystemEvent["type"]) {
    const event: SystemEvent = {
      timestamp: new Date().toISOString().slice(11, 19),
      message,
      type,
    };

    this.eventLog.push(event);
    if (this.eventLog.length > 100) {
      this.eventLog.shift();
    }
  }

  getRecentEvents(limit = 20): SystemEvent[] {
    return this.eventLog.slice(-limit);
  }

  stop() {
    if (this.watchdogInterval) {
      clearInterval(this.watchdogInterval);
    }
  }
}
