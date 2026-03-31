import prisma from "../utils/prisma.js";

// Create Task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: "todo",
        projectId,
        assignedTo,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Update Task Status
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Assign Task
export const assignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { assignedTo },
    });

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Get Tasks (Filtering + Pagination)
export const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, assignedTo, page = 1, limit = 10 } = req.query;

    const filters = {};

    if (projectId) filters.projectId = Number(projectId);
    if (status) filters.status = status;
    if (assignedTo) filters.assignedTo = Number(assignedTo);

    const tasks = await prisma.task.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: Number(limit),
      include: {
        project: true,
        user: true,
      },
    });

    const total = await prisma.task.count({ where: filters });

    res.json({
      success: true,
      page: Number(page),
      total,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};