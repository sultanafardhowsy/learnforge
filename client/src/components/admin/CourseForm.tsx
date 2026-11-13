import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Thumbnail } from "../Thumbnail";
import { Field, TextArea } from "../ui/Field";
import { Spinner } from "../ui/States";
import { api, ApiError } from "../../lib/api";
import type { Course, CourseInput } from "../../lib/types";

type Errors = Partial<Record<keyof CourseInput, string>>;

const isHttpUrl = (v: string) => {
  try {
    return ["http:", "https:"].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};

/** Mirrors the server's Zod rules so users get instant feedback. */
function validate(v: CourseInput): Errors {
  const e: Errors = {};
  const title = v.title.trim();
  const desc = v.description.trim();
  const price = String(v.price).trim();

  if (!title) e.title = "Title is required";
  else if (title.length < 3) e.title = "Title must be at least 3 characters";
  else if (title.length > 150) e.title = "Title must be at most 150 characters";

  if (!desc) e.description = "Description is required";
  else if (desc.length < 10) e.description = "Description must be at least 10 characters";

  if (price === "") e.price = "Price is required";
  else if (Number.isNaN(Number(price))) e.price = "Price must be a number";
  else if (Number(price) < 0) e.price = "Price cannot be negative";

  if (!v.thumbnailUrl.trim()) e.thumbnailUrl = "Thumbnail URL is required";
  else if (!isHttpUrl(v.thumbnailUrl.trim())) e.thumbnailUrl = "Enter a valid http(s) URL";

  return e;
}

export function CourseForm({
  course,
  onSaved,
  onCancel,
}: {
  course?: Course | null;
  onSaved: (course: Course) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<CourseInput>({
    title: course?.title ?? "",
    description: course?.description ?? "",
    price: course ? String(course.price) : "",
    thumbnailUrl: course?.thumbnailUrl ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof CourseInput) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const payload: CourseInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      thumbnailUrl: values.thumbnailUrl.trim(),
    };

    setSaving(true);
    try {
      const saved = course ? await api.updateCourse(course.id, payload) : await api.createCourse(payload);
      toast.success(course ? "Course updated" : "Course created");
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors);
      toast.error(err instanceof Error ? err.message : "Could not save course");
    } finally {
      setSaving(false);
    }
  };

  const showPreview = isHttpUrl(values.thumbnailUrl.trim());

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field
        id="course-title"
        label="Title"
        value={values.title}
        onChange={set("title")}
        error={errors.title}
        placeholder="e.g. React for Beginners"
        maxLength={150}
        autoFocus
      />
      <TextArea
        id="course-description"
        label="Description"
        value={values.description}
        onChange={set("description")}
        error={errors.description}
        placeholder="What will students learn?"
        rows={4}
      />
      <Field
        id="course-price"
        label="Price (USD)"
        type="number"
        inputMode="decimal"
        min={0}
        step="0.01"
        value={values.price}
        onChange={set("price")}
        error={errors.price}
        placeholder="0 for a free course"
      />
      <Field
        id="course-thumb"
        label="Thumbnail URL"
        type="url"
        value={values.thumbnailUrl}
        onChange={set("thumbnailUrl")}
        error={errors.thumbnailUrl}
        placeholder="https://…/image.jpg"
      />
      {showPreview && (
        <div>
          <p className="label">Preview</p>
          <Thumbnail
            key={values.thumbnailUrl}
            src={values.thumbnailUrl.trim()}
            alt="Thumbnail preview"
            className="aspect-video w-full max-w-xs rounded-md border border-line"
          />
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <button type="button" className="btn-outline" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving && <Spinner className="size-4" />}
          {course ? "Save changes" : "Create course"}
        </button>
      </div>
    </form>
  );
}
