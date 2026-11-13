import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen, ListVideo, Pencil, Plus, Search, Trash2, Wallet } from "lucide-react";
import { CourseForm } from "../../components/admin/CourseForm";
import { Thumbnail } from "../../components/Thumbnail";
import { ConfirmDialog, Modal } from "../../components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../lib/api";
import { formatDate, formatPrice, pluralize } from "../../lib/format";
import type { Course } from "../../lib/types";

export function AdminDashboardPage() {
  const { data: courses, loading, error, reload } = useAsync(() => api.getCourses(), []);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Course | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const [busy, setBusy] = useState(false);

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!courses || !term) return courses ?? [];
    return courses.filter((c) => c.title.toLowerCase().includes(term));
  }, [courses, filter]);

  const stats = useMemo(() => {
    const list = courses ?? [];
    return {
      courses: list.length,
      lectures: list.reduce((n, c) => n + (c._count?.lectures ?? 0), 0),
      free: list.filter((c) => c.price === 0).length,
    };
  }, [courses]);

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.deleteCourse(deleting.id);
      toast.success("Course deleted");
      setDeleting(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete course");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="mt-1 text-sm text-muted">Create and manage the courses students can see.</p>
        </div>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus className="size-4" /> New course
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={<BookOpen className="size-5" />} label="Courses" value={stats.courses} />
        <StatCard icon={<ListVideo className="size-5" />} label="Lectures" value={stats.lectures} />
        <StatCard icon={<Wallet className="size-5" />} label="Free courses" value={stats.free} />
      </div>

      <div className="card mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <h2 className="font-sans text-base font-bold">All courses</h2>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by title"
              aria-label="Filter courses by title"
              className="input py-2 pl-9"
            />
          </div>
        </div>

        {loading && <LoadingState label="Loading courses…" />}
        {!loading && error && (
          <div className="p-5">
            <ErrorState title="Couldn't load courses" message={error.message} onRetry={reload} />
          </div>
        )}
        {!loading && courses && courses.length === 0 && (
          <div className="p-5">
            <EmptyState
              icon={<BookOpen className="size-6" />}
              title="No courses yet"
              message="Create your first course, then add lectures to it."
              action={
                <button className="btn-primary" onClick={() => setCreating(true)}>
                  <Plus className="size-4" /> New course
                </button>
              }
            />
          </div>
        )}
        {!loading && courses && courses.length > 0 && visible.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted">No courses match “{filter}”.</p>
        )}

        {!loading && visible.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-paper text-xs font-semibold tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-5 py-3">Course</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Lectures</th>
                    <th className="px-3 py-3">Updated</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visible.map((c) => (
                    <tr key={c.id} className="hover:bg-paper/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Thumbnail src={c.thumbnailUrl} alt="" className="h-12 w-20 shrink-0 rounded border border-line" />
                          <div className="min-w-0">
                            <Link to={`/admin/courses/${c.id}`} className="line-clamp-1 font-semibold text-ink hover:text-brand-700">
                              {c.title}
                            </Link>
                            <p className="line-clamp-1 max-w-md text-xs text-muted">{c.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-semibold whitespace-nowrap">{formatPrice(c.price)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{c._count?.lectures ?? 0}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-muted">{formatDate(c.updatedAt)}</td>
                      <td className="px-5 py-3">
                        <RowActions course={c} onEdit={setEditing} onDelete={setDeleting} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-line md:hidden">
              {visible.map((c) => (
                <li key={c.id} className="p-4">
                  <div className="flex gap-3">
                    <Thumbnail src={c.thumbnailUrl} alt="" className="h-16 w-28 shrink-0 rounded border border-line" />
                    <div className="min-w-0">
                      <Link to={`/admin/courses/${c.id}`} className="line-clamp-2 font-semibold hover:text-brand-700">
                        {c.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted">
                        {formatPrice(c.price)} · {pluralize(c._count?.lectures ?? 0, "lecture")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <RowActions course={c} onEdit={setEditing} onDelete={setDeleting} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <Modal
        open={creating || Boolean(editing)}
        title={editing ? "Edit course" : "New course"}
        description={editing ? editing.title : "Fill in the details students will see."}
        onClose={closeForm}
      >
        <CourseForm
          key={editing?.id ?? "new"}
          course={editing}
          onCancel={closeForm}
          onSaved={() => {
            closeForm();
            void reload();
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete course?"
        busy={busy}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        message={
          <>
            <strong>{deleting?.title}</strong> and its{" "}
            {pluralize(deleting?._count?.lectures ?? 0, "lecture")} will be permanently deleted. This can't be
            undone.
          </>
        }
      />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="card flex items-center gap-4 p-3 sm:p-5">
      <div className="hidden size-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 sm:grid">{icon}</div>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted sm:text-sm">{label}</p>
        <p className="text-xl font-bold sm:text-2xl">{value}</p>
      </div>
    </div>
  );
}

function RowActions({
  course,
  onEdit,
  onDelete,
}: {
  course: Course;
  onEdit: (c: Course) => void;
  onDelete: (c: Course) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 md:flex-nowrap md:justify-end">
      <Link to={`/admin/courses/${course.id}`} className="btn-outline px-3 py-1.5 text-xs">
        <ListVideo className="size-3.5" /> Lectures
      </Link>
      <button onClick={() => onEdit(course)} className="btn-ghost px-2.5 py-1.5 text-xs" aria-label={`Edit ${course.title}`}>
        <Pencil className="size-3.5" /> Edit
      </button>
      <button
        onClick={() => onDelete(course)}
        className="btn px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
        aria-label={`Delete ${course.title}`}
      >
        <Trash2 className="size-3.5" /> Delete
      </button>
    </div>
  );
}
