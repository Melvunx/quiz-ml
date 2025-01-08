"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "./button";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const handleThemeChange = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      setIsAnimating(false);
    }, 400);
  };

  return (
    <Button
      onClick={handleThemeChange}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {resolvedTheme === "dark" ? (
        <Sun
          className={`transition-colors ${isAnimating ? "animate-spin" : ""} ${
            isHover ? "text-yellow-600" : ""
          }`}
        />
      ) : (
        <Moon
          className={`transition-colors ${isAnimating ? "animate-spin" : ""} ${
            isHover ? "text-indigo-400" : ""
          }`}
        />
      )}
    </Button>
  );
}
