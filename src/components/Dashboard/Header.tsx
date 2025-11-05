import { Satellite, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-primary/20 bg-card/50 backdrop-blur-glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Satellite className="w-8 h-8 text-primary animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  AtlasOS
                </h1>
                <p className="text-sm text-muted-foreground">
                  Microkernel Space Probe Simulator
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/30 animate-pulse-glow">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                Sistema Online
              </span>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                UTC Time
              </div>
              <div className="text-lg font-mono font-bold text-primary">
                {time.toLocaleTimeString("pt-BR")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
