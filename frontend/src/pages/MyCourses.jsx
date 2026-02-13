import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlay,
  FiClock,
  FiCheckCircle,
  FiStar,
  FiBarChart2,
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiShoppingBag,
  FiBookOpen,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { useAlert } from "../components/Alert";
import { coursesData } from "../data/coursesData.jsx";
import axios from "axios";
const MyCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { AlertComponent, showAlert } = useAlert();
  const [purchasedCourses, setPurchasedCourses] = useState([]);

  // const [suggestedCourses, setSuggestedCourses] = useState([
  //   {
  //     id: 4,
  //     title: "Full Stack Web Development",
  //     instructor: "Michael Chen",
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=225&fit=crop",
  //     price: "$89.99",
  //     originalPrice: "$129.99",
  //     rating: 4.9,
  //     students: 2450,
  //     duration: "52h",
  //     category: "Web Development",
  //     discount: 30,
  //   },
  //   {
  //     id: 5,
  //     title: "Mobile App Development with Flutter",
  //     instructor: "Sarah Williams",
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop",
  //     price: "$74.99",
  //     originalPrice: "$99.99",
  //     rating: 4.8,
  //     students: 1870,
  //     duration: "38h",
  //     category: "Mobile",
  //     discount: 25,
  //   },
  //   {
  //     id: 6,
  //     title: "AWS Certified Solutions Architect",
  //     instructor: "David Lee",
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop",
  //     price: "$99.99",
  //     originalPrice: "$149.99",
  //     rating: 4.7,
  //     students: 3120,
  //     duration: "42h",
  //     category: "Cloud",
  //     discount: 33,
  //   },
  //   {
  //     id: 7,
  //     title: "UI/UX Design Fundamentals",
  //     instructor: "Emma Wilson",
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
  //     price: "$59.99",
  //     originalPrice: "$79.99",
  //     rating: 4.6,
  //     students: 1560,
  //     duration: "24h",
  //     category: "Design",
  //     discount: 25,
  //   },
  // ]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    "All",
    "Web Development",
    "Frontend",
    "Backend",
    "Data Science",
    "Mobile",
    "Cloud",
    "Design",
  ];

  const fetchCourses = async () => {
    try {
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const userResponse = await axios.get(
        `${backend}/api/users/verify_buy_course`,
        {
          withCredentials: true,
        },
      );
      const purchasedIds = userResponse?.data?.courseIds || [];
      const purchasedCourses = coursesData.filter((course) =>
        purchasedIds.includes(course.id),
      );
      setPurchasedCourses(purchasedCourses);
      console.log(purchasedCourses);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to initialize payment";

      showAlert({
        type: "error",
        title: "Payment Error",
        message: errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleContinueLearning = (courseTitle) => {
    navigate(`/learn/${courseTitle}`);
  };

  const handleBuyCourse = (courseId) => {
    navigate(`/course/${courseId}/checkout`);
  };

  const filteredPurchasedCourses = purchasedCourses.filter(
    (course) =>
      (selectedCategory === "All" || course.category === selectedCategory) &&
      (searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // if (loading) {
  //   return (
  //     <div className="min-h-screen dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900 transition-colors duration-300 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-gray-400">Loading your courses...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <AlertComponent />
      <div className="relative dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900 transition-colors duration-300 bg-fixed">
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-900 to-blue-900/20"></div>

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Link
                  to="/"
                  className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors group shrink-0"
                >
                  <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium hidden sm:inline">
                    Back to Home
                  </span>
                  <span className="text-sm font-medium sm:hidden">Back</span>
                </Link>
                <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                  My{" "}
                  <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Courses
                  </span>
                </h1>
              </div>

              <div className="w-full sm:w-auto">
                <div className="relative max-w-md sm:max-w-xs mx-auto sm:mx-0">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1">
                      Total Courses
                    </p>
                    <p className="text-xl sm:text-3xl font-bold text-white">
                      {purchasedCourses.length}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FiBookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1">
                      In Progress
                    </p>
                    <p className="text-xl sm:text-3xl font-bold text-white">
                      {
                        purchasedCourses.filter(
                          (course) =>
                            course.progress > 0 && course.progress < 100,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FiBarChart2 className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1">
                      Completed
                    </p>
                    <p className="text-xl sm:text-3xl font-bold text-white">
                      {
                        purchasedCourses.filter(
                          (course) => course.progress === 100,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <FiCheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1">
                      Avg Progress
                    </p>
                    <p className="text-xl sm:text-3xl font-bold text-white">
                      {Math.round(
                        purchasedCourses.reduce(
                          (acc, course) => acc + course.progress,
                          0,
                        ) / purchasedCourses.length || 0,
                      )}
                      %
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <FiStar className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="hidden sm:block bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-10 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
              Your Learning Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-white mb-4">
                  Progress Over Time
                </h4>
                <div className="space-y-3">
                  {purchasedCourses.map((course) => (
                    <div key={course.id} className="flex items-center">
                      <div className="w-32 text-sm text-gray-400 truncate mr-4">
                        {course.title}
                      </div>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-right text-sm font-medium text-white ml-4">
                        {course.progress}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-white mb-4">
                  Time Spent Learning
                </h4>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                    42h
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Total learning time
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">This week</span>
                      <span className="text-white font-medium">8h 30m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">This month</span>
                      <span className="text-white font-medium">32h 15m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-white mb-4">
                  Achievements
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center p-3 bg-gray-700/30 rounded-xl">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                      <FiStar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">
                        Fast Learner
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Complete 3 courses in one month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-700/30 rounded-xl">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                      <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">
                        Consistent Learner
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        10 consecutive days of learning
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" />
                <span className="text-sm sm:text-base font-medium text-gray-300">
                  Filter by Category
                </span>
              </div>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden text-gray-400 hover:text-white"
              >
                {showMobileFilters ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="hidden sm:flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div
              className={`sm:hidden ${showMobileFilters ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedCategory === category
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:hidden mt-3">
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full">
                {selectedCategory}
              </span>
            </div>
          </div> */}

          <div className="mb-10 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                My Learning Journey
              </h2>
              <span className="text-gray-400 text-sm sm:text-base">
                {filteredPurchasedCourses.length} course
                {filteredPurchasedCourses.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredPurchasedCourses.length === 0 ? (
              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <FiBookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6">
                  {selectedCategory !== "All"
                    ? `You don't have any courses in ${selectedCategory}. Explore our suggested courses below!`
                    : "You haven't purchased any courses yet. Start your learning journey today!"}
                </p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all text-sm sm:text-base"
                >
                  <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredPurchasedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group flex flex-col"
                  >
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        {/* <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/80 backdrop-blur-sm text-white rounded-full">
                          {course.category}
                        </span> */}
                      </div>
                      <div className="absolute top-4 right-4 flex items-center px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                        <FiStar className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-xs font-medium text-white">
                          {course.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-4 sm:p-5 flex flex-col">
                      <div className="mb-3 flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          By {course.instructor}
                        </p>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="font-medium text-white">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 mr-1.5" />
                            <span>{course.duration}</span>
                          </div>
                          {/* <div className="flex items-center">
                            <FiCheckCircle className="w-4 h-4 mr-1.5" />
                            <span>
                              {course.completedLessons}/{course.totalLessons}
                            </span>
                          </div> */}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleContinueLearning(course.url)}
                          className="cursor-pointer w-full py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center group text-sm"
                        >
                          <FiPlay className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          {course.progress === 0
                            ? "Start Learning"
                            : "Continue"}
                        </button>
                        {/* <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Last accessed: {course.lastAccessed}</span>
                          <button
                            onClick={() => handleCourseClick(course.id)}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                          >
                            Details →
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Continue Your Learning Journey
              </h2>
              <Link
                to="/courses"
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center group text-sm sm:text-base"
              >
                View all courses
                <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {suggestedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {course.discount && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {course.discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full mb-2">
                      {course.category}
                    </span>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors min-h-10">
                      {course.title}
                    </h3>

                    <p className="text-gray-400 text-xs sm:text-sm mb-3">
                      By {course.instructor}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex items-center text-yellow-400 mr-3">
                          <FiStar className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                          <span className="ml-1 text-xs sm:text-sm font-medium">
                            {course.rating}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {course.students > 1000
                            ? `${(course.students / 1000).toFixed(1)}k`
                            : course.students}
                        </div>
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm flex items-center">
                        <FiClock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {course.duration}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg sm:text-xl font-bold text-white">
                          {course.price}
                        </span>
                        {course.originalPrice && (
                          <span className="text-gray-500 text-xs sm:text-sm line-through ml-2">
                            {course.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyCourse(course.id)}
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center group text-sm sm:text-base"
                    >
                      <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default MyCourses;
