<script setup lang="ts">
  import { useI18n } from "vue-i18n";

  withDefaults(defineProps<{ homePath?: string }>(), { homePath: "" });
  const emit = defineEmits<{ consultation: [] }>();
  const { t } = useI18n();
  const localePath = useLocalePath();
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <AppLogo light />
        <a href="mailto:support@ostupchuk.com">support@ostupchuk.com</a>
        <p class="footer__copyright">
          {{ t("footer.copyright", { year: new Date().getFullYear() }) }}<br />
          Усі права захищені
        </p>
      </div>

      <div class="footer__column">
        <strong>{{ t("footer.academy") }}</strong>
        <a :href="`${homePath}#about`">{{ t("footer.about") }}</a>
        <a :href="`${homePath}#programs`">{{ t("footer.directions") }}</a>
        <a :href="`${homePath}#results`">{{ t("footer.results") }}</a>
        <a :href="`${homePath}#faq`">Відгуки клієнтів</a>
        <NuxtLink :to="localePath('/public-offer')">{{ t("footer.offer") }}</NuxtLink>
      </div>

      <div class="footer__column">
        <strong>{{ t("footer.programs") }}</strong>
        <a :href="`${homePath}#programs`">Trading Education</a>
        <a :href="`${homePath}#programs`">Investment Education</a>
        <a :href="`${homePath}#programs`">Приватний Менторинг</a>
        <a :href="`${homePath}#programs`">Market Intelligence</a>
      </div>

      <div class="footer__column">
        <strong>{{ t("footer.contacts") }}</strong>
        <button
          class="footer__link"
          type="button"
          @click="emit('consultation')">
          {{ t("common.consultation") }}
        </button>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer">
          Instagram
        </a>
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noreferrer">
          YouTube
        </a>
        <a
          href="https://t.me/"
          target="_blank"
          rel="noreferrer">
          Telegram
        </a>
      </div>
    </div>
  </footer>
</template>
