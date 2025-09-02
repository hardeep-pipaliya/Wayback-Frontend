<script lang="ts">
   
   
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { showErrorAlert } from "$lib/utils/sweetAlert";
    import { showToast } from "$lib/utils/sweetAlert";
  import FlipSwitch from "$lib/components/FlipSwitch.svelte";
  import Pagination from "$lib/components/Pagination.svelte";

  function handleSearch() {
    
    console.log("search");
  }
  function handleStatusChange() {
    console.log("status change");
  }
  function handleEdit() {
    console.log("edit");
  }
  function handleView() {
    console.log("view");
  }
  function handleDelete() {
    console.log("delete");
  }
  function handlePageChange(){
    console.log("page change")
  }
   
  </script>
  
  <div
    class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
  >
    <!-- Left Side: Title Section -->
    <div class="w-full lg:w-1/2 text-center lg:text-left">
      <h3 class="text-lg font-semibold text-black">Activity Log</h3>
      <p class="text-xs text-gray-500">
        See all your activity log here.
      </p>
    </div>
  
    <!-- Right Side: Button -->
    <div
      class="w-full lg:w-1/2 flex justify-center lg:justify-end sm:justify-end md:justify-end"
    >
      <button
        onclick={() => goto(`/`)}
        class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-black border border-black rounded-lg hover:bg-indigo-700 cursor-pointer hover:border-none transition-colors duration-300"
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
        Back
      </button>
    </div>
  </div>

 <div
        class="bg-white mt-4 border border-gray-200 rounded-xl p-3"
      >
      <div class="flex flex-col pb-3  lg:flex-row items-center justify-between gap-4 ">
         <!-- Left Side: Title Section -->
         <div>
            <h3 class="text-lg font-semibold text-black">Activity Logs</h3>
           
          </div>
          <!-- Right Side: Buttons and Search -->
           
          <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
            
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
                id="default-search"
                value={""}
                oninput={handleSearch}
                class="block w-full max-w-xs pr-4 pl-8 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed"
                placeholder="Search here . . ."
              />
            </div>
  
           
          </div>
      </div>
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
              Title
            </th>
            <th
              scope="col"
              class="py-3.5 pl-4  text-left whitespace-nowrap font-medium text-gray-900 capitalize"
            >
              Type
            </th>
            <th
            scope="col"
            class="py-3.5 pl-4  text-left whitespace-nowrap font-medium text-gray-900 capitalize"
          >
            Date/Time
          </th>
          
        <th
        scope="col"
        class="py-3.5 pl-4 w-20 text-left whitespace-nowrap font-medium text-gray-900 capitalize"
      >
      Role
      </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm font-normal">
          {#each [] as row, i}
            <tr class="transition-all duration-500 hover:bg-gray-50">
              <td class="py-3.5 pl-4 whitespace-nowrap">{i + 1}</td>
              <td class="py-3.5 pl-4 whitespace-nowrap font-normal text-gray-900">
                <div class="flex items-center w-1/2 max-md:w-full">
                 
                  <span class="block font-medium text-gray-900">{"title"}</span>
                </div>
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap font-normal text-gray-900">
                <div class="flex items-center w-1/2 max-md:w-full">
                 
                  <span class="block font-medium text-gray-900">{"type"}</span>
                </div>
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap font-normal text-gray-900">
                <div class="flex items-center w-1/2 max-md:w-full">
                 
                  <span class="block font-medium text-gray-900">{"date-time"}</span>
                </div>
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap font-normal text-gray-900">
                <div class="flex items-center w-1/2 max-md:w-full">
                 
                  <span class="block font-medium text-gray-900">{"role"}</span>
                </div>
              </td>
            
              
            </tr>
          {/each}
        </tbody>
      </table>
      <Pagination pagination={{
        total_count: 0,
        offset: 0,
        limit: 10,
        total_pages: 0
      }} handlePageChange={handlePageChange} />
      </div>