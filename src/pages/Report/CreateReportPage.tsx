// src/pages/Report/CreateReportPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@store";
import { 
  Box, 
  Text, 
  Button, 
  Input, 
  Select, 
  DatePicker,
  TextArea,
  Icon 
} from "zmp-ui";
import { toast } from "react-toastify";
import PageLayout from "@components/layout/PageLayout";
import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`p-4 space-y-4`}
`;

const FormGroup = styled.div`
  ${tw`space-y-2`}
`;

const Label = styled.label`
  ${tw`block text-sm font-medium text-gray-700`}
`;

const Card = styled.div`
  ${tw`bg-white rounded-lg p-4 shadow-sm border`}
`;

const TDPList = styled.div`
  ${tw`space-y-2 max-h-48 overflow-y-auto`}
`;

const TDPItem = styled.div<{ selected: boolean }>`
  ${tw`p-3 border rounded-lg cursor-pointer transition-colors`}
  ${({ selected }) => selected ? tw`border-blue-500 bg-blue-50` : tw`border-gray-200 hover:border-gray-300`}
`;

const ButtonGroup = styled.div`
  ${tw`flex gap-3 pt-4`}
`;

interface CreateReportForm {
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  assignedTo: string[];
  category: string;
  requirements: string;
}

const CreateReportPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { user, tdpList, loadingTDP, getTDPList, createReport } = useStore((state) => ({
    user: state.user,
    tdpList: state.tdpList,
    loadingTDP: state.loadingTDP,
    getTDPList: state.getTDPList,
    createReport: state.createReport,
  
  }));

  const [form, setForm] = useState<CreateReportForm>({
    title: "",
    description: "",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
    priority: "medium",
    assignedTo: [],
    category: "",
    requirements: "",
  });

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    getTDPList();
  }, [getTDPList]);

  const handleInputChange = (field: keyof CreateReportForm, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTDPSelection = (tdpId: string) => {
    setForm(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(tdpId)
        ? prev.assignedTo.filter(id => id !== tdpId)
        : [...prev.assignedTo, tdpId]
    }));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setForm(prev => ({ ...prev, assignedTo: [] }));
    } else {
      setForm(prev => ({ 
        ...prev, 
        assignedTo: tdpList.map(tdp => tdp.leaderId) 
      }));
    }
    setSelectAll(!selectAll);
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề báo cáo");
      return false;
    }
    if (!form.description.trim()) {
      toast.error("Vui lòng nhập mô tả báo cáo");
      return false;
    }
    if (form.assignedTo.length === 0) {
      toast.error("Vui lòng chọn ít nhất một TDP");
      return false;
    }
    if (form.dueDate < new Date()) {
      toast.error("Hạn báo cáo phải sau ngày hiện tại");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const reportData = {
        ...form,
        assignedBy: user?.id || "",
        createdAt: new Date(),
        status: "pending" as const,
      };

      await createReport(reportData);
      toast.success("Tạo báo cáo thành công!");
      navigate("/report");
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Có lỗi xảy ra khi tạo báo cáo");
    }
  };

  const priorityOptions = [
    { value: "low", label: "Thấp", color: "text-green-600" },
    { value: "medium", label: "Trung bình", color: "text-yellow-600" },
    { value: "high", label: "Cao", color: "text-red-600" },
  ];

  const categoryOptions = [
    { value: "monthly", label: "Báo cáo tháng" },
    { value: "quarterly", label: "Báo cáo quý" },
    { value: "yearly", label: "Báo cáo năm" },
    { value: "special", label: "Báo cáo đặc biệt" },
    { value: "survey", label: "Khảo sát" },
  ];

  return (
    <PageLayout title="Tạo báo cáo mới" showBackIcon>
      <Container>
        {/* Thông tin cơ bản */}
        <Card>
          <Text className="text-lg font-semibold mb-4">Thông tin báo cáo</Text>
          
          <FormGroup>
            <Label>Tiêu đề báo cáo *</Label>
            <Input
              placeholder="Nhập tiêu đề báo cáo..."
              value={form.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Mô tả *</Label>
            <TextArea
              placeholder="Mô tả chi tiết về báo cáo..."
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </FormGroup>

          <FormGroup>
            <Label>Loại báo cáo</Label>
            <Select
              value={form.category}
              onChange={(value) => handleInputChange("category", value)}
            >
              <option value="">Chọn loại báo cáo</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Yêu cầu đặc biệt</Label>
            <TextArea
              placeholder="Các yêu cầu đặc biệt, định dạng báo cáo..."
              value={form.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              rows={3}
            />
          </FormGroup>
        </Card>

        {/* Cài đặt thời hạn và ưu tiên */}
        <Card>
          <Text className="text-lg font-semibold mb-4">Cài đặt</Text>
          
          <div className="grid grid-cols-2 gap-4">
            <FormGroup>
              <Label>Hạn báo cáo *</Label>
              <DatePicker
                value={form.dueDate}
                onChange={(date) => handleInputChange("dueDate", date)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Độ ưu tiên</Label>
              <Select
                value={form.priority}
                onChange={(value) => handleInputChange("priority", value)}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </div>
        </Card>

        {/* Chọn TDP */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <Text className="text-lg font-semibold">
              Chọn TDP ({form.assignedTo.length} đã chọn)
            </Text>
            <Button
              variant="tertiary"
              size="small"
              onClick={handleSelectAll}
            >
              {selectAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </Button>
          </div>

          {loadingTDP ? (
            <div className="flex justify-center py-8">
              <Text>Đang tải danh sách TDP...</Text>
            </div>
          ) : (
            <TDPList>
              {tdpList.map((tdp) => (
                <TDPItem
                  key={tdp.id}
                  selected={form.assignedTo.includes(tdp.leaderId)}
                  onClick={() => handleTDPSelection(tdp.leaderId)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">{tdp.name}</Text>
                      <Text className="text-sm text-gray-600">
                        Tổ trưởng: {tdp.leaderName}
                      </Text>
                    </div>
                    {form.assignedTo.includes(tdp.leaderId) && (
                      <Icon icon="zi-check-circle" className="text-blue-500" />
                    )}
                  </div>
                </TDPItem>
              ))}
            </TDPList>
          )}
        </Card>

        {/* Action buttons */}
        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1"
          >
            Tạo báo cáo
          </Button>
        </ButtonGroup>
      </Container>
    </PageLayout>
  );
};

export default CreateReportPage;