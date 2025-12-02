import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const PORT = 3001;

app.use(express.json());

// ============ ESTADO DO SISTEMA ============
let systemState = {
  processes: [
    { pid: 1, name: "servico_controle_voo", priority: "P1", status: "Running", cpu: 25, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 2, name: "servico_navegacao_ia", priority: "P2", status: "Running", cpu: 45, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 3, name: "driver_camera", priority: "P3", status: "Running", cpu: 15, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 4, name: "driver_npu", priority: "P3", status: "Running", cpu: 18, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 5, name: "servico_comunicacao_dsn", priority: "P2", status: "Running", cpu: 12, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 6, name: "servidor_gerencia_memoria", priority: "P3", status: "Running", cpu: 8, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 7, name: "servidor_gerencia_arquivos", priority: "P3", status: "Running", cpu: 6, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 8, name: "servidor_gerencia_dispositivos", priority: "P3", status: "Running", cpu: 5, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 9, name: "recovery_agent", priority: "P3", status: "Running", cpu: 3, startTime: Date.now(), lastHeartbeat: Date.now() },
    { pid: 10, name: "app_analisar_composicao", priority: "P4", status: "Waiting", cpu: 2, startTime: Date.now(), lastHeartbeat: Date.now() },
  ],
  ipcMessages: [],
  events: [],
  cometImages: [],
  uptime: 0,
  totalCpu: 0,
};

const startTime = Date.now();

// ============ FUNÇÕES AUXILIARES ============
function logEvent(message, type = "info") {
  const event = {
    timestamp: new Date().toISOString().slice(11, 19),
    message,
    type,
  };
  systemState.events.push(event);
  if (systemState.events.length > 50) systemState.events.shift();
  console.log(`[${event.timestamp}] ${type.toUpperCase()}: ${message}`);
}

