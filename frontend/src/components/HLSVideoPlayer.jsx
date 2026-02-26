import { useEffect, useRef, useState, useCallback } from "react";
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

  .video-plyr-mount {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  .video-plyr-mount .plyr,
  .video-plyr-mount video {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }

  .video-plyr-mount .plyr__video-wrapper {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }
  .video-plyr-mount .plyr__video-wrapper video {
    object-fit: contain !important;
  }

  /* ── Thumbnail ─────────────────────────────────────────── */
  .video-thumb-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    z-index: 5;
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

  /* ── Title overlay ──────────────────────────────────────── */
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

  /* ── Quality badge ──────────────────────────────────────── */
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

  /* ── Custom centre play/pause button ───────────────────── */
  .custom-play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    z-index: 12;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    opacity: 1;
    pointer-events: all;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    transition:
      transform 0.18s cubic-bezier(0.34,1.56,0.64,1),
      background 0.18s ease,
      border-color 0.18s ease,
      opacity 0.25s ease,
      box-shadow 0.18s ease;
  }

  /* Hidden state — only when playing AND controls hidden */
  .custom-play-btn.controls-hidden {
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0.85);
  }

  /* Hovering always reveals it even if hidden */
  .custom-play-btn.controls-hidden:hover {
    opacity: 1 !important;
    pointer-events: all !important;
    transform: translate(-50%, -50%) scale(1.08) !important;
  }

  .custom-play-btn:hover {
    transform: translate(-50%, -50%) scale(1.08);
    background: rgba(255,255,255,0.25);
    border-color: rgba(255,255,255,0.75);
    box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 0 10px rgba(255,255,255,0.06);
  }
  .custom-play-btn:active {
    transform: translate(-50%, -50%) scale(0.94) !important;
  }
  .custom-play-btn svg {
    width: 28px;
    height: 28px;
    fill: #fff;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
    flex-shrink: 0;
  }
  .custom-play-btn .icon-play  { margin-left: 3px; }
  .custom-play-btn .icon-pause { margin-left: 0; }

  /* Icon toggling via data attribute */
  .custom-play-btn[data-playing="false"] .icon-pause { display: none; }
  .custom-play-btn[data-playing="false"] .icon-play  { display: block; }
  .custom-play-btn[data-playing="true"]  .icon-play  { display: none; }
  .custom-play-btn[data-playing="true"]  .icon-pause { display: block; }

  /* ── Ripple ─────────────────────────────────────────────── */
  @keyframes play-ripple {
    0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.55; }
    100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0;    }
  }
  .play-ripple {
    position: absolute;
    top: 50%; left: 50%;
    width: 68px; height: 68px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.5);
    animation: play-ripple 0.55s ease-out forwards;
    pointer-events: none;
    z-index: 11;
  }

  /* ========================================
     MOBILE STYLES (< 768px)
     ======================================== */
  @media (max-width: 767px) {

    .video-plyr-mount .plyr {
      overflow: visible !important;
    }

    .plyr__controls {
      display: flex !important;
      flex-wrap: nowrap !important;
      align-items: center !important;
      padding: 8px 10px 10px !important;
      background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%) !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      box-sizing: border-box !important;
      z-index: 15 !important;
      gap: 2px !important;
      overflow: visible !important;
    }

    .plyr__progress__container {
      flex: 1 1 0% !important;
      min-width: 0 !important;
      width: auto !important;
      position: relative !important;
      bottom: auto !important;
      left: auto !important;
      transform: none !important;
      max-width: none !important;
      margin: 0 4px !important;
      z-index: auto !important;
    }
    .plyr__progress {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      height: 4px !important;
    }
    .plyr__progress input[type=range] {
      height: 4px !important;
      cursor: pointer !important;
      width: 100% !important;
      position: relative !important;
      z-index: 2 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      -webkit-appearance: none !important;
      appearance: none !important;
    }
    .plyr__progress input[type=range]::-webkit-slider-runnable-track {
      height: 4px !important;
      background: transparent !important;
      border-radius: 2px !important;
    }
    .plyr__progress input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none !important;
      height: 12px !important;
      width: 12px !important;
      border-radius: 50% !important;
      background: #fff !important;
      margin-top: -4px !important;
    }
    .plyr__progress__buffer {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      height: 4px !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 2px !important;
      background: rgba(255,255,255,0.2) !important;
      z-index: 1 !important;
    }

    .plyr__controls .plyr__time {
      display: none !important;
    }

    .plyr__controls .plyr__control {
      padding: 3px !important;
      color: #fff !important;
      opacity: 0.92 !important;
      flex-shrink: 0 !important;
    }
    .plyr__controls .plyr__control svg {
      width: 12px !important;
      height: 12px !important;
    }
    .plyr__controls .plyr__control[data-plyr="play"] svg {
      width: 20px !important;
      height: 20px !important;
    }

    .plyr__volume {
      min-width: 0 !important;
      width: auto !important;
    }
    .plyr__volume input[type=range] {
      display: none !important;
    }

    .plyr__controls [data-plyr="settings"],
    .plyr__controls [data-plyr="fullscreen"] {
      display: flex !important;
      flex-shrink: 0 !important;
    }

    .plyr__menu {
      position: relative !important;
      overflow: visible !important;
    }
    .plyr__menu__container {
      position: absolute !important;
      bottom: 20px !important;
      right: -55px !important;
      top: auto !important;
      left: auto !important;
      margin: 0 !important;
      transform-origin: bottom right !important;
      animation: plyr-menu-up 0.15s ease !important;
      z-index: 99999 !important;
      min-width: 160px !important;
      max-height: 55vh !important;
      overflow-y: auto !important;
    }

    @keyframes plyr-menu-up {
      from { opacity: 0; transform: scale(0.9) translateY(8px); }
      to   { opacity: 1; transform: scale(1)   translateY(0);   }
    }

    .plyr__control--overlaid { display: none !important; }

    @media (max-width: 360px) {
      .plyr__controls [data-plyr="rewind"],
      .plyr__controls [data-plyr="fast-forward"] {
        display: none !important;
      }
    }
  }

  /* ========================================
     DESKTOP STYLES (≥ 768px)
     ======================================== */
  @media (min-width: 768px) {
    .plyr__controls {
      display: flex !important;
      align-items: center !important;
      padding: 8px 16px !important;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%) !important;
      gap: 8px !important;
    }
    .plyr__controls .plyr__control {
      padding: 8px !important;
      border-radius: 6px !important;
      transition: background 0.2s ease;
    }
    .plyr__controls .plyr__control svg {
      width: 18px !important;
      height: 18px !important;
    }
    .plyr__controls .plyr__control[data-plyr="play"] svg {
      width: 22px !important;
      height: 22px !important;
    }
    .plyr__controls .plyr__control:hover {
      background: rgba(255,255,255,0.15) !important;
    }
    .plyr__time {
      font-size: 14px !important;
      font-weight: 500 !important;
    }
    .plyr__progress__container {
      flex: 1 !important;
      margin: 0 12px !important;
      max-width: 600px !important;
      position: relative !important;
    }
    .plyr__progress {
      margin: 0 !important;
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      height: 5px !important;
    }
    .plyr__progress input[type=range] {
      height: 5px !important;
      cursor: pointer !important;
      width: 100% !important;
      position: relative !important;
      z-index: 2 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
    }
    .plyr__progress__buffer {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      height: 5px !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 2px !important;
      background: rgba(255,255,255,0.2) !important;
      z-index: 1 !important;
    }

    .plyr__volume {
      display: flex !important;
      align-items: center !important;
      margin-left: auto !important;
    }
    .plyr__volume input[type=range] { width: 80px !important; }

    .plyr__menu { position: relative !important; }
    .plyr__menu__container {
      position: absolute !important;
      bottom: calc(100% + 8px) !important;
      top: auto !important;
      left: auto !important;
      right: 0 !important;
      margin: 0 !important;
      transform-origin: bottom right !important;
      animation: plyr-menu-desktop-up 0.15s ease !important;
      z-index: 9999 !important;
      max-height: 400px !important;
      overflow-y: auto !important;
    }
    @keyframes plyr-menu-desktop-up {
      from { opacity: 0; transform: scale(0.9) translateY(8px); }
      to   { opacity: 1; transform: scale(1)   translateY(0);   }
    }
  }

  /* ── Plyr menu shared ───────────────────────────────────── */
  .plyr__menu__container {
    font-size: 13px !important;
    border-radius: 10px !important;
    background: rgba(20,20,25,0.95) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
  }
  .plyr__menu__container .plyr__control {
    color: #fff !important;
    padding: 0px 20px 1px 20px !important;
    font-size: 10px !important;
    white-space: nowrap !important;
  }
  .plyr__menu__container .plyr__control:hover {
    background: rgba(59,130,246,0.3) !important;
  }
  .plyr__menu__container .plyr__control[aria-checked=true] {
    background: rgba(59,130,246,0.5) !important;
    font-weight: 600 !important;
  }
  .plyr__menu__container .plyr__control::after {
    font-size: 11px !important;
    color: rgba(255,255,255,0.6) !important;
  }

  .plyr__control--overlaid { display: none !important; }
