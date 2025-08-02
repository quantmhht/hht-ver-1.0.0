// src/pages/Report/ManageTDPPage.tsx
import React, { useState, useEffect } from "react";
import { useStore } from "@store";
import { 
  Box, 
  Text, 
  Button, 
  Input, 
  Modal,
  TextArea,
  Icon,
  SearchBar 
} from "zmp-ui";
import { toast } from "react-toastify";
import PageLayout from "@components/layout/PageLayout";
import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`p-4 space-y-4`}
`;

const Card = styled.div`
  ${tw`bg-white rounded-lg p-4 shadow-sm border`}
`;

const TDPGrid = styled.div`
  ${tw`grid gap-4`}
`;

const TDPCard = styled.div`
  ${tw`border rounded-lg p-4 hover:shadow-md transition-shadow`}
`;

const TDPHeader = styled.div`
  ${tw`flex items-center justify-between mb-3`}
`;

const TDPName = styled.h3`
  ${tw`text-lg font-semibold text-gray-900`}
`;

const TDPInfo = styled.div`
  ${tw`space-y-2 text-sm text-gray-600`}
`;

const ActionButtons = styled.div`
  ${tw`flex gap-2 mt-4`}
`;

const StatusBadge = styled.span<{ active: boolean }>`
  ${tw`px-2 py-1 rounded-full text-xs font-medium`}
  ${({ active }) => active ? 
    tw`bg-green-100 text-green-800` : 
    tw`bg-red-100 text-red-800`
  }
`;

const StatsRow = styled.div`
  ${tw`grid grid-cols-3 gap-4 text-center`}
`;

const StatItem = styled.div`
  ${tw`bg-gray-50 rounded-lg p-3`}
`;

const StatNumber = styled.div`
  ${tw`text-xl font-bold text-blue-600`}
`;

const StatLabel = styled.div`
  ${tw`text-xs text-gray-600 mt-1`}
`;

const SearchContainer = styled.div`
  ${tw`mb-4`}
`;

const FloatingButton = styled(Button)`
  ${tw`fixed bottom-6 right-6 rounded-full shadow-lg`}
  z-index: 1000;
