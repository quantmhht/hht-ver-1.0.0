// src/store/reportSlice.ts
import { StateCreator } from "zustand";
import {
  Report,
  ReportStats,
  TDPInfo,
  GetReportsParams,
  CreateReportParams,
  UpdateReportParams,
  ReportStatus
} from "../types/report";
import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getReportStats,
  getTDPList
} from "../service/reportService";

export interface ReportSlice {
  // State
  reports: Report[];
  loadingReports: boolean;
  reportStats: ReportStats | null;
  loadingStats: boolean;
  tdpList: TDPInfo[];
  loadingTDP: boolean;
  selectedReport: Report | null;
  
  // Actions
  getReports: (params: GetReportsParams) => Promise<void>;
  createReport: (params: CreateReportParams) => Promise<boolean>;
  updateReport: (params: UpdateReportParams) => Promise<boolean>;
  deleteReport: (id: string) => Promise<boolean>;
  getReportStats: (organizationId: string, zaloId?: string) => Promise<void>;
  getTDPList: (organizationId: string) => Promise<void>;
  setSelectedReport: (report: Report | null) => void;
  
  // Computed getters
  getPendingReportsCount: (zaloId?: string) => number;
  getOverdueReportsCount: (zaloId?: string) => number;
  getReportsByStatus: (status: ReportStatus, zaloId?: string) => Report[];
}

export const createReportSlice: StateCreator<ReportSlice> = (set, get) => ({
  // Initial state
  reports: [],
  loadingReports: false,
  reportStats: null,
  loadingStats: false,
  tdpList: [],
  loadingTDP: false,
  selectedReport: null,

  // Actions
  getReports: async (params: GetReportsParams) => {
    try {
      set({ loadingReports: true });
      const reports = await getReports(params);
      set({ reports, loadingReports: false });
    } catch (error) {
      console.error("Error fetching reports:", error);
      set({ loadingReports: false });
    }
  },

  createReport: async (params: CreateReportParams) => {
    try {
      const success = await createReport(params);
      if (success) {
        // Refresh reports list
        const currentState = get();
        if (currentState.reports.length > 0) {
          // Re-fetch reports with current params
          await get().getReports({ organizationId: params.organizationId });
        }
      }
      return success;
    } catch (error) {
      console.error("Error creating report:", error);
      return false;
    }
  },

  updateReport: async (params: UpdateReportParams) => {
    try {
      const success = await updateReport(params);
      if (success) {
        // Update local state
        const reports = get().reports.map(report => 
          report.id === params.id 
            ? { ...report, ...params, updatedAt: new Date() }
            : report
        );
        set({ reports });
      }
      return success;
    } catch (error) {
      console.error("Error updating report:", error);
      return false;
    }
  },

  deleteReport: async (id: string) => {
    try {
      const success = await deleteReport(id);
      if (success) {
        const reports = get().reports.filter(report => report.id !== id);
        set({ reports });
      }
      return success;
    } catch (error) {
      console.error("Error deleting report:", error);
      return false;
    }
  },

  getReportStats: async (organizationId: string, zaloId?: string) => {
    try {
      set({ loadingStats: true });
      const stats = await getReportStats(organizationId, zaloId);
      set({ reportStats: stats, loadingStats: false });
    } catch (error) {
      console.error("Error fetching report stats:", error);
      set({ loadingStats: false });
    }
  },

  getTDPList: async (organizationId: string) => {
    try {
      set({ loadingTDP: true });
      const tdpList = await getTDPList(organizationId);
      set({ tdpList, loadingTDP: false });
    } catch (error) {
      console.error("Error fetching TDP list:", error);
      set({ loadingTDP: false });
    }
  },

  setSelectedReport: (report: Report | null) => {
    set({ selectedReport: report });
  },

  // Computed getters
  getPendingReportsCount: (zaloId?: string) => {
    const reports = get().reports;
    return reports.filter(report => {
      const matchesUser = !zaloId || report.assignedTo === zaloId;
      const isPending = ["pending", "in_progress"].includes(report.status);
      return matchesUser && isPending;
    }).length;
  },

  getOverdueReportsCount: (zaloId?: string) => {
    const reports = get().reports;
    const now = new Date();
    return reports.filter(report => {
      const matchesUser = !zaloId || report.assignedTo === zaloId;
      const isOverdue = new Date(report.dueDate) < now && report.status !== "approved";
      return matchesUser && isOverdue;
    }).length;
  },

  getReportsByStatus: (status: ReportStatus, zaloId?: string) => {
    const reports = get().reports;
    return reports.filter(report => {
      const matchesUser = !zaloId || report.assignedTo === zaloId;
      const matchesStatus = report.status === status;
      return matchesUser && matchesStatus;
    });
  },
});