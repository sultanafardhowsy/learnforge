import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { formatPrice, pluralize } from "../lib/format";
import type { Course } from "../lib/types";
import { Thumbnail } from "./Thumbnail";

export function CourseCard({ course }: { course: Course }) {
  const lectures = course._count?.lectures ?? 0;

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex flex-col rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
    >
      <div className="relative overflow-hidden rounded-md border border-line">
        <Thumbnail
          src={course.thumbnailUrl}
          alt=""
          className="aspect-video w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
      </div>
      <h3 className="mt-3 line-clamp-2 font-sans text-base leading-snug font-bold text-ink group-hover:text-brand-800">
        {course.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{course.description}</p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <PlayCircle className="size-3.5" /> {pluralize(lectures, "lecture")}
      </p>
      <p className="mt-1.5 text-base font-bold text-ink">{formatPrice(course.price)}</p>
    </Link>
  );
}
