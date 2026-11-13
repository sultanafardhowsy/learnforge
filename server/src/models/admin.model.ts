import { prisma } from "../config/prisma";

export const AdminModel = {
  findByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.admin.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  },
};
