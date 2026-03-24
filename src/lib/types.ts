export type IssueStatus = "pending" | "in-progress" | "resolved";

export type IssueCategory = 
  | "roads" 
  | "water" 
  | "sanitation" 
  | "electricity" 
  | "public-safety" 
  | "environment" 
  | "other";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: string;
  imageUrl?: string;
  upvotes: number;
  upvotedBy: string[];
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  roads: "Roads & Infrastructure",
  water: "Water Supply",
  sanitation: "Sanitation & Waste",
  electricity: "Electricity",
  "public-safety": "Public Safety",
  environment: "Environment",
  other: "Other",
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  resolved: "Resolved",
};
