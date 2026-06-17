import { useState } from "react";
import { examQuestions } from "../data/examQuestions";

export function MockExamPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = examQuestions.filter((q) => answers[q.id] === q.answer).length;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mock exam</h1>
      <p className="text-gray-400 mb-6 text-[15px]">
        Sample multiple-choice questions in the style of the certification. Answer them all, then
        submit to see your score and explanations.
      </p>

      <div className="space-y-4">
        {examQuestions.map((q, i) => (
          <div key={q.id} className="card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="chip">{q.topic}</span>
              <span className="text-xs text-gray-500">Question {i + 1}</span>
            </div>
            <p className="text-white mb-3 font-medium">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const chosen = answers[q.id] === idx;
                const correct = submitted && idx === q.answer;
                const wrong = submitted && chosen && idx !== q.answer;
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${
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
                      className="accent-quantum-accent"
                      checked={chosen}
                      disabled={submitted}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <p className="text-xs text-gray-400 mt-3 bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4 flex-wrap">
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} className="btn-accent">
            Submit
          </button>
        ) : (
          <>
            <span className="text-lg font-semibold text-white">
              Score: <span className="text-quantum-accent2">{score}</span>/{examQuestions.length}
            </span>
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
              }}
              className="btn-ghost"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
