import useKeyboardShortcut from "@/hooks/use-keyboardShortcut";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  const { shortcutToPage } = useKeyboardShortcut();

  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      shortcutToPage(e, "q", "/add-quizzes");
      shortcutToPage(e, "m", "/add-questions");
    };

    window.addEventListener("keydown", handleKeyboardShortcut);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [shortcutToPage]);

  return (
    <div>
      <Navbar />
      <main className="relative flex min-h-screen w-full flex-col justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
