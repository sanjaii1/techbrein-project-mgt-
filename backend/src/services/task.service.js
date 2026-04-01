import taskRepository from "../repositories/task.repository.js";

class TaskService {
  async createTask(data) {
    const payload = {
      title: data.title,
      description: data.description,
      status: "todo",
      projectId: data.projectId,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };
    return await taskRepository.createTask(payload);
  }

  async updateTaskStatus(id, status) {
    return await taskRepository.updateTask(id, { status });
  }

  async assignTask(id, assignedTo) {
    return await taskRepository.updateTask(id, { assignedTo });
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
