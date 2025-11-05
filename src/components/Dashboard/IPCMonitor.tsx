import { useDashboardStore } from "@/store/dashboardStore";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const IPCMonitor = () => {
  const { ipcMessages } = useDashboardStore();

  return (
    <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden h-[400px] flex flex-col">
      <div className="p-6 border-b border-primary/20">
        <h2 className="text-xl font-bold text-foreground">
          Monitor IPC
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Comunicação entre processos
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {ipcMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors"
            >
              <span className="text-xs font-mono text-muted-foreground">
                {message.timestamp}
              </span>
              <span className="text-sm text-foreground font-medium">
                {message.from}
              </span>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-primary/80 px-2 py-1 bg-primary/10 rounded">
                {message.type}
              </span>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                {message.to}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {ipcMessages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Aguardando mensagens IPC...
          </div>
        )}
      </div>
    </div>
  );
};
