// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  css: ["~/assets/styles/main.scss"],
  modules: ["@nuxtjs/i18n"],
  i18n: {
    defaultLocale: "uk",
    strategy: "no_prefix",
    langDir: "locales",
    locales: [
      { code: "uk", language: "uk-UA", name: "Українська", file: "uk.json" },
    ],
  },
  typescript: {
    strict: true,
  },
});
