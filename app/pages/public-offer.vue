<script setup lang="ts">
  type OfferPayload = {
    academyName: string;
    title: string;
    description: string;
    content: Array<{ type: string; text: string }>;
  };

  const offerLoaders = {
    en: () => import("~/data/public-offers/en.json"),
    uk: () => import("~/data/public-offers/uk.json"),
    de: () => import("~/data/public-offers/de.json"),
    es: () => import("~/data/public-offers/es.json"),
    fr: () => import("~/data/public-offers/fr.json"),
    it: () => import("~/data/public-offers/it.json"),
    pt: () => import("~/data/public-offers/pt.json"),
    ru: () => import("~/data/public-offers/ru.json"),
    tr: () => import("~/data/public-offers/tr.json"),
    he: () => import("~/data/public-offers/he.json"),
    hi: () => import("~/data/public-offers/hi.json"),
    ja: () => import("~/data/public-offers/ja.json"),
    ko: () => import("~/data/public-offers/ko.json"),
    zh: () => import("~/data/public-offers/zh.json"),
  };

  const localePath = useLocalePath();
  const { locale } = useI18n();
  const isConsultationOpen = ref(false);
  const loadOffer = async (code: string) => {
    const loader = offerLoaders[code as keyof typeof offerLoaders] ?? offerLoaders.uk;
    return (await loader()).default as OfferPayload;
  };
  const offer = shallowRef(await loadOffer(locale.value));
  watch(locale, async code => {
    offer.value = await loadOffer(code);
  });
  const pageTitle = computed(() => `${offer.value.title} — ${offer.value.academyName}`);
  const pageDescription = computed(() => offer.value.description);
  const canonicalUrl = computed(() => `https://ostupchuk.com${localePath("/public-offer", locale.value)}`);

  useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
  });
  useHead(() => ({
    link: [{ rel: "canonical", href: canonicalUrl.value }],
  }));
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
      :lang="locale"
      :dir="locale === 'he' ? 'rtl' : 'ltr'">
      <article aria-labelledby="offer-title">
        <p class="eyebrow">{{ offer.academyName }}</p>
        <h1 id="offer-title">{{ offer.title }}</h1>
        <PublicOfferContent :blocks="offer.content" />
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
