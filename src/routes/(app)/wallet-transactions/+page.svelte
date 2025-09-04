<script lang="ts">
  import { onMount } from 'svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { goto } from '$app/navigation';
  // Types
  interface Transaction {
    id: number;
    description: string;
    amount: number;
    transactionType: 'credit' | 'debit';
    dateTime: string;
  }

  interface PaymentProvider {
    id: string;
    name: string;
    icon: string;
  }

  // State variables
  let walletBalance: number = 0;
  let searchQuery: string = '';
  let showAddFunds: boolean = false;
  let showPaymentProviders: boolean = false;
  let showBackButton: boolean = false;
  let showAddButton: boolean = true;
  let selectedAmount: string = '';
  let customAmount: string = '';
  let couponCode: string = '';
  let baseAmount: number = 0;
  let couponAmount: number = 0;
  let totalAmount: number = 0;
  let transactions: Transaction[] = [];
  let currentPage: number = 1;
  let totalPages: number = 0;
  let totalResults: number = 0;

  // Predefined amounts
  const predefinedAmounts: string[] = ['$20', '$50', '$80', '$100'];

  // Payment providers (mock data)
  const paymentProviders: PaymentProvider[] = [
    { id: 'razorpay', name: 'Razorpay', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '💰' },
    { id: 'stripe', name: 'Stripe', icon: '💵' },
    { id: 'paytm', name: 'Paytm', icon: '📱' }
  ];

  // Lifecycle
  onMount(() => {
    loadWalletBalance();
    loadTransactions();
  });

  // Functions
  function loadWalletBalance(): void {
    const savedBalance = sessionStorage.getItem('wallet_balance');
    walletBalance = savedBalance ? parseFloat(savedBalance) : 0;
  }

  function updateWalletBalance(balance: number): void {
    walletBalance = balance;
    sessionStorage.setItem('wallet_balance', balance.toString());
  }

  function toggleAddFunds(): void {
    showAddFunds = !showAddFunds;
    showPaymentProviders = false;
    showBackButton = showAddFunds;
    showAddButton = false; // Hide the Add button when clicked
  }

  function closeAddFunds(): void {
    showAddFunds = false;
    showPaymentProviders = false;
    showBackButton = false;
    showAddButton = true;
  }

  function selectAmount(amount: string): void {
    selectedAmount = amount;
    customAmount = amount.replace('$', '');
    calculateTotal();
  }

  function handleCustomAmountChange(): void {
    selectedAmount = '';
    calculateTotal();
  }

  function calculateTotal(): void {
    const amount = customAmount ? parseFloat(customAmount) : 0;
    baseAmount = amount;
    totalAmount = baseAmount + couponAmount;
  }

  async function applyCoupon(): Promise<void> {
    if (!couponCode.trim()) return;
    
    try {
      // Mock coupon API call
      const response = await mockCouponAPI(couponCode);
      if (response.valid) {
        couponAmount = response.discount;
        calculateTotal();
        alert('Coupon applied successfully!');
      } else {
        alert('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert('Error applying coupon');
    }
  }

  async function mockCouponAPI(code: string): Promise<{ valid: boolean; discount: number }> {
    // Mock API response
    return new Promise(resolve => {
      setTimeout(() => {
        if (code.toLowerCase() === 'save10') {
          resolve({ valid: true, discount: 10 });
        } else {
          resolve({ valid: false, discount: 0 });
        }
      }, 500);
    });
  }

  async function createOrder(): Promise<void> {
    if (totalAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Mock payment processing
      const success = await mockPaymentProcess(totalAmount);
      if (success) {
        updateWalletBalance(walletBalance + totalAmount);
        resetForm();
        alert('Payment successful!');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment error occurred');
    }
  }

  async function mockPaymentProcess(amount: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Math.random() > 0.1); // 90% success rate
      }, 2000);
    });
  }

  function resetForm(): void {
    closeAddFunds();
    selectedAmount = '';
    customAmount = '';
    couponCode = '';
    baseAmount = 0;
    couponAmount = 0;
    totalAmount = 0;
  }

  async function loadTransactions(): Promise<void> {
    try {
      // Mock transaction data
      transactions = [
        {
          id: 1,
          description: 'Added funds via Razorpay',
          amount: 100,
          transactionType: 'credit',
          dateTime: '2025-08-28 10:30 AM'
        },
        {
          id: 2,
          description: 'Purchase - Premium Plan',
          amount: 50,
          transactionType: 'debit',
          dateTime: '2025-08-27 3:45 PM'
        }
      ];
      totalResults = transactions.length;
      totalPages = Math.ceil(totalResults / 10);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  function searchTransactions(): void {
    if (!searchQuery.trim()) {
      loadTransactions();
      return;
    }
    
    const filtered = transactions.filter(t => 
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    transactions = filtered;
  }

  function handleSearch(): void {
    searchTransactions();
  }

  // function goBack(): void {
  //   resetForm();
  //   showAddButton = true; // Show the Add button when Previous is clicked
  // }

  let pagination = {
    total_count: 1,
    offset: 0,
    limit: 10,
    total_pages: 2,
  };

  function handlePageChange() {
    console.log("clicked on page change");}

  // Close modal when clicking outside
  function handleModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      closeAddFunds();
    }
  }
    
</script>

<div class="p-1 max-w-7xl mx-auto">
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200">
    <!-- Left Side: Title Section -->
    <div>
      <h3 class="text-lg font-semibold text-black">Wallet Transactions</h3>
      <p class="text-xs text-gray-500">Manage Transactions.</p>
    </div>

    <!-- Right Side: Buttons and Search -->
    <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
      <!-- Search Box -->
      {#if !showBackButton}
        <div class="relative text-gray-500 focus-within:text-gray-900">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 15.75L13.875 13.875M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C9.90046 14.25 11.3953 13.5836 12.48 12.5052C13.5732 11.4184 14.25 9.91325 14.25 8.25Z" stroke="#9CA3AF" stroke-width="1.2" stroke-linecap="round"></path>
            </svg>
          </div>
          <input 
            type="search" 
            bind:value={searchQuery}
            on:input={handleSearch}
            class="block w-full max-w-xs pr-4 pl-8 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed" 
            placeholder="Search here . . ."
          />
        </div>
      {/if}
    </div>
  </div>

  <!-- Wallet Balance Section -->
  <div class="bg-blue-50 w-1/3 py-3 mt-2 px-4 rounded-2xl">
    <div class="flex items-center justify-between gap-3">
      <div class="block">
        <div class="flex items-center gap-2 mb-1">
          <p class="font-semibold text-base text-gray-500">Available Credit</p>
          <!-- <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4244 8.41187L7.39676 19.9999H0L1.49985 14.299L10.4244 8.41187Z" fill="#072654"/>
            <path d="M17.1411 0L11.887 19.9996H8.28174L11.8311 6.4554L6.39062 10.0417L7.35947 6.47403L17.1411 0Z" fill="#3395FF"/>
          </svg>
          <span class="text-sm font-medium text-gray-800">Razorpay</span>    -->
        </div>
        <p class="font-bold text-xl text-black">${walletBalance.toFixed(2)}</p>
      </div>

      <!-- Add Funds Button -->
      {#if showAddButton}
        <button 
          on:click={toggleAddFunds}
          class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Add
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      {/if}
    </div>
  </div>

  <!-- Payment Providers Section -->
  {#if showPaymentProviders}
    <div class="mt-4 grid grid-cols-4 gap-2 w-1/2 ml-0 rounded-2xl p-6">
      {#each paymentProviders as provider}
        <button class="p-4 rounded-lg text-center border bg-white hover:border-indigo-500 hover:text-indigo-500">
          <div class="text-2xl mb-2">{provider.icon}</div>
          <div class="text-sm">{provider.name}</div>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Add Funds Section -->
  {#if showAddFunds}
  <div
    on:click={handleModalBackdropClick}
    on:keydown={(e) => e.key === "Escape" && closeAddFunds()}
    role="button"
    tabindex="0"
  >
    <div class="w-1/2 ml-0 bg-white rounded-2xl p-6 shadow-lg mt-4 border border-gray-200">
      <div class="flex justify-between items-center border-b border-gray-200 pb-3">
        <h3 class="text-lg font-semibold">Enter Amount</h3>
        <button on:click={closeAddFunds} aria-label="Close" class="float-right">
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg>
        </button>
      </div>

      <!-- Predefined Amount Buttons -->
      <div class="mt-4 grid grid-cols-4 gap-2">
        {#each predefinedAmounts as amount}
          <button 
            on:click={() => selectAmount(amount)}
            class="p-2 rounded-lg text-center border border-gray-200 bg-white hover:border-indigo-500 hover:text-indigo-500 focus:border-indigo-500 focus:text-indigo-500"
            class:border-indigo-500={selectedAmount === amount}
            class:text-indigo-500={selectedAmount === amount}
          >
            {amount}
          </button>
        {/each}
      </div>

      <!-- Custom Amount Input -->
      <input 
        type="number" 
        bind:value={customAmount}
        on:input={handleCustomAmountChange}
        class="w-full mt-4 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
        placeholder="Enter Amount"
        min="1"
      />

      <!-- Coupon Code -->
      <div class="flex items-center gap-2 mt-2">
        <input 
          type="text" 
          bind:value={couponCode}
          class="flex-grow p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Enter Promo Code"
        />
        <button 
          on:click={applyCoupon}
          class="px-4 py-2 bg-blue-50 text-indigo-600 rounded-lg hover:bg-blue-100"
        >
          Apply
        </button>
      </div>

      <!-- Amount Summary -->
      <div class="mt-4 space-y-2">
        <div class="flex justify-between">
          <p class="text-gray-500">Credit</p>
          <p>${baseAmount.toFixed(2)}</p>
        </div>
        <div class="flex justify-between">
          <p class="text-gray-500">Coupon Amount</p>
          <p>${couponAmount.toFixed(2)}</p>
        </div>
        <div class="flex justify-between font-semibold">
          <p>Total</p>
          <p>${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <!-- Pay Button -->
      <button 
        on:click={createOrder}
        class="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        disabled={totalAmount <= 0}
      >
        ${totalAmount.toFixed(2)} Pay with Razorpay
      </button>
    </div>
    </div>
  {/if}

  <!-- Transactions Table -->
  <div class="rounded-xl mt-4 border border-solid border-gray-200 overflow-auto">
    <table class="w-full rounded-xl">
      <thead>
        <tr class="bg-gray-50 text-sm">
          <th class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900">#</th>
          <th class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900">Description</th>
          <th class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900">Amount</th>
          <th class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900">Transaction Type</th>
          <th class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900">Date & Time</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 text-sm font-normal">
        {#each transactions as transaction, index}
          <tr class="hover:bg-gray-50">
            <td class="py-3 pl-4">{index + 1}</td>
            <td class="py-3 pl-4">{transaction.description}</td>
            <td class="py-3 pl-4">
              <span class="font-medium" class:text-green-600={transaction.transactionType === 'credit'} class:text-red-600={transaction.transactionType === 'debit'}>
                {transaction.transactionType === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
            </td>
            <td class="py-3 pl-4">
              <span class="px-2 py-1 text-xs rounded-full" 
                    class:bg-green-100={transaction.transactionType === 'credit'}
                    class:text-green-800={transaction.transactionType === 'credit'}
                    class:bg-red-100={transaction.transactionType === 'debit'}
                    class:text-red-800={transaction.transactionType === 'debit'}>
                {transaction.transactionType === 'credit' ? 'Credit' : 'Debit'}
              </span>
            </td>
            <td class="py-3 pl-4 text-gray-600">{transaction.dateTime}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if transactions.length === 0}
      <div class="text-center py-8 text-gray-500">
        No transactions found
      </div>
    {/if}
  </div>

  <!-- Pagination -->
  <Pagination pagination={{
    total_count: 1,
    offset: 0,
    limit: 10,
    total_pages: 2
  }} handlePageChange={handlePageChange} />

</div>