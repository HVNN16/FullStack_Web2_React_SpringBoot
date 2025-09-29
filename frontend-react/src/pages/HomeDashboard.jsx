import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function HomeDashboard() {
  const [stats, setStats] = useState({ users: 0, companies: 0 });

  useEffect(() => {
    (async () => {
      try {
        const usersRes = await api.get("/api/users");
        const companiesRes = await api.get("/api/companies");

        const totalUsers = usersRes.data.totalElements ?? usersRes.data.length;
        const totalCompanies =
          companiesRes.data.totalElements ?? companiesRes.data.length;

        setStats({
          users: totalUsers,
          companies: totalCompanies,
        });
      } catch (e) {
        console.error("Load stats failed", e);
      }
    })();
  }, []);

  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Companies", value: stats.companies },
  ];

  const COLORS = ["#6366f1", "#a855f7"];

  const barData = [
    { name: "Users", count: stats.users },
    { name: "Companies", count: stats.companies },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-12 p-6">
      {/* Lời chào */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          👋 Xin chào, Admin!
        </h1>
        <p className="text-gray-200 text-lg">
          Đây là bảng điều khiển thống kê & quản lý hệ thống.
        </p>
      </div>

      {/* Cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-[#0f172a] rounded-2xl p-6 shadow-lg text-center">
          <h2 className="text-xl font-bold text-indigo-400 mb-2">Tổng Users</h2>
          <p className="text-4xl font-extrabold text-white">{stats.users}</p>
        </div>
        <div className="bg-[#0f172a] rounded-2xl p-6 shadow-lg text-center">
          <h2 className="text-xl font-bold text-purple-400 mb-2">
            Tổng Companies
          </h2>
          <p className="text-4xl font-extrabold text-white">
            {stats.companies}
          </p>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        <div className="bg-[#0f172a] rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg text-gray-300 mb-4">Biểu đồ tròn</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0f172a] rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg text-gray-300 mb-4">Biểu đồ cột</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#e2e8f0" />
              <YAxis stroke="#e2e8f0" />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Menu điều hướng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link
          to="/users"
          className="bg-[#0f172a] hover:bg-[#1e293b] transition rounded-2xl shadow-lg p-8 flex flex-col items-center"
        >
          <div className="text-indigo-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5V4H2v16h5m10 0a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Quản lý Users</h2>
          <p className="text-gray-400 mt-2">
            Thêm, sửa, xóa và xem danh sách người dùng.
          </p>
        </Link>

        <Link
          to="/companies"
          className="bg-[#0f172a] hover:bg-[#1e293b] transition rounded-2xl shadow-lg p-8 flex flex-col items-center"
        >
          <div className="text-purple-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10c0 1.1.9 2 2 2h2v-4h10v4h2c1.1 0 2-.9 2-2V7l-8-5-8 5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Quản lý Companies</h2>
          <p className="text-gray-400 mt-2">
            Thêm, sửa, xóa và xem danh sách công ty.
          </p>
        </Link>
      </div>
    </div>
  );
}
