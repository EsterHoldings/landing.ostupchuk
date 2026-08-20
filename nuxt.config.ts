// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
      ],
    },
  },
  css: ["~/assets/styles/main.scss"],
  runtimeConfig: {
    public: {
      esterApiBase: "https://server.esterholdings.com/api",
    },
  },
  modules: ["@nuxtjs/i18n"],
  i18n: {
    // Each translation has a separate, crawlable URL. Keeping the default
    // locale prefixed prevents the root page from competing with /uk in search.
    defaultLocale: "uk",
    strategy: "prefix",
    trailingSlash: false,
    baseUrl: "https://ostupchuk.com",
    experimental: {
      // Nuxt i18n generates canonical and alternate (hreflang) tags from the
      // configured base URL and locale routes.
      strictSeo: true,
      // Browser locale must never override Ukrainian on a first visit.
      // The detector below restores only a locale explicitly saved by the user.
      localeDetector: "localeDetector.ts",
    },
    langDir: "locales",
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json" },
      { code: "uk", language: "uk-UA", name: "Українська", file: "uk.json" },
      { code: "de", language: "de-DE", name: "Deutsch", file: "de.json" },
      { code: "es", language: "es-ES", name: "Español", file: "es.json" },
      { code: "fr", language: "fr-FR", name: "Français", file: "fr.json" },
      { code: "it", language: "it-IT", name: "Italiano", file: "it.json" },
      { code: "pt", language: "pt-PT", name: "Português", file: "pt.json" },
      { code: "ru", language: "ru-RU", name: "Русский", file: "ru.json" },
      { code: "tr", language: "tr-TR", name: "Türkçe", file: "tr.json" },
      { code: "he", language: "he-IL", name: "עברית", file: "he.json" },
      { code: "hi", language: "hi-IN", name: "हिन्दी", file: "hi.json" },
      { code: "ja", language: "ja-JP", name: "日本語", file: "ja.json" },
      { code: "ko", language: "ko-KR", name: "한국어", file: "ko.json" },
      { code: "zh", language: "zh-CN", name: "中文", file: "zh.json" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: false,
      // A selected language is restored only when entering the root URL. URLs
      // that already contain a language prefix are always respected.
      redirectOn: "root",
      fallbackLocale: "uk",
    },
  },
  typescript: {
    strict: true,
  },
});
