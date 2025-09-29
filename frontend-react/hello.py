import os

base_path = "src"

# Các folder cần thiết
folders = [
    "api",
    "pages/auth",
    "pages/user",
    "pages/company",
    "store"
]

# Nội dung file api.js
api_js = """import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Thêm token JWT vào header nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
"""

# Nội dung Register.jsx
register_jsx = """import { useState } from "react";
import api from "../../api/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      alert("Đăng ký thành công!");
      localStorage.setItem("token", res.data.accessToken);
    } catch (err) {
      alert("Lỗi đăng ký: " + err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng ký</h2>
      <input name="name" placeholder="Tên" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} />
      <button type="submit">Đăng ký</button>
    </form>
  );
}
"""

# Nội dung Login.jsx
login_jsx = """import { useState } from "react";
import api from "../../api/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      alert("Đăng nhập thành công!");
      localStorage.setItem("token", res.data.accessToken);
    } catch (err) {
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng nhập</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
"""

# Nội dung UserList.jsx
user_list_jsx = """import { useEffect, useState } from "react";
import api from "../../api/api";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>Danh sách Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
"""

# Nội dung CompanyList.jsx
company_list_jsx = """import { useEffect, useState } from "react";
import api from "../../api/api";

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get("/companies").then((res) => setCompanies(res.data));
  }, []);

  return (
    <div>
      <h2>Danh sách Companies</h2>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>{c.name} - {c.address}</li>
        ))}
      </ul>
    </div>
  );
}
"""

# Nội dung store/index.js
store_index = """import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {},
});
"""

# Danh sách file cần tạo
files = {
    "api/api.js": api_js,
    "pages/auth/Register.jsx": register_jsx,
    "pages/auth/Login.jsx": login_jsx,
    "pages/user/UserList.jsx": user_list_jsx,
    "pages/company/CompanyList.jsx": company_list_jsx,
    "store/index.js": store_index,
}

# Hàm tạo file
for folder in folders:
    os.makedirs(os.path.join(base_path, folder), exist_ok=True)

for file_path, content in files.items():
    full_path = os.path.join(base_path, file_path)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("✅ React files generated successfully!")
