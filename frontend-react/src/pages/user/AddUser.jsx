// src/pages/user/AddUser.jsx
import { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "ROLE_USER",
    password: "",
    companyId: "",
  });
  const [err, setErr] = useState("");
  const [companies, setCompanies] = useState([]);

  // Lấy danh sách công ty
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/companies");
        const list = Array.isArray(data) ? data : data.content || [];
        setCompanies(list);
      } catch (e) {
        console.error("Load companies failed", e);
        setCompanies([]);
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.password || form.password.trim() === "") {
      setErr("Password is required");
      return;
    }

    try {
      await api.post("/api/users", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        company: form.companyId ? { id: form.companyId } : null,
      });
      nav("/users");
    } catch (error) {
      setErr(error?.response?.data || "Create failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-700 p-6">
      {/* form container */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Thêm Người Dùng
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <Field
            label="Tên"
            placeholder="Nhập tên người dùng"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Field
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Vai trò
            </label>
            <select
              className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-white/20 text-white 
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option className="bg-[#1e1e2f] text-white" value="ROLE_USER">
                ROLE_USER
              </option>
              <option className="bg-[#1e1e2f] text-white" value="ROLE_ADMIN">
                ROLE_ADMIN
              </option>
            </select>
          </div>

          <Field
            type="password"
            label="Mật khẩu"
            placeholder="••••••••"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Công ty
            </label>
            <select
              className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-white/20 text-white 
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none"
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            >
              <option className="bg-[#1e1e2f] text-white" value="">
                -- Chọn công ty --
              </option>
              {Array.isArray(companies) &&
                companies.map((c) => (
                  <option
                    key={c.id}
                    className="bg-[#1e1e2f] text-white"
                    value={c.id}
                  >
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {err && (
            <p className="text-red-400 text-sm text-center bg-red-500/20 py-2 rounded-lg">
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-600 rounded-lg px-3 py-2 
                   bg-white/20 text-white placeholder-gray-400 
                   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
