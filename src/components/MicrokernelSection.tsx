import { Cpu, Zap, Shield, MessageSquare } from "lucide-react";

export const MicrokernelSection = () => {
  const components = [
    {
      name: "Escalonador",
      description: "Preemptivo P1>P2>P3>P4",
      icon: <Cpu className="h-8 w-8 text-orange-400" />,
    },
    {
      name: "IPC Hub",
      description: "Hub-and-Spoke Mensagens",
      icon: <MessageSquare className="h-8 w-8 text-orange-400" />,
    },
    {
      name: "MMU",
      description: "Proteção/Isolamento",
      icon: <Shield className="h-8 w-8 text-orange-400" />,
    },
    {
      name: "Tratamento IRQ",
      description: "Interrupções",
      icon: <Zap className="h-8 w-8 text-orange-400" />,
    },
  ];

  return (
    <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4 text-orange-300">
        Camada 1: Microkernel Core (Modo Kernel)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Apenas 4 componentes essenciais no espaço privilegiado
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {components.map((comp, index) => (
          <div
            key={index}
            className="bg-orange-950/30 border border-orange-800 rounded-lg p-4 text-center hover:bg-orange-900/40 transition-colors"
          >
            <div className="flex justify-center mb-3">{comp.icon}</div>
            <div className="font-bold text-sm mb-1">{comp.name}</div>
            <div className="text-xs text-gray-500">{comp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
