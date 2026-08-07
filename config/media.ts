export interface MediaLink {
  href: string;
  thumbnail: string;
  embedUrl: string;
}

const youtube = (href: string): MediaLink => {
  const match = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^?&#/]+)/);
  const videoId = match?.[1] ?? "";

  return {
    href,
    thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "",
    embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0` : href,
  };
};

/**
 * Edit video URLs here. Thumbnails and embed URLs are generated from each
 * YouTube link automatically, so the localized copy and components stay unchanged.
 */
export const mediaLinks = {
  // These testimonials stay without links until their final video sources are selected.
  videoReviews: [],
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
