// src/pages/Report/components/LeaderReportView.tsx
import React, { useState } from "react";
import { useStore } from "@store";
import { Box, Text, Button, Icon, Modal } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import { Report } from "@types";
import { formatDateTime } from "@utils/date-time";
import { TextArea } from "@components";

const Container = styled(Box)`
  ${tw`bg-white mx-4 rounded-lg shadow-sm p-4`}
`;

const ReportCard = styled(Box)<{ isOverdue?: boolean }>`
  ${tw`border rounded-lg p-4 mb-3`}
  ${({ isOverdue }) => isOverdue 
    ? tw`border-red-300 bg-red-50` 
    : tw`border-gray-200 bg-white`
  }
`;

const StatusIndicator = styled.div<{ status: string }>`
  ${tw`w-3 h-3 rounded-full mr-2`}
  ${({ status }) => {
    switch (status) {
      case "pending":
        return tw`bg-yellow-400`;
      case "in_progress":
        return tw`bg-blue-400`;
      case "submitted":
        return tw`bg-purple-400`;
      case "approved":
        return tw`bg-green-400`;
      case "rejected":
        return tw`bg-red-400`;
      default:
        return tw`bg-gray-400`;
    }
  }}
`;

const PriorityLabel = styled.span<{ priority: string }>`
  ${tw`text-xs px-2 py-1 rounded font-medium`}
  ${({ priority }) => {
    switch (priority) {
      case "urgent":
        return tw`bg-red-100 text-red-800`;
      case "high":
        return tw`bg-orange-100 text-orange-800`;
      case "medium":
        return tw`bg-yellow-100 text-yellow-800`;
      default:
        return tw`bg-gray-100 text-gray-800`;
    }
  }}
`;

const SubmitModal = styled(Modal)`
  .zaui-modal-content {
    max-height: 80vh;
    overflow-y: auto;
  }
`;

