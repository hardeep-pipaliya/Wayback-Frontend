<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import WaybackChart from "$lib/components/WaybackChart.svelte";
  import PerPageSelecter from "$lib/components/PerPageSelecter.svelte";
  import type { PageData } from './$types';

  export let data: PageData;

  // Get action and id from page data
  const { action, id } = data;
  
  // Stepper state
  let domainName = "";
  
  // Initialize domain name for update action
  onMount(() => {
    if (action === 'update' && id) {
      // Load existing domain data for update
      // You can fetch domain data here based on the id
      console.log('Loading domain for update:', id);
      domainName = `example-${id}.com`; // Replace with actual domain data
    }
  });

  function handleSubmit() {
    if (!domainName?.trim()) return;
    console.log(`${action === 'create' ? 'Creating' : 'Updating'} domain:`, domainName);
    // Start step 1 logs only after submit
    currentStep = 1;
    step1Enabled = true;
    startStepIfNeeded(1);
  }
  let currentStep: number = 1;
  const totalSteps: number = 5;

  // Unified step state
  type LogEntry = { index: number; message: string };
  type StepState = {
    logs: LogEntry[];
    running: boolean;
    completed: boolean;
    messages: string[];
  };

  let step1Enabled = false; // preserves submit gating for step 1

  let steps: StepState[] = [
    {
      logs: [],
      running: false,
      completed: false,
      messages: [
        "Starting installation. Upgrading system to latest update. This will take a while...",
        "Upgraded system to latest software version. Bootstrapping installation...",
        "Enabling swap if not enabled...",
        "Finalizing setup...",
      ],
    },
    {
      logs: [],
      running: false,
      completed: false,
      messages: [
        "Fetching Wayback snapshot timeline...",
        "Building year-month histogram...",
        "Grouping snapshots by period and filtering duplicates...",
        "Preparing preview screenshots...",
        "Finalizing selection UI...",
      ],
    },
    {
      logs: [],
      running: false,
      completed: false,
      messages: [
        "Initializing content extraction...",
        "Analyzing HTML structure...",
        "Identifying content selectors...",
        "Processing title and metadata...",
        "Extracting images and links...",
        "Finalizing content extraction...",
      ],
    },
    {
      logs: [],
      running: false,
      completed: false,
      messages: [
        "Loading Wayback URLs...",
        "Filtering and processing URLs...",
        "Generating URL list...",
        "Preparing selection interface...",
        "Finalizing URL processing...",
      ],
    },
    {
      logs: [],
      running: false,
      completed: false,
      messages: [
        "Calculating final statistics...",
        "Processing payment details...",
        "Generating overview report...",
        "Preparing download options...",
        "Finalizing process...",
      ],
    },
  ];

  $: isCurrentStepRunning = steps[currentStep - 1]?.running ?? false;

  // Removed unused circle/line class helpers (classes are inlined in template)

  function getPrevBtnClasses(): string {
    if (currentStep === 1) {
      return "px-6 py-3 bg-gray-200 text-gray-400 rounded-lg font-medium transition-all duration-300 cursor-pointer";
    } else {
      return "px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 cursor-pointer";
    }
  }

  function getNextBtnClasses(): string {
    return "px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300";
  }

  function handleNext(): void {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  }

  function handlePrev(): void {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  function goToStep(step: number): void {
    // Only allow navigation to completed steps or the next available step
    if (step >= 1 && step <= totalSteps && !isCurrentStepRunning) {
      const maxAllowedStep = Math.max(
        1,
        ...steps.map((s, i) => (s.completed ? i + 1 : 0))
      );

      if (step <= maxAllowedStep + 1) {
        currentStep = step;
      }
    }
  }

  // Check if a step is completed
  function isStepCompleted(step: number): boolean {
    const s = steps[step - 1];
    return !!s?.completed;
  }

  // Check if next button should be shown for current step
  function shouldShowNextButton(): boolean {
    if (currentStep >= totalSteps) return false;
    const s = steps[currentStep - 1];
    return !!s && s.completed && !s.running;
  }

  // Unified step starter
  function startStepIfNeeded(stepIndex: number) {
    const idx = stepIndex - 1;
    const step = steps[idx];
    if (!step) return;
    if (idx === 0 && !step1Enabled) return; // gate step 1 until submit
    if (currentStep !== stepIndex || step.running || step.completed) return;

    step.running = true;
    step.logs = [];
    let i = 0;
    const total = step.messages.length;
    const interval = setInterval(() => {
      const message = step.messages[i];
      step.logs = [...step.logs, { index: i + 1, message }];
      i++;
      if (i >= total) {
        clearInterval(interval);
        step.running = false;
        step.completed = true;
        // trigger reactivity
        steps = [...steps];
      } else {
        steps = [...steps];
      }
    }, 600);
    steps = [...steps];
  }

  // Kick off when entering any step (step 1 still gated by submit)
  $: startStepIfNeeded(currentStep);

  // Step 4 functions for wayback URLs
  let perPageValue: number = 10;
  let searchKeyword: string = "";

  function listWaybackArticleUrls() {
    // This function will handle filtering and pagination
    console.log("Filtering URLs with:", { perPageValue, searchKeyword });
    // Add your filtering logic here
  }

  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchKeyword = target.value;
    listWaybackArticleUrls();
  }

  // Add Fund Modal State
  let showAddFundModal = false;
  let fundAmount = "";
  let selectedPaymentMethod = "credit_card";
  let couponCode = "";
  let baseAmount = 0;
  let couponAmount = 0;
  let totalAmount = 0;
  let selectedAmount = 0;

  function openMoneyModal() {
    showAddFundModal = true;
  }

  function closeAddMoneyModal() {
    showAddFundModal = false;
    fundAmount = "";
    selectedPaymentMethod = "credit_card";
    couponCode = "";
    baseAmount = 0;
    couponAmount = 0;
    totalAmount = 0;
    selectedAmount = 0;
  }

  function setAmount(amount: number) {
    selectedAmount = amount;
    fundAmount = amount.toString();
    baseAmount = amount;
    calculateTotal();
  }

  function applyCoupon() {
    if (couponCode.trim()) {
      // Add your coupon logic here
      couponAmount = Math.round(baseAmount * 0.1); // 10% discount example
      calculateTotal();
    }
  }

  function calculateTotal() {
    totalAmount = baseAmount - couponAmount;
  }

  function createOrder() {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    console.log("Creating order:", {
      amount: fundAmount,
      method: selectedPaymentMethod,
      couponCode,
      baseAmount,
      couponAmount,
      totalAmount,
    });
    // Add your payment processing logic here

    closeAddMoneyModal();
  }

  // Close modal when clicking outside
  function handleModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      closeAddMoneyModal();
    }
  }

  // Reactive statement to update calculations when fundAmount changes
  $: {
    if (fundAmount && fundAmount.trim() !== "") {
      const amount = parseFloat(fundAmount);
      if (!isNaN(amount) && amount > 0) {
        baseAmount = amount;
      } else {
        baseAmount = 0;
      }
    } else {
      baseAmount = 0;
    }
    calculateTotal();
  }
