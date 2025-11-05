import { useDashboardStore } from "@/store/dashboardStore";
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { Activity, BarChart3, Clock } from "lucide-react";

export const SystemCharts = () => {
  const { cpuHistory, processes, eventLogs } = useDashboardStore();

  const ipcData = processes.map((p) => ({
    name: p.name.substring(0, 12),
    messages: Math.floor(Math.random() * 50) + 10,
  }));

  const timelineData = eventLogs.slice(0, 20).map((log, index) => ({
    x: index,
    y: log.severity === "error" ? 3 : log.severity === "warning" ? 2 : log.severity === "success" ? 1 : 0,
    severity: log.severity,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* CPU History */}
      <Card className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
        <div className="p-4 border-b border-primary/20">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            CPU Histórico (30s)
          </h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cpuHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#94a3b8"
                fontSize={10}
                tickFormatter={(value) => new Date(value).toLocaleTimeString('pt-BR', { minute: '2-digit', second: '2-digit' })}
              />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #3b82f6",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* IPC per Process */}
      <Card className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
        <div className="p-4 border-b border-primary/20">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-success" />
            IPC por Processo
          </h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ipcData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #10b981",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="messages" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Events Timeline */}
      <Card className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
        <div className="p-4 border-b border-primary/20">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Timeline de Eventos
          </h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="x" stroke="#94a3b8" fontSize={10} />
              <YAxis 
                dataKey="y" 
                stroke="#94a3b8" 
                fontSize={10}
                tickFormatter={(value) => {
                  const labels = ['Info', 'Success', 'Warning', 'Error'];
                  return labels[value] || '';
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #f59e0b",
                  borderRadius: "8px",
                }}
                formatter={(value: any, name: any, props: any) => [props.payload.severity, 'Severidade']}
              />
              <Scatter data={timelineData} fill="#f59e0b" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
