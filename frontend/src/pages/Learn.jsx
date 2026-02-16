import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiChevronLeft, FiClock } from "react-icons/fi";
import { HLSVideoPlayer } from "../components/HLSVideoPlayer";
import { coursesData } from "../data/coursesData.jsx";
import { useAlert } from "../components/Alert.jsx";

const LearnPage = () => {
  const { AlertComponent, showAlert } = useAlert();
  const { slug } = useParams();
  const navigate = useNavigate();

  const currentCourse = coursesData.find((course) => course.url === slug);

  const [videoSource, setVideoSource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoInfo, setVideoInfo] = useState(null);

  const courseId = currentCourse?.id;
  // const video_url = currentCourse?.lessons?.video_url;
  const title = currentCourse?.title;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!courseId) {
        showAlert({
          type: "error",
          title: "Error",
          message: "No video selected",
        });
        return;
      }

      try {
        setIsLoading(true);
        const backend = import.meta.env.VITE_BACKEND_PORT_LINK;

        const response = await axios.post(
          `${backend}/api/users/fetch-video-URL`,
          { courseId },
          { withCredentials: true },
        );

        const { signed_URL, transcodingStatus, video } = response.data;

        // Check transcoding status
        if (
          transcodingStatus === "pending" ||
          transcodingStatus === "processing"
        ) {
          showAlert({
            type: "info",
            title: "Processing",
            message:
              "Video is being processed. Please check back in a few minutes.",
          });
          setIsLoading(false);
          return;
        }

        if (transcodingStatus === "failed") {
          showAlert({
            type: "error",
            title: "Error",
            message: "Video processing failed. Please contact support.",
          });
          setIsLoading(false);
          return;
        }

        // Set video source
        setVideoSource(signed_URL);
        setVideoInfo(video);
        setIsLoading(false);
      } catch (error) {
        console.error("Video fetch error:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load video";

        showAlert({
          type: "error",
          title: "Error",
          message: errorMessage,
        });

        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchVideo();
    }
  }, [courseId]);

  const handleVideoReady = (info) => {
    console.log("Video ready:", info);
  };

  const handleVideoError = (error) => {
    console.error("Video error:", error);
    showAlert({
      type: "error",
      title: "Playback Error",
      message: "Failed to play video. Please try again.",
    });
  };

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AlertComponent />

      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold">{currentCourse.title}</h1>
              <p className="text-sm text-gray-400">
                By {currentCourse.instructor}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${currentCourse?.lessons?.moduleProgress || 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4">
            <div className="bg-black rounded-xl overflow-hidden">
              {isLoading ? (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Loading video...</p>
                  </div>
                </div>
              ) : videoSource ? (
                <HLSVideoPlayer
                  videoUrl={videoSource}
                  poster={currentCourse.thumbnail}
                  title={title}
                  onReady={handleVideoReady}
                  onError={handleVideoError}
                />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <p className="text-white">No video available</p>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{currentCourse.title}</h1>
                  <div className="flex items-center space-x-4 mt-2 text-gray-300">
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span>{currentCourse.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">About this lesson</h3>
                <p className="text-gray-300 leading-relaxed">
                  {currentCourse.description ||
                    "In this comprehensive lesson, you'll dive deep into the fundamentals. " +
                      "We'll cover everything from basic concepts to advanced techniques, " +
                      "with plenty of practical examples and real-world applications."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-blue-400">
                      Key Topics Covered
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "Core concepts and fundamentals",
                        "Practical implementation",
                        "Best practices",
                        "Real-world examples",
                      ].map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-purple-400">
                      Learning Outcomes
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "Master key concepts",
                        "Build practical projects",
                        "Apply best practices",
                        "Solve real problems",
                      ].map((outcome, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
