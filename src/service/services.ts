// src/service/services.ts
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { News, Feedback, Organization, FeedbackType } from "@dts";

// ===== INTERFACES CHO PARAMS =====

export interface GetOrganizationParams {
  miniAppId: string;
}

export interface GetNewsParams {
  organizationId?: string;
  page?: number;
  limit?: number;
}

export interface CreateFeedbackParams {
  title: string;
  content: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  nationalId: string;
  type: string; // Tên loại phản ánh
  imageUrls: string[];
  organizationId: string;
  response?: string;
  creationTime: Date;
  responseTime?: Date | null;
}

export interface GetFeedbacksParams {
  organizationId: string;
  page?: number;
  limit?: number;
  firstFetch?: boolean;
}

export interface GetFeedbackTypeParams {
  organizationId: string;
}

// ===== ORGANIZATION SERVICES =====

export const getOrganization = async (params: GetOrganizationParams): Promise<Organization | null> => {
  try {
    // Tạm thời trả về dữ liệu mặc định, sau này có thể lấy từ Firestore theo miniAppId
    const defaultOrg: Organization = {
      id: "ha-huy-tap-ward",
      name: "UBND Phường Hà Huy Tập",
      description: "Ủy ban nhân dân phường Hà Huy Tập, thành phố Hà Tĩnh, tỉnh Hà Tĩnh",
      logoUrl: "/assets/logo.png",
      officialAccounts: [
        {
          oaId: "oa-ha-huy-tap",
          name: "UBND Phường Hà Huy Tập",
          logoUrl: "/assets/logo.png",
          follow: false,
        }
      ]
    };
    return defaultOrg;
  } catch (error) {
    console.error("Error getting organization:", error);
    return null;
  }
};

// ===== NEWS SERVICES =====

export const getNews = async (params: GetNewsParams = {}): Promise<News[]> => {
  try {
    const { limit: limitCount = 20, page = 0 } = params;
    
    let newsQuery = query(
      collection(db, "news"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    // Nếu có phân trang
    if (page > 0) {
      // Lấy document cuối cùng của trang trước để phân trang
      // Cần implement logic phân trang phức tạp hơn nếu cần
    }

    const newsSnapshot = await getDocs(newsQuery);
    const newsList = newsSnapshot.docs.map((doc) => ({
      id: parseInt(doc.id) || 0,
      ...doc.data(),
    })) as News[];

    return newsList;
  } catch (error) {
    console.error("Error getting news:", error);
    return [];
  }
};

// ===== FEEDBACK SERVICES =====

export const createFeedback = async (feedbackData: CreateFeedbackParams): Promise<boolean> => {
  try {
    const feedbackCol = collection(db, "feedbacks");
    await addDoc(feedbackCol, {
      ...feedbackData,
      createdAt: new Date(),
      status: "Mới",
    });
    return true;
  } catch (error) {
    console.error("Error creating feedback:", error);
    return false;
  }
};

export const getFeedbacks = async (params: GetFeedbacksParams): Promise<Feedback[]> => {
  try {
    const { organizationId, limit: limitCount = 10, page = 0 } = params;
    
    let feedbackQuery = query(
      collection(db, "feedbacks"),
      where("organizationId", "==", organizationId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const feedbackSnapshot = await getDocs(feedbackQuery);
    const feedbackList = feedbackSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Chuyển đổi timestamp thành Date nếu cần
      creationTime: doc.data().creationTime?.toDate?.() || doc.data().creationTime,
      responseTime: doc.data().responseTime?.toDate?.() || doc.data().responseTime,
    })) as Feedback[];

    return feedbackList;
  } catch (error) {
    console.error("Error getting feedbacks:", error);
    return [];
  }
};

export const getFeedbackDetail = async (id: string): Promise<Feedback | null> => {
  try {
    const docRef = doc(db, "feedbacks", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        creationTime: data.creationTime?.toDate?.() || data.creationTime,
        responseTime: data.responseTime?.toDate?.() || data.responseTime,
      } as Feedback;
    }
    return null;
  } catch (error) {
    console.error("Error getting feedback detail:", error);
    return null;
  }
};

export const getFeedbackTypes = async (params: GetFeedbackTypeParams): Promise<FeedbackType[]> => {
  // Tạm thời trả về dữ liệu tĩnh, sau này có thể lưu vào Firestore
  try {
    const types: FeedbackType[] = [
      { id: 1, title: "Tin báo về ANTT", order: 1 },
      { id: 2, title: "Tin báo về văn hóa xã hội", order: 2 },
      { id: 3, title: "Tin báo về địa chính, xây dựng, kinh doanh, đô thị", order: 3 },
      { id: 4, title: "Tin báo khác", order: 4 },
    ];
    return types;
  } catch (error) {
    console.error("Error getting feedback types:", error);
    return [];
  }
};

// ===== HELPER FUNCTIONS =====

export const getFeedbackTypeName = (id: number): string => {
  const types: { [key: number]: string } = {
    1: "Tin báo về ANTT",
    2: "Tin báo về văn hóa xã hội",
    3: "Tin báo về địa chính, xây dựng, kinh doanh, đô thị",
    4: "Tin báo khác"
  };
  return types[id] || "Tin báo khác";
};