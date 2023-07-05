import { createContext, useState, useContext, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { redirect, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const { doFetch } = useFetch({
    url: base_url + "/user/me",
    authorized: true,
    method: "GET",
    onSuccess: (data) => {
      setCurrentUser(data.user);
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 4000,
      });
      localStorage.clear();
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
  });

  useEffect(() => {
    doFetch();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};
