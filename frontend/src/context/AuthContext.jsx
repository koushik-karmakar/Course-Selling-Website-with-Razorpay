import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("code-master-user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);

          const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
          const response = await axios.post(`${backend}/api/users/verify`, {
            email: userData.email,
          });

          if (response.data.exists) {
            setUser(userData);
          } else {
            localStorage.removeItem("code-master-user");
            setUser(null);
          }
        } catch (error) {
          console.error("Auth verification failed:", error);
          localStorage.removeItem("code-master-user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const response = await axios.post(`${backend}/api/users/login`, {
        email,
        password,
      });
      if (!response.data) {
        return {
          success: false,
          message: "Login failed",
        };
      }
      localStorage.setItem(
        "code-master-user",
        JSON.stringify(response.data.user),
      );
      setUser(response.data.user);
      return {
        success: true,
        message: response.data.message,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("code-master-user");
    setUser(null);
  };

  const signup = async (userData) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const response = await axios.post(
        `${backend}/api/users/register`,
        userData,
      );

      localStorage.setItem(
        "code-master-user",
        JSON.stringify(response.data.user),
      );
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
