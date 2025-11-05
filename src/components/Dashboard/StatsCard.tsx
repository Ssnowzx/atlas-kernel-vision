import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: "primary" | "success" | "warning" | "critical";
}

const colorClasses = {
  primary: "border-primary/30 glow-primary",
  success: "border-success/30 glow-success",
  warning: "border-warning/30 glow-warning",
  critical: "border-critical/30 glow-error",
};

const iconColorClasses = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  critical: "text-critical",
};

export const StatsCard = ({ title, value, icon: Icon, trend, color }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-glass p-6 transition-all hover:scale-105 ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-foreground">
            {value}
          </h3>
          {trend && (
            <p className="text-xs text-muted-foreground mt-2">
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-full p-3 bg-background/50 ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
