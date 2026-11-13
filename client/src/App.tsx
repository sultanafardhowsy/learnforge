import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AdminLayout } from "./layouts/AdminLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import { HomePage } from "./pages/HomePage";
import { LecturePage } from "./pages/LecturePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AdminCourseLecturesPage } from "./pages/admin/AdminCourseLecturesPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";

/** Scroll to top on navigation, or to #hash targets when present. */
function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollManager />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses/:courseId" element={<CourseDetailsPage />} />
            <Route path="courses/:courseId/lectures/:lectureId" element={<LecturePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="courses/:courseId" element={<AdminCourseLecturesPage />} />
          </Route>
        </Routes>
        <Toaster position="top-center" toastOptions={{ className: "text-sm font-medium" }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
