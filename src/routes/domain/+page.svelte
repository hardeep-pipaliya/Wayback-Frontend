<script lang="ts">
  import Pagination from '$lib/components/Pagination.svelte';
  import { goto } from '$app/navigation';

  type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

  type DomainRow = {
    id: string;
    name: string;
    selectedUrls: number;
    scrapedArticles: number;
    paymentStatus: PaymentStatus;
    statusMessage: string;
    processId?: string;
  };

  export let data: { domains: DomainRow[] };

  let searchQuery = '';
  let page = 1;
  let pageSize = 10;
  let domains: DomainRow[] = data?.domains ?? [];
  
  // Add static test data for development/testing
  if (domains.length === 0) {
    domains = [
      {
        id: 'test-001',
        name: 'example.com',
        selectedUrls: 25,
        scrapedArticles: 150,
        paymentStatus: 'Paid' as PaymentStatus,
        statusMessage: 'Active',
        processId: 'proc-123'
      }
    ];
  }
  
  let pagination = {
    total_count: 1,
    offset: 0,
    limit: 10,
    total_pages: 2,
  };

  $: filtered = domains.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );
  $: total = filtered.length;
  $: totalPages = Math.max(1, Math.ceil(total / pageSize));
  $: page = Math.min(Math.max(1, page), totalPages);
  $: start = (page - 1) * pageSize + 1;
  $: end = Math.min(page * pageSize, total);
  $: visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function setSearch(value: string) {
    searchQuery = value;
    page = 1;
  }

  async function handleDownloadCsv(id: string) {
    try {
      const res = await fetch(`/api/domains/${id}/export`, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to download CSV');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  }

  function handlePageChange() {
  console.log("clicked on page change");}
</script>

<div>
  <div
    class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
  >
    <div>
      <h3 class="text-lg font-semibold text-black">Domain &amp; List</h3>
      <p class="text-xs text-gray-500">Manage Domains.</p>
    </div>

    <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
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
          id="search-input"
          bind:value={searchQuery}
          on:input={(e) => setSearch((e.target as HTMLInputElement).value)}
          class="block w-full max-w-xs pr-4 pl-8 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed"
          placeholder="Search here . . ."
        />
      </div>

      <a
        href="/domain/process/proc-new"
        data-permission="add_domain"
        class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 4.5V13.5M13.5 9H4.5"
            stroke="white"
            stroke-width="1.3"
            stroke-linecap="round"
          ></path>
        </svg>
        New Domain
      </a>
    </div>
  </div>

  <div
    class="rounded-xl mt-4 border border-solid border-gray-200 overflow-auto"
  >
    <table class="w-full rounded-xl font-poppins">
      <thead>
        <tr class="bg-gray-50 text-sm">
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
            Domains
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize"
          >
            Selected URLs
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize"
          >
            Scraped Articles
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize"
          >
            Payment Status
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 w-20 text-left whitespace-nowrap font-medium text-gray-900 capitalize"
          >
            Actions
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 w-fit text-left whitespace-nowrap font-medium text-gray-900 capitalize"
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 text-sm font-normal">
        {#if visible.length === 0}
          <tr>
            <td class="py-6 pl-4 text-gray-500" colspan="7">No results</td>
          </tr>
        {:else}
          {#each visible as row, i}
            <tr class="transition-all duration-500 hover:bg-gray-50">
              <td class="py-3.5 pl-4 whitespace-nowrap">{(page - 1) * pageSize + i + 1}</td>
              <td class="py-3.5 pl-4 whitespace-nowrap font-normal text-gray-900 pb-6">
                {row.name}
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap font-normal text-gray-900">
                {row.selectedUrls}
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap font-normal text-gray-900">
                {row.scrapedArticles}
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-full text-xs {row.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : row.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                  {row.paymentStatus}
                </span>
              </td>
              <td class="py-3.5 px-4">
                <div class="flex font-poppins">
                  <button
                    class="mr-2"
                    on:click={() => handleDownloadCsv(row.id)}
                    title="Download Articles"
                    aria-label="Download Articles"
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="32" height="32" rx="16" fill="#EAECF0"></rect>
                      <path
                        d="M16 19.5V8.5M16 19.5L12 15.5M16 19.5L20 15.5"
                        stroke="#1F2937"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M8 21.5V22.5C8 23.0523 8.44772 23.5 9 23.5H23C23.5523 23.5 24 23.0523 24 22.5V21.5"
                        stroke="#1F2937"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </button>
                  {#if row.processId}
                    <a href={`/domain/process/${row.processId ?? 'proc-123'}`} class="mr-2" title="View Domain" aria-label="View Domain">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="32" height="32" rx="16" fill="#EAECF0"></rect>
                        <path
                          d="M16 10C11.82 10 8.14999 12.73 6.31999 16C8.14999 19.27 11.82 22 16 22C20.18 22 23.85 19.27 25.68 16C23.85 12.73 20.18 10 16 10Z"
                          stroke="#292D32"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z"
                          stroke="#292D32"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </a>
                  {/if}
                </div>
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  {row.statusMessage}
                </span>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

      <Pagination pagination={{
        total_count: 1,
        offset: 0,
        limit: 10,
        total_pages: 2
      }} handlePageChange={handlePageChange} />
    
  
</div>
