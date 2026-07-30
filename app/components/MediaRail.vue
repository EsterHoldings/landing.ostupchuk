<script setup lang="ts">
  import { useI18n } from "vue-i18n";

  interface MediaItem {
    image: string;
    title: string;
    meta?: string;
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

  const { t } = useI18n();
  const track = ref<HTMLElement>();

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
      <article
        v-for="item in items"
        :key="`${title}-${item.title}`"
        class="media-card">
        <img
          :src="item.image"
          :alt="item.title"
          loading="lazy"
          draggable="false" />
      </article>
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
    scroll-snap-align: start;
  }

  .media-card img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
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
      grid-auto-columns: min(440px, 92%);
    }

    .media-rail--portrait .media-rail__track {
      grid-auto-columns: min(325px, 84%);
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
