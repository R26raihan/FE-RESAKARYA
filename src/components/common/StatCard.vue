<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
}>();
</script>

<template>
  <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5">
    <div>
      <p class="text-[11px] font-bold text-gray-400 tracking-wider mb-0.5">{{ title }}</p>
      <div class="flex items-baseline gap-2">
        <h3 class="text-lg font-bold text-gray-800 tracking-tight">{{ value }}</h3>
        <span
          v-if="trend"
          :class="[
            'text-xs font-bold',
            trendPositive === false ? 'text-rose-500' : 'text-teal-500'
          ]"
        >
          {{ trend }}
        </span>
      </div>
      <p v-if="subtitle" class="text-[11px] text-gray-400 mt-0.5 font-medium">{{ subtitle }}</p>
    </div>

    <!-- Right Teal Rounded Icon Square -->
    <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-white shadow-[0_4px_12px_0_rgba(79,209,197,0.35)] shrink-0">
      <slot name="icon" />
    </div>
  </div>
</template>

