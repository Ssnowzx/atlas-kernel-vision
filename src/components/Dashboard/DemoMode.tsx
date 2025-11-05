import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { Play, Square } from "lucide-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export const DemoMode = () => {
  const { 
    isDemoMode, 
    setDemoMode, 
    processes,
    simulateFailure, 
    addEventLog,
    addCapturedImage,
    addIPCMessage 
  } = useDashboardStore();
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    if (isDemoMode) {
      runDemoSequence();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stepRef.current = 0;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isDemoMode]);

  const runDemoSequence = () => {
    intervalRef.current = setInterval(() => {
      const step = stepRef.current % 4;
      
      switch (step) {
        case 0:
          // Captura de imagem
          const imageNumber = Math.floor(Math.random() * 1000);
          addCapturedImage({
            filename: `IMG_DEMO_${String(imageNumber).padStart(4, "0")}.jpg`,
            timestamp: new Date().toLocaleString("pt-BR"),
            coordinates: {
              lat: (Math.random() * 180 - 90).toFixed(2) as any,
              long: (Math.random() * 360 - 180).toFixed(2) as any,
            },
            altitude: `${Math.floor(Math.random() * 200000 + 100000).toLocaleString()} km`,
            status: "Processada",
            url: `https://images.unsplash.com/photo-${1600000000000 + imageNumber}?w=800&h=600&fit=crop`,
          });
          addEventLog({
            timestamp: new Date().toLocaleTimeString("pt-BR"),
            message: "🎬 [DEMO] Nova imagem capturada automaticamente",
            severity: "success",
          });
          break;

        case 1:
          // Simular falha em driver
          const cameraProcess = processes.find((p) => p.name === "Driver Câmera");
          if (cameraProcess) {
            simulateFailure(cameraProcess.id);
            addEventLog({
              timestamp: new Date().toLocaleTimeString("pt-BR"),
              message: "🎬 [DEMO] Simulando falha no driver",
              severity: "warning",
            });
          }
          break;

        case 2:
          // IPC entre processos
          addIPCMessage({
            timestamp: new Date().toLocaleTimeString("pt-BR"),
            from: "Navegação IA",
            to: "Controle de Voo",
            type: "TRAJECTORY_UPDATE",
          });
          addEventLog({
            timestamp: new Date().toLocaleTimeString("pt-BR"),
            message: "🎬 [DEMO] IPC: Atualização de trajetória",
            severity: "info",
          });
          break;

        case 3:
          // Log de sucesso
          addEventLog({
            timestamp: new Date().toLocaleTimeString("pt-BR"),
            message: "🎬 [DEMO] Ciclo completo - sistema operando normalmente",
            severity: "success",
          });
          break;
      }

      stepRef.current++;
    }, 5000);
  };

  const handleToggleDemo = () => {
    if (!isDemoMode) {
      setDemoMode(true);
      toast.success("Modo apresentação ativado!", {
        icon: "🎬",
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #3b82f6",
        },
      });
    } else {
      setDemoMode(false);
      toast("Modo apresentação desativado", {
        icon: "⏸️",
        style: {
          background: "#1e293b",
          color: "#fff",
        },
      });
    }
  };

  return (
    <Button
      onClick={handleToggleDemo}
      variant={isDemoMode ? "destructive" : "default"}
      className={isDemoMode ? "" : "bg-primary hover:bg-primary/80"}
    >
      {isDemoMode ? (
        <>
          <Square className="w-4 h-4 mr-2" />
          Parar Apresentação
        </>
      ) : (
        <>
          <Play className="w-4 h-4 mr-2" />
          Modo Apresentação
        </>
      )}
    </Button>
  );
};
