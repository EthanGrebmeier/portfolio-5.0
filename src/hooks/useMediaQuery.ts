"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

function getServerSnapshot(): boolean {
  return false; // Default to desktop on server
}

export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}
