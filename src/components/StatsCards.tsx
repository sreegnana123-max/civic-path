import { useEffect, useState } from "react";
import { getStats } from "@/lib/store";
import { FileText, Clock, Loader2, CheckCircle2, ThumbsUp } from "lucide-react";

export function StatsCards() {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, totalUpvotes: 0 });

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const cards = [
    { label: "Total Reports", value: stats.total, icon: FileText, color: "text-foreground" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-civic-amber" },
    { label: "In Progress", value: stats.inProgress, icon: Loader2, color: "text-civic-blue" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-civic-green" },
    { label: "Total Upvotes", value: stats.totalUpvotes, icon: ThumbsUp, color: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="bg-card border border-border rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <card.icon className={`w-4 h-4 ${card.color}`} />
            <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
          </div>
          <p className={`text-2xl font-heading font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
