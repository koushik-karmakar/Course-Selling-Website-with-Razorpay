import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiStar,
  FiCode,
} from "react-icons/fi";
import axios from "axios";
import { useAlert } from "../components/Alert.jsx";
import { useAuth } from "../context/AuthContext.jsx";
const SignIn = () => {
  const { AlertComponent, showAlert } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignin = async () => {
    try {
      setIsLoading(true);

      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const response = await axios.post(
        `${backend}/api/users/login`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim(),
        },
        {
          withCredentials: true,
        },
      );

      console.log(response.data);
      showAlert({
        type: "success",
        title: "Signin Successful",
        message: response.data.message || "Login successful",
        showRedirect: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
      const user = JSON.stringify(response.data.user);
      localStorage.setItem("code-master-user", user);
      setFormData({
        email: "",
        password: "",
        termsAgreed: false,
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Signin Failed",
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        showAlert({
          type: "success",
          title: "Signin Successful",
          message: result.message,
          showRedirect: false,
        });
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 100);
      } else {
        console.error("Login failed:", result.message);
        showAlert({
          type: "error",
          title: "Signin Failed",
          message: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert({
        type: "error",
        title: "Signin Failed",
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <>
      <AlertComponent />
      <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-linear-to-br from-gray-900 via-gray-900 to-blue-900/20 bg-fixed">
        <div className="absolute inset-0 bg-linear-to-br  from-gray-900 via-gray-900 to-blue-900/20"></div>

        <div className="container mx-auto px-6 py-4 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors group"
          >
            <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-xl">
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-8">
                Sign in to{" "}
                <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CodeMaster
                </span>
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                      placeholder="developer@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-gray-600 rounded-md peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200 flex items-center justify-center">
                        {formData.rememberMe && (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300 font-medium">
                      Remember me
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className=" cursor-pointer w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isLoading ? "Signing In..." : "Sign In"}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-gray-800/40 text-gray-400 text-sm font-semibold tracking-wide">
                      OR
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className=" cursor-pointer w-full flex items-center justify-center space-x-3 p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-blue-500 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-semibold">Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                    className="cursor-pointer w-full flex items-center justify-center space-x-3 p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-blue-600 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-semibold">Sign up with Facebook</span>
                  </button>
                </div>

                <div className="text-center pt-6">
                  <p className="text-gray-400">
                    Don't have an Account?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors relative group"
                    >
                      Sign Up
                      <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
