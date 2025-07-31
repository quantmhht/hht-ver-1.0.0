    import React from "react";
    import { PageLayout } from "@components";
    import { Box, Text } from "zmp-ui";

    const NewsManagementPage: React.FC = () => {
      return (
        <PageLayout title="Quản lý Tin tức" showBackIcon>
          <Box p={4}>
            <Text>Đây là trang quản lý tin tức dành cho Admin và Mod.</Text>
            {/* Thêm các chức năng Thêm/Sửa/Xóa ở đây */}
          </Box>
        </PageLayout>
      );
    };

    export default NewsManagementPage;
    