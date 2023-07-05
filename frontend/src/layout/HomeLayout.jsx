import React, { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/global/Navbar";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
};

export default HomeLayout;
