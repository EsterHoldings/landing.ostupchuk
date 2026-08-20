<script setup lang="ts">
  import { useI18n } from "vue-i18n";
  import type { MediaPlatform } from "../../config/media";

  interface MediaItem {
    image: string;
    title: string;
    meta?: string;
    href?: string;
    embedUrl?: string;
    previewUrl?: string;
    previewTime?: number;
    hoverEmbedUrl?: string;
    platform?: MediaPlatform;
  }

  withDefaults(
    defineProps<{
      title: string;
      items: MediaItem[];
      portrait?: boolean;
      dark?: boolean;
    }>(),
    {
      portrait: false,
      dark: false,
    }
  );

  const emit = defineEmits<{
    open: [item: MediaItem];
  }>();

  const { t } = useI18n();
  const track = ref<HTMLElement>();
  const failedPreviews = ref<Record<string, boolean>>({});
  const activePreviewKey = ref<string | null>(null);
  const soundEnabled = ref<Record<string, boolean>>({});

  const previewKey = (item: MediaItem) => item.href ?? item.title;

  const handlePreviewError = (item: MediaItem) => {
    failedPreviews.value[previewKey(item)] = true;
  };

  const hoverEmbedUrl = (item: MediaItem) => {
    return item.hoverEmbedUrl ?? "";
  };

  const seekToPreviewFrame = (item: MediaItem, video: HTMLVideoElement) => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    const previewTime = Math.min(item.previewTime ?? 2.5, Math.max(0, video.duration - 0.1));

    if (Math.abs(video.currentTime - previewTime) > 0.05) {
      video.currentTime = previewTime;
    }
  };

  const prepareInstagramPreview = (item: MediaItem, event: Event) => {
    const video = event.currentTarget as HTMLVideoElement | null;

    if (video) {
      seekToPreviewFrame(item, video);
    }
  };

  const startPreview = (item: MediaItem, event: MouseEvent) => {
    const key = previewKey(item);
    activePreviewKey.value = key;

    const video = (event.currentTarget as HTMLElement | null)?.querySelector<HTMLVideoElement>("video");
    if (video) {
      void video.play().catch(() => undefined);
    }
  };

  const stopPreview = (item: MediaItem, event: MouseEvent) => {
    const video = (event.currentTarget as HTMLElement | null)?.querySelector<HTMLVideoElement>("video");
    if (video) {
      video.pause();
      seekToPreviewFrame(item, video);
      video.muted = true;
    }

    if (activePreviewKey.value === previewKey(item)) {
      activePreviewKey.value = null;
    }

    soundEnabled.value = { ...soundEnabled.value, [previewKey(item)]: false };
  };

  const toggleSound = (item: MediaItem, event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
    const key = previewKey(item);
    const nextValue = !soundEnabled.value[key];
    soundEnabled.value = { ...soundEnabled.value, [key]: nextValue };

    const card = (event.currentTarget as HTMLElement | null)?.closest<HTMLElement>(".media-card");
    const video = card?.querySelector<HTMLVideoElement>("video");
    if (video) {
      video.muted = !nextValue;
      if (nextValue) {
        void video.play().catch(() => undefined);
      }
    }

    const frame = card?.querySelector<HTMLIFrameElement>("iframe");
    if (frame?.contentWindow && item.platform === "youtube") {
      frame.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: nextValue ? "unMute" : "mute",
          args: [],
        }),
        "*"
      );
    }
  };

  const syncYouTubeSound = (event: Event) => {
    const frame = event.currentTarget as HTMLIFrameElement | null;
    const item = frame?.closest<HTMLElement>(".media-card")?.dataset.mediaKey;
    if (!frame?.contentWindow || !item) {
      return;
    }

    frame.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: soundEnabled.value[item] ? "unMute" : "mute",
        args: [],
      }),
      "*"
    );
  };

  const scroll = (direction: -1 | 1) => {
    const rail = track.value;
    const card = rail?.querySelector<HTMLElement>(".media-card");

    if (!rail || !card) {
      return;
    }

    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const atStart = rail.scrollLeft <= 1;
    const atEnd = maxScroll - rail.scrollLeft <= 1;

    let nextPosition = rail.scrollLeft + direction * step;

    if (direction === 1 && atEnd) {
      nextPosition = 0;
    } else if (direction === -1 && atStart) {
      nextPosition = maxScroll;
    }

    rail.scrollTo({
      left: Math.max(0, Math.min(nextPosition, maxScroll)),
      behavior: "smooth",
    });
  };
