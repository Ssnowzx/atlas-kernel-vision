import express from "express";
import type { Request, Response } from "express";
import { WebSocketServer, type WebSocket } from "ws";
import { Scheduler } from "./microkernel/Scheduler.js";
import { IPCHub } from "./microkernel/IPC.js";
import { RecoveryAgent } from "./microkernel/RecoveryAgent.js";
import { HardwareSimulator } from "./microkernel/Hardware.js";
import { SystemState } from "./types.js";

const app = express();
const PORT = 3001;

app.use(express.json());

// ============ MICROKERNEL CORE ============
const scheduler = new Scheduler();
const ipc = new IPCHub();
const recoveryAgent = new RecoveryAgent(scheduler, ipc);
const hardware = new HardwareSimulator(ipc, recoveryAgent);

// ============ CRIAR PROCESSOS INICIAIS ============
scheduler.createProcess("servico_controle_voo", "P1");
scheduler.createProcess("servico_navegacao_ia", "P2");
scheduler.createProcess("driver_camera", "P3");
scheduler.createProcess("driver_npu", "P3");
scheduler.createProcess("servico_comunicacao_dsn", "P2");
scheduler.createProcess("servidor_gerencia_memoria", "P3");
scheduler.createProcess("servidor_gerencia_arquivos", "P3");
scheduler.createProcess("servidor_gerencia_dispositivos", "P3");
scheduler.createProcess("recovery_agent", "P3");
scheduler.createProcess("app_analisar_composicao", "P4");

// ============ INICIAR COMPONENTES ============
recoveryAgent.start();
hardware.start();

recoveryAgent.logEvent("AtlasOS Microkernel inicializado", "success");
recoveryAgent.logEvent("Missão 3I/ATLAS - Sistema online", "success");

// ============ WEBSOCKET SERVER ============
const server = app.listen(PORT, () => {
  console.log(`🚀 AtlasOS Kernel rodando em http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("✅ Frontend conectado via WebSocket");

  // Enviar estado inicial
  sendSystemState(ws);

  // Atualizar frontend a cada 1 segundo
  const interval = setInterval(() => {
    sendSystemState(ws);
  }, 1000);

  ws.on("message", (data: any) => {
    const message = JSON.parse(data.toString());
    handleClientMessage(message);
  });

  ws.on("close", () => {
    console.log("❌ Frontend desconectado");
    clearInterval(interval);
  });
});

function sendSystemState(ws: WebSocket) {
  const state: SystemState = {
    processes: scheduler.getAllProcesses(),
    ipcMessages: ipc.getRecentMessages(),
    events: recoveryAgent.getRecentEvents(),
    cometImages: hardware.getRecentImages(),
    // simple MMU simulator metrics
    mmu: {
      usedPages: Math.floor(Math.random() * 200),
      totalPages: 256,
      pageFaults: Math.floor(Math.random() * 5),
    },
    uptime: Math.floor((Date.now() - startTime) / 1000),
    totalCpu: scheduler.getAllProcesses().reduce((sum, p) => sum + p.cpu, 0),
  };

  ws.send(JSON.stringify({ type: "STATE_UPDATE", data: state }));
}

function handleClientMessage(message: any) {
  switch (message.type) {
    case "SIMULATE_FAILURE":
      const process = scheduler
        .getAllProcesses()
        .find((p) => p.name === message.processName);
      if (process) {
        scheduler.updateProcessStatus(process.pid, "Crashed");
        recoveryAgent.logEvent(
          `SIMULAÇÃO: ${message.processName} travou!`,
          "error"
        );
      }
      break;

    case "RESTART_PROCESS":
      const proc = scheduler
        .getAllProcesses()
        .find((p) => p.name === message.processName);
      if (proc) {
        recoveryAgent.restartProcess(proc.pid);
      }
      break;
  }
}

const startTime = Date.now();

// ============ REST API (opcional) ============
app.get("/api/status", (req: Request, res: Response) => {
  res.json({
    status: "online",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    processes: scheduler.getAllProcesses().length,
  });
});

console.log(`📡 WebSocket Server: ws://localhost:${PORT}`);
