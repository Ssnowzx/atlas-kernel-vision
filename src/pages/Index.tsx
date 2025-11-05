import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/Dashboard/Header";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ProcessTable } from "@/components/Dashboard/ProcessTable";
import { IPCMonitor } from "@/components/Dashboard/IPCMonitor";
import { EventLog } from "@/components/Dashboard/EventLog";
import { ImageGallery } from "@/components/Dashboard/ImageGallery";
import { useDashboardStore } from "@/store/dashboardStore";
import { Cpu, MessageSquare, Clock, Activity } from "lucide-react";

const Index = () => {
  const { processes, stats, updateStats, addIPCMessage, addEventLog, updateProcess } = useDashboardStore();

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update uptime
      updateStats({ uptime: stats.uptime + 1 });

      // Randomly update process states and CPU
      const randomProcess = processes[Math.floor(Math.random() * processes.length)];
      if (randomProcess && randomProcess.state !== "Crashed") {
        const newCpu = Math.max(5, Math.min(90, randomProcess.cpu + Math.floor(Math.random() * 20 - 10)));
        updateProcess(randomProcess.id, { cpu: newCpu });

        // Randomly change state between Running and Waiting
        if (Math.random() > 0.9) {
          const newState = randomProcess.state === "Running" ? "Waiting" : "Running";
          updateProcess(randomProcess.id, { state: newState });
        }
      }

      // Calculate average CPU
      const avgCpu = Math.floor(
        processes.reduce((sum, p) => sum + p.cpu, 0) / processes.length
      );
      updateStats({ cpuUsage: avgCpu });

      // Generate IPC messages
      if (Math.random() > 0.4) {
        const processNames = processes.map((p) => p.name);
        const from = processNames[Math.floor(Math.random() * processNames.length)];
        let to = processNames[Math.floor(Math.random() * processNames.length)];
        while (to === from) {
          to = processNames[Math.floor(Math.random() * processNames.length)];
        }

        const types = ["READ_DATA", "WRITE_FILE", "COMPUTE", "SYNC", "REQUEST"];
        const type = types[Math.floor(Math.random() * types.length)];

        addIPCMessage({
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          from,
          to,
          type,
        });

        updateStats({ ipcPerSecond: stats.ipcPerSecond + 1 });
      }

      // Random system events
      if (Math.random() > 0.95) {
        const messages = [
          "Sistema de telemetria atualizado",
          "Dados de navegação sincronizados",
          "Cache de memória otimizado",
          "Verificação de integridade concluída",
        ];
        addEventLog({
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          message: messages[Math.floor(Math.random() * messages.length)],
          severity: "info",
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [processes, stats]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <Header />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Processos Ativos"
            value={stats.totalProcesses}
            icon={Activity}
            color="primary"
          />
          <StatsCard
            title="Mensagens IPC/s"
            value={stats.ipcPerSecond}
            icon={MessageSquare}
            color="success"
            trend="Comunicação ativa"
          />
          <StatsCard
            title="Uptime do Sistema"
            value={formatUptime(stats.uptime)}
            icon={Clock}
            color="warning"
            trend="Operação contínua"
          />
          <StatsCard
            title="Uso de CPU"
            value={`${stats.cpuUsage}%`}
            icon={Cpu}
            color={stats.cpuUsage > 70 ? "critical" : "primary"}
            trend={stats.cpuUsage > 70 ? "Alto consumo" : "Normal"}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProcessTable />
            <IPCMonitor />
            <ImageGallery />
          </div>

          <div className="lg:col-span-1">
            <EventLog />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
