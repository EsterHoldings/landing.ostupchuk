<script setup lang="ts">
  import { ArrowLeft, ArrowRight, Play } from "@lucide/vue";
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

  const scroll = (direction: number) => {
    track.value?.scrollBy({
      left: direction * Math.min(track.value.clientWidth * 0.82, 720),
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
          <ArrowLeft :size="18" />
        </button>
        <button
          type="button"
          :aria-label="t('media.scrollForward', { title })"
          @click="scroll(1)">
          <ArrowRight :size="18" />
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
          loading="lazy" />
        <span
          class="media-card__play"
          aria-hidden="true">
          <Play
            :size="18"
            fill="currentColor" />
        </span>
        <div class="media-card__caption">
          <strong>{{ item.title }}</strong>
          <small v-if="item.meta">{{ item.meta }}</small>
        </div>
      </article>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .media-rail {
    padding: var(--section-space) 0 0;
  }

  .media-rail__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 26px;
  }

  .media-rail__header h2 {
    margin: 0;
    color: var(--ink);
    font: 500 clamp(36px, 4.6vw, 62px) / 1 var(--font-display);
    letter-spacing: -0.035em;
  }

  .media-rail__controls {
    display: flex;
    gap: 8px;
  }

  .media-rail__controls button {
    display: grid;
    width: 42px;
    height: 42px;
    padding: 0;
    place-items: center;
    border: 1px solid var(--navy);
    background: var(--navy);
    color: #ffffff;
    cursor: pointer;
    transition:
      background 160ms ease,
      color 160ms ease;
  }

  .media-rail__controls button:hover {
    background: transparent;
    color: var(--navy);
  }

  .media-rail__track {
    display: grid;
    grid-auto-columns: calc((100% - 48px) / 4);
    grid-auto-flow: column;
    gap: 16px;
    padding-bottom: 8px;
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
    min-height: clamp(150px, 17.5vw, 252px);
    overflow: hidden;
    background: var(--navy);
    scroll-snap-align: start;
  }

  .media-card::after {
    position: absolute;
    inset: 40% 0 0;
    background: linear-gradient(transparent, rgb(4 12 26 / 88%));
    content: "";
  }

  .media-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 500ms cubic-bezier(0.2, 0.7, 0, 1);
  }

  .media-card:hover img {
    transform: scale(1.035);
  }

  .media-card__play {
    position: absolute;
    z-index: 2;
    top: 16px;
    left: 16px;
    display: grid;
    width: 42px;
    height: 42px;
    place-items: center;
    border: 1px solid rgb(255 255 255 / 45%);
    border-radius: 50%;
    background: rgb(10 19 33 / 45%);
    color: #ffffff;
    backdrop-filter: blur(8px);
  }

  .media-card__caption {
    position: absolute;
    z-index: 2;
    right: 18px;
    bottom: 18px;
    left: 18px;
    display: grid;
    gap: 5px;
    color: #ffffff;
  }

  .media-card__caption strong {
    font-size: 14px;
  }

  .media-card__caption small {
    color: rgb(255 255 255 / 68%);
    font-size: 10px;
  }

  .media-rail--portrait .media-rail__track {
    grid-auto-columns: calc((100% - 48px) / 4);
  }

  .media-rail--portrait .media-card {
    min-height: clamp(320px, 40vw, 576px);
  }

  .media-rail--dark .media-rail__header h2 {
    color: #ffffff;
  }

  .media-rail--dark .media-rail__controls button {
    border-color: #ffffff;
    background: #ffffff;
    color: var(--navy);
  }

  @media (max-width: 760px) {
    .media-rail__track,
    .media-rail--portrait .media-rail__track {
      grid-auto-columns: minmax(265px, 84%);
    }

    .media-rail--portrait .media-card {
      min-height: 400px;
    }

    .media-rail__controls {
      display: none;
    }
  }
</style>
