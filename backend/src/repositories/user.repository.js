import prisma from "../utils/prisma.js";

class UserRepository {
  /**
   * Find a user by their unique ID.
   * @param {number} id
   */
  async findById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, role: true, password: true },
    });
  }

  /**
   * Find a user by email (for auth lookups).
   * @param {string} email
   */
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find the first user matching a Prisma `where` clause.
   * @param {object} where
   */
  async findFirst(where) {
    return prisma.user.findFirst({ where });
  }

  /**
   * Paginated list of all users (passwords excluded).
   * @param {number} skip
   * @param {number} take
   */
  async findAll(skip = 0, take = 20) {
    return prisma.user.findMany({
      skip,
      take,
      select: { id: true, name: true, email: true, role: true },
      orderBy: { id: "asc" },
    });
  }

  /**
   * Total count of all users (for pagination meta).
   */
  async count() {
    return prisma.user.count();
  }

  /**
   * Create a new user record.
   * @param {object} data  - { name, email, password (hashed), role }
   */
  async create(data) {
    return prisma.user.create({ data });
  }

  /**
   * Update a user by ID.
   * @param {number} id
   * @param {object} data
   */
  async update(id, data) {
    return prisma.user.update({
      where: { id: Number(id) },
      data,
    });
  }

  /**
   * Delete a user by ID.
   * @param {number} id
   */
  async delete(id) {
    return prisma.user.delete({ where: { id: Number(id) } });
  }
}

export default new UserRepository();
