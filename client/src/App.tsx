import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth";
import AuthManager from "./pages/AuthManager";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import QuizPage from "./pages/QuizPage";
import QuizResults from "./pages/QuizResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthManager />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "quiz-dashboard",
        element: <Home />,
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
  { path: "/auth", element: <Auth /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
