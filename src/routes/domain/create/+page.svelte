<script lang="ts">
  import { goto } from "$app/navigation";
  let domainName = "";

  function handleSubmit() {
    console.log("Submitted domain:", domainName);
    // here you can call an API or do further logic
  }

  function goBack() {
    goto("/domain"); // 👈 change "/" to the route you want to navigate to
  }
</script>

<div class="w-full px-8 py-6 h-[calc(100vh-0px)] overflow-y-auto">
  <!-- Top bar -->
  <div
    class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
  >
    <!-- Left Side: Title Section -->
    <div>
      <h3 class="text-lg font-semibold text-black">Domain</h3>
      <p class="text-xs text-gray-500">Create new Domain</p>
    </div>

    <!-- Right Side: Buttons -->
    <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
      <button
        on:click={goBack}
        class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-black border border-black-600 rounded-lg hover:bg-indigo-700"
      >
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.99953 11.78C5.87286 11.78 5.7462 11.7333 5.6462 11.6333L1.29953 7.28668C0.592865 6.58001 0.592865 5.42001 1.29953 4.71335L5.6462 0.36668C5.83953 0.173346 6.15953 0.173346 6.35286 0.36668C6.5462 0.560013 6.5462 0.880013 6.35286 1.07335L2.0062 5.42001C1.6862 5.74001 1.6862 6.26001 2.0062 6.58001L6.35286 10.9267C6.5462 11.12 6.5462 11.44 6.35286 11.6333C6.25286 11.7267 6.1262 11.78 5.99953 11.78Z"
            fill="white"
          />
        </svg>
        Privious
      </button>
    </div>
  </div>

  <!-- Domain Input Form -->
  <div class="grid grid-cols-12 gap-5 pt-6 font-poppins">
    <div class="col-span-12 2xl:col-span-12">
      <div class="domain-form-container">
        <div class="w-full">
          <!-- Step 1: Connect -->
          <div id="step1" class="p-4 mb-4 border border-gray-200 rounded-2xl">
            <label
              for="domain-name"
              class="block pb-1 text-sm font-medium text-gray-600"
            >
              Domain name
            </label>
            <div class="flex items-center gap-x-4">
              <div class="flex-1">
                <input
                  type="text"
                  id="domain-name"
                  name="domain_name"
                  bind:value={domainName}
                  class="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Enter your domain name"
                />
              </div>
              <button
                type="button"
                on:click={handleSubmit}
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex-shrink-0"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
