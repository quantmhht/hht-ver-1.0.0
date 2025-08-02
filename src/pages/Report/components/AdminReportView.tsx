// src/pages/Report/components/AdminReportView.tsx
import React, { useState } from "react";
import { useStore } from "@store";
import { Box, Text, Button, Icon, Tabs } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import { Report, ReportStatus } from "@types";
import { formatDateTime } from "@utils/date-time";

const Container = styled(Box)`
  ${tw`bg-white mx-4 rounded-lg shadow-sm`}
`;

const TabContent = styled(Box)`
  ${tw`p-4`}
`;

const ReportCard = styled(Box)`
  ${tw`border border-gray-200 rounded-lg p-4 mb-3`}
`;

const StatusBadge = styled.span<{ status: ReportStatus }>`
  ${tw`px-2 py-1 rounded-full text-xs font-medium`}
  ${({ status }) => {
    switch (status) {
      case "pending":
        return tw`bg-yellow-100 text-yellow-800`;
      case "in_progress":
        return tw`bg-blue-100 text-blue-800`;
      case "submitted":
        return tw`bg-purple-100 text-purple-800`;
      case "approved":
        return tw`bg-green-100 text-green-800`;
      case "rejected":
        return tw`bg-red-100 text-red-800`;
      case "overdue":
        return tw`bg-red-100 text-red-800`;
      default:
        return tw`bg-gray-100 text-gray-800`;
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: string }>`
  ${tw`px-2 py-1 rounded text-xs font-medium ml-2`}
  ${({ priority }) => {
    switch (priority) {
      case "urgent":
        return tw`bg-red-500 text-white`;
      case "high":
        return tw`bg-orange-500 text-white`;
      case "medium":
        return tw`bg-yellow-500 text-white`;
      default:
        return tw`bg-gray-500 text-white`;
    }
  }}
`;

const ActionButton = styled(Button)`
  ${tw`ml-2`}
`;

export const AdminReportView: React.FC = () => {
  const { reports, loadingReports, updateReport } = useStore();
  const [activeTab, setActiveTab] = useState("pending");

  const getStatusText = (status: ReportStatus) => {
    const statusMap = {
      pending: "Chưa làm",
      in_progress: "Đang làm",
      submitted: "Đã nộp",
      approved: "Đã duyệt",
      rejected: "Từ chối",
      overdue: "Quá hạn",
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      urgent: "Khẩn cấp",
      high: "Cao",
      medium: "Trung bình",
      low: "Thấp",
    };
    return priorityMap[priority] || priority;
  };

  const handleApproveReport = async (reportId: string) => {
    await updateReport({
      id: reportId,
      status: "approved",
      feedback: "Báo cáo đã được duyệt",
    });
  };

  const handleRejectReport = async (reportId: string) => {
    // TODO: Show modal for rejection reason
    await updateReport({
      id: reportId,
      status: "rejected",
      feedback: "Báo cáo cần bổ sung thông tin",
    });
  };

  const getFilteredReports = (status?: ReportStatus) => {
    if (!status) return reports;
    return reports.filter(report => {
      if (status === "overdue") {
        const now = new Date();
        return new Date(report.dueDate) < now && report.status !== "approved";
      }
      return report.status === status;
    });
  };

  const renderReportCard = (report: Report) => {
    const isOverdue = new Date(report.dueDate) < new Date() && report.status !== "approved";
    
    return (
      <ReportCard key={report.id}>
        <Box className="flex justify-between items-start mb-2">
          <Box className="flex-1">
            <Text.Title size="small" className="mb-1">
              {report.title}
            </Text.Title>
            <Text className="text-sm text-gray-600 mb-2">
              {report.tdpName} • {report.category}
            </Text>
          </Box>
          <Box className="flex items-center">
            <StatusBadge status={isOverdue ? "overdue" : report.status}>
              {isOverdue ? "Quá hạn" : getStatusText(report.status)}
            </StatusBadge>
            <PriorityBadge priority={report.priority}>
              {getPriorityText(report.priority)}
            </PriorityBadge>
          </Box>
        </Box>

        <Text className="text-sm text-gray-700 mb-3 line-clamp-2">
          {report.description}
        </Text>

        <Box className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span>Hạn: {formatDateTime(report.dueDate)}</span>
          <span>Giao: {formatDateTime(report.createdAt)}</span>
        </Box>

        {report.status === "submitted" && (
          <Box className="flex justify-end">
            <ActionButton
              size="small"
              variant="secondary"
              onClick={() => handleRejectReport(report.id)}
            >
              Từ chối
            </ActionButton>
            <ActionButton
              size="small"
              onClick={() => handleApproveReport(report.id)}
            >
              Duyệt
            </ActionButton>
          </Box>
        )}

        {(report.status === "pending" || report.status === "in_progress") && (
          <Box className="flex justify-end">
            <ActionButton
              size="small"
              variant="tertiary"
              onClick={() => {/* Navigate to edit */}}
            >
              <Icon icon="zi-edit" />
            </ActionButton>
            <ActionButton
              size="small"
              variant="tertiary"
              onClick={() => {/* Show detail */}}
            >
              <Icon icon="zi-info-circle" />
            </ActionButton>
          </Box>
        )}
      </ReportCard>
    );
  };

  const tabs = [
    { key: "pending", label: "Chờ làm", count: getFilteredReports("pending").length },
    { key: "submitted", label: "Chờ duyệt", count: getFilteredReports("submitted").length },
    { key: "overdue", label: "Quá hạn", count: getFilteredReports("overdue").length },
    { key: "approved", label: "Đã duyệt", count: getFilteredReports("approved").length },
  ];

  return (
    <Container>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ backgroundColor: "white" }}
      >
        {tabs.map(tab => (
          <Tabs.Tab
            key={tab.key}
            label={
              <Box className="flex items-center">
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </Box>
            }
          >
            <TabContent>
              {loadingReports ? (
                <Box className="text-center py-8">
                  <Text>Đang tải...</Text>
                </Box>
              ) : (
                <>
                  {getFilteredReports(activeTab as ReportStatus).length === 0 ? (
                    <Box className="text-center py-8">
                      <Icon icon="zi-note" size={48} className="text-gray-300 mb-2" />
                      <Text className="text-gray-500">
                        Không có báo cáo nào
                      </Text>
                    </Box>
                  ) : (
                    getFilteredReports(activeTab as ReportStatus).map(renderReportCard)
                  )}
                </>
              )}
            </TabContent>
          </Tabs.Tab>
        ))}
      </Tabs>
    </Container>
  );
};