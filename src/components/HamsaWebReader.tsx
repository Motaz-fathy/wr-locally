"use client";

import React, { useEffect, Suspense } from "react";
import Script from "next/script";
import { useSearchParams, usePathname } from "next/navigation";

interface HamsaWebReaderProps {
  projectId?: string;
  baseUrl?: string;
  apiUrl?: string;
  placement?: "floating" | "inline";
  theme?: "dark" | "light";
  language?: string;
  languages?: string;
  uiLanguage?: string;
  className?: string;
}

const DEFAULT_PROJECT_ID =
  process.env.NEXT_PUBLIC_HAMSA_PROJECT_ID ||
  "547fb28e-ae15-4a4a-8b03-ebd7bf4ef10b";

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_HAMSA_BASE_URL ||
  "https://nickname-grew-boundary-moss.trycloudflare.com";

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_HAMSA_API_URL ||
  "https://nickname-grew-boundary-moss.trycloudflare.com/api";

function HamsaWebReaderContent({
  projectId = DEFAULT_PROJECT_ID,
  baseUrl = DEFAULT_BASE_URL,
  apiUrl = DEFAULT_API_URL,
  placement = "floating",
  theme = "dark",
  language = "EGY",
  languages,
  uiLanguage = "ar",
  className = "",
}: HamsaWebReaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeProjectId = searchParams.get("projectId") || projectId;
  const activeBaseUrl = searchParams.get("baseUrl") || baseUrl;
  const activeApiUrl = searchParams.get("apiUrl") || apiUrl;
  const activePlacement =
    (searchParams.get("placement") as "floating" | "inline") || placement;
  const activeTheme = (searchParams.get("theme") as "dark" | "light") || theme;
  const activeLanguage = searchParams.get("language") || language;
  const activeLanguages = searchParams.get("languages") || languages;
  const activeUiLanguage = searchParams.get("uiLanguage") || uiLanguage;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as any;
      const reinit =
        win.HamsaWebReader?.reinit ||
        win.HamsaWebReader?.init ||
        win.__hamsaWebReaderMount;
      if (typeof reinit === "function") {
        try {
          reinit();
        } catch (err) {
          console.warn("HamsaWebReader re-init:", err);
        }
      }
    }
  }, [
    pathname,
    activeProjectId,
    activeBaseUrl,
    activeApiUrl,
    activePlacement,
    activeTheme,
    activeLanguage,
    activeLanguages,
    activeUiLanguage,
  ]);

  return (
    <>
      <div
        key={`${pathname}-${activeProjectId}-${activeBaseUrl}-${activeApiUrl}-${activePlacement}-${activeTheme}-${activeLanguage}-${activeLanguages}-${activeUiLanguage}`}
        {...{ "hamsa-webreader": "" }}
        data-projectid={activeProjectId}
        data-base-url={activeBaseUrl}
        data-api-url={activeApiUrl}
        data-placement={activePlacement}
        data-theme={activeTheme}
        data-language={activeLanguage}
        data-languages={activeLanguages}
        data-ui-language={activeUiLanguage}
        className={className}
      />
      <Script
        src={`${activeBaseUrl}/webreader.js`}
        strategy="afterInteractive"
      />
    </>
  );
}

export default function HamsaWebReader(props: HamsaWebReaderProps) {
  return (
    <Suspense fallback={null}>
      <HamsaWebReaderContent {...props} />
    </Suspense>
  );
}
