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
        <p className="text-xs text-amber-400 bg-amber-500/10 rounded px-3 py-2 mb-4">
          This lesson is a scaffold — objectives and links are in place, full content coming soon.
        </p>
      )}

      <Markdown>{lesson.content}</Markdown>

      {lesson.widget && <InteractiveQubit variant={lesson.widget} />}

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
        <div>
          {prev && (
            <Link to={`/lesson/${prev.id}`} className="text-sm text-gray-400 hover:text-white">
              ← {prev.title}
            </Link>
          )}
        </div>
        <button
          onClick={() => markLesson(lesson.id, !done)}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            done ? "bg-green-500/30 text-green-300" : "bg-quantum-accent text-white"
          }`}
        >
          {done ? "✓ Completed" : "Mark as complete"}
        </button>
        <div>
          {next && (
            <Link to={`/lesson/${next.id}`} className="text-sm text-gray-400 hover:text-white">
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
