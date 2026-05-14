import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MeshBackground } from "../components/layout/MeshBackground";
import { Spinner } from "../components/ui";

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, bootstrapping } = useAuth();

    if (bootstrapping) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
                <MeshBackground />
                <div className="relative z-10">
                    <Spinner label="Restoring your session…" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
