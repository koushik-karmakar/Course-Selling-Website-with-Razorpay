// import React, { useState, useRef, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ReactPlayer from "react-player";
// import axios from "axios";
// import {
//   FiPlay,
//   FiPause,
//   FiVolume2,
//   FiVolumeX,
//   FiMaximize,
//   FiChevronLeft,
//   FiSettings,
//   FiCheck,
//   FiClock,
// } from "react-icons/fi";
// import { coursesData } from "../data/coursesData.jsx";
// import { useAlert } from "../components/Alert.jsx";
// const LearnPage = () => {
//   const { AlertComponent, showAlert } = useAlert();

//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const playerRef = useRef(null);
//   const videoContainerRef = useRef(null);
//   const currentCourse = coursesData.find((course) => course.url === slug);
//   console.log("course", currentCourse);
//   const [playing, setPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.8);
//   const [muted, setMuted] = useState(false);
//   const [played, setPlayed] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [seeking, setSeeking] = useState(false);
//   const [fullscreen, setFullscreen] = useState(false);
//   const [showControls, setShowControls] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);

//   const [selectedModule, setSelectedModule] = useState(0);
//   const [selectedLesson, setSelectedLesson] = useState(0);
//   const [videoSource, setVideoSource] = useState(null);

//   const formatTime = (seconds) => {
//     const date = new Date(seconds * 1000);
//     const hh = date.getUTCHours();
//     const mm = date.getUTCMinutes();
//     const ss = date.getUTCSeconds().toString().padStart(2, "0");

//     if (hh) {
//       return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
//     }
//     return `${mm}:${ss}`;
//   };

//   const handlePlayPause = () => {
//     setPlaying(!playing);
//   };

//   const handleVolumeChange = (e) => {
//     const value = parseFloat(e.target.value);
//     setVolume(value);
//     setMuted(value === 0);
//   };

//   const handleProgress = (state) => {
//     if (!seeking) {
//       setPlayed(state.played);
//       setCurrentTime(state.playedSeconds);
//     }
//   };

//   const handleSeekChange = (e) => {
//     const value = parseFloat(e.target.value);
//     setPlayed(value);
//     if (playerRef.current) {
//       playerRef.current.seekTo(value);
//     }
//   };

//   const handleSeekMouseDown = () => {
//     setSeeking(true);
//   };

//   const handleSeekMouseUp = () => {
//     setSeeking(false);
//     if (playerRef.current) {
//       playerRef.current.seekTo(played);
//     }
//   };

//   const handleDuration = (duration) => {
//     setDuration(duration);
//   };

//   const handleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       videoContainerRef.current?.requestFullscreen();
//       setFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setFullscreen(false);
//     }
//   };

//   const handleSpeedChange = (speed) => {
//     setPlaybackSpeed(speed);
//     setShowSpeedMenu(false);
//   };

//   useEffect(() => {
//     let timeout;
//     if (playing && showControls) {
//       timeout = setTimeout(() => {
//         setShowControls(false);
//       }, 3000);
//     }
//     return () => clearTimeout(timeout);
//   }, [playing, showControls]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.code === "Space") {
//         e.preventDefault();
//         handlePlayPause();
//       } else if (e.code === "KeyM") {
//         e.preventDefault();
//         setMuted(!muted);
//       } else if (e.code === "KeyF") {
//         e.preventDefault();
//         handleFullscreen();
//       } else if (e.code === "Period") {
//         e.preventDefault();
//         if (playerRef.current) {
//           playerRef.current.seekTo(currentTime + 10);
//         }
//       } else if (e.code === "Comma") {
//         e.preventDefault();
//         if (playerRef.current) {
//           playerRef.current.seekTo(currentTime - 10);
//         }
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [playing, muted, currentTime]);

//   const overallProgress = currentCourse.lessons.overallProgress;
//   const moduleProgress = currentCourse.lessons.moduleProgress;
//   const courseId = currentCourse.id;
//   const video_url = currentCourse.lessons.video_url;
//   const title = currentCourse.title;
//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "instant",
//     });
//   }, []);
//   useEffect(() => {
//     const fetch_video = async () => {
//       try {
//         const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
//         const response = await axios.post(
//           `${backend}/api/users/fetch-video-URL`,
//           { courseId, video_url, title },
//           { withCredentials: true },
//         );
//         console.log(response.data.signed_URL);
//         setVideoSource(response.data.signed_URL);
//       } catch (error) {
//         console.error("Video initialization error:", error);
//         const errorMessage =
//           error.response?.data?.message ||
//           error.message ||
//           "Failed to initialize video";