function sendIPCMessage(source, destination, type) {
  const message = {
    id: `ipc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString().slice(11, 19),
    source,
    destination,
    type,
  };
  systemState.ipcMessages.push(message);
  if (systemState.ipcMessages.length > 20) systemState.ipcMessages.shift();
  return message;
}

function captureImage() {
  // As 5 imagens reais do cometa 3I/ATLAS
  const cometImages = [
    { src: "/imagens/nucleo-ativo.png", label: "Núcleo Ativo", description: "Região central do cometa com atividade intensa - H₂O, CH₄ detectado" },
    { src: "/imagens/coma-expansiva.png", label: "Coma Expansiva", description: "Nuvem de gás e poeira ao redor do núcleo - jatos ativos" },
    { src: "/imagens/jato-de-gas.png", label: "Jato de Gás", description: "Emissão de jatos de gás sublimado - velocidade 800 m/s" },
    { src: "/imagens/espectro-infravermelho.png", label: "Espectro Infravermelho", description: "Análise térmica do cometa - NH₃ detectado" },
    { src: "/imagens/nucleo-coma-interstelar.png", label: "Núcleo e Coma Interstelar", description: "Visão completa do objeto interestelar - moléculas orgânicas" },
  ];

  const imageIndex = systemState.cometImages.length % cometImages.length;
  const cometImage = cometImages[imageIndex];
  const imageId = `3I_ATLAS_${String(systemState.cometImages.length + 1).padStart(3, "0")}`;

  const image = {
    id: imageId,
    filename: `${imageId}.png`,
    timestamp: new Date().toISOString().slice(11, 19),
    description: cometImage.description,
    label: cometImage.label,
    url: cometImage.src,
  };

  systemState.cometImages.push(image);
  if (systemState.cometImages.length > 10) systemState.cometImages.shift();

  sendIPCMessage("hardware_camera", "driver_camera", "IRQ_IMAGE_CAPTURED");
  logEvent(`Imagem capturada: ${cometImage.label}`, "info");
}

function simulateProcessActivity() {
  systemState.processes.forEach((proc) => {
    if (proc.status === "Running") {
      proc.cpu = Math.max(5, Math.min(50, proc.cpu + (Math.random() - 0.5) * 10));
      proc.lastHeartbeat = Date.now();
    }
  });

  systemState.totalCpu = systemState.processes.reduce((sum, p) => sum + p.cpu, 0);
}

function checkProcessHealth() {
  const now = Date.now();
  systemState.processes.forEach((proc) => {
    if (proc.status === "Crashed") {
      // Recovery Agent reinicia processo
      setTimeout(() => {
        proc.status = "Running";
        proc.lastHeartbeat = now;
        logEvent(`${proc.name} reiniciado com sucesso`, "success");
        sendIPCMessage("recovery_agent", proc.name, "RESTART");
      }, 3000);
    }
  });
}

// ============ EVENTOS PERIÓDICOS ============
setInterval(() => {
  systemState.uptime = Math.floor((Date.now() - startTime) / 1000);
  simulateProcessActivity();
}, 1000);

setInterval(() => {
  captureImage();
}, 60000); // Captura imagem a cada 1 minuto (60 segundos)

setInterval(() => {
  checkProcessHealth();
}, 3000);

// ============ EVENTOS INICIAIS ============
logEvent("AtlasOS Microkernel inicializado", "success");
logEvent("Missão 3I/ATLAS - Sistema online", "success");
sendIPCMessage("kernel", "servico_controle_voo", "INIT");
sendIPCMessage("kernel", "servico_navegacao_ia", "INIT");

setTimeout(() => {
  captureImage();
}, 5000);

// ============ WEBSOCKET SERVER ============
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('✅ Frontend conectado via WebSocket');
  logEvent("Dashboard conectado ao kernel", "info");

  // Enviar estado inicial
  ws.send(JSON.stringify({ type: "STATE_UPDATE", data: systemState }));

  // Log envio inicial
  console.log('[WS SEND] initial STATE_UPDATE');

  // Atualizar frontend a cada 1 segundo e logar o payload (para debugging)
  const interval = setInterval(() => {
    try {
      const payload = JSON.stringify({ type: "STATE_UPDATE", data: systemState });
      ws.send(payload);
      // Log truncado para evitar prints enormes, mas suficiente para debugging
      console.log('[WS SEND]', payload.slice(0, 1000));
    } catch (err) {
      console.error('[WS SEND ERROR]', err && err.stack ? err.stack : err);
    }
  }, 1000);

  ws.on('message', (data) => {
    // Log raw message received from frontend for full visibility
    console.log('[WS RECV]', data.toString().slice(0, 2000));
    try {
      const message = JSON.parse(data.toString());
      handleClientMessage(message);
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
    }
  });

  ws.on('close', () => {
    console.log('❌ Frontend desconectado');
    clearInterval(interval);
  });
});

function handleClientMessage(message) {
  switch (message.type) {
    case "SIMULATE_FAILURE":
      const process = systemState.processes.find((p) => p.name === message.processName);
      if (process) {
        process.status = "Crashed";
        logEvent(`SIMULAÇÃO: ${message.processName} travou!`, "error");
        sendIPCMessage("kernel", "recovery_agent", "PROCESS_CRASHED");
      }
      break;

    case "RESTART_PROCESS":
      const proc = systemState.processes.find((p) => p.name === message.processName);
      if (proc) {
        proc.status = "Running";
        proc.lastHeartbeat = Date.now();
        logEvent(`${message.processName} reiniciado manualmente`, "success");
      }
      break;
  }
}

// ============ REST API ============
app.get('/api/status', (req, res) => {
  res.json({
    status: "online",
    uptime: systemState.uptime,
    processes: systemState.processes.length,
    totalCpu: systemState.totalCpu,
  });
});

// Expose full current state for external tools (useful for CLI monitors)
app.get('/api/state', (req, res) => {
  res.json(systemState);
});

server.listen(PORT, () => {
  console.log(`🚀 AtlasOS Kernel Backend rodando em http://localhost:${PORT}`);
  console.log(`📡 WebSocket Server: ws://localhost:${PORT}`);
  console.log(`\n✨ Aguardando conexão do dashboard...`);
});
