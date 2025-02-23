import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useKeyboardShortcut() {
  const navigate = useNavigate();

  const shortcutToPage = useCallback(
    (event: KeyboardEvent, targetKey: string, path: string) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === targetKey.toLowerCase()
      ) {
        event.preventDefault();
        navigate(path);
      }
    },
    [navigate]
  );

  const shortcutToSearch = useCallback(
    (event: KeyboardEvent, inputId: string) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();

        const input = document.getElementById(inputId);

        if (!input) return null;

        input.focus();
      }
    },
    []
  );

  return {
    shortcutToPage,
    shortcutToSearch,
  };
}
