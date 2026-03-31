"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data.data);
  };

  return (
    <div>
      <h2>Projects</h2>
      {projects.map((p) => (
        <div key={p.id}>
          <h4>{p.name}</h4>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}