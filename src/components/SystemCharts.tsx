export const SystemCharts = () => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Gráficos do Sistema</h3>
      <p className="text-sm text-gray-400 mb-4">
        Métricas de desempenho da missão 3I/ATLAS
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Uso de CPU</div>
          <div className="h-32 bg-gradient-to-t from-blue-900/30 to-transparent rounded"></div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Memória</div>
          <div className="h-32 bg-gradient-to-t from-green-900/30 to-transparent rounded"></div>
        </div>
      </div>
    </div>
  );
};
