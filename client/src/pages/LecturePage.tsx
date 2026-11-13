import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { VideoPlayer } from "../components/VideoPlayer";
import { ErrorState, LoadingState } from "../components/ui/States";
import { useAsync } from "../hooks/useAsync";
import { api, ApiError } from "../lib/api";
import { pluralize } from "../lib/format";

export function LecturePage() {
  const { courseId = "", lectureId = "" } = useParams();
  // One request gives us the course and its full curriculum for the sidebar.
  const { data: course, loading, error, reload } = useAsync(() => api.getCourse(courseId), [courseId]);

  if (loading) return <LoadingState label="Loading lecture…" />;

  const index = course?.lectures.findIndex((l) => l.id === lectureId) ?? -1;
  const lecture = index >= 0 ? course!.lectures[index] : null;

  if (error || !course || !lecture) {
    const notFound = (error instanceof ApiError && error.status === 404) || (course && !lecture);
    return (
      <div className="container-page py-16">
        <ErrorState
          title={notFound ? "Lecture not found" : "Couldn't load this lecture"}
          message={notFound ? "This lecture may have been removed." : error?.message}
          onRetry={notFound ? undefined : reload}
        />
        <div className="mt-6 text-center">
          <Link to={course ? `/courses/${course.id}` : "/"} className="text-sm font-semibold text-brand-700 hover:underline">
            ← Back to {course ? "course" : "all courses"}
          </Link>
        </div>
      </div>
    );
  }

  const prev = course.lectures[index - 1];
  const next = course.lectures[index + 1];

  return (
    <div className="bg-white">
      <div className="border-b border-white/10 bg-ink text-white">
        <div className="container-page flex h-12 items-center gap-3 text-sm">
          <Link to={`/courses/${course.id}`} className="inline-flex items-center gap-1.5 font-semibold hover:text-brand-100">
            <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Back to course</span>
          </Link>
          <span className="text-white/30">|</span>
          <span className="truncate text-white/80">{course.title}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className="bg-black">
            <div className="mx-auto max-w-6xl">
              <VideoPlayer url={lecture.videoUrl} title={lecture.title} />
            </div>
          </div>

          <div className="px-4 py-6 sm:px-8">
            <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
              Lecture {index + 1} of {course.lectures.length}
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{lecture.title}</h1>
            <p className="mt-3 max-w-3xl whitespace-pre-line text-ink-soft">{lecture.description}</p>

            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-line pt-5">
              {prev ? (
                <Link to={`/courses/${course.id}/lectures/${prev.id}`} className="btn-outline">
                  <ChevronLeft className="size-4" /> Previous
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link to={`/courses/${course.id}/lectures/${next.id}`} className="btn-primary">
                  Next lecture <ChevronRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <aside className="border-t border-line lg:border-t-0 lg:border-l">
          <div className="lg:sticky lg:top-16 lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-sans text-base font-bold">Course content</h2>
              <p className="text-xs text-muted">{pluralize(course.lectures.length, "lecture")}</p>
            </div>
            <ol>
              {course.lectures.map((l, i) => {
                const active = l.id === lecture.id;
                return (
                  <li key={l.id}>
                    <Link
                      to={`/courses/${course.id}/lectures/${l.id}`}
                      aria-current={active ? "true" : undefined}
                      className={`flex gap-3 border-b border-line px-5 py-3.5 text-sm transition-colors ${
                        active ? "bg-brand-50" : "hover:bg-paper"
                      }`}
                    >
                      <PlayCircle className={`mt-0.5 size-4 shrink-0 ${active ? "text-brand-700" : "text-muted"}`} />
                      <span className={active ? "font-semibold text-brand-800" : "text-ink-soft"}>
                        {i + 1}. {l.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
