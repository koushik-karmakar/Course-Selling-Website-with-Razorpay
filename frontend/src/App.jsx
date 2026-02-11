import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnrollmentPage from "./pages/EnrollmentPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignIn from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import { PaymentPage } from "./pages/Payment.jsx";
import MyCourses from "./pages/MyCourses.jsx";
import LearnPage from "./pages/Learn.jsx";
import NotFound from "./pages/NotFound.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learn/:slug" element={<LearnPage />} />
          <Route path="/course/:slug" element={<EnrollmentPage />} />
          <Route path="/checkout/:slug" element={<CheckoutPage />} />
          <Route path="/payment/:slug" element={<PaymentPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
