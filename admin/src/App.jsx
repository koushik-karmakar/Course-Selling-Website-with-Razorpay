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
  ExternalLink,
} from "lucide-react";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const mockUploadedFiles = [
    {
      id: 1,
      name: "react-advanced-course.mp4",
      path: "https://s3.amazonaws.com/codemaster/videos/react-advanced.mp4",
      date: "2024-01-15",
      size: "245 MB",
    },
    {
      id: 2,
      name: "javascript-fundamentals.mp4",
      path: "https://s3.amazonaws.com/codemaster/videos/js-fundamentals.mp4",
      date: "2024-01-10",
      size: "180 MB",
    },
    {
      id: 3,
      name: "nodejs-backend.mp4",
      path: "https://s3.amazonaws.com/codemaster/videos/node-backend.mp4",
      date: "2024-01-05",
      size: "320 MB",
    },
    {
      id: 4,
      name: "typescript-essentials.mp4",
      path: "https://s3.amazonaws.com/codemaster/videos/typescript-essentials.mp4",
      date: "2024-01-18",
      size: "195 MB",
    },
    {
      id: 5,
      name: "nextjs-tutorial.mp4",
      path: "https://s3.amazonaws.com/codemaster/videos/nextjs-tutorial.mp4",
      date: "2024-01-20",
      size: "275 MB",
    },
  ];

  useEffect(() => {
    setUploadedFiles(mockUploadedFiles);
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
    { id: "courses", label: "Courses", icon: <Video size={20} /> },
    { id: "uploads", label: "Uploads", icon: <Upload size={20} /> },
    { id: "content", label: "Content", icon: <FileText size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            const newFile = {
              id: uploadedFiles.length + 1,
              name: file.name,
              path: `https://s3.amazonaws.com/codemaster/videos/${Date.now()}-${file.name}`,
              date: new Date().toISOString().split("T")[0],
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            };

            setUploadedFiles([newFile, ...uploadedFiles]);
            setUploadStatus("success");

            setTimeout(() => setUploadStatus("idle"), 3000);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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

          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Welcome back, Admin!
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your courses and content from here
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Courses</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        24
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Video className="text-blue-500" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        1,248
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Users className="text-green-500" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Uploaded Videos</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        156
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Upload className="text-purple-500" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Storage Used</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        4.2 GB
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <FileText className="text-orange-500" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Upload Video to S3
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Upload course videos directly to Amazon S3 storage
                    </p>
                  </div>
                  <Upload className="text-blue-500" size={24} />
                </div>

                <div
                  className={`
                  border-2 border-dashed rounded-xl p-6 md:p-8 text-center
                  transition-all duration-300 mb-6
                  ${
                    uploadStatus === "uploading"
                      ? "border-blue-300 bg-blue-50"
                      : uploadStatus === "success"
                        ? "border-green-300 bg-green-50"
                        : uploadStatus === "error"
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }
                `}
                >
                  {uploadStatus === "uploading" ? (
                    <div className="space-y-4">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                      <div>
                        <p className="text-gray-700 font-medium">
                          Uploading video...
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Please wait while we upload your file
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">{uploadProgress}%</p>
                    </div>
                  ) : uploadStatus === "success" ? (
                    <div className="space-y-3">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                      <p className="text-green-700 font-medium">
                        Upload successful!
                      </p>
                      <p className="text-sm text-green-600">
                        Video has been uploaded to S3 successfully
                      </p>
                    </div>
                  ) : uploadStatus === "error" ? (
                    <div className="space-y-3">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                      <p className="text-red-700 font-medium">Upload failed</p>
                      <p className="text-sm text-red-600">Please try again</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="inline-flex items-center px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                          <Upload size={20} className="mr-2" />
                          Choose Video File
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="text-gray-500 text-sm mt-4">
                        or drag and drop video files here
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        MP4, MOV, AVI up to 2GB
                      </p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Select Video</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Choose your course video file
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Upload to S3</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Automatic upload to AWS S3 bucket
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Get Link</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Copy the generated S3 URL
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Recently Uploaded Files
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      S3 file paths for uploaded videos
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                    {uploadedFiles.length} files
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {uploadedFiles.map((file) => (
                        <tr
                          key={file.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <Video className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <span className="text-sm font-medium text-gray-900 block">
                                  {file.name}
                                </span>
                                <code className="text-xs text-gray-500 font-mono mt-1 block truncate max-w-xs">
                                  {file.path}
                                </code>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {file.date}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {file.size}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => copyToClipboard(file.path)}
                              className="inline-flex items-center px-3 py-1 border border-blue-200 text-blue-600 text-sm font-medium rounded hover:bg-blue-50 transition-colors"
                            >
                              <Copy size={14} className="mr-1.5" />
                              Copy Link
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    S3 URLs (Click to copy)
                  </h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => copyToClipboard(file.path)}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                      >
                        <code className="text-xs text-gray-600 font-mono truncate flex-1">
                          {file.path}
                        </code>
                        <Copy
                          size={14}
                          className="text-gray-400 group-hover:text-gray-600 ml-2"
                        />
                      </div>
                    ))}
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
