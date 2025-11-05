import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/Dashboard/Header";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ProcessTable } from "@/components/Dashboard/ProcessTable";
import { IPCMonitor } from "@/components/Dashboard/IPCMonitor";
import { EventLog } from "@/components/Dashboard/EventLog";
import { ImageGallery } from "@/components/Dashboard/ImageGallery";
import { MicrokernelSection } from "@/components/Dashboard/MicrokernelSection";
import { ArchitectureDiagram } from "@/components/Dashboard/ArchitectureDiagram";
import { BootSequence } from "@/components/Dashboard/BootSequence";
import { SystemCharts } from "@/components/Dashboard/SystemCharts";
import { AlertsPanel } from "@/components/Dashboard/AlertsPanel";
import { DemoMode } from "@/components/Dashboard/DemoMode";
import { ExportData } from "@/components/Dashboard/ExportData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStore } from "@/store/dashboardStore";
import { Cpu, MessageSquare, Clock, Activity } from "lucide-react";

const Index = () => {
  const { 
    processes, 
    stats, 
    updateStats, 
    addIPCMessage, 
    addEventLog, 
    updateProcess,
    updateMicrokernelStats,
    addCPUHistory,
    addAlert,
    alerts
  } = useDashboardStore();
  const [failureCount, setFailureCount] = useState<Record<string, number>>({});

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update uptime
      updateStats({ uptime: stats.uptime + 1 });

      // Randomly update process states and CPU
      const randomProcess = processes[Math.floor(Math.random() * processes.length)];
      if (randomProcess) {
        if (randomProcess.state !== "Crashed") {
          const newCpu = Math.max(5, Math.min(90, randomProcess.cpu + Math.floor(Math.random() * 20 - 10)));
          updateProcess(randomProcess.id, { cpu: newCpu });

          // Randomly change state between Running and Waiting
          if (Math.random() > 0.9) {
            const newState = randomProcess.state === "Running" ? "Waiting" : "Running";
            updateProcess(randomProcess.id, { state: newState });
          }
        }

        // Track failures for alerts
        if (randomProcess.state === "Crashed") {
          const count = (failureCount[randomProcess.id] || 0) + 1;
          setFailureCount({ ...failureCount, [randomProcess.id]: count });
          
          if (count >= 3) {
            addAlert({
              severity: "critical",
              message: `Processo ${randomProcess.name} falhou 3x - CRÍTICO`,
              timestamp: new Date().toLocaleTimeString("pt-BR"),
            });
          }
        }
      }

      // Calculate average CPU
      const avgCpu = Math.floor(
        processes.reduce((sum, p) => sum + p.cpu, 0) / processes.length
      );
      updateStats({ cpuUsage: avgCpu });

      // Add CPU history
      addCPUHistory({
        timestamp: Date.now(),
        cpu: avgCpu,
      });

      // CPU usage alerts
      if (avgCpu > 90) {
        addAlert({
          severity: "warning",
          message: "CPU >90% por 5s - HIGH LOAD",
          timestamp: new Date().toLocaleTimeString("pt-BR"),
        });
      }

      // Generate IPC messages
      const ipcCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < ipcCount; i++) {
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
      }

      const totalIPC = ipcCount;
      updateStats({ ipcPerSecond: totalIPC });

      // IPC queue alert
      if (totalIPC > 100) {
        addAlert({
          severity: "warning",
          message: "IPC queue >100 - WARNING",
          timestamp: new Date().toLocaleTimeString("pt-BR"),
        });
      }

      // Update microkernel stats
      updateMicrokernelStats({
        schedulerQueueSize: Math.floor(Math.random() * 10) + 1,
        ipcHubMessages: totalIPC,
        mmuMemorySpaces: processes.length,
        lastIRQ: ["Timer", "Keyboard", "Network", "Disk"][Math.floor(Math.random() * 4)],
      });

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
  }, [processes, stats, failureCount]);

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
        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <DemoMode />
          <ExportData />
        </div>

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

        {/* Tabs Section */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-card/50 border border-primary/20">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
            <TabsTrigger value="boot">Boot</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <MicrokernelSection />
            
            {alerts.length > 0 && <AlertsPanel />}

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
          </TabsContent>

          <TabsContent value="architecture">
            <ArchitectureDiagram />
          </TabsContent>

          <TabsContent value="boot">
            <BootSequence />
          </TabsContent>

          <TabsContent value="charts">
            <SystemCharts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
