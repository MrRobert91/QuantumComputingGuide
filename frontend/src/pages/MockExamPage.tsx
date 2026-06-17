import { useState } from "react";
import { examQuestions } from "../data/examQuestions";

export function MockExamPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = examQuestions.filter((q) => answers[q.id] === q.answer).length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Mock exam</h1>
      <p className="text-gray-400 mb-6">
        Sample multiple-choice questions in the style of the certification. Answer them all, then
        submit to see your score and explanations.
      </p>

      <div className="space-y-5">
        {examQuestions.map((q, i) => (
          <div key={q.id} className="rounded-xl bg-quantum-panel/60 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded bg-quantum-accent/20 text-quantum-accent2">
                {q.topic}
              </span>
              <span className="text-xs text-gray-500">Question {i + 1}</span>
            </div>
            <p className="text-white mb-3">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const chosen = answers[q.id] === idx;
                const correct = submitted && idx === q.answer;
                const wrong = submitted && chosen && idx !== q.answer;
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer text-sm ${
                      correct
                        ? "border-green-500 bg-green-500/10"
                        : wrong
                        ? "border-red-500 bg-red-500/10"
                        : chosen
                        ? "border-quantum-accent bg-quantum-accent/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={chosen}
                      disabled={submitted}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
            {submitted && (
              <p className="text-xs text-gray-400 mt-3 bg-black/30 rounded px-3 py-2">
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            className="px-5 py-2 rounded bg-quantum-accent2 text-black font-semibold"
          >
            Submit
          </button>
        ) : (
          <>
            <span className="text-lg font-semibold text-white">
              Score: {score}/{examQuestions.length}
            </span>
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
              }}
              className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
