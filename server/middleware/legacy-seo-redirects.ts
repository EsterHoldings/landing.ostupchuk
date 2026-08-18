import { getRequestURL, sendRedirect } from "h3";

const localeAliases: Record<string, string> = {
  ua: "uk",
  uk: "uk",
  en: "en",
  de: "de",
  es: "es",
  fr: "fr",
  it: "it",
  pt: "pt",
  ru: "ru",
  tr: "tr",
  he: "he",
  hi: "hi",
  ja: "ja",
  ko: "ko",
  zh: "zh",
};

const legacySectionAnchors: Record<string, string> = {
  about: "#about",
  programs: "#programs",
  results: "#results",
  faq: "#faq",
};

/**
 * Retains authority from links indexed by the former multi-page site while the
 * landing now uses locale-prefixed, one-page URLs. Fragments are deliberately
 * used only after the canonical locale path so crawlers do not see duplicates.
 */
export default defineEventHandler((event) => {
  if (event.method !== "GET" && event.method !== "HEAD") {
    return;
  }

  const requestUrl = getRequestURL(event);
  const segments = requestUrl.pathname.split("/").filter(Boolean);
  const [firstSegment, secondSegment, ...remainingSegments] = segments;

  if (!firstSegment || remainingSegments.length > 0) {
    return;
  }

  const first = firstSegment.toLowerCase();
  const requestedLocale = localeAliases[first];
  const legacyAnchor = legacySectionAnchors[first];
  const nestedAnchor = secondSegment ? legacySectionAnchors[secondSegment.toLowerCase()] : undefined;

  let locale: string | undefined;
  let anchor: string | undefined;

  if (first === "ua") {
    locale = "uk";
    anchor = nestedAnchor;
  } else if (requestedLocale && nestedAnchor) {
    locale = requestedLocale;
    anchor = nestedAnchor;
  } else if (legacyAnchor && !secondSegment) {
    locale = "uk";
    anchor = legacyAnchor;
  }

  if (!locale) {
    return;
  }

  const location = `/${locale}${requestUrl.search}${anchor ?? ""}`;
  return sendRedirect(event, location, 301);
});
