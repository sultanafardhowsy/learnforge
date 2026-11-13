import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { VideoPlayer } from "../VideoPlayer";
import { Field, TextArea } from "../ui/Field";
import { Spinner } from "../ui/States";
import { api, ApiError } from "../../lib/api";
import type { Lecture, LectureInput } from "../../lib/types";
import { isEmbeddableVideoUrl } from "../../lib/video";

type Errors = Partial<Record<keyof LectureInput, string>>;

function validate(v: LectureInput): Errors {
  const e: Errors = {};
  const title = v.title.trim();
  const desc = v.description.trim();
  const url = v.videoUrl.trim();

  if (!title) e.title = "Title is required";
  else if (title.length < 3) e.title = "Title must be at least 3 characters";

  if (!desc) e.description = "Description is required";
  else if (desc.length < 5) e.description = "Description must be at least 5 characters";

  if (!url) e.videoUrl = "Video URL is required";
  else if (!/^https?:\/\//i.test(url)) e.videoUrl = "Enter a valid http(s) URL";
  else if (!isEmbeddableVideoUrl(url))
    e.videoUrl = "Use a YouTube or Vimeo link, or a direct .mp4 / .webm file";

  return e;
}

export function LectureForm({
  courseId,
  lecture,
  onSaved,
  onCancel,
}: {
  courseId: string;
  lecture?: Lecture | null;
  onSaved: (lecture: Lecture) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<LectureInput>({
    title: lecture?.title ?? "",
    description: lecture?.description ?? "",
    videoUrl: lecture?.videoUrl ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof LectureInput) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      videoUrl: values.videoUrl.trim(),
    };

    setSaving(true);
    try {
      const saved = lecture
        ? await api.updateLecture(lecture.id, payload)
        : await api.createLecture(courseId, payload);
      toast.success(lecture ? "Lecture updated" : "Lecture added");
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors);
      toast.error(err instanceof Error ? err.message : "Could not save lecture");
    } finally {
      setSaving(false);
    }
  };

  const url = values.videoUrl.trim();
  const canPreview = /^https?:\/\//i.test(url) && isEmbeddableVideoUrl(url);

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field
        id="lecture-title"
        label="Title"
        value={values.title}
        onChange={set("title")}
        error={errors.title}
        placeholder="e.g. Introduction to components"
        maxLength={150}
        autoFocus
      />
      <TextArea
        id="lecture-description"
        label="Description"
        value={values.description}
        onChange={set("description")}
        error={errors.description}
        placeholder="What does this lecture cover?"
        rows={3}
      />
      <Field
        id="lecture-video"
        label="Video URL"
        type="url"
        value={values.videoUrl}
        onChange={set("videoUrl")}
        error={errors.videoUrl}
        placeholder="https://www.youtube.com/watch?v=…"
        hint="YouTube (incl. ?t= start time), Vimeo, or a direct .mp4 / .webm link."
      />
      {canPreview && (
        <div>
          <p className="label">Preview</p>
          <div className="overflow-hidden rounded-md">
            <VideoPlayer url={url} title="Video preview" />
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <button type="button" className="btn-outline" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving && <Spinner className="size-4" />}
          {lecture ? "Save changes" : "Add lecture"}
        </button>
      </div>
    </form>
  );
}
