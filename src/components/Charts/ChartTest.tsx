/**
 * Simple test component to verify Recharts installation and basic rendering
 */
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for testing
const lineData = [
  { name: '周一', calories: 1800 },
  { name: '周二', calories: 2100 },
  { name: '周三', calories: 1950 },
  { name: '周四', calories: 2200 },
  { name: '周五', calories: 1900 },
  { name: '周六', calories: 2300 },
  { name: '周日', calories: 2000 },
];

const pieData = [
  { name: '早餐', value: 500, color: '#FF9800' },
  { name: '午餐', value: 800, color: '#FFC107' },
  { name: '晚餐', value: 700, color: '#9C27B0' },
  { name: '加餐', value: 200, color: '#4CAF50' },
];

/**
 * Test component demonstrating basic chart rendering
 */
const ChartTest: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>图表库测试</h1>
      <p>验证 Recharts 安装和基本渲染功能</p>

      {/* Line Chart Test */}
      <div style={{ marginBottom: '3rem' }}>
        <h2>折线图测试</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#4CAF50"
              strokeWidth={2}
              name="卡路里"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart Test */}
      <div style={{ marginBottom: '3rem' }}>
        <h2>柱状图测试</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="calories" fill="#667eea" name="卡路里" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart Test */}
      <div style={{ marginBottom: '3rem' }}>
        <h2>饼图测试</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#2e7d32' }}>
          ✓ 如果您能看到上面的三个图表，说明 Recharts 已成功安装并正常工作！
        </p>
      </div>
    </div>
  );
};

export default ChartTest;
