import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiBookOpen,
  FiFileText,
  FiDownload,
  FiShare2,
  FiHeart,
  FiMessageSquare,
  FiSettings,
  FiX,
  FiMenu,
  FiHome,
  FiUser,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  PiPlayCircleBold,
  PiPauseCircleBold,
  PiClosedCaptioningBold,
  PiPictureInPictureBold,
} from "react-icons/pi";
import { coursesData } from "../data/coursesData.jsx";

const LearnPage = () => {
  const { courseTitle } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  //   useEffect(() => {
  //     window.screenTop({ top: 0, left: 0, behavior: "smooth" });
  //   }, []);
  const currentCourse =
    coursesData.find((course) => course.url === courseTitle) || coursesData[0];

  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [caption, setCaption] = useState(false);
  const [pip, setPip] = useState(false);

  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [note, setNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [expandedModules, setExpandedModules] = useState([0]);

  const courseModules = [
    {
      id: 1,
      title: "Introduction to React",
      duration: "45m",
      lessons: [
        {
          id: 1,
          title: "What is React?",
          duration: "8:15",
          videoUrl: "../../public/facebook_1749806821879.mp4",
        },
        {
          id: 2,
          title: "Setting up Development Environment",
          duration: "12:30",
          videoUrl: "https://example.com/video2.mp4",
        },
        {
          id: 3,
          title: "Your First React Component",
          duration: "15:45",
          videoUrl: "https://example.com/video3.mp4",
        },
        {
          id: 4,
          title: "JSX Fundamentals",
          duration: "8:45",
          videoUrl: "https://example.com/video4.mp4",
        },
      ],
    },
    {
      id: 2,
      title: "Components & Props",
      duration: "1h 30m",
      lessons: [
        {
          id: 5,
          title: "Functional Components",
          duration: "10:20",
          videoUrl: "https://example.com/video5.mp4",
        },
        {
          id: 6,
          title: "Class Components",
          duration: "15:10",
          videoUrl: "https://example.com/video6.mp4",
        },
        {
          id: 7,
          title: "Understanding Props",
          duration: "12:45",
          videoUrl: "https://example.com/video7.mp4",
        },
        {
          id: 8,
          title: "Component Composition",
          duration: "15:30",
          videoUrl: "https://example.com/video8.mp4",
        },
      ],
    },
    {
      id: 3,
      title: "State & Lifecycle",
      duration: "2h",
      lessons: [
        {
          id: 9,
          title: "Understanding State",
          duration: "18:15",
          videoUrl: "https://example.com/video9.mp4",
        },
        {
          id: 10,
          title: "setState Deep Dive",
          duration: "22:30",
          videoUrl: "https://example.com/video10.mp4",
        },
        {
          id: 11,
          title: "Lifecycle Methods",
          duration: "25:45",
          videoUrl: "https://example.com/video11.mp4",
        },
        {
          id: 12,
          title: "Hooks Introduction",
          duration: "13:30",
          videoUrl: "https://example.com/video12.mp4",
        },
      ],
    },
  ];

  const videoSource = currentCourse.thumbnail;

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    setMuted(value === 0);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      setCurrentTime(state.playedSeconds);
    }
  };

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value);
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
  };

  const toggleModule = (moduleIndex) => {
    if (expandedModules.includes(moduleIndex)) {
      setExpandedModules(expandedModules.filter((idx) => idx !== moduleIndex));
    } else {
      setExpandedModules([...expandedModules, moduleIndex]);
    }
  };

  const markAsCompleted = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const saveNote = () => {
    if (note.trim()) {
      console.log("Note saved:", note);
      setNote("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (playerRef.current) {
          playerRef.current.seekTo(currentTime - 10);
        }
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (playerRef.current) {
          playerRef.current.seekTo(currentTime + 10);
        }
      } else if (e.code === "KeyM") {
        e.preventDefault();
        setMuted(!muted);
      } else if (e.code === "KeyF") {
        e.preventDefault();
        handleFullscreen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [playing, muted, currentTime]);

  useEffect(() => {
    let timeout;
    if (playing && showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [playing, showControls]);

  const totalLessons = courseModules.reduce(
    (acc, module) => acc + module.lessons.length,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold">{currentCourse.title}</h1>
              <p className="text-sm text-gray-400">
                By {currentCourse.instructor}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {showSidebar ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1">
          <div
            ref={videoContainerRef}
            className="relative bg-black"
            onMouseEnter={() => setShowControls(true)}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => {
              if (playing) setShowControls(false);
            }}
          >
            <div className="relative pt-[56.25%]">
              {" "}
              <ReactPlayer
                ref={playerRef}
                url={videoSource}
                playing={playing}
                volume={muted ? 0 : volume}
                playbackRate={playbackRate}
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={() => {
                  markAsCompleted(
                    courseModules[selectedModule].lessons[selectedLesson].id,
                  );
                  setPlaying(false);
                }}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
              <div
                className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 md:p-4 transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="mb-3 md:mb-4">
                  <input
                    ref={progressBarRef}
                    type="range"
                    min={0}
                    max={0.999999}
                    step="any"
                    value={played}
                    onChange={handleSeekChange}
                    onMouseDown={handleSeekMouseDown}
                    onMouseUp={handleSeekMouseUp}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      {playing ? (
                        <PiPauseCircleBold className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        <PiPlayCircleBold className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setMuted(!muted)}
                        className="p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        {muted || volume === 0 ? (
                          <FiVolumeX className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <FiVolume2 className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 md:w-24 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                    </div>

                    <div className="text-sm hidden sm:block">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 md:space-x-4">
                    <button
                      onClick={handleFullscreen}
                      className="p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <FiMaximize className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 max-w-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-blue-400">
                      {currentCourse.title}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-300">
                      By {currentCourse.instructor}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg md:text-xl">
                    {
                      courseModules[selectedModule].lessons[selectedLesson]
                        .title
                    }
                  </h2>
                  <p className="text-sm text-gray-300 mt-1">
                    Module {selectedModule + 1} • Lesson {selectedLesson + 1}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {
                      courseModules[selectedModule].lessons[selectedLesson]
                        .title
                    }
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {courseModules[selectedModule].title} •{" "}
                    {
                      courseModules[selectedModule].lessons[selectedLesson]
                        .duration
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      markAsCompleted(
                        courseModules[selectedModule].lessons[selectedLesson]
                          .id,
                      )
                    }
                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center ${
                      completedLessons.includes(
                        courseModules[selectedModule].lessons[selectedLesson]
                          .id,
                      )
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    }`}
                  >
                    <FiCheckCircle className="mr-2" />
                    {completedLessons.includes(
                      courseModules[selectedModule].lessons[selectedLesson].id,
                    )
                      ? "Completed"
                      : "Mark Complete"}
                  </button>
                  <button className="p-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                    <FiDownload className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 mb-6">
                <h3 className="font-bold text-lg mb-3">About this lesson</h3>
                <p className="text-gray-300 leading-relaxed">
                  In this lesson, you'll learn the fundamental concepts of React
                  components. We'll cover both functional and class components,
                  understand how props work, and learn about component
                  composition patterns that are essential for building scalable
                  React applications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <FiFileText className="w-5 h-5 text-blue-400 mr-2" />
                    <h4 className="font-bold">Lecture Notes</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    Download the comprehensive lecture notes for this lesson.
                  </p>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Download PDF →
                  </button>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <FiBookOpen className="w-5 h-5 text-purple-400 mr-2" />
                    <h4 className="font-bold">Code Examples</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    Access the complete source code shown in this lesson.
                  </p>
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                    View on GitHub →
                  </button>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <FiMessageSquare className="w-5 h-5 text-green-400 mr-2" />
                    <h4 className="font-bold">Discussion</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    Join the community discussion for this lesson.
                  </p>
                  <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                    Open Forum →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed lg:relative top-0 right-0 h-screen w-full lg:w-96 bg-gray-900 border-l border-gray-800 transform transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 md:p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl">Course Content</h3>
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    {completedLessons.length} of {totalLessons} lessons
                    completed
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        (completedLessons.length / totalLessons) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${(completedLessons.length / totalLessons) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="space-y-4">
                {courseModules.map((module, moduleIndex) => (
                  <div key={module.id} className="space-y-3">
                    <button
                      onClick={() => toggleModule(moduleIndex)}
                      className="flex items-center justify-between w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 mr-3">
                          <span className="text-blue-400 font-bold">
                            {moduleIndex + 1}
                          </span>
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-gray-300">
                            {module.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {module.duration}
                          </p>
                        </div>
                      </div>
                      {expandedModules.includes(moduleIndex) ? (
                        <FiChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedModules.includes(moduleIndex) && (
                      <div className="space-y-2 ml-4">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setSelectedModule(moduleIndex);
                              setSelectedLesson(lessonIndex);
                              setPlaying(true);
                              if (window.innerWidth < 1024) {
                                setShowSidebar(false);
                              }
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                              selectedModule === moduleIndex &&
                              selectedLesson === lessonIndex
                                ? "bg-blue-500/20 border border-blue-500/30"
                                : "hover:bg-gray-800/50"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                  completedLessons.includes(lesson.id)
                                    ? "bg-green-500/20 text-green-400"
                                    : selectedModule === moduleIndex &&
                                        selectedLesson === lessonIndex
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-700 text-gray-400"
                                }`}
                              >
                                {completedLessons.includes(lesson.id) ? (
                                  <FiCheckCircle className="w-3 h-3" />
                                ) : (
                                  <span className="text-xs font-medium">
                                    {lessonIndex + 1}
                                  </span>
                                )}
                              </div>
                              <div className="text-left">
                                <span
                                  className={`block ${
                                    selectedModule === moduleIndex &&
                                    selectedLesson === lessonIndex
                                      ? "text-white font-medium"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                                <span className="text-xs text-gray-500 mt-1 block">
                                  {lesson.duration}
                                </span>
                              </div>
                            </div>
                            {selectedModule === moduleIndex &&
                              selectedLesson === lessonIndex && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-gray-800">
              <button
                onClick={() => navigate(`/course/${currentCourse.url}`)}
                className="w-full py-3 text-center bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                View Course Details
              </button>
            </div>
          </div>
        </div>

        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>

      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 lg:hidden z-30 w-12 h-12 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
      >
        <FiMenu className="w-5 h-5" />
      </button>
    </div>
  );
};

export default LearnPage;
