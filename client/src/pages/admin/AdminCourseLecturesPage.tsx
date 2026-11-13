import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink, ListVideo, Pencil, Plus, Trash2 } from "lucide-react";
import { CourseForm } from "../../components/admin/CourseForm";
import { LectureForm } from "../../components/admin/LectureForm";
import { Thumbnail } from "../../components/Thumbnail";
import { ConfirmDialog, Modal } from "../../components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { useAsync } from "../../hooks/useAsync";
import { api, ApiError } from "../../lib/api";
import { formatPrice, pluralize } from "../../lib/format";
import type { Lecture } from "../../lib/types";
import { toVideoSource } from "../../lib/video";

const providerLabel = (url: string) => {
  const s = toVideoSource(url);
  if (s.kind === "iframe") return s.provider === "youtube" ? "YouTube" : "Vimeo";
  if (s.kind === "file") return "Video file";
  return "Link";
};

export function AdminCourseLecturesPage() {
  const { courseId = "" } = useParams();
  const { data: course, loading, error, reload } = useAsync(() => api.getCourse(courseId), [courseId]);

  const [lectureForm, setLectureForm] = useState<{ open: boolean; lecture: Lecture | null }>({
    open: false,
    lecture: null,
  });
  const [editingCourse, setEditingCourse] = useState(false);
  const [deleting, setDeleting] = useState<Lecture | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <LoadingState label="Loading course…" />;

  if (error || !course) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="px-4 py-8 sm:px-8">
        <ErrorState
          title={notFound ? "Course not found" : "Couldn't load course"}
          message={notFound ? "It may have been deleted." : error?.message}
          onRetry={notFound ? undefined : reload}
        />
        <Link to="/admin" className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:underline">
          ← Back to courses
        </Link>
      </div>
    );
  }

  const closeLectureForm = () => setLectureForm({ open: false, lecture: null });

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.deleteLecture(deleting.id);
      toast.success("Lecture deleted");
      setDeleting(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete lecture");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> All courses
      </Link>

      {/* Course summary */}
      <div className="card mt-4 flex flex-col gap-5 p-5 sm:flex-row">
        <Thumbnail src={course.thumbnailUrl} alt="" className="aspect-video w-full shrink-0 rounded-md border border-line sm:w-56" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">{course.title}</h1>
          <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{course.description}</p>
          <p className="mt-3 text-sm">
            <span className="font-bold">{formatPrice(course.price)}</span>
            <span className="text-muted"> · {pluralize(course.lectures.length, "lecture")}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-outline px-3 py-2" onClick={() => setEditingCourse(true)}>
              <Pencil className="size-4" /> Edit course
            </button>
            <Link to={`/courses/${course.id}`} target="_blank" className="btn-ghost px-3 py-2">
              <ExternalLink className="size-4" /> View as student
            </Link>
          </div>
        </div>
      </div>

      {/* Lectures */}
      <div className="card mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <h2 className="font-sans text-base font-bold">Lectures</h2>
          <button className="btn-primary px-3 py-2" onClick={() => setLectureForm({ open: true, lecture: null })}>
            <Plus className="size-4" /> Add lecture
          </button>
        </div>

        {course.lectures.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<ListVideo className="size-6" />}
              title="No lectures yet"
              message="Add the first lecture so students have something to watch."
              action={
                <button className="btn-primary" onClick={() => setLectureForm({ open: true, lecture: null })}>
                  <Plus className="size-4" /> Add lecture
                </button>
              }
            />
          </div>
        ) : (
          <ol className="divide-y divide-line">
            {course.lectures.map((l, i) => (
              <li key={l.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                <div className="flex min-w-0 flex-1 gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">{l.title}</p>
                    <p className="line-clamp-1 text-sm text-muted">{l.description}</p>
                    <a
                      href={l.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-brand-700 hover:underline"
                    >
                      <span className="rounded bg-paper px-1.5 py-0.5 font-semibold text-ink-soft">{providerLabel(l.videoUrl)}</span>
                      <span className="truncate">{l.videoUrl}</span>
                    </a>
                  </div>
                </div>
                <div className="flex gap-1.5 pl-11 sm:pl-0">
                  <button
                    className="btn-ghost px-2.5 py-1.5 text-xs"
                    onClick={() => setLectureForm({ open: true, lecture: l })}
                    aria-label={`Edit ${l.title}`}
                  >
                    <Pencil className="size-3.5" /> Edit
                  </button>
                  <button
                    className="btn px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => setDeleting(l)}
                    aria-label={`Delete ${l.title}`}
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <Modal
        open={lectureForm.open}
        title={lectureForm.lecture ? "Edit lecture" : "Add lecture"}
        description={course.title}
        onClose={closeLectureForm}
        size="lg"
      >
        <LectureForm
          key={lectureForm.lecture?.id ?? "new"}
          courseId={course.id}
          lecture={lectureForm.lecture}
          onCancel={closeLectureForm}
          onSaved={() => {
            closeLectureForm();
            void reload();
          }}
        />
      </Modal>

      <Modal open={editingCourse} title="Edit course" description={course.title} onClose={() => setEditingCourse(false)}>
        <CourseForm
          course={course}
          onCancel={() => setEditingCourse(false)}
          onSaved={() => {
            setEditingCourse(false);
            void reload();
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete lecture?"
        busy={busy}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        message={
          <>
            <strong>{deleting?.title}</strong> will be permanently removed from this course.
          </>
        }
      />
    </div>
  );
}
