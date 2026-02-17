import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import Hls from "hls.js";
import "plyr/dist/plyr.css";


const playerStyle = `
  .video-aspect-box {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
  }


  .video-aspect-box .plyr,
  .video-aspect-box video {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important; 
  }

  
  .video-thumb-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    z-index: 2;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .video-thumb-layer img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    object-position: center;
  }
  .video-thumb-layer.hidden {
    opacity: 0;
    pointer-events: none;
  }

 
  .video-title-overlay {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    z-index: 10;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .video-title-overlay.hidden {
    opacity: 0;
  }

  .video-quality-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
    padding: 2px 10px;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    z-index: 10;
    pointer-events: none;
  }

 
  .video-aspect-box .plyr__video-wrapper {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }
  .video-aspect-box .plyr__video-wrapper video {
    object-fit: contain !important;
  }
`;

function HLSVideoPlayer({ videoUrl, poster, title, onReady, onError }) {
  const videoRef = useRef(null);
  const plyrRef = useRef(null);
  const hlsRef = useRef(null);
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumb, setShowThumb] = useState(true);

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const signedParams = new URL(videoUrl).search;

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
        debug: false,
        xhrSetup: (xhr, url) => {
          if (signedParams && !url.includes("Policy=")) {
            xhr.open("GET", url + signedParams, true);
          }
        },
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const availableQualities = data.levels.map((l) => l.height);

        const player = new Plyr(video, {
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
          settings: ["quality", "speed"],
          speed: {
            selected: 1,
            options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
          },
          quality: {
            default: availableQualities[0],
            options: availableQualities,
            forced: true,
            onChange: (quality) => {
              const levelIndex = hls.levels.findIndex(
                (l) => l.height === quality
              );
              if (levelIndex !== -1) hls.currentLevel = levelIndex;
            },
          },
          keyboard: { focused: true, global: true },
          tooltips: { controls: true, seek: true },
          hideControls: true,
          autoplay: false,
          storage: { enabled: true, key: "plyr-settings" },
        });

        plyrRef.current = player;

        player.on("play", () => {
          setIsPlaying(true);
          setShowThumb(false);
        });
        player.on("pause", () => setIsPlaying(false));
        player.on("ended", () => setIsPlaying(false));

        if (onReady) {
          onReady({
            qualities: data.levels.map((l) => `${l.height}p`),
            duration: video.duration,
          });
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const quality = hls.levels[data.level];
        setCurrentQuality(`${quality.height}p`);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              if (onError)
                onError(new Error(`Failed to load video: ${data.details}`));
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;

      const player = new Plyr(video, {
        controls: [
          "play-large", "play", "progress", "current-time",
          "duration", "mute", "volume", "fullscreen",
        ],
        hideControls: true,
      });

      plyrRef.current = player;
      player.on("play", () => { setIsPlaying(true); setShowThumb(false); });
      player.on("pause", () => setIsPlaying(false));
      player.on("ended", () => setIsPlaying(false));

      video.addEventListener("loadedmetadata", () => {
        if (onReady) onReady({ qualities: ["Auto"], duration: video.duration });
      });
    } else {
      if (onError) onError(new Error("HLS is not supported in your browser"));
    }

    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      if (plyrRef.current) { plyrRef.current.destroy(); plyrRef.current = null; }
    };
  }, [videoUrl, onReady, onError]);

  if (!videoUrl) {
    return (
      <div className="video-aspect-box">
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p>Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{playerStyle}</style>

      <div className="video-aspect-box">

        {poster && (
          <div className={`video-thumb-layer${showThumb ? "" : " hidden"}`}>
            <img src={poster} alt={title} draggable={false} />
          </div>
        )}

        <div className={`video-title-overlay${isPlaying ? " hidden" : ""}`}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(6px)",
              borderRadius: 8,
              padding: "10px 14px",
              maxWidth: 420,
            }}
          >
            <h2
              style={{
                margin: 0, color: "#fff",
                fontSize: "clamp(14px, 2vw, 20px)",
                fontWeight: 700, lineHeight: 1.3,
              }}
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="video-quality-badge">{currentQuality}</div>

        <video
          ref={videoRef}
          className="plyr-video"
          playsInline
          crossOrigin="anonymous"
        />
      </div>
    </>
  );
}

export { HLSVideoPlayer };