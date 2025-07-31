    import React from "react";
    import { useStore } from "@store";
    import { Box, Text } from "zmp-ui";
    import PageLayout from "@components/layout/PageLayout";
    import { ADMIN_ZALO_IDS, LEADER_ZALO_IDS } from "@constants/roles";

    const AdminView = () => <Text>Giao diện Admin/Mod</Text>;
    const LeaderView = () => <Text>Giao diện Tổ trưởng TDP</Text>;

    const NoAccessView = () => (
      <Box p={4}>
        <Text>Đây là mục dành riêng cho UBND phường và các tổ trưởng tổ dân phố.</Text>
      </Box>
    );

    const ReportPage: React.FC = () => {
      const { user } = useStore((state) => state);
      const zaloId = user?.idByOA;

      const isAdmin = zaloId && ADMIN_ZALO_IDS.includes(zaloId);
      const isLeader = zaloId && LEADER_ZALO_IDS.includes(zaloId);

      const renderContent = () => {
        if (isAdmin) return <AdminView />;
        if (isLeader) return <LeaderView />;
        return <NoAccessView />;
      };

      return (
        <PageLayout title="Báo cáo Tổ dân phố">
          {renderContent()}
        </PageLayout>
      );
    };

    export default ReportPage;
    