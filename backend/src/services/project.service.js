import projectRepository from "../repositories/project.repository.js";
import prisma from "../utils/prisma.js";
import AppError from "../utils/AppError.js";

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
      if (!user) throw new AppError("Manager user not found", 404);
    }

    // Use transaction: create project + promote manager atomically
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({ data });

      if (data.managerId) {
        const user = await tx.user.findUnique({ where: { id: Number(data.managerId) } });
        if (user && user.role === "user") {
          await tx.user.update({
            where: { id: Number(data.managerId) },
            data: { role: "manager" },
          });
        }
      }

      return created;
    });

    return project;
  }

  /**
   * Paginated list of projects.
   * @param {{ page?: number, limit?: number }} query
   */
  async getProjects(query = {}, currentUser = null) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const skip = (page - 1) * limit;

    const filters = {};
    // Filter for non-admin users
    if (currentUser && currentUser.role !== 'admin') {
      filters.OR = [
        { createdBy: currentUser.id },
        { managerId: currentUser.id },
        { tasks: { some: { assignedTo: currentUser.id } } }
      ];
    }

    const [projects, total] = await Promise.all([
      projectRepository.getProjects(filters, skip, limit),
      projectRepository.countProjects(filters),
    ]);

    return {
      data: projects,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateProject(id, data) {
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) throw new AppError("Project not found", 404);

    if (data.managerId) {
      const user = await prisma.user.findUnique({ where: { id: Number(data.managerId) } });
      if (!user) throw new AppError("Manager user not found", 404);
    }

    // Use transaction: update project + promote manager atomically
    const project = await prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: Number(id) },
        data,
      });

      if (data.managerId !== undefined && data.managerId) {
        const user = await tx.user.findUnique({ where: { id: Number(data.managerId) } });
        if (user && user.role === "user") {
          await tx.user.update({
            where: { id: Number(data.managerId) },
            data: { role: "manager" },
          });
        }
      }

      return updated;
    });

    return project;
  }

  async deleteProject(id) {
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) throw new AppError("Project not found", 404);
    return await projectRepository.deleteProject(id);
  }
}

export default new ProjectService();
