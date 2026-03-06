"use client";

import { useEffect } from "react";

/**
 * Синхронизирует CSS-переменную с вертикальным смещением VisualViewport.
 * Это помогает корректно позиционировать фиксированную шапку в mobile WebView (в т.ч. Telegram).
 */
export function ViewportOffsetController() {
  useEffect(() => {
    const root = document.documentElement;
    let rafId = 0;
    let prevOffset = -1;

    const commitOffset = () => {
      rafId = 0;
      const nextOffset = Math.max(0, Math.round(window.visualViewport?.offsetTop ?? 0));
      if (nextOffset === prevOffset) return;

      prevOffset = nextOffset;
      root.style.setProperty("--vv-top", `${nextOffset}px`);
    };

    const requestCommit = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(commitOffset);
    };

    requestCommit();

    window.visualViewport?.addEventListener("resize", requestCommit);
    window.visualViewport?.addEventListener("scroll", requestCommit);
    window.addEventListener("resize", requestCommit);
    window.addEventListener("orientationchange", requestCommit);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.visualViewport?.removeEventListener("resize", requestCommit);
      window.visualViewport?.removeEventListener("scroll", requestCommit);
      window.removeEventListener("resize", requestCommit);
      window.removeEventListener("orientationchange", requestCommit);
      root.style.setProperty("--vv-top", "0px");
    };
  }, []);

  return null;
}
