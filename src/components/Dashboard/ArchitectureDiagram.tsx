import { useDashboardStore } from "@/store/dashboardStore";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const ArchitectureDiagram = () => {
  const { processes } = useDashboardStore();

  const layers = [
    {
      layer: 0,
      name: "Hardware",
      color: "bg-slate-800 border-slate-600",
      processes: ["CPU", "RAM", "Storage", "NPU"],
    },
    {
      layer: 1,
      name: "Microkernel Core",
      color: "bg-critical/20 border-critical/50",
      processes: ["Escalonador", "IPC Hub", "MMU", "IRQ Handler"],
    },
    {
      layer: 2,
      name: "Drivers & Gerenciadores",
      color: "bg-primary/20 border-primary/50",
      processes: processes.filter((p) => p.layer === 2).map((p) => p.name),
    },
    {
      layer: 3,
      name: "Serviços do Sistema",
      color: "bg-success/20 border-success/50",
      processes: processes.filter((p) => p.layer === 3).map((p) => p.name),
    },
    {
      layer: 4,
      name: "Aplicações",
      color: "bg-warning/20 border-warning/50",
      processes: processes.filter((p) => p.layer === 4).map((p) => p.name),
    },
  ];

  return (
    <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
      <div className="p-6 border-b border-primary/20">
        <h2 className="text-xl font-bold text-foreground">
          Arquitetura em Camadas
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Estrutura hierárquica do AtlasOS
        </p>
      </div>

      <div className="p-6 space-y-4">
        {layers.reverse().map((layer, index) => (
          <motion.div
            key={layer.layer}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg border-2 ${layer.color} p-4`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-foreground">
                  Camada {layer.layer}
                </h3>
                <p className="text-sm text-muted-foreground">{layer.name}</p>
              </div>
              <Badge variant="outline" className="font-mono">
                L{layer.layer}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {layer.processes.map((process) => (
                <span
                  key={process}
                  className="px-3 py-1 rounded-md bg-background/50 text-foreground text-xs font-medium border border-primary/20"
                >
                  {process}
                </span>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-sm text-foreground">
            <span className="font-bold text-primary">IPC Hub</span> conecta todas as camadas,
            permitindo comunicação segura e isolada entre processos.
          </p>
        </div>
      </div>
    </div>
  );
};
