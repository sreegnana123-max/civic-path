import { CATEGORY_LABELS } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { MapPin, ThumbsUp, Clock, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface IssueCardProps {
  issue: any;
  onUpvote: (id: string) => void;
}

export function IssueCard({ issue, onUpvote }: IssueCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-fade-in border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={issue.status} />
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="w-3 h-3" />
                {CATEGORY_LABELS[issue.category as keyof typeof CATEGORY_LABELS] || issue.category}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-foreground text-base mb-1.5 leading-snug">
              {issue.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {issue.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {issue.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
          <button
            onClick={() => onUpvote(issue.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border border-border bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs font-semibold">{issue.upvotes}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
