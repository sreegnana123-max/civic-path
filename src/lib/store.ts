import { Issue, IssueStatus } from "./types";

const STORAGE_KEY = "civicstrack_issues";

const SEED_ISSUES: Issue[] = [
  {
    id: "1",
    title: "Large pothole on Main Street",
    description: "A dangerous pothole near the intersection of Main St and Oak Ave. Multiple vehicles have been damaged. Needs urgent repair.",
    category: "roads",
    status: "pending",
    location: "Main St & Oak Ave, Downtown",
    upvotes: 24,
    upvotedBy: [],
    reportedBy: "citizen",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    title: "Broken street light on Elm Road",
    description: "Street light has been out for two weeks creating a safety hazard for pedestrians at night.",
    category: "electricity",
    status: "in-progress",
    location: "142 Elm Road, Westside",
    upvotes: 15,
    upvotedBy: [],
    reportedBy: "citizen",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "3",
    title: "Overflowing garbage bins in Central Park",
    description: "Garbage bins in Central Park haven't been emptied for days. Causing unpleasant odor and attracting pests.",
    category: "sanitation",
    status: "pending",
    location: "Central Park, East Entrance",
    upvotes: 31,
    upvotedBy: [],
    reportedBy: "citizen",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "4",
    title: "Water pipe burst on River Lane",
    description: "Major water pipe burst causing flooding on the street. Water supply affected for nearby residents.",
    category: "water",
    status: "resolved",
    location: "River Lane, Northside",
    upvotes: 42,
    upvotedBy: [],
    reportedBy: "citizen",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "5",
    title: "Illegal dumping near school zone",
    description: "Construction waste being dumped illegally near Riverside Elementary School. Health hazard for children.",
    category: "environment",
    status: "pending",
    location: "Near Riverside Elementary, South District",
    upvotes: 56,
    upvotedBy: [],
    reportedBy: "citizen",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

function getIssues(): Issue[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ISSUES));
  return SEED_ISSUES;
}

function saveIssues(issues: Issue[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

export function getAllIssues(): Issue[] {
  return getIssues().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addIssue(issue: Omit<Issue, "id" | "upvotes" | "upvotedBy" | "createdAt" | "updatedAt" | "reportedBy">): Issue {
  const issues = getIssues();
  const newIssue: Issue = {
    ...issue,
    id: crypto.randomUUID(),
    upvotes: 0,
    upvotedBy: [],
    reportedBy: "citizen",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  issues.push(newIssue);
  saveIssues(issues);
  return newIssue;
}

export function upvoteIssue(id: string): Issue | null {
  const issues = getIssues();
  const issue = issues.find((i) => i.id === id);
  if (!issue) return null;
  issue.upvotes += 1;
  issue.updatedAt = new Date().toISOString();
  saveIssues(issues);
  return issue;
}

export function updateIssueStatus(id: string, status: IssueStatus): Issue | null {
  const issues = getIssues();
  const issue = issues.find((i) => i.id === id);
  if (!issue) return null;
  issue.status = status;
  issue.updatedAt = new Date().toISOString();
  saveIssues(issues);
  return issue;
}

export function getStats() {
  const issues = getIssues();
  return {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    inProgress: issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    totalUpvotes: issues.reduce((sum, i) => sum + i.upvotes, 0),
  };
}
