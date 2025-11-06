import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "orange" | "purple";
}

export const StatsCard = ({
  icon,
  title,
  value,
  subtitle,
  color = "blue",
}: StatsCardProps) => {
  const colorClasses = {
    blue: "border-blue-600 bg-blue-900/20",
    green: "border-green-600 bg-green-900/20",
    orange: "border-orange-600 bg-orange-900/20",
    purple: "border-purple-600 bg-purple-900/20",
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-400 text-sm">{title}</div>
        <div className={`text-${color}-400`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
  );
};
