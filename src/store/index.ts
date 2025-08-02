import { create } from "zustand";
import { devtools } from "zustand/middleware";
import createAppStore, { AppSlice } from "./appSlice";
import createAuthStore, { AuthSlice } from "./authSlice";
import createFeedbackSlide, { FeedbackSlice } from "./feedbackSlice";
import createOrganizationSlide, {
    OrganizationSlice,
} from "./organizationSlice";
import { createNewsSlice, NewsSlice } from "./newsSlice"; 
import { createReportSlice, ReportSlice } from "./reportSlice"; // ← Thêm ReportSlice


type State = AppSlice &
    AuthSlice &
    FeedbackSlice &
    OrganizationSlice &
    NewsSlice & ReportSlice;


export const useStore = create<State>()(
    devtools((...a) => ({
        ...createAppStore(...a),
        ...createAuthStore(...a),
        ...createFeedbackSlide(...a),
        ...createOrganizationSlide(...a),
        ...createNewsSlice(...a), 
        ...createReportSlice(...a), // ← Thêm ReportSlice vào store

    })),
);
