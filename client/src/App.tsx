import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/layout/Layout";
import { Toaster } from "./components/ui/toaster";
import Auth from "./pages/Auth";
import AuthManager from "./pages/AuthManager";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Questions from "./pages/QuestionsPage";
import QuizPage from "./pages/QuizPage";
import QuizResults from "./pages/QuizResults";
import StartQuiz from "./pages/QuizStarter";
import AddQuestionPage from "./pages/form/AddQuestionPage";
import AddQuizPage from "./pages/form/AddQuizPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthManager />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "quiz-dashboard",
            element: <Home />,
          },
          {
            path: "quiz",
            element: <QuizPage itemsPerPage={3} />,
          },
          {
            path: "add-quizzes",
            element: <AddQuizPage />,
          },
          {
            path: "quiz-questions",
            element: <Questions itemsPerPage={3} />,
          },
          {
            path: "add-questions",
            element: <AddQuestionPage />,
          },
          {
            path: "quiz-start",
            element: <StartQuiz />,
          },
          {
            path: "quiz-results",
            element: <QuizResults itemsPerPage={5} />,
          },
        ],
      },
    ],
  },
  { path: "/auth", element: <Auth /> },
]);

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
