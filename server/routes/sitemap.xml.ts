import { setHeader } from "h3";

const siteUrl = "https://ostupchuk.com";

const locales = [
  { code: "uk", language: "uk-UA" },
  { code: "en", language: "en-US" },
  { code: "de", language: "de-DE" },
  { code: "es", language: "es-ES" },
  { code: "fr", language: "fr-FR" },
  { code: "it", language: "it-IT" },
  { code: "pt", language: "pt-PT" },
  { code: "ru", language: "ru-RU" },
  { code: "tr", language: "tr-TR" },
  { code: "he", language: "he-IL" },
  { code: "hi", language: "hi-IN" },
  { code: "ja", language: "ja-JP" },
  { code: "ko", language: "ko-KR" },
  { code: "zh", language: "zh-CN" },
] as const;

const escapeXml = (value: string) =>
  value.replace(/[<>&"']/g, character => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
    };

    return entities[character]!;
  });

export default defineEventHandler(event => {
  setHeader(event, "content-type", "application/xml; charset=UTF-8");
  setHeader(event, "cache-control", "public, max-age=3600, s-maxage=3600");

  const alternateLinks = locales
    .map(({ code, language }) => `    <xhtml:link rel="alternate" hreflang="${language}" href="${siteUrl}/${code}" />`)
    .join("\n");
  const defaultAlternateLink = `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/uk" />`;

  const urls = locales
    .map(
      ({ code }) => `  <url>
    <loc>${escapeXml(`${siteUrl}/${code}`)}</loc>
${alternateLinks}
${defaultAlternateLink}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
});
