import projectRepository from "../repositories/project.repository.js";
import prisma from "../utils/prisma.js";

class ProjectService {
  async promoteToManagerIfNeeded(managerId) {
    if (!managerId) return;
    const user = await prisma.user.findUnique({ where: { id: Number(managerId) } });
    if (user && user.role === "user") {
      await prisma.user.update({
        where: { id: Number(managerId) },
        data: { role: "manager" }
      });
    }
  }

  async createProject(data) {
    if (data.managerId) {
      const user = await prisma.user.findUnique({ where: { id: Number(data.managerId) } });
      if (!user) throw new Error("Manager user not found");
    }

    const project = await projectRepository.createProject(data);
    await this.promoteToManagerIfNeeded(data.managerId);
    return project;
  }

  async getProjects() {
    return await projectRepository.getProjects();
  }

  async updateProject(id, data) {
    const existingProject = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!existingProject) throw new Error("Project not found");

    if (data.managerId) {
      const user = await prisma.user.findUnique({ where: { id: Number(data.managerId) } });
      if (!user) throw new Error("Manager user not found");
    }

    const project = await projectRepository.updateProject(id, data);
    if (data.managerId !== undefined) {
      await this.promoteToManagerIfNeeded(data.managerId);
    }
    return project;
  }

  async deleteProject(id) {
    const existingProject = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!existingProject) throw new Error("Project not found");
    return await projectRepository.deleteProject(id);
  }
}

export default new ProjectService();
