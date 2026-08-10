export type MediaPlatform = "youtube" | "instagram";

export interface MediaLink {
  href: string;
  thumbnail: string;
  embedUrl: string;
  platform: MediaPlatform;
}

const youtube = (href: string): MediaLink => {
  const match = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^?&#/]+)/);
  const videoId = match?.[1] ?? "";

  return {
    href,
    thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "",
    embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0` : href,
    platform: "youtube",
  };
};

const instagram = (href: string): MediaLink => {
  const reelId = href.match(/instagram\.com\/(?:reel|p)\/([^?&#/]+)/)?.[1];
  const shareToken = href.match(/instagram\.com\/s\/([^?&#/]+)/)?.[1];

  return {
    href,
    thumbnail: "",
    embedUrl: reelId
      ? `https://www.instagram.com/reel/${reelId}/embed/`
      : shareToken
        ? `https://www.instagram.com/s/${shareToken}/embed/`
        : href,
    platform: "instagram",
  };
};

/**
 * Edit media URLs here. YouTube thumbnails and embed URLs are generated from
 * each link automatically; Instagram reels open through Instagram's embed
 * endpoint without leaving the landing page.
 */
export const mediaLinks = {
  videoReviews: [
    instagram("https://www.instagram.com/reel/DbyhdcciHDp/?igsh=MXdpYWh2bG1ubGJqdw=="),
    instagram("https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTgxMDg1Mzc4MDY5Mjg3?igsh=MXRxMGN1aWk1bXFkZw=="),
    instagram("https://www.instagram.com/reel/Db2ppNLiaTM/?igsh=MXc0OHk0ODFwd3Z1dA=="),
    instagram("https://www.instagram.com/reel/Db2qMNqio-2/?igsh=YTR2YmR5Mnk0anRw"),
    instagram("https://www.instagram.com/reel/Db2qNyvCzT2/?igsh=MnZyN2FqMnhucHB4"),
    instagram("https://www.instagram.com/reel/Db2rZ8fipyV/?igsh=dHpjNWYzYmY3djg="),
  ],
  practicalResults: [
    youtube("https://youtu.be/srOD-QuqNNU?si=i9M3rKbyQZ36SHiE"),
    youtube("https://youtu.be/eSd8nSPPHXw?si=cLqmB8dRVsRMWPBY"),
    youtube("https://youtu.be/oA61Twdur9Y?si=Nvc78IUVqA4jIvFQ"),
    youtube("https://youtu.be/O7IArPf-CWQ?si=NDwYkC6RuraMLH0j"),
  ],
  interviews: [
    youtube("https://youtu.be/zvJ-3xEss14?si=5TteUXKSvQOT57n5"),
    youtube("https://youtu.be/HM4drPiicdU?si=5teNQnt8oy3YRIas"),
    youtube("https://youtu.be/75Xi7dKzCu8?si=bYWfiUF0SdRfMhgn"),
    youtube("https://youtu.be/p9crj6aBKNs?si=AYWoMqaJ7JbcuUqG"),
  ],
} as const;
