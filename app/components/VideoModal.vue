<script setup lang="ts">
  import { X } from "@lucide/vue";
  import { useI18n } from "vue-i18n";
  import type { MediaPlatform } from "../../config/media";

  const props = withDefaults(
    defineProps<{
      open: boolean;
      title: string;
      embedUrl: string | null;
      previewUrl: string | null;
      platform?: MediaPlatform;
    }>(),
    {
      platform: "youtube",
      previewUrl: null,
    }
  );

  const emit = defineEmits<{
    close: [];
  }>();

  const { t } = useI18n();

  const close = () => emit("close");

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && props.open) {
      close();
    }
  };

  watch(
    () => props.open,
    open => {
      if (import.meta.client) {
        document.body.style.overflow = open ? "hidden" : "";
      }
    }
  );

  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeydown);
    if (import.meta.client) {
      document.body.style.overflow = "";
    }
  });
</script>

<template>
  <Teleport to="body">
    <Transition name="video-modal">
      <div
        v-if="open"
        class="video-modal"
        :class="`video-modal--${platform}`"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        @click.self="close">
        <section class="video-modal__panel">
          <button
            class="video-modal__close"
            type="button"
            :aria-label="t('modal.closeAria')"
            @click="close">
            <X :size="22" />
          </button>
          <h2 id="video-modal-title">{{ title }}</h2>
          <div class="video-modal__frame">
            <video
              v-if="platform === 'instagram' && previewUrl"
              class="video-modal__video"
              :src="previewUrl"
              :title="title"
              autoplay
              controls
              loop
              muted
              playsinline
              preload="metadata" />
            <iframe
              v-else-if="embedUrl"
              :src="embedUrl"
              :title="title"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowfullscreen />
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
  .video-modal {
    position: fixed;
    z-index: 100;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgb(7 15 28 / 72%);
    backdrop-filter: blur(8px);
  }

  .video-modal__panel {
    position: relative;
    width: min(1080px, 100%);
    padding: clamp(24px, 4vw, 48px);
    background: var(--paper);
  }

  .video-modal__panel h2 {
    max-width: calc(100% - 48px);
    margin: 0 0 20px;
    color: var(--ink);
    font: 400 clamp(28px, 4vw, 48px) / 1 var(--font-display);
  }

  .video-modal__close {
    position: absolute;
    top: 16px;
    right: 16px;
    display: grid;
    width: 40px;
    height: 40px;
    padding: 0;
    place-items: center;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    cursor: pointer;
  }

  .video-modal__frame {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #000000;
  }

  .video-modal__frame iframe,
  .video-modal__frame video {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .video-modal__video {
    object-fit: contain;
  }

  .video-modal--instagram .video-modal__panel {
    width: min(680px, 100%);
  }

  .video-modal--instagram .video-modal__frame {
    max-height: calc(100svh - 120px);
    aspect-ratio: 9 / 16;
  }

  .video-modal-enter-active,
  .video-modal-leave-active {
    transition: opacity 220ms ease;

    .video-modal__panel {
      transition: transform 220ms ease;
    }
  }

  .video-modal-enter-from,
  .video-modal-leave-to {
    opacity: 0;

    .video-modal__panel {
      transform: translateY(16px);
    }
  }

  @media (max-width: 600px) {
    .video-modal {
      padding: 12px;
    }

    .video-modal__panel {
      padding: 24px 12px 12px;
    }

    .video-modal__close {
      top: 6px;
      right: 6px;
      width: 34px;
      height: 34px;
    }
  }
</style>
