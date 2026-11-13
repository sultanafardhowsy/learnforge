import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export type CourseInput = {
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
};

// Prisma returns Decimal for price; convert to a plain number for the API.
function serialize<T extends { price: Prisma.Decimal }>(course: T) {
  return { ...course, price: Number(course.price) };
}

export const CourseModel = {
  async findAll(search?: string) {
    const where: Prisma.CourseWhereInput | undefined = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { lectures: true } } },
    });
    return courses.map(serialize);
  },

  async findById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lectures: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
        _count: { select: { lectures: true } },
      },
    });
    return course ? serialize(course) : null;
  },

  async exists(id: string) {
    const count = await prisma.course.count({ where: { id } });
    return count > 0;
  },

  async create(data: CourseInput) {
    return serialize(await prisma.course.create({ data }));
  },

  async update(id: string, data: Partial<CourseInput>) {
    return serialize(await prisma.course.update({ where: { id }, data }));
  },

  async remove(id: string) {
    await prisma.course.delete({ where: { id } });
  },

  async stats() {
    const [courses, lectures] = await Promise.all([
      prisma.course.count(),
      prisma.lecture.count(),
    ]);
    return { courses, lectures };
  },
};
