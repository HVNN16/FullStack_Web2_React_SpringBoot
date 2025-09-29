import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";

export default function CompanyList() {
  const [page, setPage] = useState({
    content: [],
    totalElements: 0,
    number: 0,
    size: 20,
  });
  const [loading, setLoading] = useState(true);
  const isAdmin = useAuthStore((s) => s.hasRole("ADMIN"));

  const fetchData = async (p = 0) => {
    const { data } = await api.get("/api/companies", {
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
    if (!confirm("Xoá công ty này?")) return;
    await api.delete(`/api/companies/${id}`);
    await fetchData(page.number);
  };

  if (loading)
    return (
      <p className="p-4 text-center text-gray-200">Đang tải dữ liệu...</p>
    );

  return (
    <div className="flex items-center justify-center p-6 min-h-screen">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Danh sách Công Ty
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 border border-indigo-500">ID</th>
                <th className="px-4 py-3 border border-indigo-500">Tên</th>
                <th className="px-4 py-3 border border-indigo-500">Địa chỉ</th>
                {isAdmin && (
                  <th className="px-4 py-3 border border-indigo-500 text-center">
                    Thao tác
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {page.content.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-indigo-900/40 transition-colors"
                >
                  <td className="px-4 py-3 border border-gray-700 text-gray-200">
                    {c.id}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 font-medium text-white">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">
                    {c.address}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 border border-gray-700 text-center space-x-3">
                      <Link
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                        to={`/companies/edit/${c.id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                        onClick={() => onDelete(c.id)}
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
                    className="px-4 py-4 border border-gray-700 text-center text-gray-400"
                    colSpan={isAdmin ? 4 : 3}
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
