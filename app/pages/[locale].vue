<script setup lang="ts">
  import { useI18n } from "vue-i18n";

  // The previous website used locale prefixes (for example, /ua/). Keep these
  // URLs working without making the current no-prefix routes duplicate pages.
  const localeAliases: Record<string, string> = {
    ua: "uk",
    uk: "uk",
    en: "en",
    de: "de",
    es: "es",
    fr: "fr",
    it: "it",
    pt: "pt",
    ru: "ru",
    tr: "tr",
    he: "he",
    hi: "hi",
    ja: "ja",
    ko: "ko",
    zh: "zh",
  };

  // The old multi-page landing is now a one-page site. Preserve the indexed
  // URLs by taking visitors directly to the matching section on the homepage.
  const legacySectionAnchors: Record<string, string> = {
    about: "#about",
    programs: "#programs",
    results: "#results",
    faq: "#faq",
  };

  const route = useRoute();
  const { setLocale } = useI18n();
  const localeSegment = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale;
  const normalizedSegment = localeSegment?.toLowerCase();
  const locale = normalizedSegment ? localeAliases[normalizedSegment] : undefined;
  const legacyAnchor = normalizedSegment ? legacySectionAnchors[normalizedSegment] : undefined;

  if (!locale && !legacyAnchor) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
    });
  }

  if (locale) {
    // setLocale persists i18n_redirected, so following visits retain a language
    // selected from either the language switcher or a prefixed legacy URL.
    await setLocale(locale);
  }

  await navigateTo(
    {
      path: "/",
      query: route.query,
      hash: legacyAnchor ?? route.hash,
    },
    {
      redirectCode: 301,
      replace: true,
    },
  );
</script>
