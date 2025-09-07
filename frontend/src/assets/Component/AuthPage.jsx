import React, { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export default function AuthPage({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoading(false); // ✅ done checking
  }, []);

  const tokenAdder = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const tokenDelete = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, tokenAdder, tokenDelete, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
