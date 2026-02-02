import React from "react";
import { Play, Clock, Download, Award, Star, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { coursesData } from "../data/coursesData";
import { useAlert } from "../components/Alert";
import axios from "axios";
const Courses = () => {
  const { AlertComponent, showAlert } = useAlert();
  const navigate = useNavigate();

  const [courses, setCourse] = useState(coursesData);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState([]);
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
      setPurchasedCourseIds(purchasedIds);
      console.log(purchasedIds);
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

  return (
    <section id="courses" className="pt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4">
            <span className="text-sm font-medium bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Courses
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Programming Courses Designed to Make You{" "}
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Job-Ready
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Each course is carefully structured from basics to advanced
            concepts, with practical examples and real-world projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group relative bg-linear-to-br dark:from-gray-800/50 dark:to-gray-900/50 from-white to-gray-50 rounded-2xl border dark:border-gray-700 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`h-2 bg-linear-to-r ${course.color}`}></div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-300 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-3 dark:text-white text-gray-900">
                  {course.title}
                </h3>
                <p className="dark:text-gray-400 text-gray-600 mb-6">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold dark:text-white text-gray-900">
                      {course.duration}
                    </div>
                    <div className="text-sm dark:text-gray-400 text-gray-600">
                      Content
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold dark:text-white text-gray-900">
                      {course.projects.length}+
                    </div>
                    <div className="text-sm dark:text-gray-400 text-gray-600">
                      Projects
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="dark:text-gray-300 text-gray-700 font-medium">
                      {course.rating}
                    </span>
                  </div>
                  <span className="dark:text-gray-400 text-gray-600 text-sm">
                    {course.students.toLocaleString()} students
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold dark:text-white text-gray-900">
                      {course.price}
                    </span>
                    <span className="line-through dark:text-gray-500 text-gray-400">
                      {course.originalPrice}
                    </span>
                    <span className="px-2 py-1 text-xs font-bold bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full">
                      SAVE 60%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    purchasedCourseIds.includes(course.id)
                      ? navigate(`/my-courses`)
                      : navigate(`/course/${course.url}`)
                  }
                  className={`cursor-pointer w-full py-3 rounded-xl font-semibold transition-all
                        ${
                          purchasedCourseIds.includes(course.id)
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-linear-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                        }
                      `}
                >
                  {purchasedCourseIds.includes(course.id) ? (
                    <span className="flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>Watch</span>
                    </span>
                  ) : (
                    "Enroll Now"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
