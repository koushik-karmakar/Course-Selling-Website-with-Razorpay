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
      try {
        const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
        const { data } = await axios.get(`${backend}/api/users/me`, {
          withCredentials: true,
        });

        setUser(data.user);
        console.log(data.user);
      } catch (error) {
        setUser(null);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const response = await axios.post(
        `${backend}/api/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message,
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

  const logout = async () => {
    try {
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;

      await axios.post(
        `${backend}/api/users/logout`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("code-master-user");
      setUser(null);
      navigate("/");
    }
  };

  const signup = async (userData) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const response = await axios.post(
        `${backend}/api/users/register`,
        userData,
        {
          withCredentials: true,
        },
      );

      localStorage.setItem(
        "code-master-user",
        JSON.stringify(response.data.user),
      );
      // setUser(response.data.user);
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
