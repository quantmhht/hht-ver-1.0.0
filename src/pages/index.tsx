// src/pages/index.tsx
import React from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import {
  FeedbackPage,
  FeedbackDetailPage,
  CreateFeedbackPage,
} from "./Feedback";
import { HomePage } from "./Home";
import { ReportPage } from "./Report";
import { DirectoryPage } from "./Directory";
import {
  NewsListPage,
  NewsDetailPage,
  NewsManagementPage,
} from "./News";
// Import thêm các trang báo cáo
import { 
  CreateReportPage,
  ReportDetailPage,
  ReportStatsPage,
  ManageTDPPage,
} from "./Report";


const Routes: React.FC = () => (
  <ZMPRouter>
    <AnimationRoutes>
      <Route path="/" element={<HomePage />} />
      
      {/* Các route cho chức năng Phản ánh kiến nghị */}
      <Route path="/feedbacks" element={<FeedbackPage />} />
      <Route path="/feedbacks/:id" element={<FeedbackDetailPage />} />
      <Route path="/create-feedback" element={<CreateFeedbackPage />} />

      {/* Các route cho báo cáo TDP */}
      <Route path="/report" element={<ReportPage />} />
      <Route path="/report/create" element={<CreateReportPage />} />
      <Route path="/report/:id" element={<ReportDetailPage />} />
      <Route path="/report/stats" element={<ReportStatsPage />} />
      <Route path="/report/manage-tdp" element={<ManageTDPPage />} />

      {/* Các route khác */}
      <Route path="/directory" element={<DirectoryPage />} />
      <Route path="/news" element={<NewsListPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/manage-news" element={<NewsManagementPage />} />
    </AnimationRoutes>
  </ZMPRouter>
);

export default Routes;