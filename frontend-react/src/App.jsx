import React from "react";import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/NavBar";
import { Protected, RequireRole } from "./components/Protected";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import UserList from "./pages/user/UserList";
import AddUser from "./pages/user/AddUser";
import EditUser from "./pages/user/EditUser";

import CompanyList from "./pages/company/CompanyList";
import AddCompany from "./pages/company/AddCompany";
import EditCompany from "./pages/company/EditCompany";

import HomeDashboard from "./pages/HomeDashboard";
// 👉 Layout có Navbar
function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth (không Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home */}
        <Route element={<LayoutWithNavbar />}>
  <Route
    path="/"
    element={
      <Protected>
        <HomeDashboard />
      </Protected>
    }
  />

          {/* Users */}
          <Route
            path="/users"
            element={
              <Protected>
                <UserList />
              </Protected>
            }
          />
          <Route
            path="/users/add"
            element={
              <Protected>
                <RequireRole role="ADMIN">
                  <AddUser />
                </RequireRole>
              </Protected>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <Protected>
                <RequireRole role="ADMIN">
                  <EditUser />
                </RequireRole>
              </Protected>
            }
          />

          {/* Companies */}
          <Route
            path="/companies"
            element={
              <Protected>
                <CompanyList />
              </Protected>
            }
          />
          <Route
            path="/companies/add"
            element={
              <Protected>
                <RequireRole role="ADMIN">
                  <AddCompany />
                </RequireRole>
              </Protected>
            }
          />
          <Route
            path="/companies/edit/:id"
            element={
              <Protected>
                <RequireRole role="ADMIN">
                  <EditCompany />
                </RequireRole>
              </Protected>
            }
          />
        </Route>

        {/* Not found */}
        <Route path="*" element={<div className="p-4">Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
