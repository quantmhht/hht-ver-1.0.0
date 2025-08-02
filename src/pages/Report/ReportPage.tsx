// src/pages/Report/ReportPage.tsx
import React, { useEffect } from "react";
import { useStore } from "@store";
import { Box, Text, Button, Icon } from "zmp-ui";
import PageLayout from "@components/layout/PageLayout";
import { getUserRole, canAccessReports, getTDPInfo } from "@utils/auth";
import { AdminReportView } from "./components/AdminReportView";
import { LeaderReportView } from "./components/LeaderReportView";
import styled from "styled-components";
import tw from "twin.macro";

const NoAccessContainer = styled(Box)`
  ${tw`p-6 text-center bg-white mx-4 mt-4 rounded-lg`}
`;

const WelcomeContainer = styled(Box)`
  ${tw`bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white`}
`;

const StatsContainer = styled(Box)`
  ${tw`p-4 bg-white mx-4 mt-4 rounded-lg shadow-sm`}
`;

const QuickActions = styled(Box)`
  ${tw`grid grid-cols-2 gap-3 p-4`}
`;

const ActionButton = styled(Button)`
  ${tw`h-16 text-sm`}
`;

const NotificationBadge = styled.div`
  ${tw`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`}
`;

const ReportPage: React.FC = () => {
  const { user, organization } = useStore((state) => ({
    user: state.user,
    organization: state.organization,
  }));

  const {
    reports,
    loadingReports,
    reportStats,
    getPendingReportsCount,
    getOverdueReportsCount,
    getReports,
    getReportStats,
  } = useStore((state) => state);

  const zaloId = user?.idByOA;
  const userRole = getUserRole(zaloId);
  const organizationId = organization?.id || "";

  // Load data on mount
  useEffect(() => {
    if (organizationId && canAccessReports(zaloId)) {
      const params = {
        organizationId,
        assignedTo: userRole === "leader" ? zaloId : undefined,
      };
      getReports(params);
      getReportStats(organizationId, userRole === "leader" ? zaloId : undefined);
    }
  }, [organizationId, zaloId, userRole]);

  // Kiểm tra quyền truy cập
  if (!canAccessReports(zaloId)) {
    return (
      <PageLayout title="Báo cáo TDP">
        <NoAccessContainer>
          <Icon icon="zi-lock" size={48} className="text-gray-400 mb-4" />
          <Text.Title size="normal" className="mb-2">
            Không có quyền truy cập
          </Text.Title>
          <Text className="text-gray-600">
            Đây là mục dành riêng cho UBND phường và các tổ trưởng tổ dân phố.
          </Text>
        </NoAccessContainer>
      </PageLayout>
    );
  }

  const pendingCount = getPendingReportsCount(userRole === "leader" ? zaloId : undefined);
  const overdueCount = getOverdueReportsCount(userRole === "leader" ? zaloId : undefined);

  const renderUserSpecificView = () => {
    switch (userRole) {
      case "admin":
      case "mod":
        return <AdminReportView />;
      case "leader":
        return <LeaderReportView />;
      default:
        return null;
    }
  };

  const getUserTitle = () => {
    switch (userRole) {
      case "admin":
        return "Quản trị viên";
      case "mod":
        return "Điều hành viên";
      case "leader":
        return "Tổ trưởng TDP";
      default:
        return "Báo cáo TDP";
    }
  };

  return (
    <PageLayout title="Báo cáo TDP">
      {/* Welcome Header */}
      <WelcomeContainer>
        <Text.Title className="text-white mb-1">
          Xin chào, {getUserTitle()}!
        </Text.Title>
        <Text className="text-blue-100">
          {userRole === "leader" 
            ? "Quản lý báo cáo của tổ dân phố" 
            : "Theo dõi tiến độ báo cáo các TDP"
          }
        </Text>
      </WelcomeContainer>

      {/* Quick Stats */}
      <StatsContainer>
        <Box className="grid grid-cols-2 gap-4">
          <Box className="text-center">
            <Text className="text-2xl font-bold text-blue-600">
              {reportStats?.totalReports || 0}
            </Text>
            <Text className="text-sm text-gray-600">Tổng báo cáo</Text>
          </Box>
          <Box className="text-center">
            <Text className="text-2xl font-bold text-green-600">
              {reportStats?.completedReports || 0}
            </Text>
            <Text className="text-sm text-gray-600">Đã hoàn thành</Text>
          </Box>
        </Box>
        
        <Box className="grid grid-cols-2 gap-4 mt-4">
          <Box className="text-center">
            <Text className="text-2xl font-bold text-orange-600">
              {pendingCount}
            </Text>
            <Text className="text-sm text-gray-600">Đang chờ</Text>
          </Box>
          <Box className="text-center">
            <Text className="text-2xl font-bold text-red-600">
              {overdueCount}
            </Text>
            <Text className="text-sm text-gray-600">Quá hạn</Text>
          </Box>
        </Box>

        {reportStats && (
          <Box className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-sm text-gray-600">Tỷ lệ hoàn thành:</Text>
            <Text className="text-lg font-bold text-blue-600">
              {reportStats.completionRate.toFixed(1)}%
            </Text>
          </Box>
        )}
      </StatsContainer>

      {/* Quick Actions */}
      {(userRole === "admin" || userRole === "mod") && (
        <QuickActions>
          <ActionButton 
            variant="secondary" 
            className="relative"
            onClick={() => {/* Navigate to create report */}}
          >
            <Box className="flex flex-col items-center">
              <Icon icon="zi-plus" className="mb-1" />
              <Text className="text-xs">Tạo báo cáo</Text>
            </Box>
          </ActionButton>
          
          <ActionButton 
            variant="secondary"
            onClick={() => {/* Navigate to statistics */}}
          >
            <Box className="flex flex-col items-center">
              <Icon icon="zi-poll" className="mb-1" />
              <Text className="text-xs">Thống kê</Text>
            </Box>
          </ActionButton>
          
          <ActionButton 
            variant="secondary"
            className="relative"
            onClick={() => {/* Navigate to pending reports */}}
          >
            <Box className="flex flex-col items-center">
              <Icon icon="zi-clock-2" className="mb-1" />
              <Text className="text-xs">Chờ duyệt</Text>
              {pendingCount > 0 && (
                <NotificationBadge>{pendingCount}</NotificationBadge>
              )}
            </Box>
          </ActionButton>
          
          <ActionButton 
            variant="secondary"
            onClick={() => {/* Navigate to TDP management */}}
          >
            <Box className="flex flex-col items-center">
              <Icon icon="zi-group" className="mb-1" />
              <Text className="text-xs">Quản lý TDP</Text>
            </Box>
          </ActionButton>
        </QuickActions>
      )}

      {userRole === "leader" && (
        <QuickActions>
          <ActionButton 
            variant="secondary"
            className="relative"
            onClick={() => {/* Navigate to my reports */}}
          >
            <Box className="flex flex-col items-center">
              <Icon icon="zi-note" className="mb-1" />
              <Text className="text-xs">Báo cáo của tôi</Text>
              {pendingCount > 0 && (
                <NotificationBadge>{pendingCount}</NotificationBadge>
              )}
            </Box>
          </ActionButton>
          
          <ActionButton 
            variant="secondary"
            onClick={() => {/* Navigate to submit report */}}
          >
            <Box className="flex flex-col items-center">
              <Icon icon="zi-post" className="mb-1" />
              <Text className="text-xs">Nộp báo cáo</Text>
            </Box>
          </ActionButton>
        </QuickActions>
      )}

      {/* Main Content */}
      <Box className="mt-4">
        {renderUserSpecificView()}
      </Box>
    </PageLayout>
  );
};

export default ReportPage;