import prisma from "../utils/prisma.js";
import pkgBcrypt from "bcryptjs";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";

const bcrypt = pkgBcrypt;

class UserService {
  // ─── Create ──────────────────────────────────────────────────────────────────

  /**
   * Create a new user.
   * - Enforces the "only one admin" rule.
   * - Hashes the password before storing.
   * @param {{ name: string, email: string, password: string, role: string }} data
   */
  async createUser(data) {
    const { name, email, password, role } = data;

    if (role === "admin") {
      const existingAdmin = await userRepository.findFirst({ role: "admin" });
      if (existingAdmin) {
        throw new AppError("Only one admin user is allowed in the system.", 400);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use a transaction: if anything fails mid-way the user is not created
    const user = await prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: { name, email, password: hashedPassword, role },
      });
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  // ─── Read (paginated) ─────────────────────────────────────────────────────────

  /**
   * Return a paginated list of users (no passwords).
   * @param {{ page?: number, limit?: number }} query
   * @returns {{ data: User[], page: number, limit: number, total: number, totalPages: number }}
   */
  async getUsers(query = {}) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      userRepository.findAll(skip, limit),
      userRepository.count(),
    ]);

    return {
      data: users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── Update ──────────────────────────────────────────────────────────────────

  /**
   * Update a user by ID.
   * - Admin's role/email cannot be changed (only their name).
   * - Prevents promoting a second admin.
   * - Re-hashes the password if provided.
   * @param {number} id
   * @param {{ name?: string, email?: string, role?: string, password?: string }} data
   */
  async updateUser(id, data) {
    const { name, email, role, password } = data;

    const existing = await userRepository.findById(id);
    if (!existing) throw new AppError("User not found", 404);

    // Admin: only allow name updates
    if (existing.role === "admin") {
      const updated = await userRepository.update(id, {
        name: name ?? existing.name,
      });
      return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      };
    }

    // Promoting to admin — ensure uniqueness
    if (role === "admin" && existing.role !== "admin") {
      const existingAdmin = await userRepository.findFirst({ role: "admin" });
      if (existingAdmin) {
        throw new AppError("Only one admin user is allowed in the system.", 400);
      }
    }

    const payload = {};
    if (name !== undefined) payload.name = name;
    if (email !== undefined) payload.email = email;
    if (role !== undefined) payload.role = role;
    if (password) payload.password = await bcrypt.hash(password, 10);

    const updated = await userRepository.update(id, payload);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    };
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────

  /**
   * Delete a user by ID.
   * - Cannot delete the admin account.
   * @param {number} id
   */
  async deleteUser(id) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new AppError("User not found", 404);
    if (existing.role === "admin") {
      throw new AppError("Cannot delete an admin profile", 403);
    }
    await userRepository.delete(id);
  }
}

export default new UserService();
