import { Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Home } from "./pages/Home";
import { LessonPage } from "./pages/LessonPage";
import { ExercisesPage } from "./pages/ExercisesPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { MockExamPage } from "./pages/MockExamPage";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/exam" element={<MockExamPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