`;

interface TDPFormData {
  name: string;
  address: string;
  leaderName: string;
  leaderPhone: string;
  leaderZaloId: string;
  description: string;
  householdCount: number;
  populationCount: number;
}

interface TDPWithStats {
  id: string;
  name: string;
  address: string;
  leaderName: string;
  leaderPhone: string;
  leaderZaloId: string;
  description: string;
  householdCount: number;
  populationCount: number;
  active: boolean;
  createdAt: Date;
  stats: {
    totalReports: number;
    completedReports: number;
    overdueReports: number;
    completionRate: number;
  };
}

const ManageTDPPage: React.FC = () => {
  const { 
    tdpList, 
    loadingTDP,
    getTDPList,
    createTDP,
    updateTDP,
    deleteTDP,
    getTDPStats
  } = useStore((state) => ({
    tdpList: state.tdpList,
    loadingTDP: state.loadingTDP,
    getTDPList: state.getTDPList,
    createTDP: state.createTDP,
    updateTDP: state.updateTDP,
    deleteTDP: state.deleteTDP,
    getTDPStats: state.getTDPStats,
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTDP, setSelectedTDP] = useState<TDPWithStats | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<TDPFormData>({
    name: "",
    address: "",
    leaderName: "",
    leaderPhone: "",
    leaderZaloId: "",
    description: "",
    householdCount: 0,
    populationCount: 0,
  });

  const [tdpWithStats, setTdpWithStats] = useState<TDPWithStats[]>([]);

  useEffect(() => {
    loadTDPData();
  }, []);

  const loadTDPData = async () => {
    await getTDPList();
    await loadTDPStats();
  };

  const loadTDPStats = async () => {
    // Mock implementation - in real app, this would fetch from Firebase
    const statsData: TDPWithStats[] = tdpList.map(tdp => ({
      ...tdp,
      stats: {
        totalReports: Math.floor(Math.random() * 50) + 10,
        completedReports: Math.floor(Math.random() * 40) + 8,
        overdueReports: Math.floor(Math.random() * 5),
        completionRate: Math.floor(Math.random() * 20) + 80,
      }
    }));
    setTdpWithStats(statsData);
  };

  const handleInputChange = (field: keyof TDPFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      leaderName: "",
      leaderPhone: "",
      leaderZaloId: "",
      description: "",
      householdCount: 0,
      populationCount: 0,
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên TDP");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return false;
    }
    if (!formData.leaderName.trim()) {
      toast.error("Vui lòng nhập tên tổ trưởng");
      return false;
    }
    if (!formData.leaderPhone.trim()) {
      toast.error("Vui lòng nhập số điện thoại tổ trưởng");
      return false;
    }
    if (!formData.leaderZaloId.trim()) {
      toast.error("Vui lòng nhập Zalo ID tổ trưởng");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await createTDP({
        ...formData,
        active: true,
        createdAt: new Date(),
      });
      toast.success("Tạo TDP thành công!");
      setShowCreateModal(false);
      resetForm();
      loadTDPData();
    } catch (error) {
      console.error("Error creating TDP:", error);
      toast.error("Có lỗi xảy ra khi tạo TDP");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tdp: TDPWithStats) => {
    setSelectedTDP(tdp);
    setFormData({
      name: tdp.name,
      address: tdp.address,
      leaderName: tdp.leaderName,
      leaderPhone: tdp.leaderPhone,
      leaderZaloId: tdp.leaderZaloId,
      description: tdp.description,
      householdCount: tdp.householdCount,
      populationCount: tdp.populationCount,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!validateForm() || !selectedTDP) return;

    setSaving(true);
    try {
      await updateTDP(selectedTDP.id, formData);
      toast.success("Cập nhật TDP thành công!");
      setShowEditModal(false);
      resetForm();
      setSelectedTDP(null);
      loadTDPData();
    } catch (error) {
      console.error("Error updating TDP:", error);
      toast.error("Có lỗi xảy ra khi cập nhật TDP");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTDP) return;

    setSaving(true);
    try {
      await deleteTDP(selectedTDP.id);
      toast.success("Xóa TDP thành công!");
      setShowDeleteModal(false);
      setSelectedTDP(null);
      loadTDPData();
    } catch (error) {
      console.error("Error deleting TDP:", error);
      toast.error("Có lỗi xảy ra khi xóa TDP");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (tdp: TDPWithStats) => {
    setSelectedTDP(tdp);
    setShowDeleteModal(true);
  };

  const toggleTDPStatus = async (tdp: TDPWithStats) => {
    try {
      await updateTDP(tdp.id, { active: !tdp.active });
      toast.success(`${tdp.active ? "Vô hiệu hóa" : "Kích hoạt"} TDP thành công!`);
      loadTDPData();
    } catch (error) {
      console.error("Error toggling TDP status:", error);
      toast.error("Có lỗi xảy ra khi thay đổi trạng thái TDP");
    }
  };

  const filteredTDPs = tdpWithStats.filter(tdp => 
    tdp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tdp.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tdp.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout title="Quản lý TDP" showBackIcon>
      <Container>
        {/* Search */}
        <SearchContainer>
          <SearchBar
            placeholder="Tìm kiếm TDP theo tên, tổ trưởng hoặc địa chỉ..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </SearchContainer>

        {/* Summary Stats */}
        <Card>
          <Text className="text-lg font-semibold mb-4">Tổng quan</Text>
          <StatsRow>
            <StatItem>
              <StatNumber>{tdpWithStats.length}</StatNumber>
              <StatLabel>Tổng TDP</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{tdpWithStats.filter(tdp => tdp.active).length}</StatNumber>
              <StatLabel>Đang hoạt động</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{tdpWithStats.reduce((sum, tdp) => sum + tdp.householdCount, 0)}</StatNumber>
              <StatLabel>Tổng hộ dân</StatLabel>
            </StatItem>
          </StatsRow>
        </Card>

        {/* TDP List */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <Text className="text-lg font-semibold">
              Danh sách TDP ({filteredTDPs.length})
            </Text>
            <Button
              size="small"
              onClick={() => setShowCreateModal(true)}
            >
              <Icon icon="zi-plus" /> Thêm TDP
            </Button>
          </div>

          {loadingTDP ? (
            <div className="flex justify-center py-8">
              <Text>Đang tải...</Text>
            </div>
          ) : (
            <TDPGrid>
              {filteredTDPs.map((tdp) => (
                <TDPCard key={tdp.id}>
                  <TDPHeader>
                    <div>
                      <TDPName>{tdp.name}</TDPName>
                      <StatusBadge active={tdp.active}>
                        {tdp.active ? "Hoạt động" : "Vô hiệu hóa"}
                      </StatusBadge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        variant="tertiary"
                        onClick={() => handleEdit(tdp)}
                      >
                        <Icon icon="zi-edit" />
                      </Button>
                      <Button
                        size="small"
                        variant="tertiary"
                        onClick={() => toggleTDPStatus(tdp)}
                      >
                        <Icon icon={tdp.active ? "zi-pause" : "zi-play"} />
                      </Button>
                      <Button
                        size="small"
                        variant="tertiary"
                        onClick={() => confirmDelete(tdp)}
                      >
                        <Icon icon="zi-delete" />
                      </Button>
                    </div>
                  </TDPHeader>

                  <TDPInfo>
                    <div><strong>Địa chỉ:</strong> {tdp.address}</div>
                    <div><strong>Tổ trưởng:</strong> {tdp.leaderName}</div>
                    <div><strong>Điện thoại:</strong> {tdp.leaderPhone}</div>
                    <div><strong>Số hộ:</strong> {tdp.householdCount} hộ</div>
                    <div><strong>Dân số:</strong> {tdp.populationCount} người</div>
                    {tdp.description && (
                      <div><strong>Mô tả:</strong> {tdp.description}</div>
                    )}
                  </TDPInfo>

                  {/* TDP Stats */}
                  <div className="mt-4 pt-4 border-t">
                    <Text className="font-medium mb-2">Thống kê báo cáo:</Text>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{tdp.stats.totalReports}</div>
                        <div className="text-gray-600">Tổng</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{tdp.stats.completedReports}</div>
                        <div className="text-gray-600">Hoàn thành</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-red-600">{tdp.stats.overdueReports}</div>
                        <div className="text-gray-600">Quá hạn</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${
                          tdp.stats.completionRate >= 90 ? 'text-green-600' :
                          tdp.stats.completionRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {tdp.stats.completionRate}%
                        </div>
                        <div className="text-gray-600">Tỷ lệ</div>
                      </div>
                    </div>
                  </div>
                </TDPCard>
              ))}
            </TDPGrid>
          )}

          {filteredTDPs.length === 0 && !loadingTDP && (
            <div className="text-center py-8">
              <Text>Không tìm thấy TDP nào</Text>
            </div>
          )}
        </Card>
      </Container>

      {/* Floating Add Button */}
      <FloatingButton onClick={() => setShowCreateModal(true)}>
        <Icon icon="zi-plus" />
      </FloatingButton>

      {/* Create TDP Modal */}
      <Modal
        visible={showCreateModal}
        title="Thêm TDP mới"
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        actions={[
          {
            text: "Hủy",
            close: true,
          },
          {
            text: "Tạo TDP",
            primary: true,
            loading: saving,
            onClick: handleCreate,
          },
        ]}
      >
        <div className="space-y-4">
          <div>
            <Text className="block text-sm font-medium mb-1">Tên TDP *</Text>
            <Input
              placeholder="Nhập tên TDP..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-1">Địa chỉ *</Text>
            <TextArea
              placeholder="Nhập địa chỉ TDP..."
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Text className="block text-sm font-medium mb-1">Tên tổ trưởng *</Text>
              <Input
                placeholder="Họ và tên..."
                value={formData.leaderName}
                onChange={(e) => handleInputChange("leaderName", e.target.value)}
              />
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Số điện thoại *</Text>
              <Input
                placeholder="0123456789"
                value={formData.leaderPhone}
                onChange={(e) => handleInputChange("leaderPhone", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Text className="block text-sm font-medium mb-1">Zalo ID tổ trưởng *</Text>
            <Input
              placeholder="Zalo ID của tổ trưởng..."
              value={formData.leaderZaloId}
              onChange={(e) => handleInputChange("leaderZaloId", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Text className="block text-sm font-medium mb-1">Số hộ dân</Text>
              <Input
                type="number"
                placeholder="0"
                value={formData.householdCount}
                onChange={(e) => handleInputChange("householdCount", parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Dân số</Text>
              <Input
                type="number"
                placeholder="0"
                value={formData.populationCount}
                onChange={(e) => handleInputChange("populationCount", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Text className="block text-sm font-medium mb-1">Mô tả</Text>
            <TextArea
              placeholder="Mô tả thêm về TDP..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Modal>

      {/* Edit TDP Modal */}
      <Modal
        visible={showEditModal}
        title="Chỉnh sửa TDP"
        onClose={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedTDP(null);
        }}
        actions={[
          {
            text: "Hủy",
            close: true,
          },
          {
            text: "Cập nhật",
            primary: true,
            loading: saving,
            onClick: handleUpdate,
          },
        ]}
      >
        <div className="space-y-4">
          <div>
            <Text className="block text-sm font-medium mb-1">Tên TDP *</Text>
            <Input
              placeholder="Nhập tên TDP..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-1">Địa chỉ *</Text>
            <TextArea
              placeholder="Nhập địa chỉ TDP..."
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Text className="block text-sm font-medium mb-1">Tên tổ trưởng *</Text>
              <Input
                placeholder="Họ và tên..."
                value={formData.leaderName}
                onChange={(e) => handleInputChange("leaderName", e.target.value)}
              />
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Số điện thoại *</Text>
              <Input
                placeholder="0123456789"
                value={formData.leaderPhone}
                onChange={(e) => handleInputChange("leaderPhone", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Text className="block text-sm font-medium mb-1">Zalo ID tổ trưởng *</Text>
            <Input
              placeholder="Zalo ID của tổ trưởng..."
              value={formData.leaderZaloId}
              onChange={(e) => handleInputChange("leaderZaloId", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Text className="block text-sm font-medium mb-1">Số hộ dân</Text>
              <Input
                type="number"
                placeholder="0"
                value={formData.householdCount}
                onChange={(e) => handleInputChange("householdCount", parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Text className="block text-sm font-medium mb-1">Dân số</Text>
              <Input
                type="number"
                placeholder="0"
                value={formData.populationCount}
                onChange={(e) => handleInputChange("populationCount", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Text className="block text-sm font-medium mb-1">Mô tả</Text>
            <TextArea
              placeholder="Mô tả thêm về TDP..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        title="Xác nhận xóa"
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTDP(null);
        }}
        actions={[
          {
            text: "Hủy",
            close: true,
          },
          {
            text: "Xóa",
            primary: true,
            danger: true,
            loading: saving,
            onClick: handleDelete,
          },
        ]}
      >
        <div className="space-y-4">
          <Text>
            Bạn có chắc chắn muốn xóa TDP <strong>{selectedTDP?.name}</strong>?
          </Text>
          <Text className="text-sm text-red-600">
            ⚠️ Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa.
          </Text>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default ManageTDPPage;