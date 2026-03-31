import "dotenv/config";
import prisma from "../utils/prisma.js";
import pkgBcrypt from "bcryptjs";
const bcrypt = pkgBcrypt;

// Create User (Admin only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

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
