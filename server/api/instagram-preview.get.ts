import { createError, defineEventHandler, getQuery, sendRedirect, setResponseHeader } from "h3";

const allowedHosts = new Set(["instagram.com", "www.instagram.com"]);

const extractVideoUrl = (html: string) => {
  const match = html.match(/"video_versions":(\[[\s\S]*?\])/);

  if (!match?.[1]) {
    return null;
  }

  try {
    const versions = JSON.parse(match[1]) as Array<{ url?: string }>;
    return versions.find(version => typeof version.url === "string")?.url ?? null;
  } catch {
    return null;
  }
};

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const rawUrl = typeof query.url === "string" ? query.url : "";
  let sourceUrl: URL;

  try {
    sourceUrl = new URL(rawUrl);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid Instagram URL" });
  }

  if (!allowedHosts.has(sourceUrl.hostname)) {
    throw createError({ statusCode: 400, statusMessage: "Only Instagram URLs are supported" });
  }

  const response = await fetch(sourceUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Mozilla/5.0 (compatible; OstupchukPreview/1.0)",
    },
  });

  if (!response.ok) {
    throw createError({ statusCode: 502, statusMessage: "Instagram preview is unavailable" });
  }

  const videoUrl = extractVideoUrl(await response.text());

  if (!videoUrl) {
    throw createError({ statusCode: 404, statusMessage: "Instagram video preview was not found" });
  }

  setResponseHeader(event, "Cache-Control", "public, max-age=300, s-maxage=300");
  return sendRedirect(event, videoUrl, 302);
});
