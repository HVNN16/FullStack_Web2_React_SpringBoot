// src/components/NavBar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

const norm = (r) => (r?.startsWith("ROLE_") ? r.slice(5) : r);

export default function NavBar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const hasRole = useAuthStore((s) => s.hasRole);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = hasRole("ADMIN");

  const linkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md border-b px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left menu */}
      <div className="flex items-center gap-4">
        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>
        <NavLink to="/users" className={linkStyle}>
          Users
        </NavLink>
        <NavLink to="/companies" className={linkStyle}>
          Companies
        </NavLink>
        {isAdmin && (
          <>
            <NavLink to="/users/add" className={linkStyle}>
              Add User
            </NavLink>
            <NavLink to="/companies/add" className={linkStyle}>
              Add Company
            </NavLink>
          </>
        )}
      </div>

      {/* Right user info */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-700">
              👤 <span className="font-medium">{user?.name || user?.email}</span>{" "}
              <span className="text-xs text-gray-500">
                ({norm(user?.role)})
              </span>
            </span>
            <button
              className="px-3 py-1 rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 transition"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link
              className="px-3 py-1 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="px-3 py-1 rounded-md text-sm font-medium text-indigo-600 border border-indigo-500 hover:bg-indigo-50 transition"
              to="/register"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
