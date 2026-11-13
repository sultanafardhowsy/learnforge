import type { Request, Response } from "express";
import { CourseModel } from "../models/course.model";
import { LectureModel } from "../models/lecture.model";
import { ApiError } from "../utils/ApiError";

type CourseParams = { courseId: string };
type IdParams = { id: string };

export async function listLectures(req: Request<CourseParams>, res: Response) {
  if (!(await CourseModel.exists(req.params.courseId))) throw ApiError.notFound("Course not found");
  const lectures = await LectureModel.findByCourse(req.params.courseId);
  res.json({ success: true, data: lectures });
}

export async function getLecture(req: Request<IdParams>, res: Response) {
  const lecture = await LectureModel.findById(req.params.id);
  if (!lecture) throw ApiError.notFound("Lecture not found");
  res.json({ success: true, data: lecture });
}

export async function createLecture(req: Request<CourseParams>, res: Response) {
  if (!(await CourseModel.exists(req.params.courseId))) throw ApiError.notFound("Course not found");
  const lecture = await LectureModel.create(req.params.courseId, req.body);
  res.status(201).json({ success: true, message: "Lecture added", data: lecture });
}

export async function updateLecture(req: Request<IdParams>, res: Response) {
  if (Object.keys(req.body).length === 0) throw ApiError.badRequest("Nothing to update");
  const lecture = await LectureModel.update(req.params.id, req.body);
  res.json({ success: true, message: "Lecture updated", data: lecture });
}

export async function deleteLecture(req: Request<IdParams>, res: Response) {
  await LectureModel.remove(req.params.id);
  res.json({ success: true, message: "Lecture deleted" });
}
