import { useEffect, useCallback } from "react";
import { unstable_useBlocker as useBlocker } from "react-router-dom";

export function useUnsavedChangesPrompt(isDirty, message = "You have unsaved changes. If you leave this page, the entered data will not be saved.") {
  const blocker = useBlocker(
    useCallback(() => isDirty, [isDirty])
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const ok = window.confirm(message);
      if (ok) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
}