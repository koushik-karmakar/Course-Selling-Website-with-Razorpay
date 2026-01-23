import React, { useState, useEffect, useCallback } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiInfo,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

const Alert = ({
  isOpen,
  onClose,
  type = "info",
  title = "",
  message = "",
  showRedirect = false,
  redirectText = "Continue",
  redirectTo = "/",
  onRedirect,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsVisible(true);
    } else {
      document.body.style.overflow = "unset";
      setIsVisible(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleRedirect = () => {
    if (onRedirect) {
      onRedirect();
    }
    handleClose();
  };

  // Don't render anything if not open
  if (!isOpen && !isVisible) return null;

  // Configuration based on alert type
  const alertConfig = {
    success: {
      icon: <FiCheckCircle className="w-12 h-12" />,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      buttonColor: "bg-emerald-500 hover:bg-emerald-600",
      titleColor: "text-emerald-400",
    },
    error: {
      icon: <FiXCircle className="w-12 h-12" />,
      iconColor: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      buttonColor: "bg-rose-500 hover:bg-rose-600",
      titleColor: "text-rose-400",
    },
    warning: {
      icon: <FiAlertCircle className="w-12 h-12" />,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      buttonColor: "bg-amber-500 hover:bg-amber-600",
      titleColor: "text-amber-400",
    },
    info: {
      icon: <FiInfo className="w-12 h-12" />,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      titleColor: "text-blue-400",
    },
  };

  const config = alertConfig[type] || alertConfig.info;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible
          ? "opacity-100 backdrop-blur-sm"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm"></div>

      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800/95 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex justify-center pt-8 pb-4">
            <div
              className={`p-4 rounded-full ${config.bgColor} ${config.borderColor} border-2`}
            >
              <div className={config.iconColor}>{config.icon}</div>
            </div>
          </div>

          <div className="px-8 pb-8 text-center">
            <h3 className={`text-2xl font-bold mb-3 ${config.titleColor}`}>
              {title}
            </h3>

            <p className="text-gray-300 text-base leading-relaxed mb-8">
              {message}
            </p>

            <div
              className={`flex ${showRedirect ? "space-x-4" : "justify-center"}`}
            >
              {showRedirect && (
                <button
                  onClick={handleRedirect}
                  className=" cursor-pointer flex-1 py-3 px-6 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2 group"
                >
                  <span>{redirectText}</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <button
                onClick={handleClose}
                className={`${showRedirect ? "flex-1" : "px-8"} cursor-pointer py-3 rounded-xl border border-gray-600 text-gray-300 font-semibold hover:border-gray-500 hover:text-white hover:bg-gray-700/50 transition-all duration-300`}
              >
                OK
              </button>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const useAlert = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    showRedirect: false,
    redirectText: "Continue",
    redirectTo: "/",
    onRedirect: null,
  });

  const showAlert = useCallback((config) => {
    setAlertState({
      isOpen: true,
      type: config.type || "info",
      title: config.title || "",
      message: config.message || "",
      showRedirect: config.showRedirect || false,
      redirectText: config.redirectText || "Continue",
      redirectTo: config.redirectTo || "/",
      onRedirect: config.onRedirect || null,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const AlertComponent = useCallback(
    () => (
      <Alert
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        showRedirect={alertState.showRedirect}
        redirectText={alertState.redirectText}
        redirectTo={alertState.redirectTo}
        onRedirect={alertState.onRedirect}
      />
    ),
    [alertState, hideAlert],
  );

  return {
    AlertComponent,
    showAlert,
    hideAlert,
    alertState,
  };
};

export default Alert;