export const LeaderReportView: React.FC = () => {
  const { user } = useStore();
  const { reports, loadingReports, updateReport } = useStore();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const zaloId = user?.idByOA;
  const myReports = reports.filter(report => report.assignedTo === zaloId);

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: "Chưa làm",
      in_progress: "Đang làm", 
      submitted: "Đã nộp",
      approved: "Đã duyệt",
      rejected: "Từ chối",
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

  const getDaysRemaining = (dueDate: Date) => {
    const now = new Date();
    const diff = new Date(dueDate).getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleStartReport = async (reportId: string) => {
    await updateReport({
      id: reportId,
      status: "in_progress",
    });
  };

  const handleSubmitReport = async () => {
    if (!selectedReport || !reportContent.trim()) return;

    setSubmitting(true);
    try {
      await updateReport({
        id: selectedReport.id,
        status: "submitted",
        content: reportContent,
      });
      setSubmitModalVisible(false);
      setReportContent("");
      setSelectedReport(null);
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmitModal = (report: Report) => {
    setSelectedReport(report);
    setReportContent(report.content || "");
    setSubmitModalVisible(true);
  };

  const renderReportCard = (report: Report) => {
    const daysRemaining = getDaysRemaining(report.dueDate);
    const isOverdue = daysRemaining < 0;
    const isUrgent = daysRemaining <= 2 && report.status !== "approved";

    return (
      <ReportCard key={report.id} isOverdue={isOverdue}>
        <Box className="flex justify-between items-start mb-3">
          <Box className="flex-1">
            <Box className="flex items-center mb-2">
              <StatusIndicator status={report.status} />
              <Text.Title size="small">
                {report.title}
              </Text.Title>
              {isUrgent && !isOverdue && (
                <Icon icon="zi-clock-2" className="text-orange-500 ml-2" size={16} />
              )}
              {isOverdue && (
                <Icon icon="zi-warning" className="text-red-500 ml-2" size={16} />
              )}
            </Box>
            <PriorityLabel priority={report.priority}>
              {getPriorityText(report.priority)}
            </PriorityLabel>
          </Box>
          <Text className="text-xs text-gray-500">
            {getStatusText(report.status)}
          </Text>
        </Box>

        <Text className="text-sm text-gray-700 mb-3 line-clamp-2">
          {report.description}
        </Text>

        <Box className="flex justify-between items-center mb-3">
          <Text className="text-xs text-gray-500">
            Hạn nộp: {formatDateTime(report.dueDate)}
          </Text>
          <Text className={`text-xs font-medium ${
            isOverdue 
              ? "text-red-600" 
              : daysRemaining <= 2 
                ? "text-orange-600" 
                : "text-green-600"
          }`}>
            {isOverdue 
              ? `Quá hạn ${Math.abs(daysRemaining)} ngày`
              : daysRemaining === 0
                ? "Hạn nộp hôm nay"
                : `Còn ${daysRemaining} ngày`
            }
          </Text>
        </Box>

        {report.feedback && (
          <Box className="bg-gray-50 p-3 rounded mb-3">
            <Text className="text-xs font-medium text-gray-600 mb-1">
              Phản hồi từ UBND:
            </Text>
            <Text className="text-sm text-gray-800">
              {report.feedback}
            </Text>
          </Box>
        )}

        <Box className="flex justify-end space-x-2">
          {report.status === "pending" && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleStartReport(report.id)}
            >
              Bắt đầu làm
            </Button>
          )}
          
          {(report.status === "in_progress" || report.status === "rejected") && (
            <Button
              size="small"
              onClick={() => openSubmitModal(report)}
            >
              Nộp báo cáo
            </Button>
          )}

          {report.status === "submitted" && (
            <Text className="text-sm text-purple-600 font-medium">
              Đang chờ duyệt...
            </Text>
          )}

          {report.status === "approved" && (
            <Box className="flex items-center text-green-600">
              <Icon icon="zi-check-circle" size={16} className="mr-1" />
              <Text className="text-sm font-medium">Đã duyệt</Text>
            </Box>
          )}
        </Box>
      </ReportCard>
    );
  };

  const pendingReports = myReports.filter(r => r.status === "pending");
  const inProgressReports = myReports.filter(r => r.status === "in_progress" || r.status === "rejected");
  const submittedReports = myReports.filter(r => r.status === "submitted");
  const completedReports = myReports.filter(r => r.status === "approved");

  return (
    <>
      <Container>
        <Text.Title className="mb-4">Báo cáo của tôi</Text.Title>

        {loadingReports ? (
          <Box className="text-center py-8">
            <Text>Đang tải...</Text>
          </Box>
        ) : myReports.length === 0 ? (
          <Box className="text-center py-8">
            <Icon icon="zi-note" size={48} className="text-gray-300 mb-2" />
            <Text className="text-gray-500">
              Chưa có báo cáo nào được giao
            </Text>
          </Box>
        ) : (
          <>
            {/* Pending Reports */}
            {pendingReports.length > 0 && (
              <Box className="mb-6">
                <Text className="font-medium text-orange-600 mb-3 flex items-center">
                  <Icon icon="zi-clock-2" className="mr-2" size={16} />
                  Cần làm ({pendingReports.length})
                </Text>
                {pendingReports.map(renderReportCard)}
              </Box>
            )}

            {/* In Progress Reports */}
            {inProgressReports.length > 0 && (
              <Box className="mb-6">
                <Text className="font-medium text-blue-600 mb-3 flex items-center">
                  <Icon icon="zi-edit" className="mr-2" size={16} />
                  Đang làm ({inProgressReports.length})
                </Text>
                {inProgressReports.map(renderReportCard)}
              </Box>
            )}

            {/* Submitted Reports */}
            {submittedReports.length > 0 && (
              <Box className="mb-6">
                <Text className="font-medium text-purple-600 mb-3 flex items-center">
                  <Icon icon="zi-post" className="mr-2" size={16} />
                  Chờ duyệt ({submittedReports.length})
                </Text>
                {submittedReports.map(renderReportCard)}
              </Box>
            )}

            {/* Completed Reports */}
            {completedReports.length > 0 && (
              <Box>
                <Text className="font-medium text-green-600 mb-3 flex items-center">
                  <Icon icon="zi-check-circle" className="mr-2" size={16} />
                  Đã hoàn thành ({completedReports.length})
                </Text>
                {completedReports.map(renderReportCard)}
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Submit Report Modal */}
      <SubmitModal
        visible={submitModalVisible}
        onClose={() => setSubmitModalVisible(false)}
        title="Nộp báo cáo"
        actions={[
          {
            text: "Hủy",
            close: true,
          },
          {
            text: "Nộp báo cáo",
            highLight: true,
            onClick: handleSubmitReport,
          },
        ]}
      >
        <Box className="p-4">
          {selectedReport && (
            <>
              <Text className="font-medium mb-2">
                {selectedReport.title}
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                {selectedReport.description}
              </Text>
              
              <TextArea
                label="Nội dung báo cáo*"
                placeholder="Nhập nội dung báo cáo..."
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                rows={6}
                status={!reportContent.trim() ? "error" : "default"}
                errorText={!reportContent.trim() ? "Vui lòng nhập nội dung báo cáo" : ""}
              />
            </>
          )}
        </Box>
      </SubmitModal>
    </>
  );
};