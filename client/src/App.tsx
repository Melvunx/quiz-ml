import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { Toaster } from "./components/ui/toaster";
import Auth from "./pages/Auth";
import AuthManager from "./pages/AuthManager";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import QuizPage from "./pages/QuizPage";
import QuizResults from "./pages/QuizResults";
import StartQuiz from "./pages/QuizStarter";

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
            path: "quiz-start",
            element: <StartQuiz />,
          },
          {
            path: "quiz-questions",
            element: <Questions />,
          },
          {
            path: "quiz-results",
            element: <QuizResults />,
          },
          {
            path: "quiz",
            element: <QuizPage />,
          },
        ],
      },
    ],
  },
  { path: "/auth", element: <Auth /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}
