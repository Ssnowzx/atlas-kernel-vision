import { useDashboardStore } from "@/store/dashboardStore";
import { Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { EventSeverity } from "@/types/dashboard";
import { motion } from "framer-motion";

const severityConfig: Record<EventSeverity, { icon: any; color: string }> = {
  info: { icon: Info, color: "text-primary" },
  warning: { icon: AlertTriangle, color: "text-warning" },
  error: { icon: XCircle, color: "text-critical" },
  success: { icon: CheckCircle, color: "text-success" },
};

export const EventLog = () => {
  const { eventLogs } = useDashboardStore();

  return (
    <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden h-[calc(100vh-200px)] flex flex-col">
      <div className="p-6 border-b border-primary/20">
        <h2 className="text-xl font-bold text-foreground">
          Log de Eventos
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Histórico do sistema
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
        {eventLogs.map((log, index) => {
          const config = severityConfig[log.severity];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors"
            >
              <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  {log.message}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
