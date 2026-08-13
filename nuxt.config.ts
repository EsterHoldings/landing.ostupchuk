// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  css: ["~/assets/styles/main.scss"],
  runtimeConfig: {
    public: {
      esterApiBase: "https://server.esterholdings.com/api",
    },
  },
  modules: ["@nuxtjs/i18n"],
  i18n: {
    defaultLocale: "uk",
    strategy: "no_prefix",
    experimental: {
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
      fallbackLocale: "uk",
    },
  },
  typescript: {
    strict: true,
  },
});
