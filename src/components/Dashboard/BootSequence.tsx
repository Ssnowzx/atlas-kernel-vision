import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { Power, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export const BootSequence = () => {
  const { isBootSequenceRunning, setBootSequenceRunning, addEventLog } = useDashboardStore();
  const [currentStep, setCurrentStep] = useState(0);

  const bootSteps = [
    { name: "POST", description: "Power-On Self Test", duration: 800 },
    { name: "Bootloader", description: "Carregando kernel", duration: 1000 },
    { name: "Microkernel", description: "Inicializando core", duration: 1200 },
    { name: "Camada 2", description: "Drivers & Gerenciadores", duration: 1500 },
    { name: "Camada 3", description: "Serviços do Sistema", duration: 1000 },
    { name: "Online", description: "Sistema pronto", duration: 500 },
  ];

  const handleBoot = async () => {
    setBootSequenceRunning(true);
    setCurrentStep(0);

    addEventLog({
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      message: "🚀 Iniciando sequência de boot",
      severity: "info",
    });

    for (let i = 0; i < bootSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, bootSteps[i].duration));
      
      addEventLog({
        timestamp: new Date().toLocaleTimeString("pt-BR"),
        message: `✓ ${bootSteps[i].name}: ${bootSteps[i].description}`,
        severity: i === bootSteps.length - 1 ? "success" : "info",
      });
    }

    toast.success("Sistema inicializado com sucesso!", {
      icon: "✅",
      style: {
        background: "#1e293b",
        color: "#fff",
        border: "1px solid #10b981",
      },
    });

    setTimeout(() => {
      setBootSequenceRunning(false);
      setCurrentStep(0);
    }, 1000);
  };

  return (
    <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
      <div className="p-6 border-b border-primary/20 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Power className="w-6 h-6 text-primary" />
            Sequência de Boot
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Simulação de inicialização do sistema
          </p>
        </div>

        <Button
          onClick={handleBoot}
          disabled={isBootSequenceRunning}
          className="bg-primary hover:bg-primary/80"
        >
          <Power className="w-4 h-4 mr-2" />
          {isBootSequenceRunning ? "Inicializando..." : "Simular Boot"}
        </Button>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {bootSteps.map((step, index) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: currentStep >= index && isBootSequenceRunning ? 1 : 0.3,
                  x: 0,
                }}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-primary/20"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep > index
                      ? "bg-success/20 border-success"
                      : currentStep === index
                      ? "bg-primary/20 border-primary animate-pulse"
                      : "bg-background border-muted-foreground/30"
                  } border-2`}
                >
                  {currentStep > index ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <span className="text-xs font-bold text-foreground">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{step.name}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
