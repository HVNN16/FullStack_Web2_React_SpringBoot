import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "ROLE_USER",
    password: "",
    companyId: "",
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // ✅ Lấy thông tin user
        const { data } = await api.get(`/api/users/${id}`);
        setForm({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "ROLE_USER",
          password: "",
          companyId: data.company?.id || "",
        });

        // ✅ Lấy danh sách công ty
        const res = await api.get("/api/companies");
        const list = Array.isArray(res.data) ? res.data : res.data.content || [];
        setCompanies(list);
      } catch (e) {
        console.error("Load data failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        company: form.companyId ? { id: form.companyId } : null,
      };
      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }

      // ✅ Update user
      await api.put(`/api/users/${id}`, payload);
      nav("/users");
    } catch (error) {
      setErr(error?.response?.data || "Update failed");
    }
  };

  if (loading)
    return <p className="p-4 text-center text-gray-200">Đang tải dữ liệu...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-700 p-6 flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#0f172a] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Chỉnh sửa người dùng
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <Field
            label="Tên"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Field
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Vai trò
            </label>
            <select
              className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-[#1e293b] text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="ROLE_USER">ROLE_USER</option>
              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            </select>
          </div>

          <Field
            type="password"
            label="Mật khẩu mới (tùy chọn)"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required={false}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Công ty
            </label>
            <select
              className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-[#1e293b] text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
              required
            >
              <option value="">-- Chọn công ty --</option>
              {Array.isArray(companies) &&
                companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {err && (
            <p className="text-red-500 text-sm bg-red-500/20 px-3 py-2 rounded-lg">
              {String(err)}
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-500 text-gray-200 hover:bg-gray-700 transition"
              onClick={() => nav("/users")}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = true }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-[#1e293b] text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
