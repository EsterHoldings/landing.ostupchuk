<script setup lang="ts">
  import type { Component } from "vue";
  import { useI18n } from "vue-i18n";
  import { BarChart3, CircleDollarSign, GraduationCap, UserRound } from "@lucide/vue";
  import { mediaLinks } from "../../config/media";

  interface Program {
    title: string;
    description: string;
    benefits: string[];
  }

  interface IconCard {
    icon: Component;
    text: string;
  }

  interface Testimonial {
    quote: string;
    name: string;
    role: string;
    initials: string;
    image?: string;
  }

  interface CarouselTestimonial extends Testimonial {
    carouselKey: string;
  }

  interface Metric {
    value: string;
    label: string;
  }

  interface MediaItem {
    image: string;
    title: string;
    meta?: string;
    href?: string;
  }

  interface MaterialCopy {
    title: string;
    text: string;
  }

  type MaterialIconName = "marathons" | "youtube" | "telegram" | "publications";

  interface FaqItem {
    question: string;
    answer: string;
  }

  const { locale, rt, t, tm } = useI18n();
  const isConsultationOpen = ref(false);
  const testimonialIndex = ref(0);
  const testimonialDirection = ref<"next" | "previous" | null>(null);
  const testimonialSwipeStart = ref<number | null>(null);

  const resolveMessages = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(resolveMessages);
    }

    if (value && typeof value === "object") {
      if (("t" in value && "b" in value) || ("type" in value && "body" in value)) {
        return rt(value as Parameters<typeof rt>[0]);
      }

      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveMessages(item)]));
    }

    if (typeof value === "string" || typeof value === "function") {
      return rt(value as Parameters<typeof rt>[0]);
    }

    return value;
  };

  const localizedArray = <T,>(key: string) => computed(() => resolveMessages(tm(key)) as T[]);

  const heroMetrics = localizedArray<Metric>("hero.metrics");
  const expertiseFacts = localizedArray<Metric>("expertise.facts");
  const expertiseParagraphs = localizedArray<string>("expertise.paragraphs");
  const founderParagraphs = localizedArray<string>("founder.paragraphs");
  const programs = localizedArray<Program>("programs.items");
  const audienceTexts = localizedArray<string>("audience.items");
  const journey = localizedArray<string>("journey.steps");
  const journeyTitleLines = localizedArray<string>("journey.titleLines");
  const resultsIntro = localizedArray<string>("results.intro");
  const testimonials = localizedArray<Testimonial>("results.testimonials");
  const localizedVideoReviews = localizedArray<MediaItem>("results.videoItems");
  const videoReviews = computed(() =>
    localizedVideoReviews.value.map((item, index) => ({
      ...item,
      href: mediaLinks.videoReviews[index],
    }))
  );
  const practicalResults = localizedArray<MediaItem>("results.practicalItems");
  const developmentItems = localizedArray<string>("development.items");
  const materialCopies = localizedArray<MaterialCopy>("materials.items");
  const faqItems = localizedArray<FaqItem>("faq.items");

  const audienceIcons: Component[] = [BarChart3, UserRound, GraduationCap, CircleDollarSign];
  const materialIconNames: MaterialIconName[] = ["marathons", "youtube", "telegram", "publications"];

  const audiences = computed<IconCard[]>(() =>
    audienceTexts.value.map((text, index) => ({ icon: audienceIcons[index]!, text }))
  );

  const materials = computed(() =>
    materialCopies.value.map((item, index) => ({ iconName: materialIconNames[index]!, ...item }))
  );

  const carouselTestimonials = computed<CarouselTestimonial[]>(() => {
    const items = testimonials.value;

    if (!items.length) {
      return [];
    }

    return Array.from({ length: 5 }, (_, position) => {
      const offset = position - 1;
      const itemIndex = (testimonialIndex.value + offset + items.length) % items.length;

      return {
        ...items[itemIndex]!,
        carouselKey: `${locale.value}-${testimonialIndex.value}-${position}`,
      };
    });
  });

  const shiftTestimonials = (direction: -1 | 1) => {
    if (testimonialDirection.value || testimonials.value.length < 2) {
      return;
    }

    testimonialDirection.value = direction > 0 ? "next" : "previous";
  };

  const finishTestimonialShift = (event: TransitionEvent) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform" || !testimonialDirection.value) {
      return;
    }

    const direction = testimonialDirection.value === "next" ? 1 : -1;
    testimonialIndex.value =
      (testimonialIndex.value + direction + testimonials.value.length) % testimonials.value.length;
    testimonialDirection.value = null;
  };

  const startTestimonialSwipe = (event: PointerEvent) => {
    if (!event.isPrimary || testimonialDirection.value) {
      return;
    }

    testimonialSwipeStart.value = event.clientX;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  const finishTestimonialSwipe = (event: PointerEvent) => {
    if (testimonialSwipeStart.value === null) {
      return;
    }

    const distance = event.clientX - testimonialSwipeStart.value;
    testimonialSwipeStart.value = null;

    if (Math.abs(distance) >= 50) {
      shiftTestimonials(distance < 0 ? 1 : -1);
    }
  };

  const cancelTestimonialSwipe = () => {
    testimonialSwipeStart.value = null;
  };

  watch(locale, () => {
    testimonialIndex.value = 0;
    testimonialDirection.value = null;
    testimonialSwipeStart.value = null;
  });

  const personNameParts = computed(() => {
    const name = t("common.personName");
    const parts = name.split(/\s+/);

    if (parts.length < 2) {
      return [name];
    }

    return [parts.slice(0, -1).join(" "), parts.at(-1)!];
  });

  useSeoMeta({
    title: () => t("seo.title"),
    description: () => t("seo.description"),
    ogTitle: "Capital Intelligence Academy",
    ogDescription: () => t("seo.ogDescription"),
  });

  useHead(() => ({
    htmlAttrs: {
      lang: locale.value,
      dir: locale.value === "he" ? "rtl" : "ltr",
    },
  }));
</script>

<template>
  <div class="landing">
    <section class="hero">
      <div class="container">
        <SiteHeader @consultation="isConsultationOpen = true" />

        <div class="hero__content">
          <p class="hero__intro">{{ t("hero.intro") }}</p>

          <div class="hero__metrics">
            <div
              v-for="metric in heroMetrics"
              :key="metric.value"
              class="hero__metric">
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </div>
          </div>

          <div
            class="hero__portrait"
            aria-hidden="true">
            <img
              src="/images/hero-portrait.png"
              alt="" />
          </div>

          <div
            class="hero__watermark"
            aria-hidden="true" />

          <div class="hero__claim">
            <h1>{{ t("hero.title") }}</h1>
            <div class="hero__buttons">
              <button
                class="button button--primary"
                type="button"
                @click="isConsultationOpen = true">
                {{ t("common.consultation") }}
              </button>
              <a
                class="button button--ghost"
                href="#about">
                {{ t("hero.aboutButton") }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main>
      <section
        id="about"
        class="expertise section">
        <div class="container expertise__grid">
          <h2 class="expertise__title">{{ t("expertise.title") }}</h2>

          <div class="expertise__facts">
            <div
              v-for="fact in expertiseFacts"
              :key="`${fact.value}-${fact.label}`">
              <strong>{{ fact.value }}</strong>
              <span>{{ fact.label }}</span>
            </div>
          </div>

          <div class="expertise__text">
            <p
              v-for="paragraph in expertiseParagraphs"
              :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </section>

      <section class="founder">
        <img
          class="founder__background"
          src="/images/founder-serhii.png"
          alt=""
          aria-hidden="true"
          loading="lazy" />
        <div class="container founder__inner">
          <div class="founder__copy">
            <h2>
              <template
                v-for="(namePart, index) in personNameParts"
                :key="namePart">
                <br v-if="index" />{{ namePart }}
              </template>
            </h2>
            <p>{{ t("founder.role") }}</p>
            <p
              v-for="paragraph in founderParagraphs"
              :key="paragraph">
              {{ paragraph }}
            </p>
            <button
              class="button button--primary"
              type="button"
              @click="isConsultationOpen = true">
              {{ t("common.consultation") }}
            </button>
          </div>
          <div
            class="founder__watermark"
            aria-hidden="true" />
        </div>
      </section>

      <section
        id="programs"
        class="programs section">
        <div class="container">
          <h2 class="section-title">{{ t("programs.title") }}</h2>

          <div class="programs__grid">
            <article
              v-for="program in programs"
              :key="program.title"
              class="program-card">
              <h3 :aria-label="program.title">
                <span
                  v-for="word in program.title.split(' ')"
                  :key="word"
                  aria-hidden="true">
                  {{ word }}
                </span>
              </h3>
              <p>{{ program.description }}</p>
              <ul>
                <li
                  v-for="benefit in program.benefits"
                  :key="benefit">
                  {{ benefit }}
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section class="audience section section--soft">
        <div class="container">
          <h2 class="section-title">{{ t("audience.title") }}</h2>

          <div class="audience__grid">
            <article
              v-for="audience in audiences"
              :key="audience.text"
              class="audience-card">
              <component
                :is="audience.icon"
                :size="44"
                :stroke-width="1.4" />
              <p>{{ audience.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="journey">
        <div class="journey__image">
          <img
            src="/images/journey-serhii.png"
            :alt="t('journey.imageAlt')"
            loading="lazy" />
          <div class="journey__caption">
            <strong>{{ t("common.personName") }}</strong>
            <span>{{ t("journey.captionRole") }}</span>
            <small>{{ t("journey.captionMeta") }}</small>
          </div>
        </div>
        <div class="journey__content">
          <h2>
            <template
              v-for="(line, index) in journeyTitleLines"
              :key="line">
              <br v-if="index" />{{ line }}
            </template>
          </h2>
          <ol>
            <li
              v-for="(step, index) in journey"
              :key="step">
              <span>{{ index + 1 }}</span>
              <p>{{ step }}</p>
            </li>
          </ol>
          <button
            class="button button--primary"
            type="button"
            @click="isConsultationOpen = true">
            {{ t("common.consultation") }}
          </button>
          <div
            class="journey__watermark"
            aria-hidden="true" />
        </div>
      </section>

      <section
        id="results"
        class="results section section--soft">
        <div class="container">
          <div class="results__heading">
            <h2>{{ t("results.title") }}</h2>
            <div>
              <p
                v-for="paragraph in resultsIntro"
                :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
            <div class="results__controls">
              <button
                type="button"
                :aria-label="t('common.previous')"
                :disabled="testimonialDirection !== null"
                @click="shiftTestimonials(-1)">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden="true">
                  <path
                    d="M11.4697 23.4697C11.1768 23.7626 11.1768 24.2374 11.4697 24.5303L16.2426 29.3033C16.5355 29.5962 17.0104 29.5962 17.3033 29.3033C17.5962 29.0104 17.5962 28.5355 17.3033 28.2426L13.0607 24L17.3033 19.7574C17.5962 19.4645 17.5962 18.9896 17.3033 18.6967C17.0104 18.4038 16.5355 18.4038 16.2426 18.6967L11.4697 23.4697ZM36 24V23.25H12V24V24.75H36V24Z"
                    fill="currentColor" />
                </svg>
              </button>
              <button
                type="button"
                :aria-label="t('common.next')"
                :disabled="testimonialDirection !== null"
                @click="shiftTestimonials(1)">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden="true">
                  <path
                    d="M36.5303 24.5303C36.8232 24.2374 36.8232 23.7626 36.5303 23.4697L31.7574 18.6967C31.4645 18.4038 30.9896 18.4038 30.6967 18.6967C30.4038 18.9896 30.4038 19.4645 30.6967 19.7574L34.9393 24L30.6967 28.2426C30.4038 28.5355 30.4038 29.0104 30.6967 29.3033C30.9896 29.5962 31.4645 29.5962 31.7574 29.3033L36.5303 24.5303ZM12 24V24.75H36V24V23.25H12V24Z"
                    fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>

          <div
            class="testimonials"
            role="region"
            :aria-label="t('results.title')"
            @dragstart.prevent
            @pointercancel="cancelTestimonialSwipe"
            @pointerdown="startTestimonialSwipe"
            @pointerup="finishTestimonialSwipe">
            <div
              class="testimonials__track"
              :class="{
                'testimonials__track--next': testimonialDirection === 'next',
                'testimonials__track--previous': testimonialDirection === 'previous',
              }"
              @transitionend="finishTestimonialShift">
              <article
                v-for="testimonial in carouselTestimonials"
                :key="testimonial.carouselKey"
                class="testimonial">
                <svg
                  class="testimonial__quote"
                  width="124"
                  height="103"
                  viewBox="0 0 124 103"
                  fill="none"
                  aria-hidden="true">
                  <path
                    d="M59.1232 0V28.645C59.1232 37.1775 57.6021 46.0487 54.56 55.2584C51.6501 64.3327 47.5499 73.0684 42.2592 81.4655C36.9685 89.7271 30.8843 96.9053 24.0064 103L0 87.5602C5.42293 79.163 9.78773 70.2919 13.0944 60.9467C16.5333 51.4661 18.2528 40.8343 18.2528 29.0513V0H59.1232ZM124 0V28.645C124 37.1775 122.479 46.0487 119.437 55.2584C116.527 64.3327 112.427 73.0684 107.136 81.4655C101.845 89.7271 95.7611 96.9053 88.8832 103L64.8768 87.5602C70.2997 79.163 74.6645 70.2919 77.9712 60.9467C81.4101 51.4661 83.1296 40.8343 83.1296 29.0513V0H124Z"
                    fill="currentColor" />
                </svg>
                <p>{{ testimonial.quote }}</p>
                <div class="testimonial__person">
                  <img
                    v-if="testimonial.image"
                    :src="testimonial.image"
                    :alt="testimonial.name"
                    width="45"
                    height="45"
                    loading="lazy" />
                  <span v-else>{{ testimonial.initials }}</span>
                  <div>
                    <strong>{{ testimonial.name }}</strong>
                    <small>{{ testimonial.role }}</small>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="media-showcase">
        <div class="container">
          <MediaRail
            :title="t('results.videoTitle')"
            :items="videoReviews"
            portrait />
          <MediaRail
            :title="t('results.combinedMediaTitle')"
            :items="practicalResults" />
        </div>
      </section>

      <section class="development">
        <div class="container development__grid">
          <div class="development__visual">
            <img
              src="/images/development-serhii.png"
              :alt="t('development.imageAlt')"
              loading="lazy" />
          </div>
          <div class="development__copy">
            <div class="development__content">
              <h2>{{ t("development.title") }}</h2>
              <p>{{ t("development.intro") }}</p>
              <ul>
                <li
                  v-for="item in developmentItems"
                  :key="item">
                  {{ item }}
                </li>
              </ul>
            </div>
            <div
              class="brand-watermark"
              aria-hidden="true" />
          </div>
        </div>
      </section>

      <section class="materials">
        <div class="container materials__grid">
          <div class="materials__intro">
            <h2>{{ t("materials.title") }}</h2>
            <p>{{ t("materials.intro") }}</p>
          </div>
          <div class="materials__content">
            <p class="materials__label">{{ t("materials.eyebrow") }}</p>
            <div class="materials__items">
              <article
                v-for="material in materials"
                :key="material.title">
                <MaterialIcon :name="material.iconName" />
                <strong>{{ material.title }}</strong>
                <span>{{ material.text }}</span>
              </article>
            </div>
          </div>
          <div
            class="materials__watermark"
            aria-hidden="true" />
        </div>
      </section>

      <section
        id="faq"
        class="faq section section--soft">
        <div class="container">
          <div class="faq__heading">
            <h2 class="section-title">{{ t("faq.title") }}</h2>
          </div>
          <FaqList :items="faqItems" />
        </div>
      </section>

      <section class="final-cta">
        <div class="container final-cta__inner">
          <div class="final-cta__note">
            <p>{{ t("finalCta.note") }}</p>
            <span></span>
          </div>
          <img
            src="/images/final-cta-serhii.png"
            :alt="t('common.personName')"
            loading="lazy" />
          <div class="final-cta__copy">
            <div class="final-cta__person">
              <p class="final-cta__person-name">{{ t("common.personName") }}</p>
              <span class="final-cta__person-role">{{ t("journey.captionRole") }}</span>
            </div>
            <h2>{{ t("finalCta.title") }}</h2>
            <button
              class="button button--primary"
              type="button"
              @click="isConsultationOpen = true">
              {{ t("common.consultation") }}
            </button>
          </div>
          <div
            class="brand-watermark"
            aria-hidden="true" />
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <AppLogo light />
          <a href="mailto:support@ostupchuk.com">support@ostupchuk.com</a>
          <p class="footer__copyright">
            {{ t("footer.copyright", { year: new Date().getFullYear() }) }}<br />
            Усі права захищені
          </p>
        </div>

        <div class="footer__column">
          <strong>{{ t("footer.academy") }}</strong>
          <a href="#about">{{ t("footer.about") }}</a>
          <a href="#programs">{{ t("footer.directions") }}</a>
          <a href="#results">{{ t("footer.results") }}</a>
          <a href="#faq">Відгуки клієнтів</a>
        </div>

        <div class="footer__column">
          <strong>{{ t("footer.programs") }}</strong>
          <a href="#programs">Trading Education</a>
          <a href="#programs">Investment Education</a>
          <a href="#programs">Приватний Менторинг</a>
          <a href="#programs">Market Intelligence</a>
        </div>

        <div class="footer__column">
          <strong>{{ t("footer.contacts") }}</strong>
          <button
            class="footer__link"
            type="button"
            @click="isConsultationOpen = true">
            {{ t("common.consultation") }}
          </button>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer">
            Instagram
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer">
            YouTube
          </a>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer">
            Telegram
          </a>
        </div>
      </div>
    </footer>

    <ConsultationModal v-model="isConsultationOpen" />
  </div>
</template>
