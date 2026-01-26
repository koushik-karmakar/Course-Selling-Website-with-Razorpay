import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const paymentData = location.state;
  const total = paymentData.course.price.replace("₹", "").replace(",", "");
  let user;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
        const { data } = await axios.get(`${backend}/api/users/me`, {
          withCredentials: true,
        });
        user = data.user;
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
    if (!paymentData) return;

    handleRazorpayPayment();
  }, [paymentData]);

  const handleRazorpayPayment = async () => {
    const load = await loadRazorpay();
    if (!load) {
      showAlert({
        type: "error",
        title: "Payment Error",
        message: "Razorpay SDK failed to load. Please try again.",
      });
      return;
    }
    const backend = import.meta.env.VITE_BACKEND_PORT_LINK;
    const { data: order } = await axios.post(
      `${backend}/api/payment/create-order`,
      {
        courseId: paymentData?.course?.id,
      },
      {
        withCredentials: true,
      },
    );

    const option = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      currency: "INR",
      amount: total * 100,
      name: "CodeMaster",
      description: paymentData.course?.title,
      order_id: order.id,

      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phone,
      },

      handler: async (response) => {
        await axios.post(
          `${backend}/api/payment/verify`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: course?.id || courseFromState?.id,
          },
          {
            withCredentials: true,
          },
        );

        showAlert({
          type: "success",
          title: "Payment Successful!",
          message: "You are now enrolled in the course.",
          showRedirect: true,
          redirectText: "Go to Course",
          onRedirect: () => {
            navigate(`/course/${course?.url || courseFromState?.url}/learn`);
          },
        });
      },

      theme: {
        color: "#6366f1",
      },
    };

    const payment = new window.Razorpay(option);
    payment.open();
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
      </div>
    </div>
  );
};
export { PaymentPage };
