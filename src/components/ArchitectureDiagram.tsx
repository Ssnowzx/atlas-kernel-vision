import { Layers } from "lucide-react";

export const ArchitectureDiagram = () => {
  const layers = [
    {
      number: 4,
      title: "Aplicações Científicas",
      mode: "Modo Usuário",
      color: "purple",
      items: ["Análise Composição 3I/ATLAS (P4)", "Estudos Coma/Núcleo (P4)"],
    },
    {
      number: 3,
      title: "Serviços de Missão",
      mode: "Modo Usuário",
      color: "yellow",
      items: [
        "Controle de Voo (P1)",
        "Navegação IA (P2)",
        "Comunicação DSN",
        "Gerência Energia",
      ],
    },
    {
      number: 2,
      title: "Serviços Essenciais",
      mode: "Modo Usuário",
      color: "blue",
      items: [
        "Driver Câmera (P3)",
        "Driver NPU (P3)",
        "Gerência Memória",
        "Recovery Agent",
      ],
    },
    {
      number: 1,
      title: "Microkernel",
      mode: "Modo Kernel",
      color: "orange",
      items: ["Escalonador", "IPC Hub", "MMU", "Tratamento IRQ"],
    },
    {
      number: 0,
      title: "Hardware",
      mode: "Camada Física",
      color: "green",
      items: [
        "CPU Resistente",
        "NPU (IA)",
        "Câmera",
        "Propulsores",
        "Flash",
        "Timer/Watchdog",
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "bg-purple-900/20 border-purple-700",
      yellow: "bg-yellow-900/20 border-yellow-700",
      blue: "bg-blue-900/20 border-blue-700",
      orange: "bg-orange-900/20 border-orange-700",
      green: "bg-green-900/20 border-green-700",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Layers className="h-6 w-6 text-blue-400" />
        Arquitetura em 5 Camadas
      </h3>
      <div className="space-y-4">
        {layers.map((layer) => (
          <div
            key={layer.number}
            className={`border rounded-lg p-6 ${getColorClasses(layer.color)}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`bg-${layer.color}-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shrink-0`}
              >
                {layer.number}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-1">{layer.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{layer.mode}</p>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 bg-${layer.color}-800/30 rounded-full text-xs`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
