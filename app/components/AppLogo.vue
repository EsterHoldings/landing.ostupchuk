<script setup lang="ts">
  import { useI18n } from "vue-i18n";

  withDefaults(
    defineProps<{
      light?: boolean;
    }>(),
    {
      light: false,
    }
  );

  const { t } = useI18n();
</script>

<template>
  <NuxtLink
    class="brand"
    :class="{ 'brand--light': light }"
    to="/"
    :aria-label="t('appLogo.homeAria')">
    <span
      class="brand__art"
      aria-hidden="true" />
  </NuxtLink>
</template>

<style lang="scss" scoped>
  .brand {
    display: block;
    flex: 0 0 auto;
    color: var(--ink);
    text-decoration: none;
  }

  .brand__art {
    display: block;
    width: clamp(145px, 10.8vw, 160px);
    aspect-ratio: 1052 / 296;
    background: currentColor;
    mask: url("/images/logo-white.png") center / contain no-repeat;
    animation: logo-float 6s ease-in-out infinite;
    transform-origin: center;
  }

  .brand--light {
    color: #ffffff;
  }

  @keyframes logo-float {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }

    50% {
      transform: translate3d(0, -3px, 0) rotate(0.2deg);
    }
  }

  @media (max-width: 520px) {
    .brand__art {
      width: 132px;
    }
  }
</style>
