import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ForgotPasswordResetPage from "./pages/ForgotPasswordResetPage";
import OtpPage from "./pages/OtpPage";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./router/ProtectedRoute";
import Header from "./navbar/Header";
import Footer from "./navbar/Footer";

const App = () => {
    return (
        <Router>
            <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased">
                <Header />
                <main className="flex-grow pt-16">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/forgot-password/reset" element={<ForgotPasswordResetPage />} />
                        <Route path="/verify-otp" element={<OtpPage />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/home" element={<Dashboard />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
