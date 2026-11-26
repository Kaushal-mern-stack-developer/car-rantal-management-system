import { createContext, useContext, useState } from "react";
import api from "../services/api.js";
import { getUser, saveUser, removeUser } from "../services/localStorage.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    saveUser(res.data);
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    saveUser(res.data);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    removeUser();
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
