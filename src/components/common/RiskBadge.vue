<script setup lang="ts">
defineProps<{
  labelAnomali: number;
  entropy?: number;
}>();
</script>

<template>
  <span
    v-if="labelAnomali === 1"
    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60"
  >
    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
    Anomali (High Risk)
  </span>
  <span
    v-else
    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-teal-50 text-teal-600 border border-teal-200/60"
  >
    <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
    Normal (Low Risk)
  </span>
</template>

