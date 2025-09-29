// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", form);
      // ✅ sau khi đăng ký xong điều hướng về login
      navigate("/login");
    } catch (error) {
      setErr(
        typeof error?.response?.data === "string"
          ? error.response.data
          : "Đăng ký thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-700">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Đăng ký
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Tạo tài khoản mới để bắt đầu 🚀
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Họ và tên</label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          {err && <p className="text-red-500 text-sm">{String(err)}</p>}

          <button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2 
                       rounded-lg hover:opacity-90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-500">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-indigo-500 font-medium hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
