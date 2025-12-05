import React from "react";
import "./StatsCard.css";

interface StatsCardProps {
  title: string;
  count: number;
  icon?: string;
  color?: string;
}

export default function StatsCard({ title, count, icon, color = "#2563eb" }: StatsCardProps) {
  return (
    <div className="stats-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stats-header">
        {icon && <span className="stats-icon">{icon}</span>}
        <h4 className="stats-title">{title}</h4>
      </div>
      <p className="stats-count">{count}</p>
    </div>
  );
}
