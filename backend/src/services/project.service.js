import projectRepository from "../repositories/project.repository.js";
import prisma from "../utils/prisma.js";

class ProjectService {
  async promoteToManagerIfNeeded(managerId) {
    if (!managerId) return;
    const user = await prisma.user.findUnique({ where: { id: managerId } });
    if (user && user.role === "user") {
      await prisma.user.update({
        where: { id: managerId },
        data: { role: "manager" }
      });
    }
  }

  async createProject(data) {
    const project = await projectRepository.createProject(data);
    await this.promoteToManagerIfNeeded(data.managerId);
    return project;
  }

  async getProjects() {
    return await projectRepository.getProjects();
  }

  async updateProject(id, data) {
    const project = await projectRepository.updateProject(id, data);
    if (data.managerId !== undefined) {
      await this.promoteToManagerIfNeeded(data.managerId);
    }
    return project;
  }

  async deleteProject(id) {
    return await projectRepository.deleteProject(id);
  }
}

export default new ProjectService();
