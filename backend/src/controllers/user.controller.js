import "dotenv/config";
import prisma from "../utils/prisma.js";
import pkgBcrypt from "bcryptjs";
const bcrypt = pkgBcrypt;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a newly registered user (Admin, Manager, User)
 *     tags: [Users]
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
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Email already exists
 *       403:
 *         description: Access denied
 */
// Create User (Admin only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if an admin already exists when trying to create a new one
    if (role === "admin") {
      const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Only one admin user is allowed in the system."
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    next(error);
  }
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 */
// List Users (Admin only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Access denied
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const userToUpdate = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If updating the admin user, ONLY allow name change
    if (userToUpdate.role === "admin") {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { name: name || userToUpdate.name }
      });
      return res.json({
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    }

    // If changing a standard user to an admin, ensure an admin doesn't already exist
    if (role === "admin" && userToUpdate.role !== "admin") {
      const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Only one admin user is allowed in the system."
        });
      }
    }

    const data = { name, email, role };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data
    });

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
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
 *         description: User deleted
 *       403:
 *         description: Cannot delete admin
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userToDel = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!userToDel) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (userToDel.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot delete an admin profile" });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
