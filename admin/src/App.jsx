import { useState, useEffect } from "react";
import {
  Upload,
  Video,
  FileText,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Copy,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import "./App.css";
import axios from "axios";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadPhase, setUploadPhase] = useState("idle");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "JavaScript Mastery",
      instructor: "John Doe",
    },
    {
      id: 2,
      name: "React Pro",
      instructor: "Sarah Chen",
    },
    {
      id: 3,
      name: "Full Stack Development",
      instructor: "Alex Johnson",
    },
    {
      id: 4,
      name: "Node.js Backend",
      instructor: "Michael Rodriguez",
    },
    {
      id: 5,
      name: "Python for Data Science",
      instructor: "Dr. Emily Zhang",
    },
    {
      id: 6,
      name: "Mobile App Development",
      instructor: "David Kim",
    },
    {
      id: 7,
      name: "UI/UX Design Fundamentals",
      instructor: "Sophia Williams",
    },
    {
      id: 8,
      name: "DevOps & Cloud",
      instructor: "Robert Chen",
    },
    { id: 9, name: "TypeScript Pro", instructor: "Thomas Wilson" },
    {
      id: 10,
      name: "GraphQL API Development",
      instructor: "Lisa Anderson",
    },
    {
      id: 11,
      name: "Web3 & Blockchain",
      instructor: "James Satoshi",
    },
    {
      id: 12,
      name: "System Design",
      instructor: "Maria Gonzalez",
    },
  ]);
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
    { id: "courses", label: "Courses", icon: <Video size={20} /> },
    { id: "uploads", label: "Uploads", icon: <Upload size={20} /> },
    { id: "content", label: "Content", icon: <FileText size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];

      if (!validTypes.includes(file.type)) {
        alert("Please select a valid video file (MP4, MOV, AVI)");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedCourseId || !selectedFile) return;

    setUploadPhase("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("course_id", selectedCourseId);
    formData.append("title", selectedFile.name);

    try {
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;

      await axios.post(`${backend}/admin/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },

        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);

          if (percent === 100) {
            setTimeout(() => {
              setUploadPhase("processing");
            }, 300);
          }
        },
      });

      setUploadPhase("success");

      setTimeout(() => {
        setUploadPhase("idle");
        setUploadProgress(0);
        setSelectedFile(null);
        document.getElementById("file-upload").value = "";
      }, 2000);
    } catch (err) {
      console.error(err);
      setUploadPhase("error");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-hidden">
      <div className="flex h-screen">
        <aside
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed lg:fixed
          w-64 h-screen bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          z-40 top-0 left-0
          lg:translate-x-0 lg:z-0
          ${sidebarOpen ? "shadow-xl lg:shadow-none" : ""}
          overflow-y-auto
        `}
        >
          <div className="p-4 border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CM</span>
                </div>
                <h1 className="text-lg font-bold text-gray-800">
                  CodeMaster Admin
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-4 h-full">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={` cursor-pointer
                    flex items-center space-x-3 w-full px-4 py-3 rounded-lg 
                    transition-all duration-200
                    ${
                      activeMenu === item.id
                        ? "bg-linear-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {activeMenu === item.id && (
                    <ChevronRight className="ml-auto" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col h-screen lg:ml-64">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 md:px-6 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-linear-to-r rounded-lg flex items-center justify-center">
                    <img
                      src="https://res.cloudinary.com/db7qmdfr2/image/upload/v1768744832/9ae17728-89d8-4828-97f0-beb33573fe8c_lmfdkx.png"
                      alt="CodeMaster Logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h1 className="text-xl font-bold text-gray-800 hidden lg:block">
                    CodeMaster Admin
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-medium">A</span>
                  </div>
                  <span>Admin User</span>
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-linear-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                    Welcome back, Admin!
                  </h2>
                </div>
                <p className="text-gray-600 ml-5">
                  Manage your courses and content from the dashboard
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl">
                            <BookOpen className="w-6 h-6 text-gradient bg-linear-to-r from-blue-600 to-purple-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Select Course
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm ml-11">
                          Choose a course to upload videos to
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                        Course Selection
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          className="w-full px-4 py-3.5 pl-12 pr-10 bg-white border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300"
                        >
                          <option value="">Select a course...</option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.name} - {course.instructor}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <BookOpen size={18} />
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <ChevronDown size={18} />
                        </div>
                      </div>

                      {selectedCourseId && (
                        <div className="mt-4 p-4 bg-linear-to-r from-blue-50/50 to-purple-50/50 border border-blue-100 rounded-xl">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 border border-blue-100">
                              <BookOpen className="w-5 h-5 text-gradient bg-linear-to-r from-blue-600 to-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {
                                  courses.find(
                                    (c) => c.id === Number(selectedCourseId),
                                  )?.name
                                }
                              </p>
                              <p className="text-sm text-gray-600">
                                Course ID: {selectedCourseId}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-br from-blue-50/50 to-purple-50/50 rounded-2xl border border-blue-100 p-6 flex flex-col justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Ready to Upload?
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {selectedCourseId
                        ? `Selected: ${courses.find((c) => c.id === Number(selectedCourseId))?.name}`
                        : "Select a course to begin"}
                    </p>
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-lg ${selectedCourseId ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${selectedCourseId ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                      <span className="text-sm font-medium">
                        {selectedCourseId
                          ? "Course Selected"
                          : "No Course Selected"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl">
                        <Upload className="w-6 h-6 text-gradient bg-linear-to-r from-blue-600 to-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Upload Video to S3
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm ml-11">
                      {selectedCourseId
                        ? `Uploading to: ${courses.find((c) => c.id === Number(selectedCourseId))?.name}`
                        : "Select a course first to upload videos"}
                    </p>
                  </div>
                </div>

                <div
                  className={`
          border-3 border-dashed rounded-2xl p-8 md:p-12 text-center
          transition-all duration-500 mb-8
          ${
            uploadPhase === "uploading"
              ? "border-blue-300 bg-linear-to-br from-blue-50/50 to-blue-100/30 animate-pulse-subtle"
              : uploadPhase === "processing"
                ? "border-yellow-300 bg-linear-to-br from-yellow-50/50 to-amber-100/30"
                : uploadPhase === "success"
                  ? "border-green-300 bg-linear-to-br from-green-50/50 to-emerald-100/30"
                  : uploadPhase === "error"
                    ? "border-red-300 bg-linear-to-br from-red-50/50 to-rose-100/30"
                    : selectedFile
                      ? "border-blue-300 bg-linear-to-br from-blue-50/50 to-blue-100/30"
                      : "border-gray-200 bg-linear-to-br from-gray-50/50 to-gray-100/30 hover:border-blue-300 hover:bg-linear-to-br hover:from-blue-50/50 hover:to-blue-100/30"
          }
        `}
                >
                  {uploadPhase === "uploading" && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div className="relative">
                        <Loader2 className="w-16 h-16 text-gradient bg-linear-to-r from-blue-600 to-purple-600 animate-spin mx-auto" />
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-xl"></div>
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold text-lg mb-2">
                          Uploading video…
                        </p>
                        <p className="text-sm text-gray-500">
                          Please wait while we upload your file to secure
                          storage
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-linear-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gradient bg-linear-to-r from-blue-600 to-purple-600">
                            {uploadProgress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadPhase === "processing" && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div className="relative">
                        <Loader2 className="w-16 h-16 text-gradient bg-linear-to-r from-yellow-500 to-amber-500 animate-spin mx-auto" />
                        <div className="absolute inset-0 bg-linear-to-r from-yellow-500/10 to-amber-500/10 rounded-full blur-xl"></div>
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold text-lg mb-2">
                          Processing video…
                        </p>
                        <p className="text-sm text-gray-500">
                          Encoding & uploading to secure storage. This may take
                          a few minutes.
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-linear-to-r from-yellow-500 to-amber-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-linear-to-r from-yellow-500 to-amber-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-linear-to-r from-yellow-500 to-amber-500 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  )}

                  {uploadPhase === "success" && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div className="relative">
                        <div className="w-20 h-20 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                          <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-linear-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl"></div>
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold text-lg mb-2">
                          Video uploaded successfully! 🎉
                        </p>
                        <p className="text-sm text-green-600">
                          Your video is now securely stored and ready for use
                        </p>
                      </div>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-green-500/25"
                      >
                        Upload Another Video
                      </button>
                    </div>
                  )}

                  {uploadPhase === "error" && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div className="relative">
                        <div className="w-20 h-20 bg-linear-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                          <AlertCircle className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-linear-to-r from-red-500/20 to-rose-500/20 rounded-full blur-xl"></div>
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold text-lg mb-2">
                          Upload failed
                        </p>
                        <p className="text-sm text-red-600">
                          Please check your connection and try again
                        </p>
                      </div>
                      <button
                        onClick={() => setUploadPhase("idle")}
                        className="px-6 py-3 bg-linear-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-red-500/25"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {uploadPhase === "idle" && selectedFile && (
                    <div className="space-y-8 max-w-2xl mx-auto">
                      <div className="flex flex-col  items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-800 text-lg truncate max-w-xs">
                              {selectedFile.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                              MB • Ready to upload
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              document.getElementById("file-upload").value = "";
                            }}
                            className="cursor-pointer px-5 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                          >
                            Change File
                          </button>

                          <button
                            onClick={handleUploadSubmit}
                            disabled={!selectedCourseId}
                            className={`cursor-pointer px-6 py-2.5 font-medium rounded-xl transition-all duration-300 flex items-center gap-2 ${
                              !selectedCourseId
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                            }`}
                          >
                            <Upload size={18} />
                            Upload to S3
                          </button>
                        </div>
                      </div>

                      <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              File Type
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                              {selectedFile.type.split("/")[1].toUpperCase()}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                              {selectedCourseId
                                ? courses.find(
                                    (c) => c.id === Number(selectedCourseId),
                                  )?.name
                                : "Not selected"}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </p>
                            <div className="inline-flex items-center px-3 py-1 bg-linear-to-r from-blue-50 to-purple-50 rounded-full">
                              <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-2"></div>
                              <span className="text-xs font-medium text-gradient bg-linear-to-r from-blue-600 to-purple-600">
                                Ready for upload
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadPhase === "idle" && !selectedFile && (
                    <div className="space-y-8 max-w-md mx-auto">
                      <div className="relative">
                        <Upload className="w-20 h-20 text-gray-300 mx-auto" />
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-xl"></div>
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold text-lg mb-3">
                          Drag & drop your video here
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                          or choose a file from your computer
                        </p>
                      </div>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="inline-flex items-center px-8 py-3.5 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300">
                          <Upload size={20} className="mr-3" />
                          Choose Video File
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="text-gray-400 text-xs">
                        Supported formats: MP4, MOV, AVI • Max size: 2GB
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Select Course & File
                        </h4>
                        <p className="text-sm text-gray-600">
                          Choose a course and select your video file from
                          computer
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:border-purple-200 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Review & Submit
                        </h4>
                        <p className="text-sm text-gray-600">
                          Review file details and click Upload to S3 to begin
                          upload
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:border-green-200 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Get Secure Link
                        </h4>
                        <p className="text-sm text-gray-600">
                          Copy the generated S3 URL for secure video access
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl">
                        <Video className="w-6 h-6 text-gradient bg-linear-to-r from-blue-600 to-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Recently Uploaded Files
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm ml-11">
                      S3 file paths for uploaded videos
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                      <span className="text-gradient bg-linear-to-r from-blue-600 to-purple-600 font-semibold">
                        {uploadedFiles.length} files
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {uploadedFiles.length > 0 ? (
                        uploadedFiles.map((file) => (
                          <tr
                            key={file.id}
                            className="hover:bg-linear-to-r hover:from-gray-50/50 hover:to-gray-100/30 transition-all duration-300 group"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center mr-4">
                                  <Video className="w-5 h-5 text-gradient bg-linear-to-r from-blue-600 to-purple-600" />
                                </div>
                                <div>
                                  <span className="text-sm font-semibold text-gray-800 block">
                                    {file.name}
                                  </span>
                                  <code className="text-xs text-gray-500 font-mono mt-1 block truncate max-w-xs">
                                    {file.path}
                                  </code>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                                {file.date}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-800 bg-linear-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-lg">
                                {file.size}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <button
                                onClick={() => copyToClipboard(file.path)}
                                className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105"
                              >
                                <Copy size={16} className="mr-2" />
                                Copy Link
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <div className="w-20 h-20 bg-linear-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                                <Upload className="w-10 h-10 text-gray-300" />
                              </div>
                              <p className="text-lg font-medium text-gray-600 mb-2">
                                No files uploaded yet
                              </p>
                              <p className="text-sm">
                                Upload your first video to get started
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-base font-semibold text-gray-800">
                      S3 URLs (Click to copy)
                    </h4>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                      Click any URL to copy
                    </span>
                  </div>
                  <div className="space-y-3">
                    {uploadedFiles.length > 0 ? (
                      uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => copyToClipboard(file.path)}
                          className="flex items-center justify-between p-4 bg-linear-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md hover:scale-[1.002] transition-all duration-300 cursor-pointer group"
                        >
                          <code className="text-sm text-gray-700 font-mono truncate flex-1">
                            {file.path}
                          </code>
                          <div className="flex items-center gap-3">
                            <div className="hidden group-hover:inline-flex items-center px-3 py-1 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg">
                              <span className="text-xs font-medium text-gradient bg-linear-to-r from-blue-600 to-purple-600">
                                Click to copy
                              </span>
                            </div>
                            <Copy
                              size={16}
                              className="text-gray-400 group-hover:text-gradient group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-10 text-center bg-linear-to-r from-gray-50 to-white border border-gray-200 rounded-2xl">
                        <div className="max-w-md">
                          <div className="w-16 h-16 bg-linear-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Copy className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-600 font-medium mb-2">
                            No URLs available
                          </p>
                          <p className="text-sm text-gray-500">
                            Upload a video to generate S3 URLs
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
