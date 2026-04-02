import prisma from "../utils/prisma.js";

class TaskRepository {
  async createTask(data) {
    return await prisma.task.create({ data });
  }

  async updateTask(id, data) {
    return await prisma.task.update({
      where: { id: Number(id) },
      data,
    });
  }

  async getTasks(filters, skip, take) {
    return await prisma.task.findMany({
      where: filters,
      skip,
      take,
      include: {
        project: true,
        user: true,
      },
    });
  }

  async countTasks(filters) {
    return await prisma.task.count({ where: filters });
  }

  async deleteTask(id) {
    return await prisma.task.delete({
      where: { id: Number(id) },
    });
  }
}

export default new TaskRepository();
