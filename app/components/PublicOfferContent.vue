<script setup lang="ts">
  type OfferBlock = {
    type: string;
    text: string;
  };

  defineProps<{ blocks: OfferBlock[] }>();
</script>

<template>
  <div class="offer-content">
    <component
      :is="block.type"
      v-for="(block, index) in blocks"
      :key="index">
      {{ block.text }}
    </component>
  </div>
</template>
