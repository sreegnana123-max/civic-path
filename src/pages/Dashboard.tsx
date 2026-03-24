import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { StatusBadge } from "@/components/StatusBadge";
import { getAllIssues, updateIssueStatus } from "@/lib/store";
import { IssueStatus, CATEGORY_LABELS, STATUS_LABELS } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { MapPin, ThumbsUp, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthority, loading } = useAuth();
  const [issues, setIssues] = useState<any[]>([]);

  const fetchIssues = useCallback(async () => {
    try {
      const data = await getAllIssues();
      setIssues(data);
    } catch {
      toast.error("Failed to load issues");
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  if (loading) return null;
  if (!isAuthority) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <ShieldAlert className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm">Only authorized authorities can access this dashboard.</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (id: string, status: IssueStatus) => {
    try {
      await updateIssueStatus(id, status);
      toast.success(`Status updated to "${STATUS_LABELS[status]}"`);
      await fetchIssues();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground mb-2 tracking-tight">
            Authority Dashboard
          </h1>
          <p className="text-muted-foreground text-base">
            Manage and update the status of community-reported issues.
          </p>
        </div>

        <div className="mb-8">
          <StatsCards />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-x-auto animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-heading font-semibold">Issue</TableHead>
                <TableHead className="font-heading font-semibold">Category</TableHead>
                <TableHead className="font-heading font-semibold">Location</TableHead>
                <TableHead className="font-heading font-semibold text-center">Upvotes</TableHead>
                <TableHead className="font-heading font-semibold">Reported</TableHead>
                <TableHead className="font-heading font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id} className="hover:bg-muted/30">
                  <TableCell>
                    <p className="font-medium text-foreground text-sm">{issue.title}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[issue.category as keyof typeof CATEGORY_LABELS] || issue.category}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {issue.location}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {issue.upvotes}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Select value={issue.status} onValueChange={(v) => handleStatusChange(issue.id, v as IssueStatus)}>
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <StatusBadge status={issue.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([v, l]) => (
                          <SelectItem key={v} value={v}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
