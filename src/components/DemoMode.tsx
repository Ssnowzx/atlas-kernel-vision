import { Play, FileDown } from "lucide-react";

interface DemoModeProps {
  onStart: () => void;
  onExport: () => void;
}

export const DemoMode = ({ onStart, onExport }: DemoModeProps) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onStart}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        <Play className="h-5 w-5" />
        Modo Apresentação
      </button>
      <button
        onClick={onExport}
        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        <FileDown className="h-5 w-5" />
        Exportar Relatório
      </button>
    </div>
  );
};
