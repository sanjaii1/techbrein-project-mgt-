import prisma from "../utils/prisma.js";

class ProjectRepository {
  async createProject(data) {
    return await prisma.project.create({ data });
  }

  async getProjects() {
    return await prisma.project.findMany({
      include: {
        manager: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });
  }

  async updateProject(id, data) {
    return await prisma.project.update({
      where: { id: Number(id) },
      data,
    });
  }

  async deleteProject(id) {
    return await prisma.project.delete({
      where: { id: Number(id) },
    });
  }
}

export default new ProjectRepository();
