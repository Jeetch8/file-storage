import React, { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/global/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/global/Sidebar";

const HomeLayout = () => {
  return (
    <AuthProvider>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </AuthProvider>
  );
};

export default HomeLayout;
