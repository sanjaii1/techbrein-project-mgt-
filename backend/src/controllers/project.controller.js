import projectService from "../services/project.service.js";

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project (Admin, Manager, User)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       403:
 *         description: Access denied
 */
export const createProject = async (req, res, next) => {
  try {
    const { name, description, managerId } = req.body;
    const project = await projectService.createProject({
      name,
      description,
      createdBy: req.user.id,
      managerId: managerId ? Number(managerId) : undefined,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all projects
 */
export const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjects();

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, managerId } = req.body;

    const dataToUpdate = { name, description };
    if (managerId !== undefined) {
      dataToUpdate.managerId = managerId ? Number(managerId) : null;
    }

    const project = await projectService.updateProject(id, dataToUpdate);

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    await projectService.deleteProject(id);

    res.json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    next(error);
  }
};