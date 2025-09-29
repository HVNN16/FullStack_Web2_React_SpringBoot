// src/store/index.js
import { create } from "zustand";

const KEY = "web2_auth";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch { return { token: null, user: null }; }
}

const norm = (r) => (r?.startsWith("ROLE_") ? r.slice(5) : r);

export const useAuthStore = create((set, get) => ({
  token: load().token,
  user: load().user, // { id, name, email, role }
  login: ({ token, user }) => {
    localStorage.setItem(KEY, JSON.stringify({ token, user }));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem(KEY);
    set({ token: null, user: null });
  },
  isAuthenticated: () => !!get().token,
  hasRole: (role) => {
    const u = get().user;
    if (!u?.role) return false;
    const wants = Array.isArray(role) ? role.map(norm) : [norm(role)];
    return wants.includes(norm(u.role));
  },
}));
