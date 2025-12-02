import { useDashboardStore } from "@/store/dashboardStore";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export const AlertsPanel = () => {
  const { alerts, clearAlert } = useDashboardStore();

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-critical bg-critical/10 text-critical";
      case "warning":
        return "border-warning bg-warning/10 text-warning";
      default:
        return "border-primary bg-primary/10 text-primary";
    }
  };

  return (
    <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
      <div className="p-6 border-b border-primary/20">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-warning" />
          Alertas do Sistema
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoramento de alertas críticos
        </p>
      </div>

      <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum alerta ativo</p>
            </motion.div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`rounded-lg border-2 p-4 ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getAlertIcon(alert.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => clearAlert(alert.id)}
                    className="h-6 w-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
