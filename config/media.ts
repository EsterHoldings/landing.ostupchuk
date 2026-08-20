export type MediaPlatform = "youtube" | "instagram";

export interface MediaLink {
  href: string;
  thumbnail: string;
  embedUrl: string;
  previewUrl?: string;
  previewTime?: number;
  hoverEmbedUrl?: string;
  platform: MediaPlatform;
}

const youtube = (href: string): MediaLink => {
  const match = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^?&#/]+)/);
  const videoId = match?.[1] ?? "";

  return {
    href,
    thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "",
    embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0` : href,
    hoverEmbedUrl: videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`
      : "",
    platform: "youtube",
  };
};

const instagram = (href: string, thumbnail: string, previewTime = 2.5): MediaLink => {
  const reelId = href.match(/instagram\.com\/(?:reel|p)\/([^?&#/]+)/)?.[1];

  return {
    href,
    thumbnail,
    embedUrl: reelId ? `https://www.instagram.com/reel/${reelId}/embed/` : href,
    previewUrl: `/api/instagram-preview?url=${encodeURIComponent(href)}`,
    previewTime,
    platform: "instagram",
  };
};

/**
 * Edit media URLs here. YouTube thumbnails and hover embeds are generated from
 * each link automatically. Instagram reels use a local static cover until a
 * visitor hovers the card, then the local preview endpoint plays the reel
 * without Instagram UI overlays. The third argument of instagram() is the
 * still-preview timestamp in seconds.
 */
export const mediaLinks = {
  videoReviews: [
    instagram(
      "https://www.instagram.com/reel/DbyhdcciHDp/?igsh=MXdpYWh2bG1ubGJqdw==",
      "/images/instagram-transformation.jpg",
      2.5
    ),
    instagram(
      "https://www.instagram.com/reel/Db2ppNLiaTM/?igsh=MXc0OHk0ODFwd3Z1dA==",
      "/images/instagram-mentorship.jpg",
      2.5
    ),
    instagram(
      "https://www.instagram.com/reel/Db2qMNqio-2/?igsh=YTR2YmR5Mnk0anRw",
      "/images/instagram-railway-to-trader.jpg",
      2.5
    ),
    instagram(
      "https://www.instagram.com/reel/Db2qNyvCzT2/?igsh=MnZyN2FqMnhucHB4",
      "/images/instagram-results-five-days.jpg",
      2.5
    ),
    instagram(
      "https://www.instagram.com/reel/Db2rZ8fipyV/?igsh=dHpjNWYzYmY3djg=",
      "/images/instagram-personal-approach.jpg",
      2.5
    ),
    youtube("https://youtu.be/BlZ5BLj45Xc?si=ayetoGe_wA1RrIlN"),
  ],
  practicalResults: [
    youtube("https://youtu.be/srOD-QuqNNU?si=i9M3rKbyQZ36SHiE"),
    youtube("https://youtu.be/eSd8nSPPHXw?si=cLqmB8dRVsRMWPBY"),
    youtube("https://youtu.be/oA61Twdur9Y?si=Nvc78IUVqA4jIvFQ"),
    youtube("https://youtu.be/O7IArPf-CWQ?si=NDwYkC6RuraMLH0j"),
  ],
  interviews: [
    youtube("https://youtu.be/zvJ-3xEss14?si=5TteUXKSvQOT57n5"),
    youtube("https://youtu.be/75Xi7dKzCu8?si=bYWfiUF0SdRfMhgn"),
    youtube("https://youtu.be/p9crj6aBKNs?si=AYWoMqaJ7JbcuUqG"),
    youtube("https://youtu.be/BlZ5BLj45Xc?si=ayetoGe_wA1RrIlN"),
  ],
} as const;
