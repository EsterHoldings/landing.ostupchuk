<script setup lang="ts">
  // Keep one URL for the original Russian document across all site languages.
  defineI18nRoute(false);

  const localePath = useLocalePath();
  const title = "Публичная оферта — Агентство OST UP CHUK";
  const description = "Условия пользования сайтом и оказания услуг Агентства OST UP CHUK.";

  useSeoMeta({ title, description, ogTitle: title, ogDescription: description });
  useHead({
    htmlAttrs: { lang: "ru", dir: "ltr" },
    link: [{ rel: "canonical", href: "https://ostupchuk.com/publichnaya-oferta" }],
  });
</script>

<template>
  <div
    class="offer-page"
    lang="ru"
    dir="ltr">
    <header class="offer-page__header">
      <div class="container offer-page__navigation">
        <AppLogo />
        <NuxtLink :to="localePath('/')">← На главную</NuxtLink>
      </div>
    </header>

    <main class="container offer-page__main">
      <article aria-labelledby="offer-title">
        <p class="eyebrow">Агентство OST UP CHUK</p>
        <h1 id="offer-title">Публичная оферта</h1>
        <PublicOfferContent />
      </article>
    </main>

    <footer class="offer-page__footer">
      <div class="container offer-page__navigation">
        <NuxtLink :to="localePath('/')">← На главную</NuxtLink>
        <a href="mailto:support@ostupchuk.com">support@ostupchuk.com</a>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
  .offer-page {
    background: var(--paper);

    a {
      color: var(--ink);
      text-underline-offset: 4px;
    }

    a:focus-visible {
      outline: 2px solid var(--navy);
      outline-offset: 5px;
    }
  }

  .offer-page__header {
    border-bottom: 1px solid var(--line);
  }

  .offer-page__navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
    padding-block: 28px;
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

  .offer-page__footer {
    background: var(--soft);
    border-top: 1px solid var(--line);
  }
</style>
