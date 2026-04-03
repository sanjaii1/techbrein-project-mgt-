import prisma from "../utils/prisma.js";

class ProjectRepository {
  async createProject(data) {
    return await prisma.project.create({ data });
  }

  /**
   * Paginated list of projects with relations.
   * @param {object} filters  - Prisma `where` clause
   * @param {number} skip
   * @param {number} take
   */
  async getProjects(filters = {}, skip = 0, take = 10) {
    return await prisma.project.findMany({
      where: filters,
      skip,
      take,
      orderBy: { id: "desc" },
      include: {
        manager: {
          select: { id: true, name: true, email: true, role: true },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
            user: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  /**
   * Total count (for pagination meta).
   * @param {object} filters
   */
  async countProjects(filters = {}) {
    return await prisma.project.count({ where: filters });
  }

  async findById(id) {
    return await prisma.project.findUnique({ where: { id: Number(id) } });
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
