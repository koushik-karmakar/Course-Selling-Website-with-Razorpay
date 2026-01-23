import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnrollmentPage from "./pages/EnrollmentPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignIn from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/course/:slug" element={<EnrollmentPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
