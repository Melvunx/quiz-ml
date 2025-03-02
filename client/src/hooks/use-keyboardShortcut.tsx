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

  return {
    shortcutToPage,
  };
}
