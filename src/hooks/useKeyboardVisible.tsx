import { useState, useEffect } from "react";

export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        setTimeout(() => setIsKeyboardVisible(true), 100);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (
        !relatedTarget ||
        (relatedTarget.tagName !== "INPUT" &&
          relatedTarget.tagName !== "TEXTAREA" &&
          !relatedTarget.isContentEditable)
      ) {
        setIsKeyboardVisible(false);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return isKeyboardVisible;
}
