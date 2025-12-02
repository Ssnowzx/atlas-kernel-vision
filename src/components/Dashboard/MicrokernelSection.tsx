import { useDashboardStore } from "@/store/dashboardStore";
import { Cpu, MessageSquare, HardDrive, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const MicrokernelSection = () => {
  const { microkernelStats } = useDashboardStore();

  const components = [
    {
      title: "Escalonador",
      value: `${microkernelStats.schedulerQueueSize} processos`,
      icon: Cpu,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      title: "IPC Hub",
      value: `${microkernelStats.ipcHubMessages} msg/s`,
      icon: MessageSquare,
      color: "text-success",
      bgColor: "bg-success/20",
    },
    {
      title: "MMU",
      value: `${microkernelStats.mmuMemorySpaces} espaços`,
      icon: HardDrive,
      color: "text-warning",
      bgColor: "bg-warning/20",
    },
    {
      title: "Tratamento IRQ",
      value: microkernelStats.lastIRQ,
      icon: Zap,
      color: "text-critical",
      bgColor: "bg-critical/20",
    },
  ];

  return (
    <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
      <div className="p-6 border-b border-primary/20">
        <h2 className="text-xl font-bold text-foreground">
          Camada 1: Microkernel Core
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Componentes fundamentais do sistema
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {components.map((component, index) => {
          const Icon = component.icon;
          return (
            <motion.div
              key={component.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-primary/20 bg-background/50 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${component.bgColor}`}>
                  <Icon className={`w-5 h-5 ${component.color}`} />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  {component.title}
                </h3>
              </div>
              <p className="font-mono text-lg text-foreground">
                {component.value}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
