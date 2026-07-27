"use client";

import { useEffect } from "react";

const LANG_COOKIE_NAME = "googtrans";

// Google's widget reads this cookie on page load to know which language
// to translate into. Format is "/sourceLang/targetLang".
function setLanguageCookie(targetLang) {
  const value = `/en/${targetLang}`;
  const domain = window.location.hostname;
  // Set both with and without an explicit domain — some browsers/hosting
  // setups only honor one or the other.
  document.cookie = `${LANG_COOKIE_NAME}=${value};path=/`;
  document.cookie = `${LANG_COOKIE_NAME}=${value};path=/;domain=${domain}`;
}

function clearLanguageCookie() {
  const domain = window.location.hostname;
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = `${LANG_COOKIE_NAME}=;path=/;${expired}`;
  document.cookie = `${LANG_COOKIE_NAME}=;path=/;domain=${domain};${expired}`;
}

// Call this from anywhere (e.g. the Navbar buttons) to switch language.
// Reloading is required — Google's widget only re-checks the cookie on
// a fresh page load, there's no way around that with this approach.
export function switchToLanguage(targetLang) {
  if (targetLang === "en") {
    clearLanguageCookie();
  } else {
    setLanguageCookie(targetLang);
  }
  window.location.reload();
}

// Reads the cookie so the Navbar can show which language is active.
export function getCurrentLanguage() {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
  return match ? match[1] : "en";
}

// Mount this once, near the top of your root layout — it injects
// Google's script and initializes the (hidden) widget. It renders
// nothing visible; your own Navbar buttons drive it via switchToLanguage().
export default function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ar",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} />;
}