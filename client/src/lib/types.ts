export type Lecture = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  _count?: { lectures: number };
};

export type CourseWithLectures = Course & { lectures: Lecture[] };

export type LectureWithCourse = Lecture & { course: { id: string; title: string } };

export type Admin = { id: string; name: string; email: string };

export type CourseInput = {
  title: string;
  description: string;
  price: number | string;
  thumbnailUrl: string;
};

export type LectureInput = {
  title: string;
  description: string;
  videoUrl: string;
};
