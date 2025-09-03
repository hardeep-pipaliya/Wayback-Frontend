<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Input from "$lib/components/Input.svelte";
  import RadioButton from "$lib/components/RadioButton.svelte";
  import TextArea from "$lib/components/TextArea.svelte";

  // Types
  interface TicketForm {
    subject: string;
    description: string;
    category: string;
    priority: string;
    username: string;
    email: string;
  }

  // Form state
  let ticketForm: TicketForm = {
    subject: "",
    description: "",
    category: "",
    priority: "",
    username: "",
    email: ""
  };

  // Form validation
  let errors: Partial<TicketForm> = {};
  let isSubmitting = false;

  // Options for radio buttons
  const categoryOptions = [
    "Technical Issue",
    "Billing Issue", 
    "Feature Request",
    "Bug Report"
  ];

  const priorityOptions = [
    "Normal",
    "High", 
    "Urgent"
  ];

  // Functions
  function validateForm(): boolean {
    errors = {};
    
    if (!ticketForm.subject.trim()) {
      errors.subject = "Subject is required";
    }
    
    if (!ticketForm.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!ticketForm.category) {
      errors.category = "Category is required";
    }
    
    if (!ticketForm.priority) {
      errors.priority = "Priority is required";
    }
    
    if (!ticketForm.username.trim()) {
      errors.username = "Username is required";
    }
    
    if (!ticketForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(ticketForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    return Object.keys(errors).length === 0;
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    isSubmitting = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Ticket created:", ticketForm);
      
      // Show success message and redirect
      alert("Ticket created successfully!");
      goto("/tickets");
      
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      isSubmitting = false;
    }
  }

  // Initialize form with default values
  onMount(() => {
    ticketForm.category = categoryOptions[0];
    ticketForm.priority = priorityOptions[0];
  });
</script>

<div class="max-w-7xl mx-auto">
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200">
    <!-- Left Side: Title Section -->
    <div>
      <h3 class="text-2xl font-bold text-gray-900">Support</h3>
      <p class="text-sm text-gray-600">Create Quick Ticket</p>
    </div>

    <!-- Right Side: Back Button -->
    <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
      <button
        on:click={() => goto("/tickets")}
        class="flex items-center hover:border-none cursor-pointer gap-1.5 px-4 py-2 text-sm font-medium border border-black-600 text-white bg-gray-900 border border-gray-900 rounded-lg hover:bg-indigo-700 transition-colors duration-300 "
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.99953 11.78C5.87286 11.78 5.7462 11.7333 5.6462 11.6333L1.29953 7.28668C0.592865 6.58001 0.592865 5.42001 1.29953 4.71335L5.6462 0.36668C5.83953 0.173346 6.15953 0.173346 6.35286 0.36668C6.5462 0.560013 6.5462 0.880013 6.35286 1.07335L2.0062 5.42001C1.6862 5.74001 1.6862 6.26001 2.0062 6.58001L6.35286 10.9267C6.5462 11.12 6.5462 11.44 6.35286 11.6333C6.25286 11.7267 6.1262 11.78 5.99953 11.78Z" fill="white"/>
        </svg>
        Back
      </button>
    </div>
  </div>

  <!-- Ticket Form Container -->
  <div class="grid grid-cols-12 gap-5 pt-6 font-poppins">
    <div class="col-span-12 lg:col-span-8">
      <div class="p-6 border border-gray-200 rounded-2xl bg-white">
        <h5 class="text-xl font-semibold text-gray-900 pb-4 border-b border-gray-200">
          Create Quick Ticket
        </h5>
        <p class="text-sm text-gray-500 mt-2 mb-6">
          Write and address new queries and issues here
        </p>

        <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-6">
          <!-- Subject -->
          <Input
            bind:value={ticketForm.subject}
            label="Subject"
            id="subject"
            name="subject"
            placeholder="Enter ticket subject"
            required={true}
            className="w-full"
          />
          {#if errors.subject}
            <p class="text-red-500 text-sm -mt-4">{errors.subject}</p>
          {/if}

          <!-- Description -->
          <TextArea
            bind:value={ticketForm.description}
            label="Description"
            id="description"
            name="description"
            placeholder="Describe your issue or request in detail"
            required={true}
            containerClass="w-full"
          />
          {#if errors.description}
            <p class="text-red-500 text-sm -mt-4">{errors.description}</p>
          {/if}

          <!-- Category -->
          <RadioButton
            bind:selected={ticketForm.category}
            name="category"
            label="Category"
            options={categoryOptions}
            required={true}
            className="w-full"
          />
          {#if errors.category}
            <p class="text-red-500 text-sm -mt-4">{errors.category}</p>
          {/if}

          <!-- Priority -->
          <RadioButton
            bind:selected={ticketForm.priority}
            name="priority"
            label="Priority"
            options={priorityOptions}
            required={true}
            className="w-full"
          />
          {#if errors.priority}
            <p class="text-red-500 text-sm -mt-4">{errors.priority}</p>
          {/if}

          <!-- Contact Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              bind:value={ticketForm.username}
              label="Username"
              id="username"
              name="username"
              placeholder="Enter your username"
              required={true}
              className="w-full"
            />
            {#if errors.username}
              <p class="text-red-500 text-sm -mt-4">{errors.username}</p>
            {/if}

            <Input
              bind:value={ticketForm.email}
              label="Contact Email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required={true}
              className="w-full"
            />
            {#if errors.email}
              <p class="text-red-500 text-sm -mt-4">{errors.email}</p>
            {/if}
          </div>

          <!-- Submit Button -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              class="flex items-center justify-center gap-1.5 px-6 py-3 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200 w-full md:w-auto"
            >
              {#if isSubmitting}
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              {:else}
                Create Ticket
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
