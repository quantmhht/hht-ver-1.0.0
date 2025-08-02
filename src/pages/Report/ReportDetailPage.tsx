// src/pages/Report/ReportDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@store";
import { 
  Box, 
  Text, 
  Button, 
  Icon, 
  Modal,
  TextArea,
  ImageViewer 
} from "zmp-ui";
import { toast } from "react-toastify";
import PageLayout from "@components/layout/PageLayout";
import { getUserRole } from "@utils/auth";
import { formatDate } from "@utils/date";
import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`p-4 space-y-4`}
`;

const Card = styled.div`
  ${tw`bg-white rounded-lg p-4 shadow-sm border`}
`;

const StatusBadge = styled.span<{ status: string }>`
  ${tw`px-3 py-1 rounded-full text-xs font-medium`}
  ${({ status }) => {
    switch (status) {
      case "pending": return tw`bg-yellow-100 text-yellow-800`;
      case "in_progress": return tw`bg-blue-100 text-blue-800`;
      case "submitted": return tw`bg-green-100 text-green-800`;
      case "approved": return tw`bg-emerald-100 text-emerald-800`;
      case "rejected": return tw`bg-red-100 text-red-800`;
      case "overdue": return tw`bg-orange-100 text-orange-800`;
      default: return tw`bg-gray-100 text-gray-800`;
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: string }>`
  ${tw`px-2 py-1 rounded text-xs font-medium`}
  ${({ priority }) => {
    switch (priority) {
      case "high": return tw`bg-red-100 text-red-800`;
      case "medium": return tw`bg-yellow-100 text-yellow-800`;
      case "low": return tw`bg-green-100 text-green-800`;
      default: return tw`bg-gray-100 text-gray-800`;
    }
  }}
`;

const InfoRow = styled.div`
  ${tw`flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0`}
`;

const HistoryItem = styled.div`
  ${tw`flex gap-3 p-3 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg`}
`;

const ImageGrid = styled.div`
  ${tw`grid grid-cols-2 gap-2`}
`;

const ImageItem = styled.div`
  ${tw`aspect-square rounded-lg overflow-hidden cursor-pointer`}
  
  img {
    ${tw`w-full h-full object-cover`}
  }
`;

const ButtonGroup = styled.div`
  ${tw`flex gap-3 pt-4`}
`;

const ReportDetailPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  
  const { 
    user, 
    reportDetail, 
    loadingReportDetail,
    getReportDetail,
    updateReportStatus,
    submitReport,
    updatingReport 
  } = useStore((state) => ({
    user: state.user,
    reportDetail: state.reportDetail,
    loadingReportDetail: state.loadingReportDetail,
    getReportDetail: state.getReportDetail,
    updateReportStatus: state.updateReportStatus,
    submitReport: state.submitReport,
    updatingReport: state.updatingReport,
  }));

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [reportImages, setReportImages] = useState<string[]>([]);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const userRole = getUserRole(user?.id || "");
  const isAdmin = userRole === "admin" || userRole === "mod";
  const isAssignedLeader = reportDetail?.assignedTo === user?.id;

  useEffect(() => {
    if (reportId) {
      getReportDetail(reportId);
    }
  }, [reportId, getReportDetail]);

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: "Chờ thực hiện",
      in_progress: "Đang thực hiện", 
      submitted: "Đã nộp",
      approved: "Đã duyệt",
      rejected: "Từ chối",
      overdue: "Quá hạn"
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      low: "Thấp",
      medium: "Trung bình",
      high: "Cao"
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  };

  const handleApprove = async () => {
    if (!reportId) return;
    
    try {
      await updateReportStatus(reportId, "approved", approvalNote);
      toast.success("Đã duyệt báo cáo thành công!");
      setShowApprovalModal(false);
      setApprovalNote("");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi duyệt báo cáo");
    }
  };

  const handleReject = async () => {
    if (!reportId || !rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    
    try {
      await updateReportStatus(reportId, "rejected", rejectReason);
      toast.success("Đã từ chối báo cáo!");
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối báo cáo");
    }
  };

  const handleSubmit = async () => {
    if (!reportId || !reportContent.trim()) {
      toast.error("Vui lòng nhập nội dung báo cáo");
      return;
    }
    
    try {
      await submitReport(reportId, {
        content: reportContent,
        images: reportImages,
        submittedAt: new Date()
      });
      toast.success("Nộp báo cáo thành công!");
      setShowSubmitModal(false);
      setReportContent("");
      setReportImages([]);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi nộp báo cáo");
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageViewer(true);
  };

  if (loadingReportDetail) {
    return (
      <PageLayout title="Chi tiết báo cáo" showBackIcon>
        <div className="flex justify-center items-center h-64">
          <Text>Đang tải...</Text>
        </div>
      </PageLayout>
    );
  }

  if (!reportDetail) {
    return (
      <PageLayout title="Chi tiết báo cáo" showBackIcon>
        <div className="flex justify-center items-center h-64">
          <Text>Không tìm thấy báo cáo</Text>
        </div>
      </PageLayout>
    );
  }

  const isOverdue = new Date() > reportDetail.dueDate && 
                   !["submitted", "approved"].includes(reportDetail.status);

  return (
    <PageLayout title="Chi tiết báo cáo" showBackIcon>
      <Container>
        {/* Header thông tin */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Text className="text-lg font-semibold mb-2">
                {reportDetail.title}
              </Text>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={isOverdue ? "overdue" : reportDetail.status}>
                  {isOverdue ? "Quá hạn" : getStatusText(reportDetail.status)}
                </StatusBadge>
                <PriorityBadge priority={reportDetail.priority}>
                  {getPriorityText(reportDetail.priority)}
                </PriorityBadge>
              </div>
            </div>
            {isOverdue && (
              <Icon icon="zi-clock-1" className="text-red-500 text-xl" />
            )}
          </div>

          <Text className="text-gray-600 mb-4">
            {reportDetail.description}
          </Text>

          <div className="space-y-2">
            <InfoRow>
              <Text className="font-medium">Giao bởi:</Text>
              <Text>{reportDetail.assignedByName}</Text>
            </InfoRow>
            <InfoRow>
              <Text className="font-medium">Giao cho:</Text>
              <Text>{reportDetail.assignedToName}</Text>
            </InfoRow>
            <InfoRow>
              <Text className="font-medium">Hạn nộp:</Text>
              <Text className={isOverdue ? "text-red-600 font-medium" : ""}>
                {formatDate(reportDetail.dueDate)}
              </Text>
            </InfoRow>
            <InfoRow>
              <Text className="font-medium">Ngày tạo:</Text>
              <Text>{formatDate(reportDetail.createdAt)}</Text>
            </InfoRow>
            {reportDetail.category && (
              <InfoRow>
                <Text className="font-medium">Loại báo cáo:</Text>
                <Text>{reportDetail.category}</Text>
              </InfoRow>
            )}
          </div>
        </Card>

        {/* Yêu cầu đặc biệt */}
        {reportDetail.requirements && (
          <Card>
            <Text className="text-lg font-semibold mb-3">Yêu cầu đặc biệt</Text>
            <Text className="text-gray-700">{reportDetail.requirements}</Text>
          </Card>
        )}

        {/* Nội dung báo cáo đã nộp */}
        {reportDetail.submittedContent && (
          <Card>
            <Text className="text-lg font-semibold mb-3">Nội dung báo cáo</Text>
            <Text className="text-gray-700 mb-4">{reportDetail.submittedContent}</Text>
            
            {reportDetail.submittedImages && reportDetail.submittedImages.length > 0 && (
              <div>
                <Text className="font-medium mb-2">Hình ảnh đính kèm:</Text>
                <ImageGrid>
                  {reportDetail.submittedImages.map((image, index) => (
                    <ImageItem
                      key={index}
                      onClick={() => handleImageClick(index)}
                    >
                      <img src={image} alt={`Báo cáo ${index + 1}`} />
                    </ImageItem>
                  ))}
                </ImageGrid>
              </div>
            )}

            {reportDetail.submittedAt && (
              <div className="mt-4 pt-4 border-t">
                <Text className="text-sm text-gray-600">
                  Nộp lúc: {formatDate(reportDetail.submittedAt)}
                  {reportDetail.submittedAt > reportDetail.dueDate && (
                    <span className="text-red-600 ml-2">(Trễ hạn)</span>
                  )}
                </Text>
              </div>
            )}
          </Card>
        )}

        {/* Lịch sử xử lý */}
        {reportDetail.history && reportDetail.history.length > 0 && (
          <Card>
            <Text className="text-lg font-semibold mb-4">Lịch sử xử lý</Text>
            <div className="space-y-3">
              {reportDetail.history.map((item, index) => (
                <HistoryItem key={index}>
                  <Icon icon="zi-clock-1" className="text-blue-500 mt-1" />
                  <div className="flex-1">
                    <Text className="font-medium">{item.action}</Text>
                    <Text className="text-sm text-gray-600">
                      {item.note}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {formatDate(item.timestamp)} - {item.by}
                    </Text>
                  </div>
                </HistoryItem>
              ))}
            </div>
          </Card>
        )}

        {/* Action buttons */}
        <Card>
          <ButtonGroup>
            {/* Buttons cho Admin/Mod */}
            {isAdmin && reportDetail.status === "submitted" && (
              <>
                <Button
                  variant="primary"
                  onClick={() => setShowApprovalModal(true)}
                  className="flex-1"
                >
                  <Icon icon="zi-check" /> Duyệt
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1"
                >
                  <Icon icon="zi-close" /> Từ chối
                </Button>
              </>
            )}

            {/* Button cho Tổ trưởng */}
            {isAssignedLeader && 
             ["pending", "in_progress", "rejected"].includes(reportDetail.status) && (
              <Button
                variant="primary"
                onClick={() => setShowSubmitModal(true)}
                className="flex-1"
              >
                <Icon icon="zi-send" /> 
                {reportDetail.status === "rejected" ? "Nộp lại" : "Nộp báo cáo"}
              </Button>
            )}

            {/* Button chỉnh sửa cho Admin */}
            {isAdmin && ["pending", "in_progress"].includes(reportDetail.status) && (
              <Button
                variant="tertiary"
                onClick={() => navigate(`/report/edit/${reportId}`)}
              >
                <Icon icon="zi-edit" /> Chỉnh sửa
              </Button>
            )}
          </ButtonGroup>
        </Card>
      </Container>

      {/* Modal duyệt báo cáo */}
      <Modal
        visible={showApprovalModal}
        title="Duyệt báo cáo"
        onClose={() => setShowApprovalModal(false)}
        actions={[
          {
            text: "Hủy",
            close: true,
          },
          {
            text: "Duyệt",
            primary: true,
            loading: updatingReport,
            onClick: handleApprove,
          },
        ]}
      >
        <div className="space-y-4">
          <Text>Xác nhận duyệt báo cáo này?</Text>
          <TextArea
            placeholder="Ghi chú (không bắt buộc)..."
            value={approvalNote}
            onChange={(e) => setApprovalNote(e.target.value)}
            rows={3}
          />
        </div>
      </Modal>

      {/* Modal từ chối báo cáo */}
      <Modal
        visible={showRejectModal}
        title="Từ chối báo cáo"
        onClose={() => setShowRejectModal(false)}
        actions={[
          {
            text: "Hủy",
            close: true,
          },
          {
            text: "Từ chối",
            primary: true,
            loading: updatingReport,
            onClick: handleReject,
          },
        ]}
      >
        <div className="space-y-4">
          <Text>Nhập lý do từ chối:</Text>
          <TextArea
            placeholder="Lý do từ chối báo cáo..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            required
          />
        </div>
      </Modal>

      {/* Modal nộp báo cáo */}
      <Modal
        visible={showSubmitModal}
        title="Nộp báo cáo"
        onClose={() => setShowSubmitModal(false)}
        actions={[
          {
            text: "Hủy",
            close: true,
          },
          {
            text: "Nộp báo cáo",
            primary: true,
            loading: updatingReport,
            onClick: handleSubmit,
          },
        ]}
      >
        <div className="space-y-4">
          <TextArea
            label="Nội dung báo cáo *"
            placeholder="Nhập nội dung báo cáo..."
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            rows={6}
            required
          />
          
          {/* Image upload component would go here */}
          <Text className="text-sm text-gray-600">
            Bạn có thể đính kèm hình ảnh minh họa (tối đa 4 ảnh)
          </Text>
        </div>
      </Modal>

      {/* Image viewer */}
      <ImageViewer
        images={reportDetail.submittedImages || []}
        activeIndex={currentImageIndex}
        onClose={() => setShowImageViewer(false)}
        visible={showImageViewer}
      />
    </PageLayout>
  );
};

export default ReportDetailPage;