<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { invalidate } from '$app/navigation';
    import FlipSwitch from "$lib/components/FlipSwitch.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import PerPageSelector from '$lib/components/PerPageSelecter.svelte';
    import SortBy from '$lib/components/SortBy.svelte';
    import { handlePerPageChange, handleSortChange, handleSearch, handleStatusChange, handleEdit, handleView, handleDelete, handlePageChange } from './functions';
  
  
  
  </script>
  <div>
      <div
        class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
      >
        <!-- Left Side: Title Section -->
        <div>
          <h3 class="text-lg font-semibold text-black">Role & List</h3>
          <p class="text-xs text-gray-500">Manage your role.</p>
        </div>
        <!-- Right Side: Buttons and Search -->
         
        <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
          <PerPageSelector
            value={10}
            options={[1,5, 10, 25, 50, 100]}
            on:change={handlePerPageChange}
          />
          <SortBy
            
            on:sortChange={handleSortChange}
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
              id="default-search"
              value={""}
              oninput={handleSearch}
              class="block w-full max-w-xs pr-4 pl-8 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed"
              placeholder="Search here . . ."
            />
          </div>
    
          <!-- Add Role Button -->
          <button
            onclick={() => {
              console.log("clicked on new workspace");
              goto('/role/create');
            }}
            class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
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
            New Role
          </button>
        </div>
      </div>
      <div class="rounded-xl mt-4 border border-solid border-gray-200 overflow-auto">
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
                  Name
                </th>
               
            <th
            scope="col"
            class="py-3.5 pl-4 w-20 text-left whitespace-nowrap font-medium text-gray-900 capitalize"
          >
          Actions
          </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-sm font-normal">
              {#each [] as row, i}
                <tr class="transition-all duration-500 hover:bg-gray-50">
                  <td class="py-3.5 pl-4 whitespace-nowrap">{i + 1}</td>
                  <td class="py-3.5 pl-4 whitespace-nowrap font-normal text-gray-900">
                    <div class="flex items-center w-1/2 max-md:w-full">
                     
                      <span class="block font-medium text-gray-900">{"name"}</span>
                    </div>
                  </td>
                 
                  <td class="py-3.5 px-4">
                    <div class="flex font-poppins">
                      <button
                        aria-label="Edit"
                        type="button"
                        class="mr-2 cursor-pointer"
                        onclick={() => {
                          handleEdit();
                          console.log("Edit clicked for ID:", 1);
                        }}
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
                            d="M14.9533 20.2467C14.8533 20.2467 14.76 20.22 14.6733 20.16C14.5333 20.0667 14.4533 19.9133 14.4533 19.7467C14.4533 19.6467 14.4467 19.54 14.4333 19.4333C14.3733 18.96 14.16 18.5467 13.8 18.1867C13.44 17.8267 12.9933 17.6 12.5133 17.54C12.4333 17.5333 12.32 17.5267 12.2133 17.5333C12.04 17.5467 11.88 17.4733 11.78 17.3333C11.68 17.2 11.6533 17.02 11.7067 16.86C11.8067 16.5867 11.9533 16.34 12.1267 16.14L13.1533 14.8467C14.92 12.64 18.5 9.98667 21.12 8.93333C21.6733 8.72 22.2667 8.84667 22.6733 9.24667C23.0933 9.66667 23.22 10.2667 23 10.8133C21.9467 13.44 19.3 17.0133 17.0933 18.78L15.78 19.8333C15.5333 20.0133 15.3333 20.1267 15.1333 20.2067C15.08 20.2333 15.0133 20.2467 14.9533 20.2467ZM13.0267 16.6267C13.5867 16.7733 14.0867 17.0667 14.5067 17.4867C14.9267 17.9 15.2067 18.38 15.3467 18.9133L16.4733 18.0067C18.5667 16.3333 21.08 12.94 22.0733 10.4467C22.1733 10.2 22.0333 10.0267 21.9667 9.96667C21.92 9.92 21.7467 9.77333 21.48 9.87333C19 10.8733 15.6067 13.3867 13.9267 15.48L13.0267 16.6267Z"
                            fill="#292D32"
                          ></path>
                          <path
                            d="M10.7206 23.1665C10.2206 23.1665 9.74056 22.9665 9.38056 22.6065C8.96723 22.1932 8.76723 21.6199 8.8339 21.0332L9.0139 19.3932C9.18723 17.7665 10.5206 16.5599 12.1739 16.5265C12.3006 16.5199 12.4672 16.5265 12.6206 16.5399C13.3472 16.6332 13.9939 16.9599 14.5139 17.4799C15.0272 17.9932 15.3339 18.6065 15.4272 19.2932C15.4472 19.4399 15.4606 19.5999 15.4606 19.7399C15.4606 20.6199 15.1206 21.4399 14.5072 22.0599C13.9939 22.5665 13.3339 22.8799 12.5872 22.9732L10.9406 23.1532C10.8672 23.1599 10.7939 23.1665 10.7206 23.1665ZM12.3006 17.5332C12.2739 17.5332 12.2406 17.5332 12.2139 17.5332C11.2072 17.5532 10.1406 18.2399 10.0072 19.5065L9.82723 21.1465C9.7939 21.4265 9.8939 21.6999 10.0872 21.8999C10.2806 22.0932 10.5539 22.1932 10.8272 22.1599L12.4672 21.9799C12.9806 21.9132 13.4406 21.6999 13.7872 21.3532C14.2139 20.9265 14.4539 20.3532 14.4539 19.7399C14.4539 19.6399 14.4472 19.5332 14.4339 19.4265C14.3739 18.9532 14.1606 18.5399 13.8006 18.1799C13.4406 17.8199 12.9939 17.5932 12.5139 17.5332C12.4606 17.5332 12.3806 17.5332 12.3006 17.5332Z"
                            fill="#292D32"
                          ></path>
                          <path
                            d="M17.4933 18.1467C17.22 18.1467 16.9933 17.92 16.9933 17.6467C16.9933 16.18 15.8 14.9933 14.34 14.9933C14.0667 14.9933 13.84 14.7667 13.84 14.4933C13.84 14.22 14.06 13.9933 14.3333 13.9933C16.3467 13.9933 17.9867 15.6333 17.9867 17.6467C17.9933 17.9267 17.7667 18.1467 17.4933 18.1467Z"
                            fill="#292D32"
                          ></path>
                        </svg>
                      </button>
                      <button
                        aria-label="View"
                        type="button"
                        class="mr-2 cursor-pointer"
                        onclick={() => handleView()}
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
                            d="M16 18.8867C14.4067 18.8867 13.1133 17.5933 13.1133 16C13.1133 14.4067 14.4067 13.1133 16 13.1133C17.5933 13.1133 18.8867 14.4067 18.8867 16C18.8867 17.5933 17.5933 18.8867 16 18.8867ZM16 14.1133C14.96 14.1133 14.1133 14.96 14.1133 16C14.1133 17.04 14.96 17.8867 16 17.8867C17.04 17.8867 17.8867 17.04 17.8867 16C17.8867 14.96 17.04 14.1133 16 14.1133Z"
                            fill="#292D32"
                          ></path>
                          <path
                            d="M15.9997 22.0135C13.4931 22.0135 11.1264 20.5468 9.49973 18.0002C8.79306 16.9002 8.79306 15.1068 9.49973 14.0001C11.1331 11.4535 13.4997 9.98682 15.9997 9.98682C18.4997 9.98682 20.8664 11.4535 22.4931 14.0001C23.1997 15.1001 23.1997 16.8935 22.4931 18.0002C20.8664 20.5468 18.4997 22.0135 15.9997 22.0135ZM15.9997 10.9868C13.8464 10.9868 11.7864 12.2801 10.3464 14.5402C9.84639 15.3202 9.84639 16.6801 10.3464 17.4601C11.7864 19.7201 13.8464 21.0135 15.9997 21.0135C18.1531 21.0135 20.2131 19.7201 21.6531 17.4601C22.1531 16.6801 22.1531 15.3202 21.6531 14.5402C20.2131 12.2801 18.1531 10.9868 15.9997 10.9868Z"
                            fill="#292D32"
                          ></path>
                        </svg>
                      </button>
                      <button
                        aria-label="Delete"
                        type="button"
                        class="mr-2 deleteButton cursor-pointer"
                        onclick={() => handleDelete()}
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
                            d="M22 12.4867C21.9867 12.4867 21.9667 12.4867 21.9467 12.4867C18.42 12.1333 14.9 12 11.4133 12.3533L10.0533 12.4867C9.77334 12.5133 9.52667 12.3133 9.5 12.0333C9.47334 11.7533 9.67334 11.5133 9.94667 11.4867L11.3067 11.3533C14.8533 10.9933 18.4467 11.1333 22.0467 11.4867C22.32 11.5133 22.52 11.76 22.4933 12.0333C22.4733 12.2933 22.2533 12.4867 22 12.4867Z"
                            fill="#E64646"
                          ></path>
                          <path
                            d="M13.6667 11.8133C13.64 11.8133 13.6133 11.8133 13.58 11.8067C13.3133 11.76 13.1267 11.5 13.1733 11.2333L13.32 10.36C13.4267 9.72 13.5733 8.83333 15.1267 8.83333H16.8733C18.4333 8.83333 18.58 9.75333 18.68 10.3667L18.8267 11.2333C18.8733 11.5067 18.6867 11.7667 18.42 11.8067C18.1467 11.8533 17.8867 11.6667 17.8467 11.4L17.7 10.5333C17.6067 9.95333 17.5867 9.84 16.88 9.84H15.1333C14.4267 9.84 14.4133 9.93333 14.3133 10.5267L14.16 11.3933C14.12 11.64 13.9067 11.8133 13.6667 11.8133Z"
                            fill="#E64646"
                          ></path>
                          <path
                            d="M18.14 23.1667H13.86C11.5333 23.1667 11.44 21.88 11.3667 20.84L10.9333 14.1267C10.9133 13.8533 11.1267 13.6133 11.4 13.5933C11.68 13.58 11.9133 13.7867 11.9333 14.06L12.3667 20.7733C12.44 21.7867 12.4667 22.1667 13.86 22.1667H18.14C19.54 22.1667 19.5667 21.7867 19.6333 20.7733L20.0667 14.06C20.0867 13.7867 20.3267 13.58 20.6 13.5933C20.8733 13.6133 21.0867 13.8467 21.0667 14.1267L20.6333 20.84C20.56 21.88 20.4667 23.1667 18.14 23.1667Z"
                            fill="#E64646"
                          ></path>
                          <path
                            d="M17.1067 19.5H14.8867C14.6133 19.5 14.3867 19.2733 14.3867 19C14.3867 18.7267 14.6133 18.5 14.8867 18.5H17.1067C17.38 18.5 17.6067 18.7267 17.6067 19C17.6067 19.2733 17.38 19.5 17.1067 19.5Z"
                            fill="#E64646"
                          ></path>
                          <path
                            d="M17.6667 16.8333H14.3333C14.06 16.8333 13.8333 16.6067 13.8333 16.3333C13.8333 16.06 14.06 15.8333 14.3333 15.8333H17.6667C17.94 15.8333 18.1667 16.06 18.1667 16.3333C18.1667 16.6067 17.94 16.8333 17.6667 16.8333Z"
                            fill="#E64646"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
      </div>
      <Pagination pagination={{
        total_count: 0,
        offset: 0,
        limit: 10,
        total_pages: 0
      }} handlePageChange={handlePageChange} />
    </div>