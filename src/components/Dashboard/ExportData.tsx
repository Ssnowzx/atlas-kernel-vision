import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

export const ExportData = () => {
  const { exportSystemData } = useDashboardStore();

  const handleExport = () => {
    try {
      const data = exportSystemData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `atlasos-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Relatório exportado com sucesso!", {
        icon: "📥",
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #10b981",
        },
      });
    } catch (error) {
      toast.error("Erro ao exportar relatório", {
        icon: "❌",
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="border-primary/50 hover:bg-primary/10"
    >
      <Download className="w-4 h-4 mr-2" />
      Exportar Relatório
    </Button>
  );
};
