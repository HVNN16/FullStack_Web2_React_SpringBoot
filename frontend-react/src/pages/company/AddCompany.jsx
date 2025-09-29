// src/pages/company/AddCompany.jsx
import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddCompany() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", address: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/api/companies", form);
      nav("/companies");
    } catch (error) {
      setErr(error?.response?.data || "Tạo công ty thất bại");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Thêm Công Ty
        </h1>

        <form onSubmit={submit} className="space-y-5">
          <Field
            label="Tên công ty"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Nhập tên công ty"
          />
          <Field
            label="Địa chỉ"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            placeholder="Nhập địa chỉ"
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
              Tạo mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
