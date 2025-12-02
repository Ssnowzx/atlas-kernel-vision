import { AlertCircle } from "lucide-react";

interface Process {
  name: string;
  priority: string;
  status: string;
  cpu: number;
}

interface ProcessTableProps {
  processes: Process[];
  onSimulateFailure: (processName: string) => void;
}

export const ProcessTable = ({ processes, onSimulateFailure }: ProcessTableProps) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      P1: "bg-red-900/40 text-red-300 border-red-700",
      P2: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
      P3: "bg-blue-900/40 text-blue-300 border-blue-700",
      P4: "bg-purple-900/40 text-purple-300 border-purple-700",
    };
    return colors[priority as keyof typeof colors] || colors.P3;
  };

  const getStatusColor = (status: string) => {
    return status === "Running" 
      ? "bg-green-900/30 text-green-300" 
      : "bg-gray-700 text-gray-400";
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-900/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Prioridade</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">CPU %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {processes.map((process, index) => (
            <tr key={index} className="hover:bg-gray-700/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-medium">{process.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(process.priority)}`}>
                  {process.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(process.status)}`}>
                  {process.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-mono">{process.cpu}%</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onSimulateFailure(process.name)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  Simular Falha
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
