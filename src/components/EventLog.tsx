import { CheckCircle, AlertTriangle, Info } from "lucide-react";

interface Event {
  timestamp: string;
  message: string;
  type: "success" | "warning" | "info";
}

interface EventLogProps {
  events: Event[];
}

export const EventLog = ({ events }: EventLogProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Log de Eventos</h3>
      <p className="text-sm text-gray-400 mb-4">Timeline da missão 3I/ATLAS</p>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-900/50 rounded"
          >
            {getIcon(event.type)}
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-mono mb-1">
                {event.timestamp}
              </div>
              <div className="text-sm">{event.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
