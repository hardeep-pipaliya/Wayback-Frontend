<script lang="ts">
  import "../app.css"
  import Header from "$lib/layouts/Header.svelte";
  import Sidebar from "$lib/layouts/Sidebar.svelte";
  import { sidebarStore } from "$lib/stores/sidebar";
</script>

<!-- Root Wrapper -->
<div>
  <div class="flex overflow-y-hidden bg-white">
  
    <!-- Sidebar -->
    <Sidebar />
    <div
      class="h-full overflow-hidden border-l border-solid border-gray-200 lg:ml-auto max-lg:w-full relative"
      class:lg:w-[calc(100%-256px)]={$sidebarStore.isSidebarOpen}
      class:lg:w-[calc(100%-80px)]={!$sidebarStore.isSidebarOpen}
    >
      <!-- Header -->
      <Header />
      <!-- Routed Page Content -->
      <main class="w-full px-8 py-6 pt-28 h-[calc(100vh-7rem)] overflow-y-auto scroll-smooth">
        <slot />
      </main>
    </div>
  </div>
</div>