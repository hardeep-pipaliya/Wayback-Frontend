<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // Form data
  let formData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: null as File | null
  };

  // File upload state
  let selectedFile: File | null = null;
  let imagePreview: string | null = null;
  let showCropControls = false;

  // Handle file selection
  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      selectedFile = file;
      formData.profileImage = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview = e.target?.result as string;
        showCropControls = true;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle form submission
  function handleSubmit() {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically send the data to your API
    console.log("Form data:", formData);
    
    // Dispatch event for parent component handling
    dispatch("submit", formData);
  }

  // Reset image
  function resetImage() {
    selectedFile = null;
    imagePreview = null;
    showCropControls = false;
    formData.profileImage = null;
    
    // Reset file input
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  // Crop image (placeholder function)
  function cropImage() {
    // Implement image cropping logic here
    console.log("Crop image functionality");
  }
</script>

<div>
  <div class="flex flex-collg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200">
      <!-- Left Side: Title Section -->
      <div>
        <h3 class="text-lg font-semibold text-black">Users</h3>
        <p class="text-xs text-gray-500">Create new user</p>
      </div>

      <!-- Right Side: Buttons and Search -->
    <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
      <!-- Back Button -->
        <a
          href="/users/"
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
            ></path>
          </svg>
          Back
        </a>
      </div>
    </div>

  <!-- Form Section -->
    <div class="grid grid-cols-12 gap-5 pt-6 font-poppins">
      <div class="col-span-12 lg:col-span-4">
      <div class="p-4 border border-gray-200 rounded-lg">
        <h5 class="text-base font-semibold text-gray-900 pb-4 border-b border-gray-200">
            User
          </h5>

        <form class="flex flex-col gap-4 pt-4" on:submit|preventDefault={handleSubmit}>
          <!-- First Name -->
            <div class="flex flex-col md:flex-row items-start gap-3">
              <div class="block w-full">
              <Input
                bind:value={formData.firstName}
                label="First Name"
                  id="first-name-input"
                  name="first_name"
                  placeholder="First Name"
                required={true}
                type="text"
                className="w-full"
                />
              </div>
            </div>

          <!-- Last Name -->
            <div class="flex flex-col md:flex-row items-start gap-3">
              <div class="block w-full">
              <Input
                bind:value={formData.lastName}
                label="Last Name"
                  id="last-name-input"
                  name="last_name"
                  placeholder="Last Name"
                required={true}
                className="w-full"
                type="text"
                />
              </div>
            </div>

          <!-- Email -->
            <div class="flex flex-col md:flex-row items-start gap-3">
              <div class="block w-full">
              <Input
                bind:value={formData.email}
                label="E-Mail"
                  id="email-input"
                  name="email"
                  placeholder="E-Mail"
                required={true}
                className="w-full"
                type="email"
                />
              </div>
            </div>

          <!-- Password -->
            <div class="flex flex-col md:flex-row items-start gap-3">
              <div class="block w-full">
              <Input
                bind:value={formData.password}
                label="Password"
                id="password-input"
                  name="password"
                  placeholder="Password"
                required={false}
                type="password"
                className="w-full"
                />
              </div>
            </div>

          <!-- Profile Image Upload -->
            <div class="flex flex-col md:flex-row items-start gap-3">
              <div class="block w-full">
                <label class="mb-2 text-sm font-medium text-gray-600 w-full flex items-center">
                Profile Image
                </label>

              <!-- Image Upload Area -->
              <div class="w-full py-9 bg-gray-50 rounded-2xl border-2 border-gray-300 gap-3 grid border-dashed">
                  <!-- Upload and Preview Section -->
                  <div class="grid gap-1">
                    <!-- Icon and Info -->
                  <div class="text-center" class:hidden={imagePreview !== null}>
                      <svg
                        class="mx-auto"
                        width="41"
                        height="40"
                        viewBox="0 0 41 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.4974 28.333V18.333L12.1641 21.6663"
                          stroke="#4F46E5"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M15.5 18.333L18.8333 21.6663"
                          stroke="#4F46E5"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M37.1693 16.6663V24.9997C37.1693 33.333 33.8359 36.6663 25.5026 36.6663H15.5026C7.16927 36.6663 3.83594 33.333 3.83594 24.9997V14.9997C3.83594 6.66634 7.16927 3.33301 15.5026 3.33301H23.8359"
                          stroke="#4F46E5"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M37.1693 16.6663H30.5026C25.5026 16.6663 23.8359 14.9997 23.8359 9.99967V3.33301L37.1693 16.6663Z"
                          stroke="#4F46E5"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <h2 class="text-gray-600 text-sm leading-4 pt-2 pb-2">
                        Drag logo here
                      </h2>
                    <span class="text-gray-400 font-normal text-sm">OR</span>
                    </div>

                  <!-- Image Preview Section -->
                    <div class="flex flex-col items-center justify-center mt-0">
                    {#if imagePreview}
                      <div class="relative w-64 h-64 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          class="object-cover w-full h-full"
                        />
                      </div>
                    {/if}

                      <!-- File Input -->
                      <label class="mt-4">
                        <input
                          type="file"
                          id="file-input"
                          accept="image/*"
                          name="profile_image"
                        on:change={handleFileSelect}
                        hidden
                        />

                      <div class="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-lg shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                          Choose File
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- Crop Controls (visible after upload) -->
                {#if showCropControls}
                  <div class="flex items-center justify-center gap-2 mt-2">
                    <button
                      type="button"
                      class="px-4 py-2 bg-indigo-600 text-xs text-white rounded-md"
                      on:click={cropImage}
                    >
                      Crop
                    </button>
                    <button
                      type="button"
                      class="px-4 py-2 bg-red-600 text-white text-xs rounded-md"
                      on:click={resetImage}
                    >
                      Reset
                    </button>
                  </div>
                {/if}
                </div>
              </div>
            </div>

          <!-- Submit Button -->
            <div class="flex flex-col md:flex-row items-start gap-3">
              <button
              type="submit"
                class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

