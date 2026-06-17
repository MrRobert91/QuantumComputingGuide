import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Home } from "./pages/Home";
import { LessonPage } from "./pages/LessonPage";
import { ExercisesPage } from "./pages/ExercisesPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { MockExamPage } from "./pages/MockExamPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/exam" element={<MockExamPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AppShell>
  );
}
