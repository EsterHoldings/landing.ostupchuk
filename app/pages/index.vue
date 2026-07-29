<script setup lang="ts">
  import type { Component } from "vue";
  import { useI18n } from "vue-i18n";
  import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    CircleDollarSign,
    GraduationCap,
    LineChart,
    Play,
    Send,
    Trophy,
    UserRound,
  } from "@lucide/vue";

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
  }

  interface Metric {
    value: string;
    label: string;
  }

  interface MediaItem {
    image: string;
    title: string;
    meta?: string;
  }

  interface MaterialCopy {
    title: string;
    text: string;
  }

  interface FaqItem {
    question: string;
    answer: string;
  }

  const { locale, rt, t, tm } = useI18n();
  const isConsultationOpen = ref(false);
  const testimonialIndex = ref(0);

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
  const videoReviews = localizedArray<MediaItem>("results.videoItems");
  const practicalResults = localizedArray<MediaItem>("results.practicalItems");
  const interviews = localizedArray<MediaItem>("results.interviewItems");
  const developmentItems = localizedArray<string>("development.items");
  const materialCopies = localizedArray<MaterialCopy>("materials.items");
  const faqItems = localizedArray<FaqItem>("faq.items");

  const audienceIcons: Component[] = [BarChart3, UserRound, GraduationCap, CircleDollarSign];
  const materialIcons: Component[] = [Trophy, Play, Send, LineChart];

  const audiences = computed<IconCard[]>(() =>
    audienceTexts.value.map((text, index) => ({ icon: audienceIcons[index]!, text }))
  );

  const materials = computed(() =>
    materialCopies.value.map((item, index) => ({ icon: materialIcons[index]!, ...item }))
  );

  const visibleTestimonials = computed(() =>
    Array.from(
      { length: 3 },
      (_, offset) => testimonials.value[(testimonialIndex.value + offset) % testimonials.value.length]!
    )
  );

  const shiftTestimonials = (direction: number) => {
    testimonialIndex.value =
      (testimonialIndex.value + direction + testimonials.value.length) % testimonials.value.length;
  };

  watch(locale, () => {
    testimonialIndex.value = 0;
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
          <div class="expertise__facts">
            <div
              v-for="fact in expertiseFacts"
              :key="`${fact.value}-${fact.label}`">
              <strong>{{ fact.value }}</strong>
              <span>{{ fact.label }}</span>
            </div>
          </div>

          <div class="expertise__copy">
            <p class="eyebrow">Capital Intelligence Academy</p>
            <h2>{{ t("expertise.title") }}</h2>
            <div class="expertise__text">
              <p
                v-for="paragraph in expertiseParagraphs"
                :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
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
                @click="shiftTestimonials(-1)">
                <ArrowLeft :size="18" />
              </button>
              <button
                type="button"
                :aria-label="t('common.next')"
                @click="shiftTestimonials(1)">
                <ArrowRight :size="18" />
              </button>
            </div>
          </div>

          <TransitionGroup
            name="testimonials"
            tag="div"
            class="testimonials">
            <article
              v-for="testimonial in visibleTestimonials"
              :key="testimonial.name"
              class="testimonial">
              <span class="testimonial__quote">“</span>
              <p>{{ testimonial.quote }}</p>
              <div class="testimonial__person">
                <span>{{ testimonial.initials }}</span>
                <div>
                  <strong>{{ testimonial.name }}</strong>
                  <small>{{ testimonial.role }}</small>
                </div>
              </div>
            </article>
          </TransitionGroup>

          <MediaRail
            :title="t('results.videoTitle')"
            :items="videoReviews"
            portrait />
          <MediaRail
            :title="t('results.practicalTitle')"
            :items="practicalResults" />
          <MediaRail
            :title="t('results.interviewsTitle')"
            :items="interviews" />
        </div>
      </section>

      <section class="development">
        <div class="container development__grid">
          <div class="development__visual">
            <div class="development__formula">{{ t("development.formula") }}</div>
            <img
              src="/images/serhii-whiteboard.webp"
              :alt="t('development.imageAlt')"
              loading="lazy" />
          </div>
          <div class="development__copy">
            <p class="eyebrow">{{ t("development.eyebrow") }}</p>
            <h2>{{ t("development.title") }}</h2>
            <p>{{ t("development.intro") }}</p>
            <ul>
              <li
                v-for="item in developmentItems"
                :key="item">
                {{ item }}
              </li>
            </ul>
            <div
              class="watermark"
              aria-hidden="true">
              CI
            </div>
          </div>
        </div>
      </section>

      <section class="materials">
        <div class="container materials__grid">
          <div>
            <p class="eyebrow eyebrow--light">{{ t("materials.eyebrow") }}</p>
            <h2>{{ t("materials.title") }}</h2>
            <p>{{ t("materials.intro") }}</p>
          </div>
          <div class="materials__items">
            <a
              v-for="material in materials"
              :key="material.title"
              href="#"
              @click.prevent>
              <component
                :is="material.icon"
                :size="30"
                :stroke-width="1.4" />
              <strong>{{ material.title }}</strong>
              <span>{{ material.text }}</span>
              <ArrowUpRight
                class="materials__arrow"
                :size="17" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="faq"
        class="faq section section--soft">
        <div class="container">
          <div class="faq__heading">
            <p class="eyebrow">{{ t("faq.eyebrow") }}</p>
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
            src="/images/serhii-hero.webp"
            :alt="t('common.personName')"
            loading="lazy" />
          <div class="final-cta__copy">
            <p class="eyebrow">{{ t("common.personName") }}</p>
            <h2>{{ t("finalCta.title") }}</h2>
            <button
              class="button button--primary"
              type="button"
              @click="isConsultationOpen = true">
              {{ t("common.consultation") }}
            </button>
          </div>
          <div
            class="watermark"
            aria-hidden="true">
            CI
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <AppLogo light />
          <p>{{ t("footer.tagline") }}</p>
        </div>

        <div class="footer__column">
          <strong>{{ t("footer.academy") }}</strong>
          <a href="#about">{{ t("footer.about") }}</a>
          <a href="#programs">{{ t("footer.directions") }}</a>
          <a href="#results">{{ t("footer.results") }}</a>
          <a href="#faq">FAQ</a>
        </div>

        <div class="footer__column">
          <strong>{{ t("footer.programs") }}</strong>
          <a href="#programs">Trading Education</a>
          <a href="#programs">Investment Education</a>
          <a href="#programs">Private Mentorship</a>
          <a href="#programs">Market Intelligence</a>
        </div>

        <div class="footer__column">
          <strong>{{ t("footer.contacts") }}</strong>
          <a href="mailto:support@ostupchuk.com">support@ostupchuk.com</a>
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
      <div class="container footer__bottom">
        <span>{{ t("footer.copyright", { year: new Date().getFullYear() }) }}</span>
        <a href="#">{{ t("footer.privacy") }}</a>
      </div>
    </footer>

    <ConsultationModal v-model="isConsultationOpen" />
  </div>
</template>
