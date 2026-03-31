import prisma from "../utils/prisma.js";

// Create Project (Admin)
export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdBy: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Projects
export const getProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany();

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// Update Project
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Project
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id: Number(id) },
    });

    res.json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    next(error);
  }
};