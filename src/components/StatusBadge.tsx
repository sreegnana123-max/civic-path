import { IssueStatus, STATUS_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        status === "pending" && "status-pending",
        status === "in-progress" && "status-in-progress",
        status === "resolved" && "status-resolved",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          status === "pending" && "bg-civic-amber",
          status === "in-progress" && "bg-civic-blue",
          status === "resolved" && "bg-civic-green"
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
