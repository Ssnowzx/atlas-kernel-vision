import { AlertTriangle, Info } from "lucide-react";

export const AlertsPanel = () => {
  const alerts = [
    {
      type: "warning",
      message: "Radiação cósmica detectada - Sistema monitorando",
    },
    { type: "info", message: "Próxima janela DSN em 2 horas" },
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Alertas do Sistema</h3>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded ${
              alert.type === "warning" ? "bg-yellow-900/20" : "bg-blue-900/20"
            }`}
          >
            {alert.type === "warning" ? (
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            ) : (
              <Info className="h-5 w-5 text-blue-400" />
            )}
            <span className="text-sm">{alert.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
