import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import axios from "axios";
import { FiChevronLeft, FiClock } from "react-icons/fi";
import { coursesData } from "../data/coursesData.jsx";
import { useAlert } from "../components/Alert.jsx";

const LearnPage = () => {
  const { AlertComponent, showAlert } = useAlert();
  const { slug } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);

  const currentCourse = coursesData.find((course) => course.url === slug);
  const [videoSource, setVideoSource] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const overallProgress = currentCourse?.lessons?.overallProgress;
  const moduleProgress = currentCourse?.lessons?.moduleProgress;
  const courseId = currentCourse?.id;
  const video_url = currentCourse?.lessons?.video_url;
  const title = currentCourse?.title;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    const fetch_video = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
        const response = await axios.post(
          `${backend}/api/users/fetch-video-URL`,
          { courseId, video_url, title },
          { withCredentials: true },
        );
        setVideoSource(response.data.signed_URL);
      } catch (error) {
        console.error("Video initialization error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to initialize video";

        showAlert({
          type: "error",
          title: "Server Error",
          message: errorMessage,
        });
      }
    };

    if (courseId && video_url && title) {
      fetch_video();
    }
  }, [courseId, video_url, title]);

  useEffect(() => {
    if (!videoSource || !videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: true,
      playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      controlBar: {
        children: [
          "playToggle",
          "volumePanel",
          "currentTimeDisplay",
          "timeDivider",
          "durationDisplay",
          "progressControl",
          "playbackRateMenuButton",
          "fullscreenToggle",
        ],
      },
    });

    playerRef.current = player;

    player.src({
      src: videoSource,
      type: "video/mp4",
    });

    player.on("play", () => {
      setIsPlaying(true);
    });

    player.on("pause", () => {
      setIsPlaying(false);
    });

    player.on("ended", () => {
      setIsPlaying(false);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoSource]);

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
                style={{ width: `${moduleProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4">
            <div
              ref={videoContainerRef}
              className="relative bg-black rounded-xl overflow-hidden"
            >
              {videoSource ? (
                <div data-vjs-player>
                  <video
                    ref={videoRef}
                    className="video-js vjs-big-play-centered vjs-theme-city"
                    playsInline
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <p>Loading video...</p>
                </div>
              )}

              {!isPlaying && (
                <div className="absolute top-4 left-4 right-4 pointer-events-none z-10 transition-opacity duration-300">
                  <div className="inline-block bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-md">
                    <h2 className="font-bold text-xl">{currentCourse.title}</h2>
                    <p className="text-sm text-gray-300 mt-1">
                      {currentCourse.title} • By {currentCourse.instructor}
                    </p>
                  </div>
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
                  In this comprehensive lesson, you'll dive deep into React
                  fundamentals. We'll cover everything from basic concepts to
                  advanced techniques, with plenty of practical examples and
                  real-world applications.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-blue-400">
                      Key Topics Covered
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "React component architecture",
                        "State and props management",
                        "Lifecycle methods",
                        "Best practices and patterns",
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
                        "Build reusable React components",
                        "Manage application state effectively",
                        "Understand React lifecycle",
                        "Apply best practices in real projects",
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
