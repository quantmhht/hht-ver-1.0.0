import React from "react";
import PageLayout from "@components/layout/PageLayout";
import { VerticalUtinities } from "@components";
import { CONTACTS } from "@constants/utinities";

const DirectoryPage: React.FC = () => {
  return (
    <PageLayout title="Danh bạ UBND Phường">
      <VerticalUtinities title="Lãnh đạo chủ chốt" utinities={CONTACTS} />
    </PageLayout>
  );
};

export default DirectoryPage;
