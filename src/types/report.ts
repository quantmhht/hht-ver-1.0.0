// src/types/report.ts
export interface Report {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Zalo ID của tổ trưởng TDP
  assignedBy: string; // Zalo ID của admin/mod giao nhiệm vụ
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  status: ReportStatus;
  priority: ReportPriority;
  category: string; // Loại báo cáo: "monthly", "special", "urgent"
  content?: string; // Nội dung báo cáo khi hoàn thành
  attachments?: string[]; // URLs của file đính kèm
  organizationId: string;
  tdpName: string; // Tên tổ dân phố
  feedback?: string; // Phản hồi từ admin/mod
  submissionHistory?: ReportSubmission[]; // Lịch sử nộp báo cáo
}

export interface ReportSubmission {
  submittedAt: Date;
  content: string;
  attachments?: string[];
  feedback?: string;
  status: "submitted" | "approved" | "rejected";
}

export type ReportStatus = 
  | "pending"     // Chưa làm
  | "in_progress" // Đang làm
  | "submitted"   // Đã nộp, chờ duyệt
  | "approved"    // Đã được duyệt
  | "rejected"    // Bị từ chối
  | "overdue";    // Quá hạn

export type ReportPriority = "low" | "medium" | "high" | "urgent";

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  fields: ReportField[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ReportField {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "file";
  required: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface TDPInfo {
  id: string;
  name: string;
  leaderZaloId: string;
  leaderName: string;
  leaderPhone: string;
  address: string;
  households: number; // Số hộ dân
  population: number; // Số dân
  organizationId: string;
  isActive: boolean;
}

export interface ReportStats {
  totalReports: number;
  completedReports: number;
  pendingReports: number;
  overdueReports: number;
  completionRate: number;
  averageCompletionTime: number; // Thời gian hoàn thành trung bình (ngày)
  monthlyStats: MonthlyReportStats[];
}

export interface MonthlyReportStats {
  month: string; // "2024-01"
  totalReports: number;
  completedReports: number;
  completionRate: number;
  averageCompletionTime: number;
}

// Params cho API calls
export interface GetReportsParams {
  organizationId: string;
  assignedTo?: string; // Lọc theo tổ trưởng
  status?: ReportStatus[];
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface CreateReportParams {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: ReportPriority;
  category: string;
  organizationId: string;
  tdpName: string;
}

export interface UpdateReportParams {
  id: string;
  content?: string;
  attachments?: string[];
  status?: ReportStatus;
  feedback?: string;
}