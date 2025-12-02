import { Play, CheckCircle } from "lucide-react";

export const BootSequence = () => {
  const steps = [
    {
      step: 1,
      name: "Hardware POST",
      description: "Power-On Self-Test",
      status: "complete",
    },
    {
      step: 2,
      name: "Bootloader",
      description: "Carrega Microkernel",
      status: "complete",
    },
    {
      step: 3,
      name: "Microkernel",
      description: "Inicializa Escalonador, IPC, MMU, IRQ",
      status: "complete",
    },
    {
      step: 4,
      name: "Camada 2",
      description: "Serviços Essenciais (drivers, gerenciadores)",
      status: "complete",
    },
    {
      step: 5,
      name: "Camada 3",
      description: "Serviços de Missão",
      status: "complete",
    },
    {
      step: 6,
      name: "Camada 4",
      description: "Aplicações Científicas (sob demanda)",
      status: "ready",
    },
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Play className="h-5 w-5 text-green-400" />
        Sequência de Boot
      </h3>
      <div className="space-y-3">
        {steps.map((item) => (
          <div
            key={item.step}
            className="flex items-center gap-4 p-3 bg-gray-900/50 rounded"
          >
            <div className="bg-blue-900/30 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
              {item.step}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{item.name}</div>
              <div className="text-xs text-gray-400">{item.description}</div>
            </div>
            {item.status === "complete" && (
              <CheckCircle className="h-5 w-5 text-green-400" />
            )}
            {item.status === "ready" && (
              <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded text-xs">
                Pronto
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
