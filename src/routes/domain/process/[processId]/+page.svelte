<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import WaybackChart from "$lib/components/WaybackChart.svelte";
  
  // Stepper state
  let domainName = "";

  function handleSubmit() {
    if (!domainName?.trim()) return;
    console.log("Submitted domain:", domainName);
    // Start step 1 logs only after submit
    currentStep = 1;
    step1Enabled = true;
    startStep1IfNeeded();
  }
  let currentStep: number = 1;
  const totalSteps: number = 5;
  $: overallProgress = currentStep === totalSteps
    ? 100
    : Math.round(((currentStep - 1) / totalSteps) * 100);

  // Step 1 processing state (logs + progress)
  type LogEntry = { index: number; message: string };
  let step1Logs: LogEntry[] = [];
  let step1Running = false;
  let step1Completed = false;
  let step1Enabled = false;
  $: isCurrentStepRunning = (currentStep === 1 && step1Running) || (currentStep === 2 && step2Running);

  const step1Messages: string[] = [
    "Starting installation. Upgrading system to latest update. This will take a while...",
    "Upgraded system to latest software version. Bootstrapping installation...",
    "Enabling swap if not enabled...",
    "Installation started. Installing dependency will take a few moments...",
    "Configuring Supervisor to run background job...",
    "Configuring Fail2Ban to prevent SSH and Agent bruteforce...",
    "Configuring MariaDB database...",
    "Configuring default user and OpenLiteSpeed service...",
    "Configuring auto update...",
    "Configuring Firewall. Closing unused port to prevent attacks...",
    "Finalizing setup..."
  ];

  // Step 2 processing state (logs)
  let step2Logs: LogEntry[] = [];
  let step2Running = false;
  let step2Completed = false;
  const step2Messages: string[] = [
    "Fetching Wayback snapshot timeline...",
    "Building year-month histogram...",
    "Grouping snapshots by period and filtering duplicates...",
    "Preparing preview screenshots...",
    "Finalizing selection UI..."
  ];

  function getCircleClasses(step: number): string {
    if (step <= currentStep) {
      return 'flex items-center justify-center w-[34px] h-[34px] bg-indigo-500 text-white rounded-full transition-colors duration-300';
    } else {
      return 'flex items-center justify-center w-[34px] h-[34px] bg-gray-200 text-gray-400 rounded-full transition-colors duration-300';
    }
  }

  function getLineClasses(step: number): string {
    if (step < currentStep) {
      return 'flex-1 h-0.5 bg-indigo-500 transition-colors duration-300';
    } else {
      return 'flex-1 h-0.5 bg-gray-300 transition-colors duration-300';
    }
  }

  function getPrevBtnClasses(): string {
    if (currentStep === 1) {
      return 'px-6 py-3 bg-gray-200 text-gray-400 rounded-lg font-medium transition-all duration-300 cursor-not-allowed';
    } else {
      return 'px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 cursor-pointer';
    }
  }

  function getNextBtnClasses(): string {
    if (currentStep === totalSteps) {
      return 'px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300';
    } else {
      return 'px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300';
    }
  }

  function handleNext(): void {
    if (currentStep < totalSteps) {
      currentStep++;
    } else {
      alert('Process completed!');
    }
  }

  function handlePrev(): void {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  function goBack() {
    goto("/domain"); // 👈 change "/" to the route you want to navigate to
  }

  // Start Step 1 logs when entering step 1 (only after submit)
  function startStep1IfNeeded() {
    if (!step1Enabled || currentStep !== 1 || step1Running || step1Completed) return;
    step1Running = true;
    step1Logs = [];
    let i = 0;
    const total = step1Messages.length;
    const interval = setInterval(() => {
      const message = step1Messages[i];
      step1Logs = [...step1Logs, { index: i + 1, message }];
      i++;
      if (i >= total) {
        clearInterval(interval);
        step1Running = false;
        step1Completed = true;
        // Auto-advance after a short pause to mimic clicking Next
        setTimeout(() => {
          if (currentStep === 1) handleNext();
        }, 400);
      }
    }, 600);
  }

  // Start Step 2 logs when entering step 2
  function startStep2IfNeeded() {
    if (currentStep !== 2 || step2Running || step2Completed) return;
    step2Running = true;
    step2Logs = [];
    let i = 0;
    const total = step2Messages.length;
    const interval = setInterval(() => {
      const message = step2Messages[i];
      step2Logs = [...step2Logs, { index: i + 1, message }];
      i++;
      if (i >= total) {
        clearInterval(interval);
        step2Running = false;
        step2Completed = true;
        setTimeout(() => {
          if (currentStep === 2) handleNext();
        }, 400);
      }
    }, 600);
  }

  // Do not auto-start step 1 on mount. Only run after submit sets step1Enabled.
  $: if (currentStep === 1) {
    startStep1IfNeeded();
  }

  // Kick off when entering step 2
  $: if (currentStep === 2) {
    startStep2IfNeeded();
  }
</script>


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

<div class="mt-4 p-5 border border-gray-200 rounded-2xl bg-white">
  <div class="max-w-4xl mx-auto">
    <!-- Progress Steps with labels -->
    <div class="p-4 mb-4 border border-gray-200 rounded-2xl bg-white">
      <div class="flex items-center w-full">
        {#each Array(totalSteps) as _, idx}
          {#key idx}
            <div class="flex items-center flex-1">
              <div class={`${idx + 1 < currentStep ? 'bg-indigo-600 text-white' : idx + 1 === currentStep ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' : 'bg-gray-200 text-gray-400'} rounded-full w-[34px] h-[34px] flex items-center justify-center`}>
                {idx + 1}
              </div>
              <span class="ml-2 text-xs font-medium {idx + 1 <= currentStep ? 'text-indigo-700' : 'text-gray-500'}">Step {idx + 1}</span>
              {#if idx < totalSteps - 1}
                <div class={`${idx + 1 < currentStep ? 'bg-indigo-600' : 'bg-gray-300'} h-0.5 flex-1 mx-2`}></div>
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
          <div class="p-4 mb-4 border border-gray-200 rounded-2xl">
            <label for="domain-name" class="block pb-1 text-sm font-medium text-gray-600">Domain name</label>
            <div class="flex items-center gap-x-4">
              <div class="flex-1">
                <input
                  type="text"
                  id="domain-name"
                  name="domain_name"
                  bind:value={domainName}
                  class="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Enter Domain Name Here"
                  disabled={step1Running || step1Completed}
                />
              </div>
              <button
                type="button"
                on:click={handleSubmit}
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex-shrink-0"
                disabled={!domainName?.trim() || step1Running || step1Completed}
              >
                Submit
              </button>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={`width: ${overallProgress}%`}></div>
          </div>
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>Progress</span>
            <span>{overallProgress}%</span>
          </div>

          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 text-sm font-medium">Step log</div>
            <div class="bg-black text-gray-200 text-xs p-4 max-h-80 overflow-auto space-y-2">
              {#each step1Logs as row}
                <div class="flex gap-3">
                  <span class="text-indigo-400">{row.index}.</span>
                  <span class="text-gray-200">{row.message}</span>
                </div>
              {/each}
              {#if step1Running}
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
            <p class="text-xs text-gray-500">Choose the pages you want to download. Exclude unnecessary categories and sections for a cleaner result.</p>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={`width: ${overallProgress}%`}></div>
          </div>
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>Progress</span>
            <span>{overallProgress}%</span>
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
                <div class="bg-gray-100 px-4 py-2 text-sm font-medium">Processing log</div>
                <div class="bg-black text-gray-200 text-xs p-4 max-h-64 overflow-auto space-y-2">
                  {#each step2Logs as row}
                    <div class="flex gap-3">
                      <span class="text-indigo-400">{row.index}.</span>
                      <span class="text-gray-200">{row.message}</span>
                    </div>
                  {/each}
                  {#if step2Running}
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
                  <h2 class="text-base font-semibold text-gray-800">Content Extraction</h2>
                  <p class="text-xs text-gray-500">Specify selector for title, category and configure options to tailor the extraction process, like handling image and links.</p>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-center gap-3 flex-wrap mb-3">
                {#each ['Title','Tag','Category','Author','Date','Image','Content','SEO'] as opt, i}
                  <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border {i === 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-700'} cursor-pointer text-xs">
                    <input type="radio" name="ce-opt" class="hidden" />
                    <span>{opt}</span>
                  </label>
                {/each}
                <button class="ml-auto px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Save</button>
              </div>

              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-7">
                  <div class="text-sm font-medium mb-2">Article HTML</div>
                  <textarea class="w-full h-64 border border-gray-300 rounded-lg p-3 text-xs focus:outline-none" placeholder="Paste or preview extracted HTML here..."></textarea>
                </div>
                <div class="col-span-12 lg:col-span-5">
                  <div class="text-sm font-medium mb-2">Processed Preview</div>
                  <div class="h-64 border border-gray-300 rounded-lg p-3 text-xs text-gray-500">Preview will appear here</div>
                </div>
              </div>
            </div>
          </div>
        {:else if currentStep === 4}
        <!-- STEP 4: Wayback URLs table -->
        <div>
          <div class="rounded-2xl border border-gray-200">
            <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
              <h2 class="text-base font-semibold text-gray-800">Wayback Urls</h2>
              <p class="text-xs text-gray-500">Choose the pages you want to download. Exclude unnecessary categories and sections for a cleaner result.</p>
            </div>
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="text-center text-xs text-gray-500 w-full">
                  <label class="inline-flex items-center gap-2 text-gray-700">
                    <input type="checkbox" class="rounded border-gray-300" />
                    <span class="text-sm">Select All Wayback URLs</span>
                    <span class="text-gray-400 text-xs">(0)</span>
                  </label>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 mb-3">
                <div class="flex items-center gap-2 text-xs">
                  <span class="text-gray-600">Per Page</span>
                  <select class="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none">
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                  </select>
                </div>
                <div class="relative">
                  <input class="border border-gray-300 rounded-md pl-8 pr-3 py-1 text-xs focus:outline-none" placeholder="Search keywords ..." />
                  <svg class="w-4 h-4 text-gray-400 absolute left-2 top-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <table class="w-full text-left text-xs">
                  <thead class="bg-gray-50 text-gray-600">
                    <tr>
                      <th class="px-3 py-2 w-10"><input type="checkbox" class="rounded border-gray-300" /></th>
                      <th class="px-3 py-2 w-12">#</th>
                      <th class="px-3 py-2">Url</th>
                      <th class="px-3 py-2 w-48">Time Stamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each [] as _row, i}
                      <tr class="border-t">
                        <td class="px-3 py-2"><input type="checkbox" class="rounded border-gray-300" /></td>
                        <td class="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td class="px-3 py-2">—</td>
                        <td class="px-3 py-2">—</td>
                      </tr>
                    {:else}
                      <tr>
                        <td class="px-3 py-6 text-center text-gray-400" colspan="4">No URLs loaded yet.</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <!-- Placeholder for other steps until implemented -->
        <div class="text-sm text-gray-600">Step {currentStep} content will appear here.</div>
      {/if}
    </div>
  </div>

    <!-- Navigation Buttons -->
  <div class="flex justify-between items-center m-5">
    <button 
      class={getPrevBtnClasses()}
      disabled={currentStep === 1}
      on:click={handlePrev}
    >
      <span class="flex items-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Previous
      </span>
    </button>
    
    <div class="flex space-x-2">
      <span class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
    
    {#if !isCurrentStepRunning}
      <button 
        class={getNextBtnClasses()}
        on:click={handleNext}
      >
        <span class="flex items-center">
          {#if currentStep === totalSteps}
            Complete
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          {:else}
            Next
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          {/if}
        </span>
      </button>
    {/if}
  </div>

<!-- Removed duplicate bottom domain form: handled inside Step 1 above -->



 