import { useDashboardStore } from "@/store/dashboardStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Process } from "@/types/dashboard";
import toast from "react-hot-toast";

const priorityColors: Record<string, string> = {
  P1: "bg-critical text-white",
  P2: "bg-high text-background",
  P3: "bg-medium text-white",
  P4: "bg-low text-white",
};

const stateColors: Record<string, string> = {
  Running: "bg-success/20 text-success border-success/50",
  Waiting: "bg-warning/20 text-warning border-warning/50",
  Crashed: "bg-critical/20 text-critical border-critical/50",
};

export const ProcessTable = () => {
  const { processes, simulateFailure } = useDashboardStore();

  const handleSimulateFailure = (process: Process) => {
    simulateFailure(process.id);
    toast.error(`Simulando falha: ${process.name}`, {
      icon: "⚠️",
      style: {
        background: "#1e293b",
        color: "#fff",
        border: "1px solid #ef4444",
      },
    });
  };

  return (
    <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
      <div className="p-6 border-b border-primary/20">
        <h2 className="text-xl font-bold text-foreground">
          Processos Ativos
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoramento em tempo real
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20 bg-background/30">
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                Nome
              </th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                Prioridade
              </th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                Estado
              </th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                CPU %
              </th>
              <th className="text-right p-4 text-sm font-semibold text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr
                key={process.id}
                className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-4">
                  <span className="font-medium text-foreground">
                    {process.name}
                  </span>
                </td>
                <td className="p-4">
                  <Badge className={`${priorityColors[process.priority]} font-mono text-xs`}>
                    {process.priority}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={`${stateColors[process.state]} font-medium text-xs`}
                  >
                    {process.state}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${process.cpu}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">
                      {process.cpu}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleSimulateFailure(process)}
                    disabled={process.state === "Crashed"}
                    className="text-xs"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Simular Falha
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
