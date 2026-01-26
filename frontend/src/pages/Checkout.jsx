import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Shield,
  Lock,
  CreditCard,
  Smartphone,
  Globe,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  CreditCard as StripeIcon,
} from "lucide-react";
import { coursesData } from "../data/coursesData.jsx";
import { useAlert } from "../components/Alert.jsx";
import axios from "axios";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const { AlertComponent, showAlert } = useAlert();

  const course = coursesData.find((c) => c.url === slug);
  const getUser = localStorage.getItem("code-master-user");
  const user = getUser ? JSON.parse(getUser) : null;

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.mobile,
    address: "",
    country: "India",
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const courseFromState = location.state?.course;

  const originalPrice = course?.originalPrice || courseFromState?.originalPrice;
  const discountedPrice = course?.price || courseFromState?.price;
  const price = Number(
    parseInt(discountedPrice.replace("₹", "").replace(",", "")),
  );
  const tax = Math.floor(price * 0.18);
  const total = price + tax - discount;
  const currentCourse = course || courseFromState;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const isFormComplete = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
    ];
    return requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== "",
    );
  };

  const isPaymentButtonDisabled =
    isLoading || !selectedPayment || !isFormComplete();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCouponApply = () => {
    if (couponCode === "WELCOME10") {
      const price = parseInt(discountedPrice.replace("₹", "").replace(",", ""));
      const discountAmount = Math.floor(price * 0.1);
      setDiscount(discountAmount);
      showAlert({
        type: "success",
        title: "Coupon Applied!",
        message: `You got ₹${discountAmount} discount on your purchase.`,
      });
    } else {
      showAlert({
        type: "error",
        title: "Invalid Coupon",
        message: "The coupon code you entered is invalid or expired.",
      });
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      showAlert({
        type: "error",
        title: "Payment Method Required",
        message: "Please select a payment method before proceeding.",
      });
      return;
    }

    if (!isFormComplete()) {
      showAlert({
        type: "error",
        title: "Incomplete Information",
        message: "Please fill in all required fields before proceeding.",
      });
      return;
    }

    setIsLoading(true);

    if (selectedPayment === "razorpay") {
      await handleRazorPayment();
    } else if (selectedPayment === "stripe") {
      showAlert({
        type: "info",
        title: "Coming Soon",
        message: "Stripe payment integration is currently under development.",
      });
      setIsLoading(false);
    }
  };

  const handleRazorPayment = async () => {
    setIsLoading(true);
    try {
      navigate(`/payment/${course.url}`, {
        state: { course: course },
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Enrollment Failed",
        message:
          "There was an error processing your enrollment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!course && !courseFromState) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertComponent />
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-950 text-gray-100">
        <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="cursor-pointer flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Course</span>
              </button>

              <div className="flex items-center space-x-6">
                <div className="hidden md:block">
                  <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    CodeMaster
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Complete Your Purchase
              </h1>
              <p className="text-gray-400">
                Review your order and proceed to payment
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Order Summary</span>
                  </h2>

                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-20 h-20 rounded-lg bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                      <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        CM
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {currentCourse.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        By {currentCourse.instructor}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>Lifetime Access</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>Certificate Included</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold mb-4">
                      Billing Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          readOnly
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="John"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          readOnly
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          readOnly
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          readOnly
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          rows="3"
                          placeholder="Street Address"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-6">
                    Select Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        selectedPayment === "razorpay"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => setSelectedPayment("razorpay")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold">Razorpay</h3>
                            <p className="text-gray-400 text-sm">
                              Credit/Debit Cards, UPI, Net Banking
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 ${selectedPayment === "razorpay" ? "border-blue-500 bg-blue-500" : "border-gray-600"}`}
                        >
                          {selectedPayment === "razorpay" && (
                            <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedPayment === "razorpay" && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-sm text-gray-300 mb-3">
                            You'll be redirected to Razorpay's secure payment
                            gateway to complete your purchase.
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-blue-400">
                            <Shield className="w-4 h-4" />
                            <span>
                              Secure payment with 256-bit SSL encryption
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className="border border-gray-700 rounded-xl p-4 opacity-50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                            <StripeIcon className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-bold">Stripe</h3>
                            <p className="text-gray-400 text-sm">
                              International cards and payments
                            </p>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isFormComplete() && (
                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 text-amber-400 mt-0.5">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-amber-300 font-medium">
                            Complete all required fields
                          </p>
                          <p className="text-xs text-amber-400 mt-1">
                            Please fill in your address and ensure all fields
                            are completed to proceed with payment.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-700">
                      <h3 className="font-bold text-lg mb-4">Order Summary</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Course Price</span>
                          <span className="font-medium">{discountedPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Original Price</span>
                          <span className="line-through text-gray-500">
                            {originalPrice}
                          </span>
                        </div>

                        {discount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Discount</span>
                            <span className="text-green-400">-₹{discount}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax (18% GST)</span>
                          <span>₹{tax}</span>
                        </div>

                        <div className="pt-3 border-t border-gray-700">
                          <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="text-2xl font-bold">
                              ₹{total.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            Inclusive of all taxes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-b border-gray-700">
                      <h4 className="font-bold mb-3">Have a coupon code?</h4>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter coupon code"
                        />
                        <button
                          onClick={handleCouponApply}
                          className=" cursor-pointer px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Try:{" "}
                        <span
                          className="text-blue-400 cursor-pointer"
                          onClick={() => setCouponCode("WELCOME10")}
                        >
                          WELCOME10
                        </span>{" "}
                        for 10% off
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-center space-x-3 mb-6">
                        <Lock className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">
                          Secure SSL Encryption
                        </span>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={isPaymentButtonDisabled}
                        className="cursor-pointer w-full py-4 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : !selectedPayment ? (
                          "Select Payment Method"
                        ) : !isFormComplete() ? (
                          "Complete All Fields"
                        ) : (
                          <>
                            <span>Complete Purchase</span>
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-400">
                          By completing your purchase, you agree to our{" "}
                          <a
                            href="/terms"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Terms of Service
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <h4 className="font-bold">30-Day Money Back</h4>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Full refund if you're not satisfied with the course
                      </p>
                    </div>

                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <Lock className="w-5 h-5 text-blue-400" />
                        <h4 className="font-bold">Secure Payment</h4>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 py-6 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-500 text-sm">
                <p>© 2024 CodeMaster. All rights reserved.</p>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/refund"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Refund Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
