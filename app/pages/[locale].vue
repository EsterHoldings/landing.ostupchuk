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

  const route = useRoute();
  const { setLocale } = useI18n();
  const localeSegment = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale;
  const locale = localeSegment ? localeAliases[localeSegment.toLowerCase()] : undefined;

  if (!locale) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
    });
  }

  // setLocale persists i18n_redirected, so following visits retain a language
  // selected from either the language switcher or a prefixed legacy URL.
  await setLocale(locale);

  await navigateTo(
    {
      path: "/",
      query: route.query,
      hash: route.hash,
    },
    {
      redirectCode: 301,
      replace: true,
    },
  );
</script>
