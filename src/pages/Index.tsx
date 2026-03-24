import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { IssueCard } from "@/components/IssueCard";
import { ReportIssueDialog } from "@/components/ReportIssueDialog";
import { StatsCards } from "@/components/StatsCards";
import { getAllIssues, upvoteIssue } from "@/lib/store";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

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

  const filtered = issues.filter((issue) => {
    if (statusFilter !== "all" && issue.status !== statusFilter) return false;
    if (categoryFilter !== "all" && issue.category !== categoryFilter) return false;
    if (search && !issue.title.toLowerCase().includes(search.toLowerCase()) && !issue.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUpvote = async (id: string) => {
    if (!user) {
      toast.info("Please sign in to upvote");
      navigate("/auth");
      return;
    }
    try {
      await upvoteIssue(id, user.id);
      await fetchIssues();
    } catch {
      toast.error("Failed to upvote");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground mb-2 tracking-tight">
            Community Issues
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Report, track, and upvote local issues. Together we build better communities.
          </p>
        </div>

        <div className="mb-8">
          <StatsCards />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9 w-56" placeholder="Search issues..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ReportIssueDialog onIssueAdded={fetchIssues} />
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No issues found</p>
              <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or report a new issue.</p>
            </div>
          ) : (
            filtered.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
