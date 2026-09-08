import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import {
  HomePage,
  BooksPage,
  MoviesPage,
  MovieDetailPage,
  ReviewPage,
  AdminPage,
  BookDetailPage,
  StudySessionPage,
  StudyResultsPage,
  LoginPage,
} from "@/app/pages";
import ProtectedRoute from "./ProtectedRoute";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes
        location={location}

        key={location.pathname}
      >
        <Route path="/" element={<HomePage />} />

        <Route path="/books" element={<BooksPage />} />

        <Route
          path="/books/:bookId"

          element={<BookDetailPage />}
        />

        <Route path="/movies" element={<MoviesPage />} />

        <Route path="/movies/:movieId" element={<MovieDetailPage />} />

        <Route path="/movies/:movieId/study/session" element={<StudySessionPage />} />

        <Route path="/movies/:movieId/study/results" element={<StudyResultsPage />} />

        <Route path="/review" element={<ReviewPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="/books/:bookId/study/session" element={<StudySessionPage />} />

        <Route path="/books/:bookId/study/results" element={<StudyResultsPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRouter() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <BrowserRouter basename={basename || undefined}>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
