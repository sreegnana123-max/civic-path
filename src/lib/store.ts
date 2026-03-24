import { supabase } from "@/integrations/supabase/client";
import { IssueStatus } from "./types";

export async function getAllIssues() {
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addIssue(issue: {
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  reported_by?: string;
}) {
  const { data, error } = await supabase.from("issues").insert(issue).select().single();
  if (error) throw error;
  return data;
}

export async function upvoteIssue(issueId: string, userId: string) {
  // Insert upvote record
  const { error: upvoteError } = await supabase
    .from("issue_upvotes")
    .insert({ issue_id: issueId, user_id: userId });
  if (upvoteError) {
    if (upvoteError.code === "23505") {
      // Already upvoted - remove it
      await supabase.from("issue_upvotes").delete().eq("issue_id", issueId).eq("user_id", userId);
      // Decrement
      const { data: issue } = await supabase.from("issues").select("upvotes").eq("id", issueId).single();
      if (issue) {
        await supabase.from("issues").update({ upvotes: Math.max(0, issue.upvotes - 1) }).eq("id", issueId);
      }
      return;
    }
    throw upvoteError;
  }
  // Increment
  const { data: issue } = await supabase.from("issues").select("upvotes").eq("id", issueId).single();
  if (issue) {
    await supabase.from("issues").update({ upvotes: issue.upvotes + 1 }).eq("id", issueId);
  }
}

export async function updateIssueStatus(id: string, status: IssueStatus) {
  const { error } = await supabase.from("issues").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function getStats() {
  const { data, error } = await supabase.from("issues").select("status, upvotes");
  if (error) throw error;
  const issues = data || [];
  return {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    inProgress: issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    totalUpvotes: issues.reduce((sum, i) => sum + (i.upvotes || 0), 0),
  };
}
