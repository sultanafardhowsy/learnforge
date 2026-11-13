import type { Request, Response } from "express";
import { CourseModel } from "../models/course.model";
import { ApiError } from "../utils/ApiError";

type IdParams = { id: string };

export async function listCourses(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
  const courses = await CourseModel.findAll(search || undefined);
  res.json({ success: true, data: courses });
}

export async function getCourse(req: Request<IdParams>, res: Response) {
  const course = await CourseModel.findById(req.params.id);
  if (!course) throw ApiError.notFound("Course not found");
  res.json({ success: true, data: course });
}

export async function createCourse(req: Request, res: Response) {
  const course = await CourseModel.create(req.body);
  res.status(201).json({ success: true, message: "Course created", data: course });
}

export async function updateCourse(req: Request<IdParams>, res: Response) {
  if (Object.keys(req.body).length === 0) throw ApiError.badRequest("Nothing to update");
  const course = await CourseModel.update(req.params.id, req.body);
  res.json({ success: true, message: "Course updated", data: course });
}

export async function deleteCourse(req: Request<IdParams>, res: Response) {
  await CourseModel.remove(req.params.id);
  res.json({ success: true, message: "Course deleted" });
}

export async function getStats(_req: Request, res: Response) {
  res.json({ success: true, data: await CourseModel.stats() });
}
