import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import { useAuthStore } from "../../store";

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const extractToken = (data) =>
    data?.accessToken || data?.token || data?.jwt || null;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const token = extractToken(data);
      if (!token) throw new Error("Không nhận được token từ máy chủ.");

      useAuthStore.getState().login({ token, user: null });
      const me = await api.get("/api/users/me").then((r) => r.data);

      loginStore({ token, user: me });
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) setErr("Sai email hoặc mật khẩu.");
      else
        setErr(
          typeof error?.response?.data === "string"
            ? error.response.data
            : "Login failed"
        );
      try {
        useAuthStore.getState().logout();
      } catch {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-700 px-4">
      {/* card login */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Đăng nhập
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Chào mừng trở lại 👋
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              className="w-full bg-gray-100 text-gray-800 border border-gray-300 px-3 py-2 rounded-lg 
                       focus:ring-2 focus:ring-indigo-400 outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="username"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full bg-gray-100 text-gray-800 border border-gray-300 px-3 py-2 rounded-lg 
                       focus:ring-2 focus:ring-indigo-400 outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
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
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
