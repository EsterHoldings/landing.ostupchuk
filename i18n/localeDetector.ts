import { getCookie } from "h3";

const supportedLocales = new Set(["en", "uk", "de", "es", "fr", "it", "pt", "ru", "tr", "he", "hi", "ja", "ko", "zh"]);

export default defineI18nLocaleDetector((event, config) => {
  const savedLocale = getCookie(event, "i18n_redirected");

  return savedLocale && supportedLocales.has(savedLocale) ? savedLocale : config.defaultLocale;
});
