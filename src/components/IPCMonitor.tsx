interface IPCMessage {
  timestamp: string;
  source: string;
  destination: string;
  type: string;
}

interface IPCMonitorProps {
  messages: IPCMessage[];
}

export const IPCMonitor = ({ messages }: IPCMonitorProps) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Monitor IPC</h3>
      <p className="text-sm text-gray-400 mb-4">
        Hub-and-Spoke: Comunicação entre processos
      </p>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 bg-gray-900/50 rounded"
          >
            <span className="text-xs text-gray-500 font-mono w-20">
              {msg.timestamp}
            </span>
            <div className="flex items-center gap-2 flex-1">
              <span className="px-3 py-1 bg-blue-900/30 rounded text-sm">
                {msg.source}
              </span>
              <span className="text-orange-400">→</span>
              <span className="px-2 py-1 bg-orange-900/30 rounded text-xs uppercase font-bold">
                {msg.type}
              </span>
              <span className="text-orange-400">→</span>
              <span className="px-3 py-1 bg-blue-900/30 rounded text-sm">
                {msg.destination}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