`;

function HLSVideoPlayer({ videoUrl, poster, title, onReady, onError }) {
  const mountRef = useRef(null);
  const playBtnRef = useRef(null);
  const rippleHostRef = useRef(null);
  const plyrRef = useRef(null);
  const hlsRef = useRef(null);

  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [showThumb, setShowThumb] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const setPlayingUI = useCallback((playing) => {
    setIsPlaying(playing);
    if (playBtnRef.current) {
      playBtnRef.current.dataset.playing = String(playing);
    }
  }, []);

  const triggerRipple = useCallback(() => {
    const host = rippleHostRef.current;
    if (!host) return;
    const el = document.createElement("div");
    el.className = "play-ripple";
    host.appendChild(el);
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }, []);

  const handlePlayBtnClick = useCallback(() => {
    if (!plyrRef.current) return;
    triggerRipple();
    plyrRef.current.togglePlay();
  }, [triggerRipple]);

  useEffect(() => {
    if (!videoUrl || !mountRef.current) return;

    const video = document.createElement("video");
    video.className = "plyr-video";
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    mountRef.current.appendChild(video);

    let playerCleanup = null;

    const buildPlayer = (hlsInstance) => {
      const qualityLevels = hlsInstance ? hlsInstance.levels.map((l) => l.height) : [];

      const opts = {
        controls: [
          "play", "rewind", "fast-forward", "progress",
          "current-time", "duration", "mute", "volume",
          "settings", "pip", "airplay", "fullscreen",
        ],
        settings: ["quality", "speed"],
        speed: { selected: 1, options: [0.75, 1, 1.25, 1.5, 1.75, 2] },
        keyboard: { focused: true, global: true },
        tooltips: { controls: true, seek: true },
        hideControls: true,
        autoplay: false,
        storage: { enabled: true, key: "plyr-settings" },
        invertTime: false,
        toggleInvert: false,
      };

      if (hlsInstance && qualityLevels.length) {
        opts.quality = {
          default: qualityLevels[0],
          options: qualityLevels,
          forced: true,
          onChange: (q) => {
            const idx = hlsInstance.levels.findIndex((l) => l.height === q);
            if (idx !== -1) hlsInstance.currentLevel = idx;
          },
        };
      }

      const player = new Plyr(video, opts);
      plyrRef.current = player;

      const syncBtn = () => {
        if (!playBtnRef.current) return;
        const plyrEl = mountRef.current?.querySelector(".plyr");
        if (!plyrEl) return;
        const controlsHidden = plyrEl.classList.contains("plyr--hide-controls");
        const playing = plyrEl.classList.contains("plyr--playing");
        if (playing && controlsHidden) {
          playBtnRef.current.classList.add("controls-hidden");
        } else {
          playBtnRef.current.classList.remove("controls-hidden");
        }
      };

      let hideTimer = null;
      const videoBox = mountRef.current.closest(".video-aspect-box");

      const onBoxEnter = () => {
        clearTimeout(hideTimer);
        if (playBtnRef.current) {
          playBtnRef.current.classList.remove("controls-hidden");
        }
      };

      const onBoxLeave = () => {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          const plyrEl = mountRef.current?.querySelector(".plyr");
          const playing = plyrEl?.classList.contains("plyr--playing");
          if (playing) {
            playBtnRef.current?.classList.add("controls-hidden");
          }
        }, 2000);
      };

      videoBox?.addEventListener("mouseenter", onBoxEnter);
      videoBox?.addEventListener("mouseleave", onBoxLeave);

      player.on("controlshidden", syncBtn);
      player.on("controlsshown", syncBtn);
      player.on("play", () => { setPlayingUI(true); setShowThumb(false); syncBtn(); });
      player.on("pause", () => { setPlayingUI(false); syncBtn(); });
      player.on("ended", () => { setPlayingUI(false); syncBtn(); });

      return () => {
        clearTimeout(hideTimer);
        videoBox?.removeEventListener("mouseenter", onBoxEnter);
        videoBox?.removeEventListener("mouseleave", onBoxLeave);
      };
    };

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

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        playerCleanup = buildPlayer(hls); // ← only called once, here
        if (onReady)
          onReady({ qualities: data.levels.map((l) => `${l.height}p`), duration: video.duration });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentQuality(data.level === -1 ? "Auto" : `${hls.levels[data.level].height}p`);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else {
            hls.destroy();
            if (onError) onError(new Error(`Failed to load video: ${data.details}`));
          }
        }
      });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      playerCleanup = buildPlayer(null);
      video.addEventListener("loadedmetadata", () => {
        if (onReady) onReady({ qualities: ["Auto"], duration: video.duration });
      });

    } else {
      if (onError) onError(new Error("HLS is not supported in your browser"));
    }

    return () => {
      if (typeof playerCleanup === "function") playerCleanup();
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      if (plyrRef.current) { plyrRef.current.destroy(); plyrRef.current = null; }
      if (mountRef.current && video.parentNode === mountRef.current) {
        mountRef.current.removeChild(video);
      }
    };
  }, [videoUrl, onReady, onError, setPlayingUI]);

  if (!videoUrl) {
    return (
      <div className="video-aspect-box">
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p>Loading video…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{playerStyle}</style>

      <div className="video-aspect-box">
        <div ref={mountRef} className="video-plyr-mount" />


        <div ref={rippleHostRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 11 }} />


        {poster && (
          <div className={`video-thumb-layer${showThumb ? "" : " hidden"}`}>
            <img src={poster} alt={title} draggable={false} />
          </div>
        )}


        <div className={`video-title-overlay${isPlaying ? " hidden" : ""}`}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            borderRadius: 8,
            padding: "10px 14px",
            maxWidth: 420,
          }}>
            <h2 style={{
              margin: 0, color: "#fff",
              fontSize: "clamp(14px, 2vw, 20px)",
              fontWeight: 700, lineHeight: 1.3,
            }}>
              {title}
            </h2>
          </div>
        </div>


        <div className="video-quality-badge">{currentQuality}</div>


        <button
          ref={playBtnRef}
          className="custom-play-btn"
          data-playing="false"
          onClick={handlePlayBtnClick}
          aria-label="Play / Pause"
        >
          <svg className="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          <svg className="icon-pause" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
        </button>

      </div>
    </>
  );
}

export { HLSVideoPlayer };