<script lang="ts">
    import Input from "$lib/components/Input.svelte";
    import ImageUpload from "$lib/components/ImageUpload.svelte";
    // import {
    //   createWorkspace,
    //   getWorkspaceById,
    //   updateWorkspace,
    // } from "$lib/api/workspace";
    // import type {
    //   WorkspaceCreatePayload,
    //   WorkspaceUpdatePayload,
    // } from "$lib/types/workSpace";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { showErrorAlert } from "$lib/utils/sweetAlert";
    import { showToast } from "$lib/utils/sweetAlert";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import RadioButton from "$lib/components/RadioButton.svelte";
    import CheckBox1 from "$lib/components/CheckBox1.svelte";
    import type { PageData } from './$types';

    export let data: PageData;
    const { action, id } = data;
  </script>
  
  <div
    class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
  >
    <!-- Left Side: Title Section -->
    <div class="w-full lg:w-1/2 text-center lg:text-left">
      <h3 class="text-lg font-semibold text-black">Role</h3>
      <p class="text-xs text-gray-500">
        {action === "create" ? "Create new role" : "Update role"}
      </p>
    </div>
  
    <!-- Right Side: Button -->
    <div
      class="w-full lg:w-1/2 flex justify-center lg:justify-end sm:justify-end md:justify-end"
    >
      <button
        onclick={() => goto(`/role`)}
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
  
  <div class="grid grid-cols-12 gap-5 pt-6 font-poppins">
    <div class="col-span-12 lg:col-span-5 2xl:col-span-4">
      <div class="p-4 border border-gray-200 rounded-2xl">
        <h5
          class="text-base font-semibold text-gray-900 pb-4 border-b border-gray-200"
        >
          Role Details
        </h5>
        <form action="#" class="flex flex-col gap-4 pt-4">
          <div class="flex flex-col md:flex-row items-start gap-3">
            <div class="block w-full">
              <Input
                label="Name"
                placeholder="Enter Name"
                className="w-full"
                type="text"
                id="name"
                name="name"
                required={true}
              />
            </div>
          </div>
         
          <div class="flex flex-col md:flex-row items-start gap-3">
            <button
              type="submit"
              class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              {action === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  