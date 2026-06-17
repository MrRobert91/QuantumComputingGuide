import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { ComposerCircuit, Exercise } from "../api/types";
import { Composer } from "../components/composer/Composer";
import { useProgress } from "../store/progress";

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [circuit, setCircuit] = useState<ComposerCircuit>({ num_qubits: 1, num_clbits: 0, ops: [] });
  const [showHints, setShowHints] = useState(0);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { completedExercises, markExercise } = useProgress();

  useEffect(() => {
    api.exercises().then(setExercises).catch((e) => setError(e.message));
  }, []);

  const pick = (ex: Exercise) => {
    setSelected(ex);
    setCircuit(ex.starting_composer);
    setShowHints(0);
    setFeedback(null);
  };

  const validate = async () => {
    if (!selected) return;
    setError(null);
    try {
      const res = await api.validate(selected.id, { composer: circuit });
      setFeedback(res);
      if (res.passed) markExercise(selected.id);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Exercises</h1>
      <p className="text-gray-400 mb-6">
        Build the requested circuit in the composer and validate it. Solutions are checked up to
        global phase, so any equivalent construction is accepted.
      </p>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => pick(ex)}
              className={`w-full text-left p-3 rounded-lg border ${
                selected?.id === ex.id
                  ? "border-quantum-accent bg-quantum-accent/10"
                  : "border-white/10 bg-quantum-panel/40 hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{ex.title}</span>
                {completedExercises[ex.id] && <span className="text-green-400 text-xs">✓</span>}
              </div>
              <span className="text-xs text-gray-500 capitalize">{ex.difficulty}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-quantum-panel/60 border border-white/10 p-4">
                <h3 className="font-semibold text-white mb-1">{selected.title}</h3>
                <p className="text-sm text-gray-300">{selected.prompt}</p>
              </div>

              <Composer circuit={circuit} onChange={setCircuit} />

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={validate}
                  className="px-4 py-2 rounded bg-quantum-accent2 text-black font-semibold"
                >
                  Check solution
                </button>
                {showHints < selected.hints.length && (
                  <button
                    onClick={() => setShowHints((h) => h + 1)}
                    className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm"
                  >
                    Show hint ({showHints + 1}/{selected.hints.length})
                  </button>
                )}
              </div>

              {selected.hints.slice(0, showHints).map((h, i) => (
                <p key={i} className="text-sm text-amber-300 bg-amber-500/10 rounded px-3 py-2">
                  💡 {h}
                </p>
              ))}

              {feedback && (
                <p
                  className={`text-sm rounded px-3 py-2 ${
                    feedback.passed
                      ? "text-green-300 bg-green-500/10"
                      : "text-red-300 bg-red-500/10"
                  }`}
                >
                  {feedback.passed ? "✓ " : "✗ "}
                  {feedback.message}
                </p>
              )}

              {selected.links.length > 0 && (
                <div className="text-xs text-gray-500">
                  Learn more:{" "}
                  {selected.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-quantum-accent underline mr-3">
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select an exercise to begin.</p>
          )}
        </div>
      </div>
    </div>
  );
}
