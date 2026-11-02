"use client";

import { useEffect } from "react";

/* ---- Toggle features here ---- */
const BLOCK_RIGHT_CLICK = true;
const BLOCK_DRAG = true;
const BLOCK_SHORTCUTS = true; // F12, Ctrl+Shift+I/J/C, Ctrl+U/S/P
const BLUR_ON_FOCUS_LOSS = true; // blurs page when window/tab loses focus
const CLEAR_CLIPBOARD_ON_PRINTSCREEN = true;
const ONLY_IN_PRODUCTION = true; // keeps DevTools usable while you develop

const BLUR_CLASS = "protect-blur";

/* Forms and editable fields must keep working normally */
function isEditable(target) {
  return (
    target instanceof Element &&
    !!target.closest("input, textarea, select, [contenteditable='true']")
  );
}

export default function ContentProtection() {
  useEffect(() => {
    if (ONLY_IN_PRODUCTION && process.env.NODE_ENV !== "production") return;

    const root = document.documentElement;

    const hidePage = () => root.classList.add(BLUR_CLASS);
    const showPage = () => root.classList.remove(BLUR_CLASS);

    const clearClipboard = () => {
      try {
        navigator.clipboard?.writeText("").catch(() => {});
      } catch {
        /* ignore */
      }
    };

    const onContextMenu = (e) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    };

    const onDragStart = (e) => {
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      if (BLOCK_SHORTCUTS) {
        const blocked =
          e.key === "F12" ||
          (ctrl && e.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
          (e.metaKey && e.altKey && ["i", "j", "c", "u"].includes(key)) || // Mac
          (ctrl && ["u", "s", "p"].includes(key));

        if (blocked && !isEditable(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

      // Mac screenshot shortcuts (Cmd+Shift+3/4/5): can't be stopped,
      // but we can blur the page at the moment they're pressed.
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(key)) {
        hidePage();
        setTimeout(showPage, 1500);
      }
    };

    const onKeyUp = (e) => {
      if (e.key === "PrintScreen") {
        if (CLEAR_CLIPBOARD_ON_PRINTSCREEN) clearClipboard();
        hidePage();
        setTimeout(showPage, 1500);
      }
    };

    const onBlur = () => {
      if (BLUR_ON_FOCUS_LOSS) hidePage();
    };
    const onFocus = () => showPage();

    if (BLOCK_RIGHT_CLICK) document.addEventListener("contextmenu", onContextMenu);
    if (BLOCK_DRAG) document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      showPage();
    };
  }, []);

  return null;
}