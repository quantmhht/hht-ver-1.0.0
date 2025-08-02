// src/store/feedbackSlice.ts
import { Feedback, Feedbacks, FeedbackType } from "@dts";
import {
    createFeedback,
    getFeedbacks,
    getFeedbackDetail,
    getFeedbackTypes,
    getFeedbackTypeName,
    CreateFeedbackParams,
    GetFeedbacksParams,
    GetFeedbackTypeParams,
} from "@service/services";
import { StateCreator } from "zustand";

// Interface cho form input
export interface CreateFeedbackFormParams {
    title: string;
    content: string;
    fullName: string;
    address: string;
    phoneNumber: string;
    nationalId: string;
    feedBackTypeId: number; // ID số
    imageUrls: string[];
}

export interface FeedbackSlice {
    creatingFeedback?: boolean;
    gettingFeedback?: boolean;
    gettingFeedbackType?: boolean;
    feedbacks?: Feedbacks;
    feedbackResult?: boolean;
    feedbackTypes?: FeedbackType[];
    feedbackDetail?: Feedback | null;
    createFeedback: (
        feedback: CreateFeedbackFormParams,
        organizationId: string,
    ) => Promise<boolean>;
    getFeedbacks: (params: GetFeedbacksParams) => Promise<void>;
    getFeedbackTypes: (params: GetFeedbackTypeParams) => Promise<void>;
    getFeedback: (params: { id: string }) => Promise<void>;
}

const feedbackSlice: StateCreator<FeedbackSlice> = (set, get) => ({
    creatingFeedback: false,
    gettingFeedback: false,
    gettingFeedbackType: false,
    feedbackDetail: null,

    createFeedback: async (
        feedback: CreateFeedbackFormParams,
        organizationId: string,
    ) => {
        try {
            set(state => ({
                ...state,
                creatingFeedback: true,
            }));

            // Chuyển đổi dữ liệu form thành params cho Firebase
            const feedbackData: CreateFeedbackParams = {
                title: feedback.title,
                content: feedback.content,
                fullName: feedback.fullName,
                address: feedback.address,
                phoneNumber: feedback.phoneNumber,
                nationalId: feedback.nationalId,
                type: getFeedbackTypeName(feedback.feedBackTypeId), // Chuyển ID thành tên
                imageUrls: feedback.imageUrls,
                organizationId,
                response: "",
                creationTime: new Date(),
                responseTime: null,
            };

            const rs = await createFeedback(feedbackData);

            set(state => ({
                ...state,
                feedbackResult: rs,
            }));
            return rs;
        } catch (error) {
            console.error("Error creating feedback:", error);
            return false;
        } finally {
            set(state => ({
                ...state,
                creatingFeedback: false,
            }));
        }
    },

    getFeedbacks: async (params: GetFeedbacksParams) => {
        try {
            const { firstFetch = false } = params;

            set(state => ({
                ...state,
                gettingFeedback: true,
            }));

            const feedbackList = await getFeedbacks(params);
            
            // Chuyển đổi array thành format Feedbacks
            const feedbacks: Feedbacks = {
                feedbacks: feedbackList,
                total: feedbackList.length,
                page: params.page || 0,
                currentPageSize: feedbackList.length,
            };

            set(state => ({
                ...state,
                gettingFeedback: false,
                feedbacks: {
                    ...feedbacks,
                    feedbacks: firstFetch
                        ? feedbacks.feedbacks
                        : [
                              ...(state.feedbacks?.feedbacks || []),
                              ...feedbacks.feedbacks,
                          ],
                },
            }));
        } catch (err) {
            console.error("Error getting feedbacks:", err);
            set(state => ({
                ...state,
                gettingFeedback: false,
            }));
        }
    },

    getFeedbackTypes: async (params: GetFeedbackTypeParams) => {
        try {
            set(state => ({
                ...state,
                gettingFeedbackType: true,
            }));
            const feedbackTypes = await getFeedbackTypes(params);
            set(state => ({
                ...state,
                gettingFeedbackType: false,
                feedbackTypes,
            }));
        } catch (err) {
            console.error("Error getting feedback types:", err);
            set(state => ({
                ...state,
                gettingFeedbackType: false,
            }));
        }
    },

    getFeedback: async (params: { id: string }) => {
        try {
            const feedback = await getFeedbackDetail(params.id);
            set(state => ({ ...state, feedbackDetail: feedback }));
        } catch (err) {
            console.error("Error getting feedback detail:", err);
        }
    },
});

export default feedbackSlice;