<script setup lang="ts">
  import { ChevronDown, Menu, X } from "@lucide/vue";
  import { useI18n } from "vue-i18n";

  type LocaleCode = "en" | "uk" | "de" | "es" | "fr" | "it" | "pt" | "ru" | "tr" | "he" | "hi" | "ja" | "ko" | "zh";

  interface LanguageOption {
    code: LocaleCode;
    label: string;
    flag: string;
    short?: string;
  }

  const emit = defineEmits<{
    consultation: [];
  }>();

  const { locale, setLocale, t } = useI18n();
  const isMenuOpen = ref(false);
  const isLanguageOpen = ref(false);
  const isHeaderFixed = ref(false);
  const languagePicker = ref<HTMLElement>();

  const languages: LanguageOption[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "uk", label: "Українська", flag: "🇺🇦", short: "UA" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "pt", label: "Português", flag: "🇵🇹" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "he", label: "עברית", flag: "🇮🇱" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
  ];

  const navItems = computed(() => [
    { label: t("header.nav.about"), href: "#about" },
    { label: t("header.nav.programs"), href: "#programs" },
    { label: t("header.nav.results"), href: "#results" },
    { label: t("header.nav.faq"), href: "#faq" },
  ]);

  const selectedLanguage = computed(() => languages.find(language => language.code === locale.value) ?? languages[1]!);

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  const switchLanguage = async (code: LocaleCode) => {
    await setLocale(code);
    isLanguageOpen.value = false;
    closeMenu();
  };

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    isLanguageOpen.value = false;
  };

  const openConsultation = () => {
    closeMenu();
    isLanguageOpen.value = false;
    emit("consultation");
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (!languagePicker.value?.contains(event.target as Node)) {
      isLanguageOpen.value = false;
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      isLanguageOpen.value = false;
      closeMenu();
    }
  };

  const updateHeaderPosition = () => {
    isHeaderFixed.value = window.scrollY > 24;
  };

  onMounted(() => {
    updateHeaderPosition();
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", updateHeaderPosition, { passive: true });
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleDocumentClick);
    document.removeEventListener("keydown", handleEscape);
    window.removeEventListener("scroll", updateHeaderPosition);
  });
</script>

<template>
  <div class="header-shell">
    <header
      class="header"
      :class="{ 'header--fixed': isHeaderFixed }">
      <div class="header__inner">
        <AppLogo />

        <nav
          class="header__nav"
          :aria-label="t('header.mainNavigation')">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href">
            {{ item.label }}
          </a>
        </nav>

        <div class="header__actions">
          <div
            ref="languagePicker"
            class="header__language-picker">
            <button
              class="header__language"
              type="button"
              :aria-label="t('header.currentLanguage', { language: selectedLanguage.label })"
              :aria-expanded="isLanguageOpen"
              aria-controls="language-menu"
              @click="isLanguageOpen = !isLanguageOpen">
              <span>{{ selectedLanguage.short ?? selectedLanguage.code.toUpperCase() }}</span>
              <ChevronDown
                :class="{ 'header__language-chevron--open': isLanguageOpen }"
                :size="15"
                :stroke-width="2.2" />
            </button>

            <Transition name="language">
              <div
                v-if="isLanguageOpen"
                id="language-menu"
                class="header__language-dropdown">
                <p>{{ t("header.chooseLanguage") }}</p>
                <ul>
                  <li
                    v-for="language in languages"
                    :key="language.code">
                    <button
                      type="button"
                      :class="{ 'is-active': language.code === locale }"
                      :aria-current="language.code === locale ? 'true' : undefined"
                      @click="switchLanguage(language.code)">
                      <span aria-hidden="true">{{ language.flag }}</span>
                      <span>{{ language.label }}</span>
                      <small>{{ language.short ?? language.code.toUpperCase() }}</small>
                    </button>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
          <button
            class="button button--light header__consultation"
            type="button"
            @click="openConsultation">
            {{ t("common.consultation") }}
          </button>
          <button
            class="header__menu"
            type="button"
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-menu"
            :aria-label="t('header.openMenu')"
            @click="toggleMenu">
            <X
              v-if="isMenuOpen"
              :size="22" />
            <Menu
              v-else
              :size="22" />
          </button>
        </div>

        <Transition name="menu">
          <div
            v-if="isMenuOpen"
            id="mobile-menu"
            class="header__mobile">
            <a
              v-for="item in navItems"
              :key="item.href"
              :href="item.href"
              @click="closeMenu">
              {{ item.label }}
            </a>
            <button
              class="button button--primary"
              type="button"
              @click="openConsultation">
              {{ t("common.consultation") }}
            </button>
          </div>
        </Transition>
      </div>
    </header>
  </div>
</template>

