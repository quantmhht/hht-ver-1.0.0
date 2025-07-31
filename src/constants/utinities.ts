    import * as Icon from "@components/icons";
    import { Utinity } from "@dts";
    import PhoneIcon from "@assets/internal-phone.png";

    export const APP_UTINITIES: Array<Utinity> = [
      {
        key: "feedback",
        label: "Phản ánh hiện trường",
        icon: Icon.PenIcon,
        path: "/create-feedback",
      },
      {
        key: "public-service",
        label: "Tra cứu DVC",
        icon: Icon.SearchIcon,
        link: "https://dichvucong.gov.vn/",
      },
      {
        key: "reporting",
        label: "Báo cáo TDP",
        icon: Icon.ReportIcon,
        path: "/report",
      },
      {
        key: "directory",
        label: "Danh bạ",
        icon: Icon.BookIcon,
        path: "/directory",
      },
    ];

    export const CONTACTS: Array<Utinity> = [
      {
        key: "bi-thu",
        label: "Bí thư Đảng ủy phường",
        iconSrc: PhoneIcon,
        phoneNumber: "0123456789", // Thay số thật
      },
      {
        key: "chu-tich",
        label: "Chủ tịch UBND phường",
        iconSrc: PhoneIcon,
        phoneNumber: "0123456788", // Thay số thật
      },
      {
        key: "truong-ca",
        label: "Trưởng Công an Phường",
        iconSrc: PhoneIcon,
        phoneNumber: "0123456787", // Thay số thật
      },
      {
        key: "truong-ban-chqs",
        label: "Trưởng ban CHQS phường",
        iconSrc: PhoneIcon,
        phoneNumber: "0123456786", // Thay số thật
      },
    ];
    