import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../components/Alert";
const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const state = location.state;
  useEffect(() => {
    if (!state) {
      navigate(`/course/${slug}`, { replace: true });
    }
  }, [state, navigate, slug]);
  const { courseId, courseTitle, amount } = state || {};
  const paymentData = { courseId, courseTitle, amount };

  console.log(paymentData);
  console.log(paymentData.courseId);
  const totalRupees = paymentData.amount;
  console.log(totalRupees);
  const { AlertComponent, showAlert } = useAlert();
  const hasStatrted = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
        const { data } = await axios.get(`${backend}/api/users/me`, {
          withCredentials: true,
        });
        setUser(data.user);
        console.log(data.user);
      } catch (error) {
        navigate("/signin");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!paymentData) {
      navigate(`/course/${slug}`, { replace: true });
    }
  }, [paymentData, navigate, slug]);

  useEffect(() => {
    if (!paymentData || !user) return;
    if (hasStatrted.current) return;

    hasStatrted.current = true;
    handleRazorpayPayment();
  }, [paymentData, user]);

  const handleRazorpayPayment = async () => {
    try {
      if (!Number.isFinite(totalRupees) || totalRupees <= 0) {
        showAlert({
          type: "error",
          title: "Payment Error",
          message: "Invalid course price. Please go back and try again.",
        });
        console.log("Invalid course price.");
        navigate(`/course/${slug}`, { replace: true });
        return;
      }

      const load = await loadRazorpay();
      if (!load) {
        showAlert({
          type: "error",
          title: "Payment Error",
          message: "Razorpay SDK failed to load. Please try again.",
        });
        console.log("Razorpay SDK failed to load.");
        navigate(`/course/${slug}`, { replace: true });
        return;
      }

      const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
      const { data: order } = await axios.post(
        `${backend}/api/payment/create-order`,
        {
          courseId: paymentData?.courseId,
          amount: totalRupees,
        },
        {
          withCredentials: true,
        },
      );
      console.log(order.amount, order.orderId);
      console.log(paymentData?.courseTitle);
      const option = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        currency: "INR",
        amount: order.amount,
        name: "CodeMaster",
        description: paymentData?.courseTitle,
        order_id: order.orderId,

        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone,
        },

        handler: async (response) => {
          try {
            const result = await axios.post(
              `${backend}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: paymentData?.courseId,
              },
              {
                withCredentials: true,
              },
            );

            if (result.data.success) {
              setTimeout(() => {
                navigate("/my-courses", { replace: true });
              }, 1000);
            } else {
              throw new Error(
                result.data.message || "Payment verification failed",
              );
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            showAlert({
              type: "error",
              title: "Payment Verification Failed",
              message:
                "Payment was made but verification failed. Please contact support.",
            });
          }
        },

        modal: {
          ondismiss: () => {
            navigate(`/course/${slug}`, { replace: true });
          },
        },
        theme: {
          color: "#6366f1",
        },
      };

      const payment = new window.Razorpay(option);
      payment.open();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to start payment. Please try again.";
      showAlert({
        type: "error",
        title: "Payment Error",
        message,
      });
      console.log("Failed to start payment.");
      // navigate(`/course/${slug}`, { replace: true });
    }
  };

  const loadRazorpay = async () => {
    if (window.Razorpay) return true;
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-950 to-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-white">
          Redirecting to secure payment…
        </h2>
        <p className="text-gray-400 mt-2">
          Please don’t refresh or close this page
        </p>
        <AlertComponent />
      </div>
    </div>
  );
};
export { PaymentPage };
