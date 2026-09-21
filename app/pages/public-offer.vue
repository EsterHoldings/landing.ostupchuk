<script setup lang="ts">
  // Keep one URL for the original Russian document across all site languages.
  defineI18nRoute(false);

  const localePath = useLocalePath();
  const isConsultationOpen = ref(false);
  const title = "Публичная оферта — Агентство OST UP CHUK";
  const description = "Условия пользования сайтом и оказания услуг Агентства OST UP CHUK.";

  useSeoMeta({ title, description, ogTitle: title, ogDescription: description });
  useHead({
    link: [{ rel: "canonical", href: "https://ostupchuk.com/public-offer" }],
  });
</script>

<template>
  <div class="offer-page">
    <div class="container offer-page__header">
      <SiteHeader
        :home-path="localePath('/')"
        @consultation="isConsultationOpen = true" />
    </div>

    <main
      class="container offer-page__main"
      lang="ru"
      dir="ltr">
      <article aria-labelledby="offer-title">
        <p class="eyebrow">Агентство OST UP CHUK</p>
        <h1 id="offer-title">Публичная оферта</h1>
        <PublicOfferContent />
      </article>
    </main>

    <SiteFooter
      :home-path="localePath('/')"
      @consultation="isConsultationOpen = true" />
    <ConsultationModal v-model="isConsultationOpen" />
  </div>
</template>

<style lang="scss" scoped>
  .offer-page {
    background: var(--paper);
  }

  .offer-page__header {
    background: var(--sky);

    :deep(.header__inner) {
      padding-inline: clamp(16px, 1.3889vw, 20px);
    }
  }

  .offer-page__main {
    max-width: 900px;
    padding-block: clamp(40px, 6vw, 80px);
    overflow-wrap: anywhere;

    h1 {
      margin: 16px 0 40px;
      font-family: var(--font-display);
      font-size: clamp(40px, 6vw, 64px);
      font-weight: 400;
      line-height: 1.1;
    }

    :deep(h2) {
      margin: 40px 0 16px;
      font-family: var(--font-display);
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 400;
      line-height: 1.2;
    }

    :deep(h3) {
      margin: 24px 0 12px;
      font-size: 18px;
      line-height: 1.5;
    }

    :deep(p) {
      margin: 0 0 16px;
      font-size: 16px;
      line-height: 1.75;
    }
  }
</style>
