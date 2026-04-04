import taskRepository from "../repositories/task.repository.js";
import prisma from "../utils/prisma.js";
import AppError from "../utils/AppError.js";

class TaskService {
  async createTask(data, currentUser) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: Number(data.projectId) }
    });
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    
    // Check authorization for MANAGER role
    if (currentUser && currentUser.role === "manager") {
      if (project.managerId !== currentUser.id) {
        throw new AppError("Not authorized. You are not the manager of this project.", 403);
      }
    }

    // If assigning to a user, check if user exists
    if (data.assignedTo) {
      const user = await prisma.user.findUnique({
        where: { id: Number(data.assignedTo) }
      });
      if (!user) {
        throw new AppError("Assigned user not found", 404);
      }
    }

    const payload = {
      title: data.title,
      description: data.description,
      status: data.status || "todo",
      projectId: Number(data.projectId),
      assignedTo: data.assignedTo ? Number(data.assignedTo) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };
    return await taskRepository.createTask(payload);
  }

  async updateTaskStatus(id, status, currentUser) {
    const task = await prisma.task.findUnique({ 
      where: { id: Number(id) },
      include: { project: true }
    });
    if (!task) throw new AppError("Task not found", 404);

    // Check authorization for MANAGER role
    if (currentUser && currentUser.role === "manager") {
      if (task.project.managerId !== currentUser.id) {
        throw new AppError("Not authorized to update status for this project's task.", 403);
      }
    }

    return await taskRepository.updateTask(id, { status });
  }

  async assignTask(id, assignedTo, currentUser) {
    const task = await prisma.task.findUnique({ 
      where: { id: Number(id) },
      include: { project: true }
    });
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // Check authorization for MANAGER role
    if (currentUser && currentUser.role === "manager") {
      if (task.project.managerId !== currentUser.id) {
        throw new AppError("Not authorized. You are not the manager of this project.", 403);
      }
    }

    const user = await prisma.user.findUnique({ where: { id: Number(assignedTo) } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return await taskRepository.updateTask(id, { assignedTo: Number(assignedTo) });
  }

  /**
   * Paginated + filtered list of tasks.
   * @param {{ projectId?, status?, assignedTo?, page?, limit? }} query
   */
  async getTasks(query, currentUser = null) {
    const { projectId, status, assignedTo } = query;
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const skip = (page - 1) * limit;

    const filters = {};
    if (projectId) filters.projectId = Number(projectId);
    if (status) {
      filters.status = {
        in: [status, status.toLowerCase(), status.toUpperCase()]
      };
    }

    // Role-based filtering
    if (currentUser && currentUser.role !== 'admin') {
      filters.OR = [
        { assignedTo: currentUser.id },
        { project: { managerId: Number(currentUser.id) } },
        { project: { createdBy: Number(currentUser.id) } }
      ];
    } else if (assignedTo) {
      filters.assignedTo = Number(assignedTo);
    }

    const [tasks, total] = await Promise.all([
      taskRepository.getTasks(filters, skip, limit),
      taskRepository.countTasks(filters),
    ]);

    return {
      data: tasks,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateTask(id, data, currentUser) {
    const task = await prisma.task.findUnique({ 
      where: { id: Number(id) },
      include: { project: true }
    });
    if (!task) throw new AppError("Task not found", 404);

    if (currentUser && currentUser.role === "manager") {
      if (task.project.managerId !== currentUser.id) {
        throw new AppError("Not authorized to update this task.", 403);
      }
    }

    if (data.assignedTo) {
      const user = await prisma.user.findUnique({ where: { id: Number(data.assignedTo) } });
      if (!user) throw new AppError("Assigned user not found", 404);
    }

    const payload = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.status !== undefined) payload.status = data.status;
    if (data.projectId !== undefined) payload.projectId = Number(data.projectId);
    if (data.assignedTo !== undefined) payload.assignedTo = data.assignedTo !== null && data.assignedTo !== "" ? Number(data.assignedTo) : null;
    if (data.dueDate !== undefined) payload.dueDate = data.dueDate ? new Date(data.dueDate) : null;

    return await taskRepository.updateTask(id, payload);
  }

  async deleteTask(id, currentUser) {
    const task = await prisma.task.findUnique({ 
      where: { id: Number(id) },
      include: { project: true }
    });
    if (!task) throw new AppError("Task not found", 404);

    if (currentUser && currentUser.role === "manager") {
      if (task.project.managerId !== currentUser.id) {
        throw new AppError("Not authorized to delete this task.", 403);
      }
    }

    return await taskRepository.deleteTask(id);
  }
}

export default new TaskService();
