import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCompany() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/companies/${id}`);
        setForm({ name: data.name || "", address: data.address || "" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.put(`/api/companies/${id}`, form);
      nav("/companies");
    } catch (error) {
      setErr(error?.response?.data || "Update failed");
    }
  };

  if (loading)
    return <p className="p-4 text-center text-gray-200">Đang tải dữ liệu...</p>;

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Chỉnh sửa Công Ty
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <Field
            label="Tên công ty"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Field
            label="Địa chỉ"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />

          {err && (
            <p className="text-red-400 text-sm text-center bg-red-500/20 py-2 rounded-lg">
              {String(err)}
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-500 text-gray-200 hover:bg-gray-700 transition"
              onClick={() => nav("/companies")}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
