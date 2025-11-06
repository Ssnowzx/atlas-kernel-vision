import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Satellite,
  Activity,
  MessageSquare,
  Clock,
  Cpu,
  Camera,
} from "lucide-react";

interface Process {
  pid: number;
  name: string;
  priority: string;
  status: string;
  cpu: number;
  startTime: number;
  lastHeartbeat: number;
}

interface IPCMessage {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  type: string;
}

interface SystemEvent {
  timestamp: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
}

interface CometImage {
  id: string;
  filename: string;
  timestamp: string;
  description: string;
}

interface SystemState {
  processes: Process[];
  ipcMessages: IPCMessage[];
  events: SystemEvent[];
  cometImages: CometImage[];
  uptime: number;
  totalCpu: number;
}

const Index = () => {
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("✅ Conectado ao AtlasOS Kernel");
      setConnected(true);
      toast.success("Conectado ao Kernel!", { duration: 2000 });
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "STATE_UPDATE") {
        setSystemState(message.data);
      }
    };

    ws.onclose = () => {
      console.log("❌ Desconectado do Kernel");
      setConnected(false);
      toast.error("Desconectado do Kernel!", { duration: 3000 });
    };

    ws.onerror = (error) => {
      console.error("Erro WebSocket:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleFailureSimulation = (processName: string) => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "SIMULATE_FAILURE", processName }));
      ws.close();
    };
  };

  if (!systemState) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Satellite className="h-16 w-16 text-blue-400 animate-pulse mx-auto mb-4" />
          <div className="text-xl mb-4">Conectando ao AtlasOS Kernel...</div>
          <div className="text-sm text-gray-500">ws://localhost:3001</div>
          <div className="mt-8 text-xs text-gray-600">
            Execute:{" "}
            <code className="bg-gray-800 px-2 py-1 rounded">
              cd server && node src/index.js
            </code>
          </div>
        </div>
      </div>
    );
  }

  const activeProcesses = systemState.processes.filter(
    (p) => p.status === "Running"
  ).length;

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      P1: "bg-red-900/40 text-red-300 border-red-700",
      P2: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
      P3: "bg-blue-900/40 text-blue-300 border-blue-700",
      P4: "bg-purple-900/40 text-purple-300 border-purple-700",
    };
    return colors[priority as keyof typeof colors] || colors.P3;
  };

  const getStatusColor = (status: string) => {
    return status === "Running"
      ? "bg-green-900/30 text-green-300"
      : "bg-gray-700 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-800/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="h-8 w-8 text-blue-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold">AtlasOS Microkernel</h1>
                <p className="text-sm text-gray-400">
                  Exploração do Cometa 3I/ATLAS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                  connected
                    ? "bg-green-900/30 border-green-700/50"
                    : "bg-red-900/30 border-red-700/50"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    connected ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-sm font-semibold">
                  {connected ? "Sistema Online" : "Desconectado"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Uptime</p>
                <p className="text-lg font-mono">
                  {formatUptime(systemState.uptime)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="border border-blue-600 bg-blue-900/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400 text-sm">Processos Ativos</div>
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{activeProcesses}</div>
            <div className="text-xs text-gray-500">
              {systemState.processes.length} total
            </div>
          </div>

          <div className="border border-orange-600 bg-orange-900/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400 text-sm">Mensagens IPCs</div>
              <MessageSquare className="h-6 w-6 text-orange-400" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {systemState.ipcMessages.length}
            </div>
            <div className="text-xs text-gray-500">Hub-and-Spoke</div>
          </div>

          <div className="border border-green-600 bg-green-900/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400 text-sm">Uptime do Sistema</div>
              <Clock className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatUptime(systemState.uptime)}
            </div>
          </div>

          <div className="border border-purple-600 bg-purple-900/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400 text-sm">Uso de CPU</div>
              <Cpu className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {Math.round(systemState.totalCpu)}%
            </div>
          </div>
        </div>

        {/* Microkernel Section */}
        <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-orange-300">
            Camada 1: Microkernel Core (Modo Kernel)
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Apenas 4 componentes essenciais no espaço privilegiado
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-950/30 border border-orange-800 rounded-lg p-4 text-center">
              <Cpu className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="font-bold text-sm mb-1">Escalonador</div>
              <div className="text-xs text-gray-500">
                Preemptivo P1&gt;P2&gt;P3&gt;P4
              </div>
            </div>
            <div className="bg-orange-950/30 border border-orange-800 rounded-lg p-4 text-center">
              <MessageSquare className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="font-bold text-sm mb-1">IPC Hub</div>
              <div className="text-xs text-gray-500">
                Hub-and-Spoke Mensagens
              </div>
            </div>
            <div className="bg-orange-950/30 border border-orange-800 rounded-lg p-4 text-center">
              <Activity className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="font-bold text-sm mb-1">MMU</div>
              <div className="text-xs text-gray-500">Proteção/Isolamento</div>
            </div>
            <div className="bg-orange-950/30 border border-orange-800 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="font-bold text-sm mb-1">Tratamento IRQ</div>
              <div className="text-xs text-gray-500">Interrupções</div>
            </div>
          </div>
        </div>

        {/* Process Table */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Processos Ativos</h3>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    CPU %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {systemState.processes.map((process, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {process.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(
                          process.priority
                        )}`}
                      >
                        {process.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                          process.status
                        )}`}
                      >
                        {process.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {process.cpu}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleFailureSimulation(process.name)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold"
                      >
                        Simular Falha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Imagens Capturadas do Cometa 3I/ATLAS */}
        <div className="mt-12 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Camera className="h-6 w-6 text-blue-400" />
            Imagens Capturadas - Cometa 3I/ATLAS
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Núcleo e coma do cometa interestelar capturados pela câmera da sonda
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systemState.cometImages.map((img) => (
              <div
                key={img.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-600 transition-colors"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center relative">
                  <Camera className="h-16 w-16 text-gray-600" />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {img.id}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-mono text-gray-500">
                      {img.timestamp}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mb-2 text-blue-300">
                    {img.filename}
                  </div>
                  <div className="text-xs text-gray-400">{img.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <section className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h4 className="font-bold mb-2">Isolamento de Falhas</h4>
            <p className="text-sm text-gray-400">
              Drivers em modo usuário não derrubam o kernel
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🔄</div>
            <h4 className="font-bold mb-2">Auto-Recuperação</h4>
            <p className="text-sm text-gray-400">
              Recovery Agent reinicia processos automaticamente
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-bold mb-2">Prioridade Garantida</h4>
            <p className="text-sm text-gray-400">
              P1 (Crítica) sempre executa primeiro
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>AtlasOS - Projeto Acadêmico de Sistemas Operacionais</p>
          <p className="mt-2">
            Missão: Exploração do Cometa Interestelar 3I/ATLAS ☄️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
