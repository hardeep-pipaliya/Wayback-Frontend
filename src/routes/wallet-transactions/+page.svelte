<script lang="ts">
  import { onMount } from 'svelte';

  let search = '';
  let showBack = false;
  let showAddFunds = false;
  let availableCredit = 0;

  let quickAmounts = [20, 50, 80, 100];
  let enteredAmount: string = '';
  let promoCode: string = '';
  let couponAmount = 0;

  type Txn = {
    id: number;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
    at: string;
  };

  let transactions: Txn[] = [];

  onMount(() => {
    const saved = Number(sessionStorage.getItem('wallet_balance') || 0);
    availableCredit = Number.isFinite(saved) ? saved : 0;
  });

  function walletTransactionListApi() {
    // TODO: replace with real API call, using `search`
  }

  function selectQuickAmount(value: number) {
    enteredAmount = String(value);
  }

  function applyCoupon() {
    // Dummy rule: $5 off for any non-empty code
    couponAmount = promoCode.trim() ? 5 : 0;
  }

  function parseAmount(value: string): number {
    const n = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }

  $: baseAmount = parseAmount(enteredAmount);
  $: totalAmount = Math.max(baseAmount - couponAmount, 0);

  function createOrder() {
    // TODO: integrate Razorpay flow
    // Placeholder
    alert(`Paying $${totalAmount}`);
  }

  function toggleAddFunds() {
    showAddFunds = !showAddFunds;
    showBack = showAddFunds;
  }
</script>

<div class="w-full px-8 py-6 pt-28 h-[calc(100vh-0px)] overflow-y-auto">
  <div>
    <div class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200">
      <div>
        <h3 class="text-lg font-semibold text-black">Wallet Transactions</h3>
        <p class="text-xs text-gray-500">Manage Transactions.</p>
      </div>

      <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
        <div class="relative text-gray-500 focus-within:text-gray-900">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 15.75L13.875 13.875M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C9.90046 14.25 11.3953 13.5836 12.48 12.5052C13.5732 11.4184 14.25 9.91325 14.25 8.25Z" stroke="#9CA3AF" stroke-width="1.2" stroke-linecap="round"></path>
            </svg>
          </div>
          <input
            type="search"
            id="search-input"
            class="block w-full max-w-xs pr-4 pl-8 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed"
            placeholder="Search here . . ."
            bind:value={search}
            on:input={walletTransactionListApi}
          />
        </div>

        <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
          {#if showBack}
            <button name="back-btn" class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-custom-black border border-black-600 rounded-lg hover:bg-indigo-700" on:click={toggleAddFunds}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.99953 11.78C5.87286 11.78 5.7462 11.7333 5.6462 11.6333L1.29953 7.28668C0.592865 6.58001 0.592865 5.42001 1.29953 4.71335L5.6462 0.36668C5.83953 0.173346 6.15953 0.173346 6.35286 0.36668C6.5462 0.560013 6.5462 0.880013 6.35286 1.07335L2.0062 5.42001C1.6862 5.74001 1.6862 6.26001 2.0062 6.58001L6.35286 10.9267C6.5462 11.12 6.5462 11.44 6.35286 11.6333C6.25286 11.7267 6.1262 11.78 5.99953 11.78Z" fill="white"></path>
              </svg>
              Back
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
    <div class="bg-light-blue w-1/3 py-3 mt-2 px-4 rounded-2xl">
      <div class="flex items-center justify-between gap-3">
        <div class="block">
          <p class="font-semibold text-base font-poppins text-gray-500 mb-1">Available Credit</p>
          <p class="font-bold text-xl font-poppins text-black wallet-amount-text">${availableCredit}</p>
        </div>
        <button name="add-btn" class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700" on:click={toggleAddFunds}>
          Add
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div class="mt-4 grid grid-cols-4 gap-2 w-1/2 ml-0 rounded-2xl p-6" class:hidden={!showAddFunds}></div>

  <div id="addFundsSection" class="w-1/2 ml-0 bg-white rounded-2xl p-6 shadow-lg" class:hidden={!showAddFunds}>
    <div class="flex justify-between items-center border-b pb-3">
      <h3 class="text-lg font-semibold">Enter Amount</h3>
    </div>

    <div class="mt-4 grid grid-cols-4 gap-2">
      {#each quickAmounts as amt}
        <button name="amount-button" class="p-2 rounded-lg text-center border bg-white hover:border-indigo-500 hover:text-indigo-500 focus:border-indigo-500 focus:text-indigo-500" on:click={() => selectQuickAmount(amt)}>
          ${amt}
        </button>
      {/each}
    </div>

    <input type="text" name="enter-amount" class="w-full mt-4 p-2 border rounded-lg" placeholder="$120" bind:value={enteredAmount} />

    <div class="flex items-center gap-2 mt-2">
      <input type="text" name="coupon-code" class="flex-grow p-2 border rounded-lg" placeholder="Enter Promo Code" bind:value={promoCode} />
      <button class="px-4 py-2 bg-light-blue text-indigo-600 rounded-lg" on:click={applyCoupon}>Apply</button>
    </div>

    <div class="mt-4 flex justify-between">
      <p class="text-gray-500">Credit</p>
      
    </div>
    <div class="flex justify-between mt-4">
      <p class="text-gray-500">Coupon Amount</p>
      
    </div>
    <div class="flex justify-between font-semibold mt-4">
      <p>Total</p>
      <!-- <p name="total-amount">${totalAmount}</p> -->
    </div>

    <button class="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg" on:click={createOrder} name="pay-btn">${totalAmount} Pay with Razorpay</button>
  </div>

  <div class="rounded-xl mt-4 border border-solid border-gray-200 overflow-auto">
    <table class="w-full rounded-xl font-poppins">
      <thead>
        <tr class="bg-gray-50 text-sm">
          <th scope="col" class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize">#</th>
          <th scope="col" class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize">Description</th>
          <th scope="col" class="py-3.5 pl-4 w-fit text-left whitespace-nowrap font-medium text-gray-900 capitalize">Amount</th>
          <th scope="col" class="py-3.5 pl-4 w-fit text-left whitespace-nowrap font-medium text-gray-900 capitalize">Transaction Type</th>
          <th scope="col" class="py-3.5 pl-4 w-20 text-left whitespace-nowrap font-medium text-gray-900 capitalize">Date &amp; Time</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 text-sm font-normal" id="wallet_transaction_tbody">
        {#if transactions.length === 0}
          <tr>
            <td colspan="5" class="py-6 text-center text-gray-500">No transactions</td>
          </tr>
        {:else}
          {#each transactions as t, i}
            <tr>
              <td class="py-3.5 pl-4">{i + 1}</td>
              <td class="py-3.5 pl-4">{t.description}</td>
              <td class="py-3.5 pl-4">${t.amount}</td>
              <td class="py-3.5 pl-4 capitalize">{t.type}</td>
              <td class="py-3.5 pl-4 whitespace-nowrap">{t.at}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  <div id="pagination" class="flex justify-center mt-4">
    <div class="flex items-center justify-between bg-white py-4">
      <div class="flex-1">
        <p class="text-sm text-gray-700">
          Showing <span class="font-medium">{transactions.length > 0 ? 1 : 0}</span>
          to <span class="font-medium">{transactions.length}</span>
          of <span class="font-medium">{transactions.length}</span> results
        </p>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
        <nav class="isolate inline-flex space-x-1 rounded-md" aria-label="Pagination"></nav>
      </div>
  </div>
</div>
