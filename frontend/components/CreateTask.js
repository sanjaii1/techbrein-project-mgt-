"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function CreateTask({ refresh }) {
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    await api.post("/tasks", {
      title,
      projectId: 1,
    });

    setTitle("");
    refresh();
  };

  return (
    <div>
      <input placeholder="Task title" onChange={(e) => setTitle(e.target.value)} />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}