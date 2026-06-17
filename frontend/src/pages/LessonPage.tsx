import { Link, useParams } from "react-router-dom";
import { allLessons, findLesson } from "../data/curriculum";
import { Markdown } from "../components/content/Markdown";
import { InteractiveQubit } from "../components/visualizations/InteractiveQubit";
import { useProgress } from "../store/progress";

export function LessonPage() {
  const { lessonId } = useParams();
  const found = lessonId ? findLesson(lessonId) : undefined;
  const { completedLessons, markLesson } = useProgress();

  if (!found) {
    return <p className="text-gray-400">Lesson not found.</p>;
  }

  const { lesson } = found;
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const prev = allLessons[idx - 1];
  const next = allLessons[idx + 1];
  const done = !!completedLessons[lesson.id];

  return (
    <article>
      {lesson.status === "scaffold" && (
        <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-4">
          This lesson is a scaffold — objectives and links are in place, full content coming soon.
        </p>
      )}

      <Markdown>{lesson.content}</Markdown>

      {lesson.widget && <InteractiveQubit variant={lesson.widget} />}

      <div className="mt-10 pt-6 border-t border-white/10">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => markLesson(lesson.id, !done)}
            className={done ? "btn bg-quantum-accent2/20 text-quantum-accent2 border border-quantum-accent2/30" : "btn-primary"}
          >
            {done ? "✓ Completed" : "Mark as complete"}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          {prev ? (
            <Link to={`/lesson/${prev.id}`} className="btn-ghost !py-1.5 text-left max-w-[45%]">
              <span className="truncate">← {prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/lesson/${next.id}`} className="btn-ghost !py-1.5 text-right max-w-[45%]">
              <span className="truncate">{next.title} →</span>
            </Link>
          ) : <span />}
        </div>
      </div>
    </article>
  );
}