</script>

<!-- Top bar -->
<div
  class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
>
  <!-- Left Side: Title Section -->
  <div>
    <h3 class="text-lg font-semibold text-black">Domain</h3>
    <p class="text-xs text-gray-500">{action === 'create' ? 'Create new Domain' : `Update Domain (ID: ${id})`}</p>
  </div>

  <!-- Right Side: Buttons -->
  <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
    <button
      on:click={() => goto("/domain")}
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
      Previous
    </button>
  </div>
</div>

<div class="max-w-5xl mx-auto mt-4">
  <!-- Progress Steps with labels -->
  <div class="p-4 mb-4 border border-gray-200 rounded-2xl bg-white">
    <div class="flex items-center w-full ml-10">
      {#each Array(totalSteps) as _, idx}
        {#key idx}
          <div class="flex items-center flex-1">
            <button
              on:click={() => goToStep(idx + 1)}
              class={`${idx + 1 < currentStep ? "bg-indigo-600 text-white" : idx + 1 === currentStep ? "bg-indigo-500 text-white ring-2 ring-indigo-200" : "bg-gray-200 text-gray-400"} rounded-full w-[34px] h-[34px] flex items-center justify-center transition-all duration-300 hover:scale-110 ${isStepCompleted(idx + 1) || idx + 1 <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              disabled={!isStepCompleted(idx + 1) && idx + 1 > currentStep}
            >
              {idx + 1}
            </button>
            <span
              class="ml-2 text-xs font-medium {idx + 1 <= currentStep
                ? 'text-indigo-700'
                : 'text-gray-500'}">Step {idx + 1}</span
            >
            {#if idx < totalSteps - 1}
              <div
                class={`${idx + 1 < currentStep ? "bg-indigo-600" : "bg-gray-300"} h-0.5 flex-1 mx-2`}
              ></div>
            {/if}
          </div>
        {/key}
      {/each}
    </div>
  </div>

  <!-- Content Area -->
  <!-- STEP 1: Domain + Logs (logs bottom) -->
  {#if currentStep === 1}
    <div>
      {#if !steps[0].running && !steps[0].completed}
        <!-- Show domain input and submit button only before submission -->
        <div class="p-4 mb-4 border border-gray-200 rounded-2xl">
          <label
            for="domain-name"
            class="block pb-1 text-sm font-medium text-gray-600"
            >Domain name</label
          >
          <div class="flex items-center gap-x-4">
            <div class="flex-1">
              <input
                type="text"
                id="domain-name"
                name="domain_name"
                bind:value={domainName}
                class="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none {action === 'update' ? 'bg-gray-100 cursor-not-allowed' : ''}"
                placeholder="Enter Domain Name Here"
                readonly={action === 'update'}
              />
            </div>
            <button
              type="button"
              on:click={action === 'create' ? handleSubmit : handleNext}
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex-shrink-0"
              disabled={action === 'create' && !domainName?.trim()}
            >
              {action === 'create' ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      {/if}

      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-100 px-4 py-2 text-sm font-medium">Step log</div>
        <div
          class="bg-black text-gray-200 text-xs p-4 max-h-80 overflow-auto space-y-2"
        >
          {#each steps[0].logs as row}
            <div class="flex gap-3">
              <span class="text-indigo-400">{row.index}.</span>
              <span class="text-gray-200">{row.message}</span>
            </div>
          {/each}
          {#if steps[0].running}
            <div class="animate-pulse text-gray-400">Processing...</div>
          {/if}
        </div>
      </div>
    </div>
  {:else if currentStep === 2}
    <!-- STEP 2: Graph + Screenshots + Logs at bottom -->
    <div>
      <div class="mb-4">
        <h2 class="text-base font-semibold text-gray-800">Wayback Domain</h2>
        <p class="text-xs text-gray-500">
          Choose the pages you want to download. Exclude unnecessary categories
          and sections for a cleaner result.
        </p>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <div class="rounded-lg border border-gray-200 p-3">
            <div class="text-sm font-medium mb-2">Timeline</div>
            <WaybackChart />
          </div>
        </div>

        <div class="col-span-12">
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 text-sm font-medium">
              Processing log
            </div>
            <div
              class="bg-black text-gray-200 text-xs p-4 max-h-64 overflow-auto space-y-2"
            >
              {#each steps[1].logs as row}
                <div class="flex gap-3">
                  <span class="text-indigo-400">{row.index}.</span>
                  <span class="text-gray-200">{row.message}</span>
                </div>
              {/each}
              {#if steps[1].running}
                <div class="animate-pulse text-gray-400">Processing...</div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if currentStep === 3}
    <!-- STEP 3: Content Extraction -->
    <div class="rounded-2xl border border-gray-200">
      <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-base font-semibold text-gray-800">
              Content Extraction
            </h2>
            <p class="text-xs text-gray-500">
              Specify selector for title, category and configure options to
              tailor the extraction process, like handling image and links.
            </p>
          </div>
        </div>
      </div>

      <div class="p-4">
        <div class="flex items-center gap-3 flex-wrap mb-3">
          {#each ["Title", "Tag", "Category", "Author", "Date", "Image", "Content", "SEO"] as opt, i}
            <label
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border {i ===
              0
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-gray-300 text-gray-700'} cursor-pointer text-xs"
            >
              <input type="radio" name="ce-opt" class="hidden" />
              <span>{opt}</span>
            </label>
          {/each}
          <button
            class="ml-auto px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >Save</button
          >
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-7">
            <div class="text-sm font-medium mb-2">Article HTML</div>
            <textarea
              class="w-full h-64 border border-gray-300 rounded-lg p-3 text-xs focus:outline-none"
              placeholder="Paste or preview extracted HTML here..."
            ></textarea>
          </div>
          <div class="col-span-12 lg:col-span-5">
            <div class="text-sm font-medium mb-2">Processed Preview</div>
            <div
              class="h-64 border border-gray-300 rounded-lg p-3 text-xs text-gray-500"
            >
              Preview will appear here
            </div>
          </div>
        </div>

        <!-- Step 3 Logs -->
        <div class="col-span-12 mt-4">
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 text-sm font-medium">
              Processing log
            </div>
            <div
              class="bg-black text-gray-200 text-xs p-4 max-h-64 overflow-auto space-y-2"
            >
              {#each steps[2].logs as row}
                <div class="flex gap-3">
                  <span class="text-indigo-400">{row.index}.</span>
                  <span class="text-gray-200">{row.message}</span>
                </div>
              {/each}
              {#if steps[2].running}
                <div class="animate-pulse text-gray-400">Processing...</div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if currentStep === 4}
    <!-- STEP 4: Wayback URLs table -->
    <div>
      <div
        id="step4"
        class="p-4 mb-4 border border-gray-200 rounded-2xl"
        style="scrollbar-width: none; -ms-overflow-style: none;"
      >
        <style>
          #step4::-webkit-scrollbar {
            display: none;
          }
        </style>
        <!-- Assign Section -->
        <div
          class="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div>
            <h2 class="text-lg font-semibold">Wayback Urls</h2>
            <p class="text-gray-600 text-sm">
              Choose The Page You Want To Download Exclude Unnecessary
              Categories And Sections For A cleaner Result.
            </p>
          </div>
        </div>

        <div
          class="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border-b"
        >
          <!-- Left Side: Title Section -->
          <div>
            <h3 class="text-base font-semibold text-black">Wayback Urls</h3>
          </div>

          <!-- Right Side: Buttons and Search -->
          <div
            class="flex flex-wrap items-center justify-end gap-2 max-md:justify-center"
          >
            <!-- Per Page Selection -->
            <PerPageSelecter
              bind:value={perPageValue}
              options={[10, 100, 500, 1000]}
              label="Per Page"
              on:change={(event) => {
                perPageValue = event.detail.value;
                listWaybackArticleUrls();
              }}
            />

            <!-- Search Box -->
            <div class="relative text-gray-500 focus-within:text-gray-900">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M15.75 15.75L13.875 13.875M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C9.90046 14.25 11.3953 13.5836 12.48 12.5052C13.5732 11.4184 14.25 9.91325 14.25 8.25Z"
                    stroke="#9CA3AF"
                    stroke-width="1.2"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </div>
              <input
                type="search"
                bind:value={searchKeyword}
                on:input={handleSearchInput}
                class="block w-full max-w-xs pr-4 pl-8 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed"
                placeholder="Search keywords . . ."
              />
            </div>
          </div>
        </div>
        <div
          class="bg-gray-50 p-4 rounded-lg shadow flex justify-center items-center"
        >
          <label class="flex flex-col">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="select-all-wayback-urls"
                class="mr-2"
              />
              <span>Select All Wayback URLs</span>
            </div>
            <span
              id="urls-count"
              class="text-sm text-center text-gray-600 mt-1 ml-6">(0)</span
            >
          </label>
        </div>
        <div class="text-center my-4">
          <span>OR</span>
        </div>

        <div
          class="rounded-xl mt-4 border border-solid border-gray-200 overflow-auto"
        >
          <table class="w-full rounded-xl font-poppins">
            <thead>
              <tr class="bg-gray-50 text-sm">
                <th
                  scope="col"
                  class="py-3.5 pl-4 text-left whitespace-nowrap text-xs font-medium text-gray-900 capitalize"
                >
                  <input type="checkbox" id="" name="" value="" />
                </th>
                <th
                  scope="col"
                  class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize"
                >
                  #
                </th>
                <th
                  scope="col"
                  class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize"
                >
                  Url
                </th>

                <th
                  scope="col"
                  class="py-3.5 pl-4 w-fit text-left whitespace-nowrap font-medium text-gray-900 capitalize"
                >
                  Time Stamp
                </th>
              </tr>
            </thead>
            <tbody
              class="divide-y divide-gray-200 text-sm font-normal"
              id="wayback_article_urls_tbody"
            >
            </tbody>
          </table>
          <div id="pagination" class="flex justify-center mt-4"></div>
        </div>

        <!-- Step 4 Logs -->
        <div class="mt-4">
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 text-sm font-medium">
              Processing log
            </div>
            <div
              class="bg-black text-gray-200 text-xs p-4 max-h-64 overflow-auto space-y-2"
            >
              {#each steps[3].logs as row}
                <div class="flex gap-3">
                  <span class="text-indigo-400">{row.index}.</span>
                  <span class="text-gray-200">{row.message}</span>
                </div>
              {/each}
              {#if steps[3].running}
                <div class="animate-pulse text-gray-400">Processing...</div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if currentStep === 5}
    <!-- STEP 5: Overview and Payment Details -->
    <div
      id="step5"
      class="p-4 mb-4 border border-gray-200 rounded-2xl w-full flex flex-col md:flex-row gap-6"
    >
      <!-- Left Column: Overview + CSV + Breakdown -->
      <div class="flex-1 flex flex-col gap-4">
        <!-- Overview -->
        <div class="bg-gray-50 p-4 rounded-lg shadow w-full">
          <h2 class="text-lg font-semibold">Overview</h2>
        </div>
        <div class="p-4 rounded-lg shadow w-full">
          <div class="flex gap-8 mt-4">
            <!-- Total Articles -->
            <div class="flex items-center justify-between px-4 w-full md:w-1/3">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Total Articles</span>
                <span id="total-articles" class="text-2xl font-bold">1</span>
              </div>
              <!-- SVG on the right -->
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.333984" width="36" height="36" rx="8" fill="#F4ECFB"
                ></rect>
                <g clip-path="url(#clip0_620_40765)">
                  <path
                    d="M19.834 14.25V9.345C20.5278 9.607 21.158 10.0135 21.6827 10.5375L24.2957 13.152C24.8203 13.6762 25.2271 14.3062 25.489 15H20.584C20.3851 15 20.1943 14.921 20.0537 14.7803C19.913 14.6397 19.834 14.4489 19.834 14.25ZM25.834 16.8637V23.25C25.8328 24.2442 25.4373 25.1973 24.7343 25.9003C24.0313 26.6033 23.0782 26.9988 22.084 27H14.584C13.5898 26.9988 12.6367 26.6033 11.9336 25.9003C11.2306 25.1973 10.8352 24.2442 10.834 23.25V12.75C10.8352 11.7558 11.2306 10.8027 11.9336 10.0997C12.6367 9.39666 13.5898 9.00119 14.584 9H17.9702C18.0925 9 18.2132 9.00975 18.334 9.018V14.25C18.334 14.8467 18.571 15.419 18.993 15.841C19.415 16.2629 19.9872 16.5 20.584 16.5H25.816C25.8242 16.6207 25.834 16.7415 25.834 16.8637ZM21.877 19.7332C21.7399 19.5893 21.5513 19.5057 21.3525 19.5008C21.1538 19.4959 20.9613 19.5701 20.8172 19.707L18.1172 22.2803C18.0451 22.3528 17.9589 22.4099 17.8638 22.4479C17.7688 22.4859 17.667 22.504 17.5648 22.5012C17.4625 22.4984 17.3618 22.4747 17.269 22.4315C17.1763 22.3884 17.0933 22.3267 17.0252 22.2502L15.8335 21.1898C15.7599 21.1242 15.6741 21.0737 15.5811 21.0412C15.488 21.0088 15.3894 20.995 15.291 21.0006C15.0923 21.012 14.9062 21.1019 14.7737 21.2505C14.7081 21.3241 14.6577 21.4098 14.6252 21.5029C14.5928 21.596 14.579 21.6945 14.5846 21.793C14.596 21.9917 14.6859 22.1778 14.8345 22.3102L15.9925 23.3407C16.4122 23.7606 16.9809 23.9975 17.5746 23.9999C18.1683 24.0023 18.7389 23.77 19.162 23.3535L21.8507 20.793C21.9946 20.6559 22.0782 20.4673 22.0832 20.2686C22.0881 20.0698 22.0139 19.8773 21.877 19.7332Z"
                    fill="#883DCF"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_620_40765">
                    <rect
                      width="18"
                      height="18"
                      fill="white"
                      transform="translate(9.33398 9)"
                    ></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>

            <!-- Total Images -->
            <div class="flex items-center justify-between px-4 w-full md:w-1/3">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Total Images</span>
                <span id="total-images" class="text-2xl font-bold">0</span>
              </div>
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.667969"
                  width="36"
                  height="36"
                  rx="8"
                  fill="#4F46E5"
                  fill-opacity="0.15"
                ></rect>
                <g clip-path="url(#clip0_620_40797)">
                  <path
                    d="M20.168 14.25V9.345C20.8618 9.607 21.4919 10.0135 22.0167 10.5375L24.6297 13.152C25.1543 13.6762 25.5611 14.3062 25.823 15H20.918C20.7191 15 20.5283 14.921 20.3876 14.7803C20.247 14.6397 20.168 14.4489 20.168 14.25ZM26.168 16.8637V23.25C26.1668 24.2442 25.7713 25.1973 25.0683 25.9003C24.3653 26.6033 23.4122 26.9988 22.418 27H14.918C13.9238 26.9988 12.9706 26.6033 12.2676 25.9003C11.5646 25.1973 11.1692 24.2442 11.168 23.25V12.75C11.1692 11.7558 11.5646 10.8027 12.2676 10.0997C12.9706 9.39666 13.9238 9.00119 14.918 9H18.3042C18.4265 9 18.5472 9.00975 18.668 9.018V14.25C18.668 14.8467 18.905 15.419 19.327 15.841C19.7489 16.2629 20.3212 16.5 20.918 16.5H26.15C26.1582 16.6207 26.168 16.7415 26.168 16.8637ZM22.211 19.7332C22.0739 19.5893 21.8852 19.5057 21.6865 19.5008C21.4878 19.4959 21.2953 19.5701 21.1512 19.707L18.4512 22.2803C18.3791 22.3528 18.2928 22.4099 18.1978 22.4479C18.1028 22.4859 18.001 22.504 17.8987 22.5012C17.7964 22.4984 17.6958 22.4747 17.603 22.4315C17.5102 22.3884 17.4273 22.3267 17.3592 22.2502L16.1675 21.1898C16.0939 21.1242 16.0081 21.0737 15.915 21.0412C15.822 21.0088 15.7234 20.995 15.625 21.0006C15.4263 21.012 15.2402 21.1019 15.1077 21.2505C15.0421 21.3241 14.9917 21.4098 14.9592 21.5029C14.9268 21.596 14.913 21.6945 14.9186 21.793C14.93 21.9917 15.0199 22.1778 15.1685 22.3102L16.3265 23.3407C16.7462 23.7606 17.3149 23.9975 17.9086 23.9999C18.5023 24.0023 19.0728 23.77 19.496 23.3535L22.1847 20.793C22.3286 20.6559 22.4122 20.4673 22.4172 20.2686C22.4221 20.0698 22.3479 19.8773 22.211 19.7332Z"
                    fill="#4F46E5"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_620_40797">
                    <rect
                      width="18"
                      height="18"
                      fill="white"
                      transform="translate(9.66797 9)"
                    ></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>

            <!-- Total Size -->
            <div class="flex items-center justify-between px-4 w-full md:w-1/3">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Total Size</span>
                <span id="total-size" class="text-2xl font-bold">45.37 KB</span>
              </div>
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="36"
                  height="36"
                  rx="8"
                  fill="#007AFF"
                  fill-opacity="0.14"
                ></rect>
                <g clip-path="url(#clip0_620_40805)">
                  <path
                    d="M19.5 14.25V9.345C20.1938 9.607 20.824 10.0135 21.3488 10.5375L23.9618 13.152C24.4864 13.6762 24.8932 14.3062 25.155 15H20.25C20.0511 15 19.8603 14.921 19.7197 14.7803C19.579 14.6397 19.5 14.4489 19.5 14.25ZM25.5 16.8637V23.25C25.4988 24.2442 25.1033 25.1973 24.4003 25.9003C23.6973 26.6033 22.7442 26.9988 21.75 27H14.25C13.2558 26.9988 12.3027 26.6033 11.5997 25.9003C10.8967 25.1973 10.5012 24.2442 10.5 23.25V12.75C10.5012 11.7558 10.8967 10.8027 11.5997 10.0997C12.3027 9.39666 13.2558 9.00119 14.25 9H17.6363C17.7585 9 17.8793 9.00975 18 9.018V14.25C18 14.8467 18.2371 15.419 18.659 15.841C19.081 16.2629 19.6533 16.5 20.25 16.5H25.482C25.4902 16.6207 25.5 16.7415 25.5 16.8637ZM21.543 19.7332C21.4059 19.5893 21.2173 19.5057 21.0186 19.5008C20.8198 19.4959 20.6273 19.5701 20.4832 19.707L17.7833 22.2803C17.7111 22.3528 17.6249 22.4099 17.5299 22.4479C17.4348 22.4859 17.3331 22.504 17.2308 22.5012C17.1285 22.4984 17.0278 22.4747 16.9351 22.4315C16.8423 22.3884 16.7593 22.3267 16.6912 22.2502L15.4995 21.1898C15.4259 21.1242 15.3402 21.0737 15.2471 21.0412C15.154 21.0088 15.0554 20.995 14.957 21.0006C14.7583 21.012 14.5722 21.1019 14.4397 21.2505C14.3742 21.3241 14.3237 21.4098 14.2912 21.5029C14.2588 21.596 14.245 21.6945 14.2506 21.793C14.262 21.9917 14.3519 22.1778 14.5005 22.3102L15.6585 23.3407C16.0783 23.7606 16.6469 23.9975 17.2406 23.9999C17.8343 24.0023 18.4049 23.77 18.828 23.3535L21.5167 20.793C21.6607 20.6559 21.7443 20.4673 21.7492 20.2686C21.7541 20.0698 21.6799 19.8773 21.543 19.7332Z"
                    fill="#007AFF"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_620_40805">
                    <rect
                      width="18"
                      height="18"
                      fill="white"
                      transform="translate(9 9)"
                    ></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        <!-- Download CSV -->
        <div class="w-full flex justify-center">
          <button
            class="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            ↓ Download Sample CSV File
          </button>
        </div>

        <!-- Payment Provider -->
        <div class="w-full flex justify-center">
          <div class="flex items-center gap-2 mt-2">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.4244 8.41187L7.39676 19.9999H0L1.49985 14.299L10.4244 8.41187Z" fill="#072654"/>
              <path d="M17.1411 0L11.887 19.9996H8.28174L11.8311 6.4554L6.39062 10.0417L7.35947 6.47403L17.1411 0Z" fill="#3395FF"/>
            </svg>
            <span class="text-sm font-medium text-gray-800">Razorpay</span>
          </div>
        </div>

        <!-- Payment Breakdown -->
        <div class="bg-white p-4 border-gray-200 rounded-lg shadow w-full">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Payment details</h3>
            <button
              on:click={openMoneyModal}
              class="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Add Fund
            </button>
          </div>
          <div
            class="flex justify-between mt-2 t
              yext-sm text-gray-600"
          >
            <p>Per Article charge:</p>
            <strong id="per-url-price">$0</strong>
          </div>
          <div class="flex justify-between mt-2 text-sm text-gray-600">
            <p>Data Entry job per url charge:</p>
            <strong id="data-entry-job-per-url-charge">0.00</strong>
          </div>
          <div class="flex justify-between text-sm text-gray-600 mt-2">
            <p>
              <span id="article-count">0</span> Articles ×
              <span id="per-article-min">0</span> Min
            </p>
            <p class="font-semibold text-gray-800">
              <span id="total-minutes">0</span> Min
            </p>
          </div>

          <div class="flex justify-between text-sm text-gray-600 mt-2">
            <p>
              $<span id="data-entry-charge">0.00</span> (Data Entry charge) - $<span
                id="payable-amount">0.00</span
              >
            </p>
            <p class="font-semibold text-gray-800">
              $<span id="saved-amount">0.00</span>
            </p>
          </div>

          <div
            class="bg-gray-100 text-green-600 text-center mt-4 py-2 rounded-md font-medium"
          >
            We saved your $<span id="saved-amount-inline">0.00</span>
          </div>
          <button
            id="payment-button"
            class="w-full mt-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >$0.00 Pay</button
          >
        </div>
      </div>

      <!-- Right Column: Image Preview -->
      <div class="md:w-1/2">
        <div
          class="border border-blue-200 rounded-xl overflow-hidden shadow-md p-2 bg-white h-full"
        >
          <img
            src="https://ik.imagekit.io/botxbyte/screenshot_iJJN5HakU.png"
            alt="Website Preview"
            class="w-full h-full rounded-md object-cover"
          />
        </div>
      </div>

      <!-- Step 5 Logs -->
    </div>
    <div class="mt-4 w-full">
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-100 px-4 py-2 text-sm font-medium">
          Processing log
        </div>
        <div
          class="bg-black text-gray-200 text-xs p-4 max-h-64 overflow-auto space-y-2"
        >
          {#each steps[4].logs as row}
            <div class="flex gap-3">
              <span class="text-indigo-400">{row.index}.</span>
              <span class="text-gray-200">{row.message}</span>
            </div>
          {/each}
          {#if steps[4].running}
            <div class="animate-pulse text-gray-400">Processing...</div>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <!-- Placeholder for other steps until implemented -->
    <div class="text-sm text-gray-600">
      Step {currentStep} content will appear here.
    </div>
  {/if}
</div>

<!-- Navigation Buttons -->
<div class="flex justify-between items-center m-5">
  <button
    class={getPrevBtnClasses()}
    disabled={currentStep === 1}
    on:click={handlePrev}
  >
    <span class="flex items-center">
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        ></path>
      </svg>
      Previous
    </span>
  </button>

  <div class="flex space-x-2">
    <span
      class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium"
    >
      Step {currentStep} of {totalSteps}
    </span>
  </div>

  {#if !isCurrentStepRunning && currentStep < totalSteps}
    <button class={getNextBtnClasses()} on:click={handleNext}>
      <span class="flex items-center">
        Next
        <svg
          class="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </span>
    </button>
  {/if}
</div>
<!-- Add Fund Modal -->
{#if showAddFundModal}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    on:click={handleModalBackdropClick}
    on:keydown={(e) => e.key === "Escape" && closeAddMoneyModal()}
    role="button"
    tabindex="0"
  >
    <div class="bg-white rounded-lg p-6 w-1/3 max-w-md mx-4">
      <button
        on:click={closeAddMoneyModal}
        aria-label="Close"
        class="float-right"
      >
        <svg
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
          ><path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          ></path></svg
        >
      </button>
      <!-- Payment Provider Section -->
      
      <h3 class="text-lg font-semibold">Add Money to Wallet</h3>
      <div class="mt-4 grid grid-cols-4 gap-2">
        <button
          on:click={() => setAmount(20)}
          class="p-2 rounded-lg text-center border border-gray-200 bg-white hover:border-indigo-500 hover:text-indigo-500 focus:border-indigo-500 focus:text-indigo-500 transition-colors duration-200"
        >
          $20
        </button>
        <button
          on:click={() => setAmount(50)}
          class="p-2 rounded-lg text-center border border-gray-200 bg-white hover:border-indigo-500 hover:text-indigo-500 focus:border-indigo-500 focus:text-indigo-500 transition-colors duration-200"
        >
          $50
        </button>
        <button
          on:click={() => setAmount(80)}
          class="p-2 rounded-lg text-center border border-gray-200 bg-white hover:border-indigo-500 hover:text-indigo-500 focus:border-indigo-500 focus:text-indigo-500 transition-colors duration-200"
        >
          $80
        </button>
        <button
          on:click={() => setAmount(100)}
          class="p-2 rounded-lg text-center border border-gray-200 bg-white hover:border-indigo-500 hover:text-indigo-500 focus:border-indigo-500 focus:text-indigo-500 transition-colors duration-200"
        >
          $100
        </button>
      </div>

      <input
        type="text"
        bind:value={fundAmount}
        class="w-full mt-4 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter Amount"
      />

      <!-- Coupon Code Section -->
      <div class="flex items-center gap-2 mt-2">
        <input
          type="text"
          bind:value={couponCode}
          class="flex-grow p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter Promo Code"
        />
        <button
          on:click={applyCoupon}
          class="px-4 py-2 bg-blue-100 text-indigo-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
        >
          Apply
        </button>
      </div>

      <!-- Credit and Amount Section -->
      <div class="mt-4 flex justify-between">
        <p class="text-gray-500">Credit</p>
        <p>${baseAmount}</p>
      </div>

      <div class="flex justify-between mt-4">
        <p class="text-gray-500">Coupon Amount</p>
        <p>${couponAmount.toFixed(2)}</p>
      </div>

      <div class="flex justify-between font-semibold mt-4">
        <p>Total</p>
        <p>${totalAmount.toFixed(2)}</p>
      </div>

      <!-- Payment Button Section -->
      <button
        on:click={createOrder}
        class="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        ${totalAmount} Pay with Razorpay
      </button>

      <!-- Cancel Button -->
      <button
        on:click={closeAddMoneyModal}
        class="mt-2 w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
      >
        Cancel
      </button>
    </div>
  </div>
{/if}
