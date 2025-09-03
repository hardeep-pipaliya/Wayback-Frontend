<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  // Types
  interface Ticket {
    id: string;
    ticketId: string;
    subject: string;
    description: string;
    category: string;
    priority: "low" | "normal" | "high" | "urgent";
    status: "open" | "closed" | "pending" | "resolved";
    username: string;
    email: string;
    dateCreated: string;
    lastUpdated: string;
  }

  interface Message {
    id: string;
    content: string;
    timestamp: string;
    sender: "user" | "support";
    isError?: boolean;
  }

  interface Rating {
    value: number;
    emoji: string;
    label: string;
  }

  // Props
  export let data: { ticket?: Ticket };

  // State
  let ticket: Ticket | null = null;
  let messages: Message[] = [];
  let newMessage = "";
  let isConnected = false;
  let isLoading = true;
  let showRating = false;
  let selectedRating: Rating | null = null;

  // Computed values
  $: ticketId = $page.params.id;
  $: canSendMessage = newMessage.trim().length > 0 && isConnected;

  // Rating options
  const ratingOptions: Rating[] = [
    { value: 1, emoji: "😖", label: "Very Poor" },
    { value: 2, emoji: "😒", label: "Poor" },
    { value: 3, emoji: "😐", label: "Neutral" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "😍", label: "Excellent" },
  ];

  // Priority colors
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    normal: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  // Status colors
  const statusColors = {
    open: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    resolved: "bg-blue-100 text-blue-800",
  };

  // Functions

  function handleSendMessage() {
    if (!canSendMessage) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      timestamp: new Date().toLocaleString(),
      sender: "user",
    };

    messages = [...messages, message];
    newMessage = "";

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thank you for your message. Our support team will get back to you shortly.",
        timestamp: new Date().toLocaleString(),
        sender: "support",
      };
      messages = [...messages, supportMessage];
    }, 1000);
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  function handleRatingSelect(rating: Rating) {
    selectedRating = rating;
    showRating = false;

    // Simulate rating submission
    setTimeout(() => {
      alert(`Thank you for your ${rating.label} rating!`);
      selectedRating = null;
    }, 500);
  }

  function getPriorityColor(priority: string): string {
    return (
      priorityColors[priority as keyof typeof priorityColors] ||
      "bg-gray-100 text-gray-800"
    );
  }

  function getStatusColor(status: string): string {
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  }

  // Initialize
  onMount(async () => {
    try {
      // Simulate API call to fetch ticket
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock ticket data
      ticket = {
        id: ticketId || "1",
        ticketId: "TICKET33894485",
        subject: "Technical Support Request",
        description:
          "I'm experiencing issues with the application. Please help me resolve this.",
        category: "Technical Issue",
        priority: "normal",
        status: "open",
        username: "john_doe",
        email: "john@example.com",
        dateCreated: "2025-01-15",
        lastUpdated: "2025-01-15",
      };

      // Mock initial messages
      messages = [
        {
          id: "1",
          content: "Hello! I need help with a technical issue.",
          timestamp: "2025-01-15, 10:30:00 AM",
          sender: "user",
        },
        {
          id: "2",
          content:
            "Hi! I'm here to help. Could you please describe the issue in detail?",
          timestamp: "2025-01-15, 10:32:00 AM",
          sender: "support",
        },
      ];

      isConnected = true;
      isLoading = false;
    } catch (error) {
      console.error("Error loading ticket:", error);
      messages = [
        {
          id: "error",
          content: "Failed to load ticket. Please refresh the page.",
          timestamp: new Date().toLocaleString(),
          sender: "support",
          isError: true,
        },
      ];
      isLoading = false;
    }
  });

  onDestroy(() => {
    // Cleanup any subscriptions or timers
  });
</script>

