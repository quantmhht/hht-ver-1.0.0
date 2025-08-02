// src/pages/Report/ReportStatsPage.tsx
import React, { useState, useEffect } from "react";
import { useStore } from "@store";
import { 
  Box, 
  Text, 
  Button, 
  Select, 
  Tabs,
  Tab,
  Icon 
} from "zmp-ui";
import PageLayout from "@components/layout/PageLayout";
import { formatDate } from "@utils/date-time";
import styled from "styled-components";
import tw from "twin.macro";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  ${tw`p-4 space-y-4`}
`;

const StatsGrid = styled.div`
  ${tw`grid grid-cols-2 gap-4 mb-6`}
`;

const StatCard = styled.div`
  ${tw`bg-white rounded-lg p-4 shadow-sm border`}
`;

const StatNumber = styled.div`
  ${tw`text-2xl font-bold text-blue-600`}
`;

const StatLabel = styled.div`
  ${tw`text-sm text-gray-600 mt-1`}
`;

const Card = styled.div`
  ${tw`bg-white rounded-lg p-4 shadow-sm border`}
`;

const FilterRow = styled.div`
  ${tw`flex gap-3 mb-4 items-center`}
`;

const ChartContainer = styled.div`
  ${tw`h-80 w-full`}
`;

const TableContainer = styled.div`
  ${tw`overflow-x-auto`}
`;

const Table = styled.table`
  ${tw`w-full border-collapse`}
`;

const Th = styled.th`
  ${tw`bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b`}
`;

const Td = styled.td`
  ${tw`px-4 py-3 text-sm border-b border-gray-200`}
`;

const StatusBadge = styled.span<{ status: string }>`
  ${tw`px-2 py-1 rounded-full text-xs font-medium`}
  ${({ status }) => {
    switch (status) {
      case "pending": return tw`bg-yellow-100 text-yellow-800`;
      case "in_progress": return tw`bg-blue-100 text-blue-800`;
      case "submitted": return tw`bg-green-100 text-green-800`;
      case "approved": return tw`bg-emerald-100 text-emerald-800`;
      case "rejected": return tw`bg-red-100 text-red-800`;
      case "overdue": return tw`bg-orange-100 text-orange-800`;
      default: return tw`bg-gray-100 text-gray-800`;
    }
  }}
