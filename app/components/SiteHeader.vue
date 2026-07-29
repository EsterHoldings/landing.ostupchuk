<script setup lang="ts">
import { ChevronDown, Menu, X } from "@lucide/vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits<{
  consultation: [];
}>();

const { t } = useI18n();
const isMenuOpen = ref(false);

const navItems = computed(() => [
  { label: t("header.nav.about"), href: "#about" },
  { label: t("header.nav.programs"), href: "#programs" },
  { label: t("header.nav.results"), href: "#results" },
  { label: t("header.nav.faq"), href: "#faq" },
]);

const closeMenu = () => {
  isMenuOpen.value = false;
};

const openConsultation = () => {
  closeMenu();
  emit("consultation");
};
</script>

<template>
  <header class="header">
    <AppLogo />

    <nav class="header__nav" :aria-label="t('header.mainNavigation')">
      <a v-for="item in navItems" :key="item.href" :href="item.href">
        {{ item.label }}
      </a>
    </nav>

    <div class="header__actions">
      <button
        class="header__language"
        type="button"
        :aria-label="t('header.currentLanguage', { language: 'Українська' })"
      >
        <span>UA</span>
        <ChevronDown :size="15" :stroke-width="2.2" />
      </button>
      <button
        class="button button--light header__consultation"
        type="button"
        @click="openConsultation"
      >
        {{ t("common.consultation") }}
      </button>
      <button
        class="header__menu"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        :aria-label="t('header.openMenu')"
        @click="isMenuOpen = !isMenuOpen"
      >
        <X v-if="isMenuOpen" :size="22" />
        <Menu v-else :size="22" />
      </button>
    </div>

    <Transition name="menu">
      <div v-if="isMenuOpen" id="mobile-menu" class="header__mobile">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>
        <button
          class="button button--primary"
          type="button"
          @click="openConsultation"
        >
          {{ t("common.consultation") }}
        </button>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: relative;
  z-index: 20;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(18px, 2.2vw, 32px);
  min-height: 81px;
  border-bottom: 1px solid rgb(54 76 103 / 14%);
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
.menu-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 720px) {
  .header__nav,
  .header__consultation {
    display: none;
  }

  .header {
    grid-template-columns: auto 1fr;
  }

  .header__actions {
    justify-self: end;
  }

  .header__menu {
    display: grid;
  }
}
</style>