//         showAlert({
//           type: "error",
//           title: "Server Error",
//           message: errorMessage,
//         });
//       }
//     };
//     fetch_video();
//   }, []);
//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <AlertComponent />
//       <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
//             >
//               <FiChevronLeft className="w-5 h-5" />
//             </button>
//             <div>
//               <h1 className="text-lg font-bold">{currentCourse.title}</h1>
//               <p className="text-sm text-gray-400">
//                 By {currentCourse.instructor}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-blue-500 rounded-full transition-all duration-300"
//                 style={{ width: `${moduleProgress}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-4">
//             <div
//               ref={videoContainerRef}
//               className="relative bg-black rounded-xl overflow-hidden"
//               onMouseEnter={() => setShowControls(true)}
//               onMouseMove={() => setShowControls(true)}
//               onMouseLeave={() => {
//                 if (playing) setShowControls(false);
//               }}
//             >
//               {!videoSource ? (
//                 <div className="aspect-video flex items-center justify-center bg-gray-800">
//                   <p>Loading video...</p>
//                 </div>
//               ) : (
//                 <ReactPlayer
//                   ref={playerRef}
//                   url={videoSource}
//                   playing={playing}
//                   volume={muted ? 0 : volume}
//                   playbackRate={playbackSpeed}
//                   width="100%"
//                   height="100%"
//                   style={{ minHeight: "650px" }}
//                   onProgress={handleProgress}
//                   onDuration={handleDuration}
//                   onEnded={() => {
//                     setPlaying(false);
//                   }}
//                   onError={(error) => {
//                     console.error("ReactPlayer Error:", error);
//                   }}
//                   config={{
//                     file: {
//                       attributes: {
//                         controlsList: "nodownload",
//                       },
//                     },
//                   }}
//                 />
//               )}

//               <div className="absolute top-4 left-4 right-4 pointer-events-none">
//                 <div className="inline-block bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-md">
//                   <h2 className="font-bold text-xl">{currentCourse.title}</h2>
//                   <p className="text-sm text-gray-300 mt-1">
//                     {currentCourse.title} • By {currentCourse.instructor}
//                   </p>
//                 </div>
//               </div>

//               <div
//                 className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
//                   showControls ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 <div className="mb-3">
//                   <input
//                     type="range"
//                     min={0}
//                     max={0.999999}
//                     step="any"
//                     value={played}
//                     onChange={handleSeekChange}
//                     onMouseDown={handleSeekMouseDown}
//                     onMouseUp={handleSeekMouseUp}
//                     className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-transform"
//                   />
//                   <div className="flex justify-between text-sm text-gray-300 mt-1">
//                     <span>{formatTime(currentTime)}</span>
//                     <span>{formatTime(duration)}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <button
//                       onClick={handlePlayPause}
//                       className="p-2 hover:bg-white/10 rounded-full transition-colors"
//                       aria-label={playing ? "Pause" : "Play"}
//                     >
//                       {playing ? (
//                         <FiPause className="w-6 h-6" />
//                       ) : (
//                         <FiPlay className="w-6 h-6" />
//                       )}
//                     </button>

//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => setMuted(!muted)}
//                         className="p-2 hover:bg-white/10 rounded-full transition-colors"
//                         aria-label={muted ? "Unmute" : "Mute"}
//                       >
//                         {muted || volume === 0 ? (
//                           <FiVolumeX className="w-5 h-5" />
//                         ) : (
//                           <FiVolume2 className="w-5 h-5" />
//                         )}
//                       </button>
//                       <input
//                         type="range"
//                         min={0}
//                         max={1}
//                         step={0.1}
//                         value={volume}
//                         onChange={handleVolumeChange}
//                         className="w-20 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hidden sm:block"
//                       />
//                     </div>

//                     <div className="text-sm font-medium hidden md:block">
//                       {formatTime(currentTime)} / {formatTime(duration)}
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-4">
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowSpeedMenu(!showSpeedMenu)}
//                         className="px-3 py-1 text-sm hover:bg-white/10 rounded-md transition-colors"
//                       >
//                         {playbackSpeed}x
//                       </button>
//                       {showSpeedMenu && (
//                         <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden min-w-30">
//                           {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
//                             (speed) => (
//                               <button
//                                 key={speed}
//                                 onClick={() => handleSpeedChange(speed)}
//                                 className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center justify-between"
//                               >
//                                 <span>{speed}x</span>
//                                 {playbackSpeed === speed && (
//                                   <FiCheck className="w-4 h-4" />
//                                 )}
//                               </button>
//                             ),
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <button
//                       onClick={handleFullscreen}
//                       className="p-2 hover:bg-white/10 rounded-full transition-colors"
//                       aria-label="Fullscreen"
//                     >
//                       <FiMaximize className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 p-4 bg-gray-800/30 rounded-xl">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <h1 className="text-2xl font-bold">{currentCourse.title}</h1>
//                   <div className="flex items-center space-x-4 mt-2 text-gray-300">
//                     <div className="flex items-center">
//                       <FiClock className="w-4 h-4 mr-2" />
//                       <span>{currentCourse.duration}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <h3 className="text-xl font-bold mb-3">About this lesson</h3>
//                 <p className="text-gray-300 leading-relaxed">
//                   In this comprehensive lesson, you'll dive deep into React
//                   fundamentals. We'll cover everything from basic concepts to
//                   advanced techniques, with plenty of practical examples and
//                   real-world applications.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//                   <div className="space-y-3">
//                     <h4 className="font-semibold text-lg text-blue-400">
//                       Key Topics Covered
//                     </h4>
//                     <ul className="space-y-2">
//                       {[
//                         "React component architecture",
//                         "State and props management",
//                         "Lifecycle methods",
//                         "Best practices and patterns",
//                       ].map((topic, index) => (
//                         <li key={index} className="flex items-center">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                           <span>{topic}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="space-y-3">
//                     <h4 className="font-semibold text-lg text-purple-400">
//                       Learning Outcomes
//                     </h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Build reusable React components",
//                         "Manage application state effectively",
//                         "Understand React lifecycle",
//                         "Apply best practices in real projects",
//                       ].map((outcome, index) => (
//                         <li key={index} className="flex items-center">
//                           <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
//                           <span>{outcome}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

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