<div class="max-w-7xl mx-auto">
  <!-- Header Section -->
  <div
    class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
  >
    <!-- Left Side: Title Section -->
    <div>
      <h3 class="text-2xl font-bold text-gray-900">Support</h3>
    </div>

    <!-- Right Side: Back Button -->
    <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
      <button
        on:click={() => goto("/tickets")}
        class="flex items-center hover:border-none cursor-pointer gap-1.5 px-4 py-2 text-sm font-medium border border-black-600 text-white bg-gray-900 border border-gray-900 rounded-lg hover:bg-indigo-700 transition-colors duration-300 "
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
        Back to Tickets
      </button>
    </div>
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="flex items-center justify-center py-20">
      <div class="text-center">
        <svg
          class="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-600">Loading ticket...</p>
      </div>
    </div>
  {:else if ticket}
    <div class="grid grid-cols-12 gap-6 pt-6">
      <!-- Chat Section -->
      <div class="col-span-12 lg:col-span-8">
        <div
          class="bg-white border border-gray-200 rounded-2xl overflow-hidden"
        >
          <!-- Chat Header -->
          <div
            class="bg-white border-b border-gray-200 p-6 flex items-center justify-between"
          >
            <div class="flex items-center">
              <div
                class="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Wayback Support
                </h2>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p class="text-sm text-green-600">
                    {isConnected ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <button aria-label="Close chat"
              class="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Chat Messages -->
          <div class="h-96 overflow-y-auto p-6 space-y-4">
            {#each messages as message}
              <div
                class="flex {message.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'} mb-4"
              >
                <div class="max-w-[70%]">
                  <div
                    class="rounded-lg py-3 px-4 {message.isError
                      ? 'bg-red-100 text-red-800'
                      : message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-800'}"
                  >
                    <p class="text-sm">{message.content}</p>
                    <span
                      class="text-xs {message.sender === 'user'
                        ? 'text-indigo-200'
                        : 'text-gray-500'} mt-2 block"
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Chat Input -->
          <div class="p-6 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center gap-3">
              <input
                type="text"
                bind:value={newMessage}
                on:keypress={handleKeyPress}
                placeholder="Type your message here..."
                class="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!isConnected}
              />
              <button aria-label="Send message"
                on:click={handleSendMessage}
                disabled={!canSendMessage}
                class="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ticket Details Section -->
      <div class="col-span-12 lg:col-span-4">
        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Ticket Details</h2>
            <button aria-label="Close details"
              class="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- Basic Info -->
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Ticket ID</span>
                <span class="text-sm font-semibold text-gray-900"
                  >{ticket.ticketId}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Subject</span>
                <span
                  class="text-sm font-semibold text-gray-900 max-w-[150px] text-right"
                  >{ticket.subject}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Category</span>
                <span class="text-sm font-semibold text-gray-900"
                  >{ticket.category}</span
                >
              </div>
              <div class="flex justify-between items-start">
                <span class="text-sm text-gray-600">Description</span>
                <span
                  class="text-sm font-semibold text-gray-900 max-w-[150px] text-right"
                  >{ticket.description}</span
                >
              </div>
            </div>

            <!-- Status & Priority -->
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Status</span>
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full {getStatusColor(
                    ticket.status
                  )}"
                >
                  {ticket.status}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Priority</span>
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full {getPriorityColor(
                    ticket.priority
                  )}"
                >
                  {ticket.priority}
                </span>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="space-y-3">
              <h3 class="text-sm font-medium text-gray-700">
                Contact Information
              </h3>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Username</span>
                <span class="text-sm font-semibold text-gray-900"
                  >{ticket.username}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Email</span>
                <span class="text-sm font-semibold text-gray-900"
                  >{ticket.email}</span
                >
              </div>
            </div>

            <!-- Dates -->
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Created</span>
                <span class="text-sm font-semibold text-gray-900"
                  >{ticket.dateCreated}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Updated</span>
                <span class="text-sm font-semibold text-gray-900"
                  >{ticket.lastUpdated}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rating Section -->
    {#if showRating}
      <div
        class="fixed inset-0 bg-opacity-50 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl p-8 max-w-md mx-4">
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Rate Your Experience
            </h3>
            <p class="text-gray-600 mb-6">
              How would you rate your conversation with our support team?
            </p>

            <div class="flex justify-center space-x-4 mb-6">
              {#each ratingOptions as rating}
                <button
                  on:click={() => handleRatingSelect(rating)}
                  class="text-4xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-2"
                  title={rating.label}
                >
                  {rating.emoji}
                </button>
              {/each}
            </div>

            <button
              on:click={() => (showRating = false)}
              class="text-gray-500 hover:text-gray-700 text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Rating Trigger -->
    <div class="mt-6 text-center">
      <button
        on:click={() => (showRating = true)}
        class="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
       >
        Rate Your Experience
      </button>
    </div>
  {/if}
</div>
