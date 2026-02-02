import { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Lock,
  Clock,
  Users,
  Star,
  Check,
  BookOpen,
  Download,
  Award,
  ArrowLeft,
  Calendar,
  Video,
  FileText,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { coursesData } from "../data/coursesData.jsx";
import { useAlert } from "../components/Alert.jsx";
import axios from "axios";

const EnrollmentPage = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("overview");
  const [expandedSyllabus, setExpandedSyllabus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { AlertComponent, showAlert } = useAlert();

  const isUserLoggedIn = async () => {
    try {
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const { data } = await axios.get(`${backend}/api/users/me`, {
        withCredentials: true,
      });

      console.log(data);
      return data.user;
    } catch (err) {
      return null;
    }
  };

  const handleEnrollment = async () => {
    const user = await isUserLoggedIn();
    console.log(user);
    if (!user) {
      showAlert({
        type: "warning",
        title: "Login Required",
        message:
          "You need to log in to enroll in this course. Please sign in to continue.",
        showRedirect: true,
        redirectText: "Go to Login",
        redirectTo: "/signin",
        onRedirect: () => {
          navigate("/signin", {
            state: { from: `/course/${course.id}` },
          });
        },
      });
    } else {
      enrollUserInCourse();
    }
  };

  const enrollUserInCourse = async () => {
    setIsLoading(true);
    try {
      navigate(`/checkout/${course.url}`, {
        state: { course: course },
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Enrollment Failed",
        message:
          "There was an error processing your enrollment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const { slug } = useParams();
  const course = coursesData.find((c) => c.url === slug);

  const toggleSyllabus = (index) => {
    setExpandedSyllabus((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handlePurchase = () => {
    handleEnrollment();
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertComponent />
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-950 text-gray-100">
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/")}
                className="cursor-pointer flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Back to Courses</span>
              </button>

              <div className="flex items-center space-x-6">
                <div className="text-lg sm:text-2xl font-boldbg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  CodeMaster
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="block lg:hidden mb-6">
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-400 text-sm mb-4">{course.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-lg font-bold">{course.duration}</span>
                </div>
                <p className="text-xs text-gray-400">Duration</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-lg font-bold">{course.rating}</span>
                </div>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="relative rounded-xl overflow-hidden bg-black mb-6">
                <div className="relative aspect-video bg-linear-to-br from-gray-900 to-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-fullbg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                        </div>
                        <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20"></div>
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base">
                        Preview available after purchase
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                      <div className="px-3 py-2 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-sm rounded-lg">
                        <h2 className="text-lg sm:text-xl font-bold">
                          {course.title}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    disabled
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-fullbg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center opacity-50 cursor-not-allowed"
                  >
                    <Play className="w-5 h-5 sm:w-8 sm:h-8 ml-0.5 sm:ml-1 text-white" />
                  </button>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-bold">
                      {course.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Total Duration</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Video className="w-5 h-5 text-purple-400" />
                    <span className="text-2xl font-bold">120+</span>
                  </div>
                  <p className="text-sm text-gray-400">Video Lessons</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold">
                      {course.students.toLocaleString()}+
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Students</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold">{course.rating}</span>
                  </div>
                  <p className="text-sm text-gray-400">Course Rating</p>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 overflow-x-auto">
                  {["overview", "syllabus", "projects", "instructor"].map(
                    (section) => (
                      <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                        className={`flex-1 min-w-[80px] py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium capitalize transition-all text-sm sm:text-base ${
                          selectedSection === section
                            ? "bg-linear-to-r from-blue-500 to-purple-600 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {section}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {selectedSection === "overview" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                        Course Description
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {course.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                        What You'll Learn
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-0.5 sm:mt-1 shrink-0" />
                            <span className="text-sm sm:text-base">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                        Course Requirements
                      </h3>
                      <ul className="space-y-1 sm:space-y-2">
                        {course.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm sm:text-base">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedSection === "syllabus" && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                      Course Curriculum
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {course.syllabus.map((week, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700"
                        >
                          <button
                            onClick={() => toggleSyllabus(index)}
                            className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lgbg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="font-bold text-base sm:text-lg">
                                  {week.week}
                                </span>
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <h4 className="font-bold text-base sm:text-lg truncate">
                                  {week.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{week.duration}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{week.videos} videos</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            {expandedSyllabus.includes(index) ? (
                              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            )}
                          </button>

                          {expandedSyllabus.includes(index) && (
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                              <div className="pt-4 border-t border-gray-700">
                                <h5 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                                  Topics Covered:
                                </h5>
                                <ul className="space-y-1 sm:space-y-2">
                                  {week.topics.map((topic, topicIndex) => (
                                    <li
                                      key={topicIndex}
                                      className="flex items-start space-x-2 sm:space-x-3 text-gray-300 text-sm sm:text-base"
                                    >
                                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div>
                                      <span className="flex-1">{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSection === "projects" && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                      Hands-on Projects
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {course.projects.map((project, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/30 rounded-xl p-4 sm:p-6 border border-gray-700"
                        >
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lgbg-linear-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 truncate">
                                {project}
                              </h4>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                Build this real-world application to apply your
                                JavaScript skills
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSection === "instructor" && (
                  <div className="bg-gray-800/30 rounded-xl p-4 sm:p-6 border border-gray-700">
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-fullbg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                        <span className="text-xl sm:text-2xl font-bold">
                          JD
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-2xl font-bold truncate">
                          {course.instructor}
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base">
                          {course.instructorTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                          <span className="flex items-center space-x-1 text-xs sm:text-sm">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                            <span>{course.rating} Instructor Rating</span>
                          </span>
                          <span className="flex items-center space-x-1 text-xs sm:text-sm">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                            <span>
                              {course.totalRatings.toLocaleString()} Reviews
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      With over 10 years of experience in web development, John
                      has worked with top tech companies and helped thousands of
                      students become proficient developers. His teaching style
                      focuses on practical, real-world applications.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 sm:top-24">
                <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 overflow-hidden mb-6">
                  <div className="p-4 sm:p-6 border-b border-gray-700">
                    <div className="flex items-baseline flex-wrap gap-2 mb-2">
                      <span className="text-3xl sm:text-4xl font-bold">
                        {course.price}
                      </span>
                      <span className="line-through text-gray-400 text-lg sm:text-xl">
                        {course.originalPrice}
                      </span>
                      <span className="px-2 py-1 text-xs font-boldbg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full">
                        SAVE 60%
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                      One-time payment • Lifetime access
                    </p>

                    <button
                      onClick={handlePurchase}
                      disabled={isLoading}
                      className="cursor-pointer w-full py-3 mb-3 sm:mb-4 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed relative group"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm sm:text-base">
                            Processing...
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm sm:text-base">
                            Enroll Now
                          </span>
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      )}
                    </button>

                    <p className="text-center text-xs sm:text-sm text-gray-400">
                      30-Day Money-Back Guarantee
                    </p>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                      This course includes:
                    </h4>
                    <ul className="space-y-2 sm:space-y-3">
                      {course.includes.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm sm:text-base">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4 border border-gray-700">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      <h4 className="font-bold text-sm sm:text-base">
                        Last Updated
                      </h4>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      {course.lastUpdated}
                    </p>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4 border border-gray-700">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      <h4 className="font-bold text-sm sm:text-base">
                        Certificate
                      </h4>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Get a certificate upon completion
                    </p>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4 border border-gray-700">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <h4 className="font-bold text-sm sm:text-base">
                        Support
                      </h4>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Access to community and instructor support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "Can I get a refund if I don't like the course?",
                  a: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with the course, you can request a full refund within 30 days of purchase.",
                },
                {
                  q: "How long will I have access to the course?",
                  a: "You get lifetime access to the course. This includes all future updates and additional content added to the course.",
                },
                {
                  q: "Do I need any prior experience?",
                  a: "No prior experience is needed. This course starts from the basics and gradually progresses to advanced topics.",
                },
                {
                  q: "Will I get a certificate?",
                  a: "Yes, you'll receive a certificate of completion that you can share on LinkedIn and add to your resume.",
                },
                {
                  q: "Can I access the course on mobile?",
                  a: "Yes, the course is fully responsive and can be accessed on desktop, tablet, and mobile devices.",
                },
                {
                  q: "How can I get help if I'm stuck?",
                  a: "You can ask questions in the course discussion section or join our community of learners where instructors and peers can help.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-800/30 rounded-xl p-4 sm:p-6 border border-gray-700"
                >
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">
                    {faq.q}
                  </h4>
                  <p className="text-gray-400 text-sm sm:text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 py-4 sm:py-6 border-t border-gray-800 text-center text-gray-500 text-sm sm:text-base">
          <p>© 2024 CodeMaster. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default EnrollmentPage;
