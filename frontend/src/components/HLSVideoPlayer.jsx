import { useEffect, useRef, useState } from "react";
import { Plyr } from "plyr-react";
import Hls from "hls.js";
import "plyr-react/plyr.css";

function HLSVideoPlayer({ videoUrl, poster, title, onReady, onError }) {
  const plyrRef = useRef(null);
  const hlsRef = useRef(null);
  const [currentQuality, setCurrentQuality] = useState("Auto");

  useEffect(() => {
    if (!videoUrl) return;
    const video = plyrRef.current?.plyr?.media;
    if (!video) return;

    if (Hls.isSupported()) {
      console.log("HLS.js is supported");
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,

        startLevel: -1,
        capLevelToPlayerSize: true,

        manifestLoadingTimeOut: 10000,
        levelLoadingTimeOut: 10000,
        fragLoadingTimeOut: 20000,
        enableWorker: true,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("HLS manifest loaded");
        console.log(`Available qualities: ${data.levels.length}`);

        data.levels.forEach((level, index) => {
          console.log(
            `Quality ${index}: ${level.height}p (${level.bitrate} bps)`,
          );
        });

        if (onReady) {
          onReady({
            qualities: data.levels.map((l) => `${l.height}p`),
            duration: video.duration,
          });
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const quality = hls.levels[data.level];
        console.log(`Quality switched to: ${quality.height}p`);
        setCurrentQuality(`${quality.height}p`);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, trying to recover...");
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, trying to recover...");
              hls.recoverMediaError();
              break;

            default:
              console.error("Fatal error, cannot recover");
              hls.destroy();
              if (onError) {
                onError(new Error("Failed to load video"));
              }
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("Native HLS support detected (Safari)");
      video.src = videoUrl;

      video.addEventListener("loadedmetadata", () => {
        if (onReady) {
          onReady({ qualities: ["Auto"], duration: video.duration });
        }
      });
    } else {
      console.error("HLS is not supported in this browser");
      if (onError) {
        onError(new Error("HLS is not supported in your browser"));
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, onReady, onError]);

  const handleQualityChange = (newQuality) => {
    if (hlsRef.current) {
      const levels = hlsRef.current.levels;

      if (newQuality === -1) {
        hlsRef.current.currentLevel = -1;
        setCurrentQuality("Auto");
      } else {
        hlsRef.current.currentLevel = newQuality;
        setCurrentQuality(`${levels[newQuality].height}p`);
      }
    }
  };

  const plyrOptions = {
    controls: [
      "play-large",
      "restart",
      "rewind",
      "play",
      "fast-forward",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "pip",
      "airplay",
      "fullscreen",
    ],
    settings: ["quality", "speed", "loop"],
    speed: {
      selected: 1,
      options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    },
    quality: {
      default: 720,
      options: [360, 480, 720, 1080],
      forced: true,
      onChange: handleQualityChange,
    },
    keyboard: {
      focused: true,
      global: true,
    },
    tooltips: {
      controls: true,
      seek: true,
    },
    captions: {
      active: true,
      language: "auto",
    },
    disableContextMenu: true,
    hideControls: true,
    autoplay: false,
    muted: false,
    volume: 1,
    storage: {
      enabled: true,
      key: "plyr-settings",
    },
  };

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="plyr-container">
        <Plyr
          ref={plyrRef}
          source={{
            type: "video",
            title: title,
            sources: [
              {
                src: videoUrl,
                type: "application/x-mpegURL",
              },
            ],
            poster: poster,
          }}
          options={plyrOptions}
        />
      </div>

      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm pointer-events-none">
        {currentQuality}
      </div>

      <div className="absolute bottom-20 right-4 text-white text-xs opacity-50 pointer-events-none select-none">
        © CodeMaster
      </div>
    </div>
  );
}

export { HLSVideoPlayer };
