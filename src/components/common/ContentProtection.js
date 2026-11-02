"use client";

import { useEffect } from "react";

/* ---- Toggle features here ---- */
const BLOCK_RIGHT_CLICK = true;
const BLOCK_DRAG = true;
const BLOCK_SHORTCUTS = true; // F12, Ctrl+Shift+I/J/C, Ctrl+U/S/P
const CLEAR_CLIPBOARD_ON_PRINTSCREEN = true; // only helps for plain PrintScreen
const ONLY_IN_PRODUCTION = true; // keeps DevTools usable while you develop

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
      if (!BLOCK_SHORTCUTS) return;

      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      const blocked =
        e.key === "F12" ||
        (ctrl && e.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
        (e.metaKey && e.altKey && ["i", "j", "c", "u"].includes(key)) || // Mac
        (ctrl && ["u", "s", "p"].includes(key));

      if (blocked && !isEditable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onKeyUp = (e) => {
      if (e.key === "PrintScreen" && CLEAR_CLIPBOARD_ON_PRINTSCREEN) {
        clearClipboard();
      }
    };

    if (BLOCK_RIGHT_CLICK) document.addEventListener("contextmenu", onContextMenu);
    if (BLOCK_DRAG) document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("keyup", onKeyUp, true);
    };
  }, []);

  return null;
}