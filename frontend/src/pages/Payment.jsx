import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../components/Alert";

const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const paymentInitialized = useRef(false);
  const { AlertComponent, showAlert } = useAlert();
  const razorpayScriptLoaded = useRef(false);
  const razorpayInstanceRef = useRef(null);

  const paymentData = location.state;
  console.log(paymentData);
  const courseId = paymentData?.courseId;
  const amount = paymentData?.amount;
  const courseTitle = paymentData?.courseTitle;
  useEffect(() => {
    if (!paymentData || !courseId || !amount) {
      showAlert({
        type: "error",
        title: "Invalid Payment",
        message: "Missing payment information. Please try again.",
      });
      navigate(`/course/${slug}`, { replace: true });
      return;
    }
    setIsLoading(false);
  }, [paymentData, courseId, amount, navigate, slug, showAlert]);

  useEffect(() => {
    if (isLoading || paymentInitialized.current) return;
    paymentInitialized.current = true;
    initializePayment();
  }, [isLoading]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      sessionStorage.removeItem(`payment_started_${courseId}`);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [courseId]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        razorpayScriptLoaded.current = true;
        resolve(true);
        return;
      }
      if (razorpayScriptLoaded.current) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        razorpayScriptLoaded.current = true;
        resolve(true);
      };
      script.onerror = () => {
        showAlert({
          type: "error",
          title: "Payment Error",
          message: "Failed to load payment gateway. Please try again.",
        });
        navigate(`/course/${slug}`, { replace: true });
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const initializePayment = async () => {
    try {
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) return;
      sessionStorage.setItem(`payment_started_${courseId}`, "true");
      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const userResponse = await axios.get(`${backend}/api/users/me`, {
        withCredentials: true,
      });
      const user = userResponse.data.user;
      const orderResponse = await axios.post(
        `${backend}/api/payment/create-order`,
        { courseId, amount },
        { withCredentials: true },
      );

      const order = orderResponse.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        currency: "INR",
        amount: order.amount,
        name: "CodeMaster",
        description: courseTitle || "Course Purchase",
        order_id: order.orderId,
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            sessionStorage.removeItem(`payment_started_${courseId}`);
            showAlert({
              type: "info",
              title: "Payment Cancelled",
              message: "You cancelled the payment.",
            });
            navigate(`/course/${slug}`, { replace: true });
          },
        },
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `${backend}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: courseId,
                courseTitle,
              },
              { withCredentials: true },
            );

            if (verifyResponse.data.success) {
              sessionStorage.removeItem(`payment_started_${courseId}`);
              showAlert({
                type: "success",
                title: "Payment Successful!",
                message: "You now have access to the course.",
              });
              setTimeout(() => {
                navigate("/my-courses", { replace: true });
              }, 1500);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            sessionStorage.removeItem(`payment_started_${courseId}`);
            showAlert({
              type: "error",
              title: "Payment Failed",
              message: "Payment verification failed. Please contact support.",
            });
            navigate(`/course/${slug}`, { replace: true });
          }
        },
      };

      razorpayInstanceRef.current = new window.Razorpay(options);
      razorpayInstanceRef.current.open();
      razorpayInstanceRef.current.on("payment.failed", (response) => {
        sessionStorage.removeItem(`payment_started_${courseId}`);
        razorpayInstanceRef.current?.close();
        razorpayInstanceRef.current = null;
        showAlert({
          type: "error",
          title: "Payment Failed",
          message:
            response.error.description || "Payment failed. Please try again.",
        });
      });
    } catch (error) {
      sessionStorage.removeItem(`payment_started_${courseId}`);
      console.error("Payment initialization error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to initialize payment";

      showAlert({
        type: "error",
        title: "Payment Error",
        message: errorMessage,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-950 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-white">
            Preparing secure payment…
          </h2>
          <p className="text-gray-400 mt-2">
            Please wait while we set up your payment
          </p>
          <AlertComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-950 to-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-white">
          Opening secure payment gateway…
        </h2>
        <p className="text-gray-400 mt-2">
          Razorpay window will open shortly. Please don't close this page.
        </p>
        <AlertComponent />
      </div>
    </div>
  );
};

export { PaymentPage };
