import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError("");
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            router.push("/dashboard");
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return {
        login,
        logout,
        loading,
        error
    };
};
