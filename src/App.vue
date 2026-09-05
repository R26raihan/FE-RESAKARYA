<script setup lang="ts">
import { RouterView } from 'vue-router';
import Sidebar from '@/components/layout/Sidebar.vue';
import Navbar from '@/components/layout/Navbar.vue';
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA] flex text-gray-700 font-sans antialiased selection:bg-teal-500 selection:text-white">
    <!-- Floating Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 pr-4 pl-1 py-3">
      <Navbar />

      <main class="flex-1 px-6 pb-6 overflow-y-auto max-w-[1600px] w-full">
        <RouterView />
      </main>
    </div>
  </div>
</template>