`;

interface FilterOptions {
  year: number;
  month: number | null;
  quarter: number | null;
  tdpId: string | null;
}

const ReportStatsPage: React.FC = () => {
  const { 
    reportStats, 
    loadingStats,
    tdpList,
    getReportStats,
    getTDPList,
    getDetailedStats 
  } = useStore((state) => ({
    reportStats: state.reportStats,
    loadingStats: state.loadingStats,
    tdpList: state.tdpList,
    getReportStats: state.getReportStats,
    getTDPList: state.getTDPList,
    getDetailedStats: state.getDetailedStats,
  }));

  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState<FilterOptions>({
    year: new Date().getFullYear(),
    month: null,
    quarter: null,
    tdpId: null,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [tdpPerformance, setTdpPerformance] = useState<any[]>([]);

  useEffect(() => {
    getTDPList();
    loadStats();
  }, []);

  useEffect(() => {
    loadStats();
  }, [filters]);

  const loadStats = async () => {
    await getReportStats(filters);
    await loadChartData();
    await loadTDPPerformance();
  };

  const loadChartData = async () => {
    // Mock data - in real app, this would come from Firebase
    const monthlyData = [
      { month: "T1", submitted: 12, approved: 10, rejected: 2, overdue: 1 },
      { month: "T2", submitted: 15, approved: 13, rejected: 2, overdue: 2 },
      { month: "T3", submitted: 18, approved: 16, rejected: 1, overdue: 1 },
      { month: "T4", submitted: 14, approved: 12, rejected: 2, overdue: 3 },
      { month: "T5", submitted: 16, approved: 14, rejected: 1, overdue: 2 },
      { month: "T6", submitted: 20, approved: 18, rejected: 2, overdue: 1 },
    ];
    setChartData(monthlyData);
  };

  const loadTDPPerformance = async () => {
    // Mock data - in real app, this would come from Firebase
    const performanceData = [
      { 
        tdpName: "TDP 1", 
        total: 24, 
        completed: 22, 
        onTime: 20, 
        late: 2, 
        overdue: 2,
        completionRate: 91.7,
        onTimeRate: 83.3 
      },
      { 
        tdpName: "TDP 2", 
        total: 20, 
        completed: 18, 
        onTime: 16, 
        late: 2, 
        overdue: 2,
        completionRate: 90.0,
        onTimeRate: 80.0 
      },
      { 
        tdpName: "TDP 3", 
        total: 22, 
        completed: 20, 
        onTime: 19, 
        late: 1, 
        overdue: 2,
        completionRate: 90.9,
        onTimeRate: 86.4 
      },
    ];
    setTdpPerformance(performanceData);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const pieChartData = [
    { name: "Đã duyệt", value: reportStats?.approved || 0, color: "#10B981" },
    { name: "Chờ duyệt", value: reportStats?.submitted || 0, color: "#3B82F6" },
    { name: "Đang thực hiện", value: reportStats?.inProgress || 0, color: "#F59E0B" },
    { name: "Quá hạn", value: reportStats?.overdue || 0, color: "#EF4444" },
    { name: "Từ chối", value: reportStats?.rejected || 0, color: "#6B7280" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "Tháng 1" }, { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" }, { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" }, { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" }, { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" }, { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" }, { value: 12, label: "Tháng 12" },
  ];
  const quarters = [
    { value: 1, label: "Quý 1" }, { value: 2, label: "Quý 2" },
    { value: 3, label: "Quý 3" }, { value: 4, label: "Quý 4" },
  ];

  return (
    <PageLayout title="Thống kê báo cáo" showBackIcon>
      <Container>
        {/* Filters */}
        <Card>
          <Text className="text-lg font-semibold mb-4">Bộ lọc</Text>
          <FilterRow>
            <Select
              value={filters.year}
              onChange={(value) => handleFilterChange("year", value)}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>

            <Select
              value={filters.month || ""}
              onChange={(value) => handleFilterChange("month", value || null)}
            >
              <option value="">Tất cả tháng</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>

            <Select
              value={filters.quarter || ""}
              onChange={(value) => handleFilterChange("quarter", value || null)}
            >
              <option value="">Tất cả quý</option>
              {quarters.map(quarter => (
                <option key={quarter.value} value={quarter.value}>
                  {quarter.label}
                </option>
              ))}
            </Select>

            <Select
              value={filters.tdpId || ""}
              onChange={(value) => handleFilterChange("tdpId", value || null)}
            >
              <option value="">Tất cả TDP</option>
              {tdpList.map(tdp => (
                <option key={tdp.id} value={tdp.id}>
                  {tdp.name}
                </option>
              ))}
            </Select>
          </FilterRow>
        </Card>

        {/* Tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tab key="overview" label="Tổng quan">
            {/* Overview Stats */}
            <StatsGrid>
              <StatCard>
                <StatNumber>{reportStats?.total || 0}</StatNumber>
                <StatLabel>Tổng báo cáo</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{reportStats?.approved || 0}</StatNumber>
                <StatLabel>Đã duyệt</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{reportStats?.pending || 0}</StatNumber>
                <StatLabel>Chờ xử lý</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber className="text-red-600">{reportStats?.overdue || 0}</StatNumber>
                <StatLabel>Quá hạn</StatLabel>
              </StatCard>
            </StatsGrid>

            {/* Pie Chart */}
            <Card>
              <Text className="text-lg font-semibold mb-4">Phân bố trạng thái</Text>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            {/* Monthly Trend */}
            <Card>
              <Text className="text-lg font-semibold mb-4">Xu hướng theo tháng</Text>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="submitted" stroke="#3B82F6" name="Đã nộp" />
                    <Line type="monotone" dataKey="approved" stroke="#10B981" name="Đã duyệt" />
                    <Line type="monotone" dataKey="overdue" stroke="#EF4444" name="Quá hạn" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>
          </Tab>

          <Tab key="performance" label="Hiệu suất TDP">
            {/* TDP Performance Chart */}
            <Card>
              <Text className="text-lg font-semibold mb-4">Tỷ lệ hoàn thành theo TDP</Text>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tdpPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tdpName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completionRate" fill="#3B82F6" name="Tỷ lệ hoàn thành (%)" />
                    <Bar dataKey="onTimeRate" fill="#10B981" name="Tỷ lệ đúng hạn (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            {/* TDP Performance Table */}
            <Card>
              <Text className="text-lg font-semibold mb-4">Chi tiết hiệu suất TDP</Text>
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>TDP</Th>
                      <Th>Tổng số</Th>
                      <Th>Hoàn thành</Th>
                      <Th>Đúng hạn</Th>
                      <Th>Trễ hạn</Th>
                      <Th>Quá hạn</Th>
                      <Th>Tỷ lệ hoàn thành</Th>
                      <Th>Tỷ lệ đúng hạn</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {tdpPerformance.map((tdp, index) => (
                      <tr key={index}>
                        <Td className="font-medium">{tdp.tdpName}</Td>
                        <Td>{tdp.total}</Td>
                        <Td>{tdp.completed}</Td>
                        <Td>{tdp.onTime}</Td>
                        <Td>{tdp.late}</Td>
                        <Td className="text-red-600">{tdp.overdue}</Td>
                        <Td>
                          <span className={`font-medium ${
                            tdp.completionRate >= 90 ? 'text-green-600' :
                            tdp.completionRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {tdp.completionRate.toFixed(1)}%
                          </span>
                        </Td>
                        <Td>
                          <span className={`font-medium ${
                            tdp.onTimeRate >= 90 ? 'text-green-600' :
                            tdp.onTimeRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {tdp.onTimeRate.toFixed(1)}%
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </Card>
          </Tab>

          <Tab key="reports" label="Báo cáo chi tiết">
            {/* Recent Reports */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <Text className="text-lg font-semibold">Báo cáo gần đây</Text>
                <Button size="small" variant="tertiary">
                  <Icon icon="zi-download" /> Xuất Excel
                </Button>
              </div>
              
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>Tiêu đề</Th>
                      <Th>TDP</Th>
                      <Th>Hạn nộp</Th>
                      <Th>Trạng thái</Th>
                      <Th>Ngày nộp</Th>
                      <Th>Độ ưu tiên</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock data - replace with real data */}
                    {[
                      {
                        title: "Báo cáo tình hình an ninh tháng 6",
                        tdp: "TDP 1",
                        dueDate: "2024-06-30",
                        status: "approved",
                        submittedDate: "2024-06-28",
                        priority: "high"
                      },
                      {
                        title: "Báo cáo hoạt động văn hóa Q2",
                        tdp: "TDP 2", 
                        dueDate: "2024-07-05",
                        status: "submitted",
                        submittedDate: "2024-07-03",
                        priority: "medium"
                      },
                      {
                        title: "Khảo sát ý kiến cư dân",
                        tdp: "TDP 3",
                        dueDate: "2024-07-10",
                        status: "overdue",
                        submittedDate: null,
                        priority: "low"
                      }
                    ].map((report, index) => (
                      <tr key={index}>
                        <Td className="font-medium">{report.title}</Td>
                        <Td>{report.tdp}</Td>
                        <Td>{formatDate(new Date(report.dueDate))}</Td>
                        <Td>
                          <StatusBadge status={report.status}>
                            {report.status === "approved" ? "Đã duyệt" :
                             report.status === "submitted" ? "Chờ duyệt" :
                             report.status === "overdue" ? "Quá hạn" : report.status}
                          </StatusBadge>
                        </Td>
                        <Td>
                          {report.submittedDate ? 
                            formatDate(new Date(report.submittedDate)) : 
                            "-"
                          }
                        </Td>
                        <Td>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            report.priority === "high" ? "bg-red-100 text-red-800" :
                            report.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {report.priority === "high" ? "Cao" :
                             report.priority === "medium" ? "Trung bình" : "Thấp"}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </PageLayout>
  );
};

export default ReportStatsPage;