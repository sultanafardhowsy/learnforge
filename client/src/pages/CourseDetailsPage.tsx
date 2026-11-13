import { Link, useParams } from "react-router-dom";
import { CalendarClock, ChevronRight, ListVideo, PlayCircle } from "lucide-react";
import { Thumbnail } from "../components/Thumbnail";
import { EmptyState, ErrorState, LoadingState } from "../components/ui/States";
import { useAsync } from "../hooks/useAsync";
import { api, ApiError } from "../lib/api";
import { formatDate, formatPrice, pluralize } from "../lib/format";

export function CourseDetailsPage() {
  const { courseId = "" } = useParams();
  const { data: course, loading, error, reload } = useAsync(() => api.getCourse(courseId), [courseId]);

  if (loading) return <LoadingState label="Loading course…" />;

  if (error || !course) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="container-page py-16">
        <ErrorState
          title={notFound ? "Course not found" : "Couldn't load this course"}
          message={notFound ? "It may have been removed by an admin." : error?.message}
          onRetry={notFound ? undefined : reload}
        />
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm font-semibold text-brand-700 hover:underline">
            ← Back to all courses
          </Link>
        </div>
      </div>
    );
  }

  const first = course.lectures[0];

  return (
    <>
      {/* Hero band */}
      <section className="bg-ink text-white">
        <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_340px] lg:py-12">
          <div className="lg:pr-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm font-semibold text-brand-100">
              <Link to="/" className="hover:underline">
                Courses
              </Link>
              <ChevronRight className="size-4 text-white/50" />
              <span className="truncate text-white/70">{course.title}</span>
            </nav>
            <h1 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl">{course.title}</h1>
            <p className="mt-4 text-base whitespace-pre-line text-white/85 sm:text-lg">{course.description}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <ListVideo className="size-4" /> {pluralize(course.lectures.length, "lecture")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-4" /> Last updated {formatDate(course.updatedAt)}
              </span>
            </div>
          </div>

          {/* Purchase-style card; overlaps the band on large screens */}
          <aside className="lg:row-span-2">
            <div className="overflow-hidden rounded-lg bg-white text-ink shadow-xl ring-1 ring-black/5 lg:sticky lg:top-24">
              <Thumbnail src={course.thumbnailUrl} alt={course.title} className="aspect-video w-full" />
              <div className="p-5">
                <p className="text-3xl font-bold">{formatPrice(course.price)}</p>
                {first ? (
                  <Link to={`/courses/${course.id}/lectures/${first.id}`} className="btn-primary mt-4 w-full py-3 text-base">
                    <PlayCircle className="size-5" /> Start learning
                  </Link>
                ) : (
                  <button disabled className="btn-primary mt-4 w-full py-3 text-base">
                    Lectures coming soon
                  </button>
                )}
                <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                  <li className="flex items-center gap-2">
                    <ListVideo className="size-4 text-muted" /> {pluralize(course.lectures.length, "video lecture")}
                  </li>
                  <li className="flex items-center gap-2">
                    <PlayCircle className="size-4 text-muted" /> Watch on any device
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Curriculum */}
      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div className="lg:pr-6">
          <h2 className="text-2xl font-bold">Course content</h2>
          <p className="mt-1 text-sm text-muted">{pluralize(course.lectures.length, "lecture")}</p>

          {course.lectures.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                icon={<ListVideo className="size-6" />}
                title="No lectures yet"
                message="The instructor hasn't added any lectures to this course yet. Check back soon."
              />
            </div>
          ) : (
            <ol className="mt-5 divide-y divide-line overflow-hidden rounded-lg border border-line">
              {course.lectures.map((l, i) => (
                <li key={l.id}>
                  <Link
                    to={`/courses/${course.id}/lectures/${l.id}`}
                    className="group flex items-start gap-4 bg-white px-4 py-4 transition-colors hover:bg-paper sm:px-5"
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 group-hover:bg-brand-700 group-hover:text-white">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink group-hover:text-brand-800">{l.title}</span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{l.description}</span>
                    </span>
                    <PlayCircle className="mt-1 size-5 shrink-0 text-muted group-hover:text-brand-700" />
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
