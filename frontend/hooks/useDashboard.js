import { useState, useCallback } from "react";
import api from "@/lib/api";

export const useDashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        activeTasks: 0
    });
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [projectsRes, tasksRes] = await Promise.all([
                api.get("/projects?page=1&limit=100"),
                api.get("/tasks?page=1&limit=100")
            ]);

            const projects = projectsRes.data.data || [];
            const tasks = tasksRes.data.data || [];
            const totalProjects = projectsRes.data.total ?? projects.length;
            const totalTasks = tasksRes.data.total ?? tasks.length;

            // Calculate stats
            const completedTasks = tasks.filter(t => {
                const s = t.status?.toLowerCase() || "";
                return s === "done" || s === "completed";
            }).length;

            setStats({
                totalProjects,
                totalTasks,
                completedTasks,
                activeTasks: totalTasks - completedTasks
            });

            // Show latest 5 projects & tasks
            setRecentProjects(projects.slice(0, 5));
            setRecentTasks(projects.length > 0 ? tasks.slice(0, 6) : []);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            if (err.response) {
                console.error("Error response data:", err.response.data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        stats,
        recentProjects,
        recentTasks,
        loading,
        fetchDashboardData
    };
};