<style lang="scss" scoped>
  .header-shell {
    position: relative;
    min-height: 81px;
    z-index: 1000;
  }

  .header {
    position: relative;
    z-index: 1000;
    width: 100%;
    transition:
      background 180ms ease,
      box-shadow 180ms ease;
  }

  .header__inner {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: clamp(18px, 2.2vw, 32px);
    min-height: 81px;
    border-bottom: 1px solid rgb(54 76 103 / 14%);
    transition: min-height 180ms ease;
  }

  .header--fixed {
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    width: 100%;
    background: rgb(208 222 231 / 94%);
    box-shadow: 0 12px 34px rgb(21 38 59 / 12%);
    backdrop-filter: blur(16px);
  }

  .header--fixed .header__inner {
    width: min(calc(100% - 2 * var(--page-gutter)), var(--content-max));
    min-height: 81px;
    margin-inline: auto;
  }

  .header__nav {
    display: flex;
    justify-content: flex-end;
    gap: clamp(14px, 2.25vw, 32px);
  }

  .header__nav a,
  .header__language {
    color: var(--ink);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    text-decoration: none;
  }

  .header__nav a {
    position: relative;
  }

  .header__nav a::after {
    position: absolute;
    right: 0;
    bottom: -8px;
    left: 0;
    height: 1px;
    background: currentColor;
    content: "";
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 180ms ease;
  }

  .header__nav a:hover::after,
  .header__nav a:focus-visible::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  .header__actions {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header__language-picker {
    position: relative;
  }

  .header__language,
  .header__menu {
    display: flex;
    min-width: 42px;
    min-height: 36px;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .header__language svg {
    transition: transform 180ms ease;
  }

  .header__language-chevron--open {
    transform: rotate(180deg);
  }

  .header__language-dropdown {
    position: absolute;
    z-index: 30;
    top: calc(100% + 12px);
    inset-inline-end: 0;
    width: 228px;
    padding: 12px;
    border: 1px solid var(--line);
    background: rgb(246 249 251 / 99%);
    box-shadow: 0 22px 55px rgb(21 38 59 / 18%);
    backdrop-filter: blur(14px);
  }

  .header__language-dropdown > p {
    margin: 2px 8px 10px;
    color: var(--muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .header__language-dropdown ul {
    max-height: min(390px, calc(100vh - 150px));
    margin: 0;
    padding: 0;
    overflow-y: auto;
    list-style: none;
    scrollbar-width: thin;
  }

  .header__language-dropdown button {
    display: grid;
    width: 100%;
    grid-template-columns: 24px 1fr auto;
    align-items: center;
    gap: 8px;
    padding: 10px 9px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 13px;
    text-align: start;
    cursor: pointer;
    transition:
      color 160ms ease,
      background 160ms ease;
  }

  .header__language-dropdown button:hover,
  .header__language-dropdown button:focus-visible {
    background: rgb(54 78 116 / 8%);
  }

  .header__language-dropdown button.is-active {
    background: var(--navy);
    color: #ffffff;
  }

  .header__language-dropdown button > span:first-child {
    font-size: 17px;
  }

  .header__language-dropdown small {
    color: currentColor;
    font-size: 9px;
    font-weight: 700;
    opacity: 0.58;
  }

  .header__menu {
    display: none;
    color: var(--ink);
  }

  .header__consultation {
    min-width: 173px;
    padding-inline: 15px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0;
  }

  .header__mobile {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    left: 0;
    display: grid;
    gap: 4px;
    padding: 18px;
    border: 1px solid var(--line);
    background: rgb(246 249 251 / 98%);
    box-shadow: 0 20px 50px rgb(21 38 59 / 14%);
  }

  .header__mobile a {
    padding: 14px 4px;
    border-bottom: 1px solid var(--line);
    color: var(--ink);
    font-size: 14px;
    text-decoration: none;
  }

  .menu-enter-active,
  .menu-leave-active,
  .language-enter-active,
  .language-leave-active {
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  .menu-enter-from,
  .menu-leave-to,
  .language-enter-from,
  .language-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  @media (max-width: 767px) {
    .header-shell,
    .header__inner,
    .header--fixed .header__inner {
      min-height: 64px;
    }

    .header__nav,
    .header__consultation {
      display: none;
    }

    .header__inner {
      grid-template-columns: auto 1fr;
    }

    .header__actions {
      justify-self: end;
    }

    .header__menu {
      display: grid;
    }
  }

  @media (min-width: 480px) and (max-width: 767px) {
    .header-shell,
    .header__inner,
    .header--fixed .header__inner {
      min-height: 100px;
    }

    .header__inner {
      display: flex;
      gap: 28px;
    }

    .header__actions {
      display: contents;
    }

    .header__language-picker {
      display: none;
    }

    .header__menu {
      order: -1;
      width: 40px;
      min-width: 40px;
      height: 40px;
      min-height: 40px;
      background: var(--navy);
      color: #ffffff;
    }

    .header__consultation {
      display: inline-flex;
      order: 2;
      width: min(198px, 40vw);
      min-width: 0;
      min-height: 40px;
      margin-left: auto;
      padding-inline: 4px;
      font-size: clamp(13px, 2.9vw, 15px);
      white-space: nowrap;
    }
  }
</style>
