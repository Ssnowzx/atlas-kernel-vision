import { Process, Priority, ProcessStatus } from "../types.js";

export class Scheduler {
  private processes: Map<number, Process> = new Map();
  private readyQueue: number[] = [];
  private currentPid: number | null = null;
  private nextPid = 1;

  private priorityWeight: Record<Priority, number> = {
    P1: 4, // Crítica - Controle de Voo
    P2: 3, // Alta - Navegação IA
    P3: 2, // Média - Drivers
    P4: 1, // Baixa - Apps Científicos
  };

  createProcess(name: string, priority: Priority): Process {
    const process: Process = {
      pid: this.nextPid++,
      name,
      priority,
      status: "Running",
      cpu: Math.floor(Math.random() * 30) + 5,
      startTime: Date.now(),
      lastHeartbeat: Date.now(),
    };

    this.processes.set(process.pid, process);
    this.readyQueue.push(process.pid);
    this.sortReadyQueue();

    return process;
  }

  private sortReadyQueue() {
    this.readyQueue.sort((a, b) => {
      const procA = this.processes.get(a)!;
      const procB = this.processes.get(b)!;
      return (
        this.priorityWeight[procB.priority] -
        this.priorityWeight[procA.priority]
      );
    });
  }

  schedule(): Process | null {
    if (this.readyQueue.length === 0) return null;

    const pid = this.readyQueue[0];
    this.currentPid = pid;
    return this.processes.get(pid) || null;
  }

  getProcess(pid: number): Process | undefined {
    return this.processes.get(pid);
  }

  getAllProcesses(): Process[] {
    return Array.from(this.processes.values());
  }

  updateProcessStatus(pid: number, status: ProcessStatus) {
    const process = this.processes.get(pid);
    if (process) {
      process.status = status;
      if (status === "Crashed") {
        this.readyQueue = this.readyQueue.filter((p) => p !== pid);
      }
    }
  }

  updateHeartbeat(pid: number) {
    const process = this.processes.get(pid);
    if (process) {
      process.lastHeartbeat = Date.now();
    }
  }

  removeProcess(pid: number) {
    this.processes.delete(pid);
    this.readyQueue = this.readyQueue.filter((p) => p !== pid);
  }
}
