<script setup lang="ts">
  import { Check, X } from "@lucide/vue";
  import { useI18n } from "vue-i18n";

  const props = defineProps<{
    modelValue: boolean;
  }>();

  const emit = defineEmits<{
    "update:modelValue": [value: boolean];
  }>();

  const { locale, t } = useI18n();
  const runtimeConfig = useRuntimeConfig();
  const isSubmitted = ref(false);
  const isSubmitting = ref(false);
  const submitError = ref("");
  const form = reactive({
    name: "",
    phone: "",
    email: "",
    website: "",
  });

  const close = () => {
    emit("update:modelValue", false);
  };

  const trackingData = () => {
    if (!import.meta.client) {
      return {};
    }

    const query = new URLSearchParams(window.location.search);
    const readUtm = (key: string) => query.get(key) || undefined;

    return {
      referrer: document.referrer || undefined,
      utm_source: readUtm("utm_source"),
      utm_medium: readUtm("utm_medium"),
      utm_campaign: readUtm("utm_campaign"),
      utm_content: readUtm("utm_content"),
      utm_term: readUtm("utm_term"),
    };
  };

  const submit = async () => {
    if (isSubmitting.value) {
      return;
    }

    isSubmitting.value = true;
    submitError.value = "";

    try {
      await $fetch(`${String(runtimeConfig.public.esterApiBase).replace(/\/$/, "")}/public/ostupchuk/leads`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          locale: locale.value,
          page_url: import.meta.client ? window.location.href : undefined,
          website: form.website,
          ...trackingData(),
        },
      });

      isSubmitted.value = true;
      Object.assign(form, {
        name: "",
        phone: "",
        email: "",
        website: "",
      });
    } catch {
      submitError.value = t("modal.submitError");
    } finally {
      isSubmitting.value = false;
    }
  };

  watch(
    () => props.modelValue,
    value => {
      if (import.meta.client) {
        document.body.style.overflow = value ? "hidden" : "";
      }

      if (!value && import.meta.client) {
        window.setTimeout(() => {
          isSubmitted.value = false;
          submitError.value = "";
        }, 250);
      }
    }
  );

  onBeforeUnmount(() => {
    if (import.meta.client) {
      document.body.style.overflow = "";
    }
  });
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-title"
        @click.self="close">
        <section class="modal__panel">
          <button
            class="modal__close"
            type="button"
            :aria-label="t('modal.closeAria')"
            @click="close">
            <X :size="22" />
          </button>

          <template v-if="!isSubmitted">
            <p class="eyebrow">{{ t("modal.eyebrow") }}</p>
            <h2 id="consultation-title">{{ t("modal.title") }}</h2>
            <p class="modal__intro">{{ t("modal.intro") }}</p>

            <form @submit.prevent="submit">
              <label>
                <span>{{ t("modal.name") }}</span>
                <input
                  v-model.trim="form.name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  required />
              </label>
              <label>
                <span>{{ t("modal.phone") }}</span>
                <input
                  v-model.trim="form.phone"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  placeholder="+380"
                  required />
              </label>
              <label>
                <span>Email</span>
                <input
                  v-model.trim="form.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required />
              </label>
              <label
                class="modal__honeypot"
                aria-hidden="true">
                <span>Website</span>
                <input
                  v-model="form.website"
                  name="website"
                  type="text"
                  tabindex="-1"
                  autocomplete="off" />
              </label>
              <p
                v-if="submitError"
                class="modal__error"
                role="alert">
                {{ submitError }}
              </p>
              <button
                class="button button--primary button--wide"
                type="submit"
                :disabled="isSubmitting">
                {{ isSubmitting ? t("modal.sending") : t("modal.submit") }}
              </button>
              <small>{{ t("modal.consent") }}</small>
            </form>
          </template>

          <div
            v-else
            class="modal__success">
            <span><Check :size="30" /></span>
            <p class="eyebrow">{{ t("modal.thanks") }}</p>
            <h2>{{ t("modal.accepted") }}</h2>
            <p>{{ t("modal.followup") }}</p>
            <button
              class="button button--primary"
              type="button"
              @click="close">
              {{ t("common.close") }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    z-index: 100;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgb(7 15 28 / 62%);
    backdrop-filter: blur(8px);
  }

  .modal__panel {
    position: relative;
    width: min(100%, 560px);
    max-height: calc(100vh - 40px);
    padding: clamp(30px, 5vw, 56px);
    overflow-y: auto;
    background: var(--paper);
    box-shadow: 0 40px 100px rgb(0 0 0 / 26%);
  }

  .modal__close {
    position: absolute;
    top: 18px;
    right: 18px;
    display: grid;
    width: 40px;
    height: 40px;
    padding: 0;
    place-items: center;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    cursor: pointer;
  }

  .modal h2 {
    max-width: 440px;
    margin: 12px 0 18px;
    font: 500 clamp(38px, 6vw, 58px) / 0.98 var(--font-display);
    letter-spacing: -0.035em;
  }

  .modal__intro {
    max-width: 460px;
    margin: 0 0 30px;
    color: var(--muted);
    line-height: 1.65;
  }

  form {
    display: grid;
    gap: 18px;
  }

  label {
    display: grid;
    gap: 8px;
  }

  label span {
    font-size: 12px;
    font-weight: 700;
  }

  input {
    width: 100%;
    min-height: 52px;
    padding: 0 14px;
    border: 1px solid var(--line-strong);
    border-radius: 0;
    outline: none;
    background: transparent;
    color: var(--ink);
    font: inherit;
  }

  input:focus {
    border-color: var(--navy);
    box-shadow: 0 0 0 3px rgb(57 78 109 / 10%);
  }

  .modal__honeypot {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .modal__error {
    margin: 0;
    color: #b42318;
    font-size: 13px;
    line-height: 1.45;
  }

  .button:disabled {
    cursor: wait;
    opacity: 0.72;
  }

  form small {
    color: var(--muted);
    font-size: 10px;
    line-height: 1.5;
  }

  .modal__success {
    display: grid;
    justify-items: start;
    min-height: 360px;
    align-content: center;
  }

  .modal__success > span {
    display: grid;
    width: 62px;
    height: 62px;
    margin-bottom: 28px;
    place-items: center;
    background: var(--navy);
    color: #ffffff;
  }

  .modal__success p:not(.eyebrow) {
    max-width: 400px;
    margin: 0 0 28px;
    color: var(--muted);
    line-height: 1.6;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 220ms ease;

    .modal__panel {
      transition: transform 220ms ease;
    }
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;

    .modal__panel {
      transform: translateY(16px);
    }
  }
</style>
