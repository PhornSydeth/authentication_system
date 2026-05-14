import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { refreshAccessToken } from "../api/ApiClient";
import { fetchCurrentUser, logoutRequest } from "../service/AuthService";

export interface UserProfile {
    username: string;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserProfile | null;
    /** True until initial GET /me completes (avoid protected-route flash). */
    bootstrapping: boolean;
    login: (userData: UserProfile) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bootstrapping, setBootstrapping] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const restoreSession = async () => {
            /**
             * On full page reload, the access cookie may be expired while refresh is still valid.
             * ApiClient already retries once on 401 via refresh; this effect adds an explicit
             * refresh-then-/me fallback so restore is obvious and resilient if that path changes.
             */
            const applyUser = (me: UserProfile) => {
                if (!cancelled) {
                    setUser(me);
                    setIsAuthenticated(true);
                }
            };

            const clearUser = () => {
                if (!cancelled) {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            };

            try {
                const me = await fetchCurrentUser();
                applyUser(me);
            } catch (firstErr) {
                const is401 = axios.isAxiosError(firstErr) && firstErr.response?.status === 401;
                if (!is401) {
                    clearUser();
                    return;
                }
                try {
                    await refreshAccessToken();
                    const me = await fetchCurrentUser();
                    applyUser(me);
                } catch {
                    clearUser();
                }
            } finally {
                if (!cancelled) {
                    setBootstrapping(false);
                }
            }
        };

        void restoreSession();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = (userData: UserProfile) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } catch {
            // Clear local session even if revoke fails
        }
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, bootstrapping, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
