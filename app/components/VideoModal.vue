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
  const panel = ref<HTMLElement>();
  const titleElement = ref<HTMLElement>();
  const headerHeight = ref(0);
  const panelWidth = ref<number>();

  let headerObserver: ResizeObserver | undefined;
  let layoutFrame: number | undefined;

  const close = () => emit("close");

  const isPortraitVideo = computed(() => props.platform === "instagram");
  const overlayStyle = computed(() => ({
    "--video-modal-header-height": `${headerHeight.value}px`,
  }));
  const panelStyle = computed(() => (panelWidth.value ? { width: `${panelWidth.value}px` } : undefined));

  const updateLayout = async () => {
    if (!import.meta.client || !props.open) {
      return;
    }

    const header = document.querySelector<HTMLElement>(".header");
    headerHeight.value = Math.round(header?.getBoundingClientRect().height ?? 0);

    await nextTick();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isCompact = viewportWidth <= 600;
    const edge = isCompact ? 12 : 16;
    const titleGap = isCompact ? 12 : 16;
    const aspectRatio = isPortraitVideo.value ? 9 / 16 : 16 / 9;
    const maxWidth = isPortraitVideo.value ? 560 : 1280;
    const titleHeight = titleElement.value?.getBoundingClientRect().height ?? 0;
    const availableWidth = viewportWidth - edge * 2;
    const availableHeight = viewportHeight - headerHeight.value - edge * 2;
    const chromeHeight = edge * 2 + titleHeight + titleGap;
    const widthFromHeight = Math.max(180, (availableHeight - chromeHeight) * aspectRatio);

    panelWidth.value = Math.floor(Math.min(maxWidth, availableWidth, widthFromHeight));
  };

  const scheduleLayoutUpdate = () => {
    if (!import.meta.client) {
      return;
    }

    if (layoutFrame) {
      window.cancelAnimationFrame(layoutFrame);
    }

    layoutFrame = window.requestAnimationFrame(() => {
      void updateLayout();
    });
  };

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

      if (open) {
        scheduleLayoutUpdate();
      } else {
        panelWidth.value = undefined;
      }
    }
  );

  watch([() => props.platform, () => props.title], scheduleLayoutUpdate);

  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", scheduleLayoutUpdate, { passive: true });

    const header = document.querySelector<HTMLElement>(".header");
    if (header) {
      headerObserver = new ResizeObserver(scheduleLayoutUpdate);
      headerObserver.observe(header);
    }
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", scheduleLayoutUpdate);
    headerObserver?.disconnect();
    if (layoutFrame) {
      window.cancelAnimationFrame(layoutFrame);
    }
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
        :style="overlayStyle"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        @click.self="close">
        <section
          ref="panel"
          class="video-modal__panel"
          :style="panelStyle">
          <button
            class="video-modal__close"
            type="button"
            :aria-label="t('modal.closeAria')"
            @click="close">
            <X :size="22" />
          </button>
          <h2
            id="video-modal-title"
            ref="titleElement">
            {{ title }}
          </h2>
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
    --video-modal-edge: 16px;

    position: fixed;
    z-index: 100;
    top: var(--video-modal-header-height);
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    place-items: center;
    padding: var(--video-modal-edge);
    background: rgb(7 15 28 / 72%);
    backdrop-filter: blur(8px);
  }

  .video-modal__panel {
    position: relative;
    max-width: 100%;
    max-height: calc(100dvh - var(--video-modal-header-height) - 2 * var(--video-modal-edge));
    padding: var(--video-modal-edge);
    overflow: auto;
    background: var(--paper);
    box-sizing: border-box;
  }

  .video-modal__panel h2 {
    max-width: calc(100% - 48px);
    margin: 0 0 16px;
    color: var(--ink);
    font: 400 clamp(26px, 3vw, 46px) / 1 var(--font-display);
  }

  .video-modal__close {
    position: absolute;
    top: var(--video-modal-edge);
    right: var(--video-modal-edge);
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
    width: 100%;
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
    width: min(560px, 100%);
  }

  .video-modal--instagram .video-modal__frame {
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
      --video-modal-edge: 12px;
    }

    .video-modal__panel {
      max-height: calc(100dvh - var(--video-modal-header-height) - 2 * var(--video-modal-edge));
    }

    .video-modal__close {
      width: 34px;
      height: 34px;
    }

    .video-modal__panel h2 {
      margin-bottom: 12px;
    }
  }
</style>
