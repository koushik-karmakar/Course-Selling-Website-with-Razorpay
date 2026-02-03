import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Code2,
  User,
  LogOut,
  Settings,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const dropdownRef = useRef(null);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Courses", href: "#courses" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const getUserInitials = () => {
    if (!user) return "";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {loading ? (
        <nav className="sticky top-0 z-50 w-full dark:bg-gray-900/95 bg-white/95 backdrop-blur-sm border-b dark:border-gray-800 border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  CodeMaster
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <div className="h-10 w-24 bg-gray-700/20 rounded-lg animate-pulse"></div>
                <div className="h-10 w-32 bg-linear-to-r from-blue-500/20 to-purple-600/20 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav
          id="navbar"
          className="sticky top-0 z-50 w-full dark:bg-gray-900/95 bg-white/95 backdrop-blur-sm border-b dark:border-gray-800 border-gray-200"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  CodeMaster
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="dark:text-gray-300 text-gray-700 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                {!user ? (
                  <Link
                    to="/signin"
                    className="cursor-pointer px-6 py-2 rounded-lg font-medium border dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    Sign In
                  </Link>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className=" cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg dark:bg-gray-800/50 bg-gray-100/50 border dark:border-gray-700 border-gray-300 hover:border-blue-500 transition-all hover:shadow-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {getUserInitials()}
                      </div>
                      <span className="dark:text-gray-300 text-gray-700 font-medium">
                        {user.firstName || user.email?.split("@")[0] || "User"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 dark:text-gray-400 text-gray-600 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 dark:bg-gray-800/95 bg-white/95 backdrop-blur-lg border dark:border-gray-700 border-gray-300 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                        <div className="p-4 border-b dark:border-gray-700 border-gray-300">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                              {getUserInitials()}
                            </div>
                            <div>
                              <p className="font-semibold dark:text-white text-gray-800">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm dark:text-gray-400 text-gray-600 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            to="/profile"
                            className=" cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700/50 hover:bg-gray-100/50 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>My Profile</span>
                          </Link>

                          <Link
                            to="/my-courses"
                            className=" cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700/50 hover:bg-gray-100/50 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>My Courses</span>
                          </Link>

                          <Link
                            to="/settings"
                            className=" cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700/50 hover:bg-gray-100/50 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>

                          <div className="border-t dark:border-gray-700 border-gray-300 mt-2 pt-2">
                            <button
                              onClick={() => {
                                logout();
                                setUserDropdownOpen(false);
                              }}
                              className=" cursor-pointer w-full flex items-center space-x-3 px-3 py-2 rounded-lg dark:text-rose-400 text-rose-600 hover:dark:bg-rose-500/10 hover:bg-rose-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <a
                  href="#courses"
                  className="cursor-pointer px-6 py-2 rounded-lg font-medium bg-linear-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/25"
                >
                  Start Learning
                </a>
              </div>

              <button
                className="md:hidden dark:text-gray-300 text-gray-700"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {isOpen && (
              <div className="md:hidden bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-lg border-t dark:border-gray-800 border-gray-200 mt-1 rounded-b-xl shadow-2xl">
                <div className="px-4 py-3">
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2.5 rounded-lg dark:text-gray-300 text-gray-700 hover:text-blue-500 dark:hover:text-blue-400 hover:dark:bg-gray-800 hover:bg-gray-100 transition-colors font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t dark:border-gray-800 border-gray-200">
                    {!user ? (
                      <Link
                        to="/signin"
                        className="block w-full px-3 py-2.5 text-center rounded-lg font-medium border dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors mb-3"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3 px-3 py-2.5 mb-3 rounded-lg dark:bg-gray-800/50 bg-gray-100/50">
                          <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold dark:text-white text-gray-800 text-sm truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs dark:text-gray-400 text-gray-600 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <Link
                            to="/profile"
                            className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg border dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <User className="w-4 h-4 mb-1" />
                            <span className="text-xs font-medium">Profile</span>
                          </Link>

                          <Link
                            to="/my-courses"
                            className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg border dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <BookOpen className="w-4 h-4 mb-1" />
                            <span className="text-xs font-medium">Courses</span>
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <Link
                            to="/settings"
                            className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg border dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="w-4 h-4 mb-1" />
                            <span className="text-xs font-medium">
                              Settings
                            </span>
                          </Link>

                          <button
                            onClick={() => {
                              logout();
                              setIsOpen(false);
                            }}
                            className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-linear-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mb-1" />
                            <span className="text-xs font-medium">Logout</span>
                          </button>
                        </div>
                      </>
                    )}

                    <a
                      href="#courses"
                      className="block w-full px-3 py-3 text-center rounded-lg font-medium bg-linear-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Start Learning
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
