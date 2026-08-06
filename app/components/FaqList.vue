<script setup lang="ts">
  import { ChevronDown } from "@lucide/vue";

  interface FaqItem {
    question: string;
    answer: string;
  }

  defineProps<{
    items: FaqItem[];
  }>();

  const openedIndex = ref<number | null>(0);

  const toggle = (index: number) => {
    openedIndex.value = openedIndex.value === index ? null : index;
  };
</script>

<template>
  <div class="faq-list">
    <article
      v-for="(item, index) in items"
      :key="item.question"
      class="faq-item"
      :class="{ 'faq-item--open': openedIndex === index }">
      <button
        type="button"
        :aria-expanded="openedIndex === index"
        :aria-controls="`faq-answer-${index}`"
        @click="toggle(index)">
        <span>{{ item.question }}</span>
        <ChevronDown :size="19" />
      </button>
      <Transition name="answer">
        <div
          v-if="openedIndex === index"
          :id="`faq-answer-${index}`"
          class="faq-item__answer">
          <p>{{ item.answer }}</p>
        </div>
      </Transition>
    </article>
  </div>
</template>

<style lang="scss" scoped>
  .faq-list {
    display: grid;
    gap: 8px;
  }

  .faq-item {
    border: 1px solid transparent;
    background: #ffffff;
    transition: border-color 180ms ease;
  }

  .faq-item--open {
    border-color: rgb(55 77 106 / 14%);
  }

  .faq-item button {
    display: flex;
    width: 100%;
    min-height: 68px;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 16px 24px;
    border: 0;
    background: transparent;
    color: #7a7a7a;
    cursor: pointer;
    font: 400 28px/1 var(--font-display);
    text-align: left;
  }

  .faq-item button svg {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    transition: transform 180ms ease;
  }

  .faq-item--open button svg {
    transform: rotate(180deg);
  }

  .faq-item__answer {
    overflow: hidden;
  }

  .faq-item__answer p {
    max-width: 1280px;
    padding: 0 24px 20px;
    margin: 0;
    color: #000000;
    font: 400 14px/18px var(--font-body);
  }

  .answer-enter-active,
  .answer-leave-active {
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  .answer-enter-from,
  .answer-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }

  @media (max-width: 767px) {
    .faq-item button {
      min-height: 60px;
      padding: 14px 16px;
      font-size: 24px;
    }

    .faq-item__answer p {
      padding: 0 16px 16px;
      font-size: 13px;
      line-height: 18px;
    }
  }
</style>
