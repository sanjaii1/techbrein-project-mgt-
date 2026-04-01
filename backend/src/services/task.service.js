import taskRepository from "../repositories/task.repository.js";
import prisma from "../utils/prisma.js";

class TaskService {
  async createTask(data, currentUser) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: Number(data.projectId) }
    });
    if (!project) {
      throw new Error("Project not found");
    }
    
    // Check authorization for MANAGER role
    if (currentUser && currentUser.role === "manager") {
      if (project.managerId !== currentUser.id) {
        throw new Error("Not authorized. You are not the manager of this project.");
      }
    }

    // If assigning to a user, check if user exists
    if (data.assignedTo) {
      const user = await prisma.user.findUnique({
        where: { id: Number(data.assignedTo) }
      });
      if (!user) {
        throw new Error("Assigned user not found");
      }
    }

    const payload = {
      title: data.title,
      description: data.description,
      status: "todo",
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
    if (!task) throw new Error("Task not found");

    // Check authorization for MANAGER role
    if (currentUser && currentUser.role === "manager") {
      if (task.project.managerId !== currentUser.id) {
        throw new Error("Not authorized to update status for this project's task.");
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
      throw new Error("Task not found");
    }

    // Check authorization for MANAGER role
    if (currentUser && currentUser.role === "manager") {
      if (task.project.managerId !== currentUser.id) {
        throw new Error("Not authorized. You are not the manager of this project.");
      }
    }

    const user = await prisma.user.findUnique({ where: { id: Number(assignedTo) } });
    if (!user) {
      throw new Error("User not found");
    }

    return await taskRepository.updateTask(id, { assignedTo: Number(assignedTo) });
  }

  async getTasks(query) {
    const { projectId, status, assignedTo, page = 1, limit = 10 } = query;

    const filters = {};
    if (projectId) filters.projectId = Number(projectId);
    if (status) filters.status = status;
    if (assignedTo) filters.assignedTo = Number(assignedTo);

    const skip = (page - 1) * limit;
    const take = Number(limit);

    const tasks = await taskRepository.getTasks(filters, skip, take);
    const total = await taskRepository.countTasks(filters);

    return {
      page: Number(page),
      total,
      data: tasks,
    };
  }
}

export default new TaskService();
