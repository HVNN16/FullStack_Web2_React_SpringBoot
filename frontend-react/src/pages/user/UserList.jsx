import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";

export default function UserList() {
  const [page, setPage] = useState({
    content: [],
    totalElements: 0,
    number: 0,
    size: 20,
  });
  const [loading, setLoading] = useState(true);
  const isAdmin = useAuthStore((s) => s.hasRole("ADMIN"));

  const fetchData = async (p = 0) => {
    const { data } = await api.get("/api/users", {
      params: { page: p, size: page.size },
    });
    setPage(data);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchData(0);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Xoá user này?")) return;
    await api.delete(`/api/users/${id}`);
    await fetchData(page.number);
  };

  if (loading)
    return (
      <p className="p-4 text-center text-gray-200">Đang tải dữ liệu...</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-700 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Danh sách Người dùng
        </h1>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-gray-200">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Tên</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Công ty</th>
                {isAdmin && <th className="px-4 py-3 text-center">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {page.content.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{u.company?.name || "-"}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-center space-x-2">
                      <Link
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                        to={`/users/${u.id}/edit`}
                      >
                        Edit
                      </Link>
                      <button
                        className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                        onClick={() => onDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {page.content.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="px-4 py-4 text-center text-gray-400"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
