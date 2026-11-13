import { Link, useSearchParams } from "react-router-dom";
import { PlayCircle, SearchX } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { HeroCarousel } from "../components/hero/HeroCarousel";
import { CourseCardSkeleton, EmptyState, ErrorState } from "../components/ui/States";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import { pluralize } from "../lib/format";

const TOPICS = ["React", "Node.js", "TypeScript", "PostgreSQL", "Express", "Full stack"];

export function HomePage() {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";
  const { data: courses, loading, error, reload } = useAsync(() => api.getCourses(q), [q]);

  return (
    <>
      {!q && (
        <>
          <HeroCarousel />
          <section className="container-page pt-10 sm:pt-12">
            <h2 className="text-2xl font-bold sm:text-[32px]">All the skills you need in one place</h2>
            <p className="mt-2 text-base text-muted">
              From front-end frameworks to databases, pick a topic and start learning.
            </p>
            <nav aria-label="Popular topics" className="mt-5 flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <Link
                  key={t}
                  to={`/?q=${encodeURIComponent(t)}#courses`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink-soft hover:bg-paper"
                >
                  {t}
                </Link>
              ))}
            </nav>
          </section>
        </>
      )}

      <section id="courses" className="container-page scroll-mt-20 py-10 sm:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {q ? <>Results for “{q}”</> : "All courses"}
            </h2>
            {courses && (
              <p className="mt-1 text-sm text-muted">
                {pluralize(courses.length, "course")} {q ? "found" : "available"}
              </p>
            )}
          </div>
          {q && (
            <Link to="/#courses" className="text-sm font-semibold text-brand-700 hover:underline">
              Clear search
            </Link>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <ErrorState title="Couldn't load courses" message={error.message} onRetry={reload} />
        )}

        {!loading && courses && courses.length === 0 && (
          q ? (
            <EmptyState
              icon={<SearchX className="size-6" />}
              title="No matching courses"
              message="Try a different keyword, or browse the full catalogue."
              action={
                <Link to="/#courses" className="btn-outline">
                  View all courses
                </Link>
              }
            />
          ) : (
            <EmptyState
              icon={<PlayCircle className="size-6" />}
              title="No courses yet"
              message="Courses will appear here as soon as an admin publishes them."
            />
          )
        )}

        {!loading && courses && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}