</script>

<template>
  <section
    class="media-rail"
    :class="{ 'media-rail--portrait': portrait, 'media-rail--dark': dark }">
    <div class="media-rail__header">
      <h2>{{ title }}</h2>
      <div class="media-rail__controls">
        <button
          type="button"
          :aria-label="t('media.scrollBack', { title })"
          @click="scroll(-1)">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true">
            <path
              d="M11.4697 23.4697C11.1768 23.7626 11.1768 24.2374 11.4697 24.5303L16.2426 29.3033C16.5355 29.5962 17.0104 29.5962 17.3033 29.3033C17.5962 29.0104 17.5962 28.5355 17.3033 28.2426L13.0607 24L17.3033 19.7574C17.5962 19.4645 17.5962 18.9896 17.3033 18.6967C17.0104 18.4038 16.5355 18.4038 16.2426 18.6967L11.4697 23.4697ZM36 24V23.25H12V24V24.75H36V24Z"
              fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          :aria-label="t('media.scrollForward', { title })"
          @click="scroll(1)">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true">
            <path
              d="M36.5303 24.5303C36.8232 24.2374 36.8232 23.7626 36.5303 23.4697L31.7574 18.6967C31.4645 18.4038 30.9896 18.4038 30.6967 18.6967C30.4038 18.9896 30.4038 19.4645 30.6967 19.7574L34.9393 24L30.6967 28.2426C30.4038 28.5355 30.4038 29.0104 30.6967 29.3033C30.9896 29.5962 31.4645 29.5962 31.7574 29.3033L36.5303 24.5303ZM12 24V24.75H36V24V23.25H12V24Z"
              fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <div
      ref="track"
      class="media-rail__track">
      <template
        v-for="item in items"
        :key="`${title}-${item.href ?? item.title}`">
        <button
          v-if="item.href"
          class="media-card"
          :data-media-key="previewKey(item)"
          :aria-label="item.title"
          type="button"
          @mouseenter="startPreview(item, $event)"
          @mouseleave="stopPreview(item, $event)"
          @click="emit('open', item)">
          <iframe
            v-if="item.platform === 'youtube' && activePreviewKey === previewKey(item) && item.hoverEmbedUrl"
            class="media-card__embed"
            :src="hoverEmbedUrl(item)"
            :title="item.title"
            tabindex="-1"
            aria-hidden="true"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin"
            @load="syncYouTubeSound" />
          <video
            v-else-if="
              item.platform === 'instagram' &&
              activePreviewKey === previewKey(item) &&
              item.previewUrl &&
              !failedPreviews[previewKey(item)]
            "
            class="media-card__preview"
            :src="item.previewUrl"
            :title="item.title"
            muted
            loop
            playsinline
            preload="metadata"
            tabindex="-1"
            aria-hidden="true"
            @loadedmetadata="prepareInstagramPreview(item, $event)"
            @error="handlePreviewError(item)" />
          <iframe
            v-else-if="item.platform === 'instagram' && item.embedUrl && !item.image"
            class="media-card__embed"
            :src="item.embedUrl"
            :title="item.title"
            loading="lazy"
            tabindex="-1"
            aria-hidden="true"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin" />
          <img
            v-else
            :src="item.image"
            :alt="item.title"
            loading="lazy"
            draggable="false" />
          <span
            v-if="
              activePreviewKey === previewKey(item) && (item.platform === 'youtube' || item.platform === 'instagram')
            "
            class="media-card__sound"
            :class="{ 'media-card__sound--active': soundEnabled[previewKey(item)] }"
            role="button"
            tabindex="0"
            :aria-label="soundEnabled[previewKey(item)] ? 'Вимкнути звук' : 'Увімкнути звук'"
            :aria-pressed="soundEnabled[previewKey(item)]"
            @click.stop="toggleSound(item, $event)"
            @keydown.enter.stop.prevent="toggleSound(item, $event)"
            @keydown.space.stop.prevent="toggleSound(item, $event)">
            <svg
              v-if="soundEnabled[previewKey(item)]"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true">
              <path
                d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z"
                fill="currentColor" />
              <path
                d="M15 9.5a4 4 0 0 1 0 5M17.5 7a7.5 7.5 0 0 1 0 10"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.8" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true">
              <path
                d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z"
                fill="currentColor" />
              <path
                d="m16 9-5 6m0-6 5 6"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.8" />
            </svg>
          </span>
        </button>
        <article
          v-else
          class="media-card">
          <img
            :src="item.image"
            :alt="item.title"
            loading="lazy"
            draggable="false" />
        </article>
      </template>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .media-rail {
    padding: 80px 0 0;
  }

  .media-rail__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 32px;
  }

  .media-rail__header h2 {
    margin: 0;
    color: #364e74;
    font: 400 clamp(32px, 3.333vw, 48px) / 1 var(--font-display);
    letter-spacing: 0;
  }

  .media-rail__controls {
    display: flex;
    flex: 0 0 auto;
    gap: 16px;
  }

  .media-rail__controls button {
    display: grid;
    width: 48px;
    height: 48px;
    padding: 0;
    place-items: center;
    border: 0;
    background: #364e74;
    color: #ffffff;
    cursor: pointer;
    transition: opacity 160ms ease;
  }

  .media-rail__controls button:hover {
    opacity: 0.82;
  }

  .media-rail__controls svg {
    display: block;
  }

  .media-rail__track {
    display: grid;
    grid-auto-columns: calc((100% - 40px) / 3);
    grid-auto-flow: column;
    gap: 20px;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;
  }

  .media-rail__track::-webkit-scrollbar {
    display: none;
  }

  .media-card {
    position: relative;
    aspect-ratio: 440 / 249;
    overflow: hidden;
    border-radius: 6px;
    background: var(--navy);
    color: inherit;
    font: inherit;
    scroll-snap-align: start;
    text-decoration: none;
    text-align: initial;
  }

  button.media-card {
    width: 100%;
    padding: 0;
    border: 0;
    cursor: pointer;
  }

  .media-card img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .media-card__embed {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background: #000000;
    pointer-events: none;
  }

  .media-card__preview {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background: #000000;
    object-fit: cover;
    pointer-events: none;
  }

  .media-card__sound {
    position: absolute;
    z-index: 2;
    top: 12px;
    right: 12px;
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border: 1px solid rgb(255 255 255 / 55%);
    border-radius: 50%;
    background: rgb(20 30 48 / 70%);
    color: #ffffff;
    cursor: pointer;
    opacity: 0.94;
    transition:
      background 160ms ease,
      transform 160ms ease;
  }

  .media-card__sound:hover,
  .media-card__sound:focus-visible {
    background: #364e74;
    outline: none;
    transform: scale(1.06);
  }

  .media-rail--portrait .media-rail__track {
    grid-auto-columns: calc((100% - 60px) / 4);
  }

  .media-rail--portrait .media-card {
    aspect-ratio: 325 / 580;
  }

  .media-rail--dark .media-rail__header h2 {
    color: #ffffff;
  }

  .media-rail--dark .media-rail__controls button {
    background: #ffffff;
    color: var(--navy);
  }

  @media (max-width: 900px) {
    .media-rail__track {
      grid-auto-columns: min(440px, 95%);
    }

    .media-rail--portrait .media-rail__track {
      grid-auto-columns: min(325px, 92%);
    }
  }

  @media (max-width: 600px) {
    .media-rail {
      padding-top: 64px;
    }

    .media-rail__header {
      gap: 12px;
      margin-bottom: 24px;
    }

    .media-rail__controls {
      gap: 8px;
    }

    .media-rail__controls button,
    .media-rail__controls svg {
      width: 42px;
      height: 42px;
    }
  }
</style>
