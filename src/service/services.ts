import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "./firebase"; // Import database từ file firebase.ts
import { News, Feedback, Organization, FeedbackType } from "@dts";


// Hàm này có thể giữ lại hoặc xóa nếu không dùng đến
export const getOrganization = async (id: string) => {
  const docRef = doc(db, "organization", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Organization;
  } else {
    // Trả về null hoặc throw error nếu không tìm thấy
    console.log("No such document!");
    return null;
  }
};

/**
 * Lấy danh sách tin tức từ collection "news" trên Firestore.
 * Đã cập nhật để nhận tham số cho tương thích với newsSlice.ts
 */
export const getNews = async (params?: { organizationId: string; page?: number; limit?: number }) => {
  // Mặc dù hiện tại chúng ta chưa dùng đến params, việc khai báo nó sẽ giải quyết lỗi TypeScript.
  // Sau này bạn có thể dùng params.organizationId để lọc tin tức nếu cần.
  const newsCol = collection(db, "news");
  const newsSnapshot = await getDocs(newsCol);
  const newsList = newsSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as unknown as News)
  );
  // Sắp xếp tin tức theo ID (hoặc một trường timestamp nếu có) để tin mới nhất lên đầu
  return newsList.sort((a, b) => b.id - a.id);
};

/**
 * Gửi một phản ánh mới lên collection "feedbacks" trên Firestore.
 */
export const createFeedback = async (feedbackData: Omit<Feedback, "id">) => {
  try {
    const feedbackCol = collection(db, "feedbacks");
    await addDoc(feedbackCol, {
      ...feedbackData,
      createdAt: new Date(), // Thêm thời gian tạo để tiện sắp xếp
      status: "Mới", // Trạng thái mặc định
    });
    return true; // Trả về true nếu thành công
  } catch (error) {
    console.error("Error creating feedback: ", error);
    return false; // Trả về false nếu có lỗi
  }
};

// Các hàm khác có thể được thêm vào đây theo cách tương tự
// Ví dụ: lấy danh sách phản ánh, chi tiết phản ánh...

export const getFeedbacks = async (organizationId: string) => {
  // Hiện tại, chúng ta sẽ lấy tất cả feedbacks, sau này có thể lọc theo organizationId nếu cần
  const feedbackCol = collection(db, "feedbacks");
  const feedbackSnapshot = await getDocs(feedbackCol);
  const feedbackList = feedbackSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as unknown as Feedback)
  );
  return feedbackList;
};

export const getFeedbackDetail = async (id: string) => {
  const docRef = doc(db, "feedbacks", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Feedback;
  } else {
    return null;
  }
};

// Hàm này có thể giữ lại hoặc chuyển sang lấy từ Firebase nếu cần
export const getFeedbackTypes = async (organizationId: string) => {
  // Trong thực tế, bạn có thể tạo một collection 'feedbackTypes' trên Firebase
  // Ở đây, chúng ta tạm thời trả về dữ liệu tĩnh như đã làm ở các bước trước
  const types: FeedbackType[] = [
    { id: 1, title: "Tin báo về ANTT" , order: 1},
    { id: 2, title: "Tin báo về văn hóa xã hội", order: 2 },
    { id: 3, title: "Tin báo về địa chính, xây dựng, kinh doanh, đô thị", order: 3 },
    { id: 4, title: "Tin báo khác", order: 4 },
  ];
  return types;
};
