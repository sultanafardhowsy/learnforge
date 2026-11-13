import { prisma } from "../config/prisma";

export type LectureInput = {
  title: string;
  description: string;
  videoUrl: string;
  order?: number;
};

export const LectureModel = {
  findByCourse(courseId: string) {
    return prisma.lecture.findMany({
      where: { courseId },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  },

  findById(id: string) {
    return prisma.lecture.findUnique({
      where: { id },
      include: { course: { select: { id: true, title: true } } },
    });
  },

  async create(courseId: string, data: LectureInput) {
    // Append to the end when no explicit order is given.
    let order = data.order;
    if (order === undefined) {
      const last = await prisma.lecture.findFirst({
        where: { courseId },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      order = (last?.order ?? 0) + 1;
    }
    return prisma.lecture.create({ data: { ...data, order, courseId } });
  },

  update(id: string, data: Partial<LectureInput>) {
    return prisma.lecture.update({ where: { id }, data });
  },

  async remove(id: string) {
    await prisma.lecture.delete({ where: { id } });
  },
};
