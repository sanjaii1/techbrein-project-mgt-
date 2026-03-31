"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CreateTask from "@/components/CreateTask";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data.data);
  };

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.map((t) => (
        <div key={t.id}>
          <h4>{t.title}</h4>
          <p>Status: {t.status}</p>
        </div>
      ))}

      <CreateTask refresh={fetchTasks} />
    </div>
  );
}
