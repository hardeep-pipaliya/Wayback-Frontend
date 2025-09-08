<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import SortBy from "$lib/components/SortBy.svelte";
    import PerPageSelecter from "$lib/components/PerPageSelecter.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
  
    import { onMount } from "svelte";
  
    type Permission = "create" | "list" | "update" | "view";
  
    type Route = {
      id: string;
      name: string;
      permissions: {
        create: boolean;
        list: boolean;
        update: boolean;
        view: boolean;
      };
      isExpanded: boolean;
      isSelected: boolean;
    };
  
    let routes: Route[] = [
      {
        id: "workspace",
        name: "Workspace",
        permissions: { create: false, list: false, update: false, view: false },
        isExpanded: false,
        isSelected: false,
      },
      {
        id: "domain",
        name: "Domain",
        permissions: { create: false, list: false, update: false, view: false },
        isExpanded: false,
        isSelected: false,
      },
      {
        id: "campaign",
        name: "Campaign",
        permissions: { create: false, list: false, update: false, view: false },
        isExpanded: false,
        isSelected: false,
      },
      {
        id: "ai-provider",
        name: "AI Provider",
        permissions: { create: false, list: false, update: false, view: false },
        isExpanded: false,
        isSelected: false,
      },
      {
        id: "domain-metrics",
        name: "Domain Metrics",
        permissions: { create: false, list: false, update: false, view: false },
        isExpanded: false,
        isSelected: false,
      },
    ];
  
    // Toggle route expansion
    function toggleRoute(routeId: string) {
      routes = routes.map((route) =>
        route.id === routeId ? { ...route, isExpanded: !route.isExpanded } : route
      );
    }
  
    // Handle route selection (select all permissions)
    function toggleRouteSelection(routeId: string) {
      routes = routes.map((route) => {
        if (route.id === routeId) {
          const newSelected = !route.isSelected;
          return {
            ...route,
            isSelected: newSelected,
            permissions: {
              create: newSelected,
              list: newSelected,
              update: newSelected,
              view: newSelected,
            },
          };
        }
        return route;
      });
    }
  
    // Handle individual permission toggle
    function togglePermission(
      routeId: string,
      permission: Permission,
      event: Event
    ) {
      event.stopPropagation();
  
      // Use the input's actual value (since bind:checked already updated it)
      const checked = (event.currentTarget as HTMLInputElement).checked;
  
      routes = routes.map((route) => {
        if (route.id !== routeId) return route;
  
        const updatedPermissions = {
          ...route.permissions,
          [permission]: checked,
        };
  
        // If Create/Update/View is checked -> force List = true
        if (
          (permission === "create" ||
            permission === "update" ||
            permission === "view") &&
          checked
        ) {
          updatedPermissions.list = true;
        }
        // If Create/Update/View is unchecked -> do NOT touch List (stays independent)
        // If List toggled -> only List changes (already handled above)
  
        const allSelected = Object.values(updatedPermissions).every(Boolean);
  
        return {
          ...route,
          permissions: updatedPermissions,
          isSelected: allSelected,
        };
      });
    }
  
    // List is never disabled - users can always click on it
    function isListDisabled(route: Route): boolean {
      return false;
    }
  
    // Get the state of route checkbox (checked, unchecked, or indeterminate)
    function getRouteCheckboxState(
      route: Route
    ): "checked" | "unchecked" | "indeterminate" {
      const permissions = Object.values(route.permissions);
      const allSelected = permissions.every((p) => p);
      const someSelected = permissions.some((p) => p);
  
      if (allSelected) return "checked";
      if (someSelected) return "indeterminate";
      return "unchecked";
    }
  
    // Set indeterminate state for checkboxes
    function setCheckboxState(
      checkbox: HTMLInputElement,
      state: "checked" | "unchecked" | "indeterminate"
    ) {
      if (state === "indeterminate") {
        checkbox.indeterminate = true;
        checkbox.checked = false;
      } else {
        checkbox.indeterminate = false;
        checkbox.checked = state === "checked";
      }
    }
  
    onMount(() => {
      // Set initial indeterminate states
      routes.forEach((route) => {
        const checkbox = document.getElementById(
          `route-${route.id}`
        ) as HTMLInputElement;
        if (checkbox) {
          const state = getRouteCheckboxState(route);
          setCheckboxState(checkbox, state);
        }
      });
    });
  
    // Update checkbox states when routes change
    $: {
      if (typeof window !== "undefined") {
        routes.forEach((route) => {
          const checkbox = document.getElementById(
            `route-${route.id}`
          ) as HTMLInputElement;
          if (checkbox) {
            const state = getRouteCheckboxState(route);
            setCheckboxState(checkbox, state);
          }
        });
      }

    // let searchQuery = "";
    // let sortBy: "";
    // let perPage = 10;

    }
  </script>
  
  <div
    class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200"
  >
    <!-- Left Side: Title Section -->
    <div class="w-full lg:w-1/2 text-center lg:text-left">
      <h3 class="text-lg font-semibold text-black">Roles & Permissions</h3>
      <p class="text-xs text-gray-500">Update role & permission</p>
    </div>

    <!-- Filter Controls -->
    <!-- <SortBy 
    selectedValue={sortBy} 
    on:sortChange={(e) => sortBy = e.detail.value}
  />
  <PerPageSelecter 
    value={perPage} 
    on:change={(e) => perPage = e.detail.value}
    options={[5, 10, 20, 50]}
    label="Show:"
  /> -->

  
    <!-- Right Side: Button -->
    <div
      class="w-full lg:w-1/2 flex justify-center lg:justify-end sm:justify-end md:justify-end"
    >
      <button
        class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer hover:border-none transition-colors duration-300"
      >
        Save
      </button>
    </div>
  </div>
  
  <!-- Permission Section -->
  <div class="mt-4 bg-white rounded-lg border border-gray-200">
    <!-- Content -->
    <div class="p-6">
      <div class="space-y-3">
        {#each routes as route (route.id)}
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <!-- Route Row -->
            <div
              class="flex items-center p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <!-- Checkbox -->
              <div class="flex items-center mr-4">
                <input
                  id="route-{route.id}"
                  type="checkbox"
                  class="h-4 w-4 border-gray-300 rounded cursor-pointer"
                  onchange={(e) => {
                    e.stopPropagation();
                    toggleRouteSelection(route.id);
                  }}
                  onclick={(e) => e.stopPropagation()}
                />
              </div>
  
              <!-- Route Name - Clickable area for expand/collapse -->
              <div 
                class="flex-1 cursor-pointer"
                onclick={() => toggleRoute(route.id)}
                onkeydown={(e) => e.key === "Enter" && toggleRoute(route.id)}
                role="button"
                tabindex="0"
              >
                <span class="text-sm font-medium text-gray-900">{route.name}</span>
              </div>
  
              <!-- Expand/Collapse Icon -->
              <div 
                class="ml-4 cursor-pointer"
                onclick={() => toggleRoute(route.id)}
                onkeydown={(e) => e.key === "Enter" && toggleRoute(route.id)}
                role="button"
                tabindex="0"
              >
                <svg
                  class="h-5 w-5 text-gray-400 transition-transform duration-200 {route.isExpanded
                    ? 'rotate-180'
                    : ''}"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
  
            <!-- Permissions Panel -->
            {#if route.isExpanded}
              <div class="border-t border-gray-200 bg-gray-50 p-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <!-- Create Permission -->
                  <div class="flex items-center space-x-2">
                    <input
                      id="create-{route.id}"
                      type="checkbox"
                      class="h-4 w-4 border-gray-300 rounded"
                      bind:checked={route.permissions.create}
                      onchange={(e) => togglePermission(route.id, "create", e)}
                    />
                    <label
                      for="create-{route.id}"
                      class="text-sm text-gray-700 cursor-pointer"
                    >
                      <span class="font-medium">Create</span>
                    </label>
                  </div>
  
                  <!-- List Permission -->
                  <div class="flex items-center space-x-2">
                    <input
                      id="list-{route.id}"
                      type="checkbox"
                      class="h-4 w-4 border-gray-300 rounded"
                      bind:checked={route.permissions.list}
                      disabled={isListDisabled(route)}
                      onchange={(e) => togglePermission(route.id, "list", e)}
                    />
                    <label
                      for="list-{route.id}"
                      class="text-sm cursor-pointer text-gray-700"
                    >
                      <span class="font-medium">List</span>
                    </label>
                  </div>
  
                  <!-- Update Permission -->
                  <div class="flex items-center space-x-2">
                    <input
                      id="update-{route.id}"
                      type="checkbox"
                      class="h-4 w-4 border-gray-300 rounded"
                      bind:checked={route.permissions.update}
                      onchange={(e) => togglePermission(route.id, "update", e)}
                    />
                    <label
                      for="update-{route.id}"
                      class="text-sm text-gray-700 cursor-pointer"
                    >
                      <span class="font-medium">Update</span>
                    </label>
                  </div>
  
                  <!-- View Permission -->
                  <div class="flex items-center space-x-2">
                    <input
                      id="view-{route.id}"
                      type="checkbox"
                      class="h-4 w-4 border-gray-300 rounded"
                      bind:checked={route.permissions.view}
                      onchange={(e) => togglePermission(route.id, "view", e)}
                    />
                    <label
                      for="view-{route.id}"
                      class="text-sm text-gray-700 cursor-pointer"
                    >
                      <span class="font-medium">View</span>
                    </label>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
  