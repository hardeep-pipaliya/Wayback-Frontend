<script lang="ts">
   import { sidebarStore } from "$lib/stores/sidebar";
   import { goto } from "$app/navigation";
  
    // State variables
    let profileOpen = false;
    let mobileDropdownOpen = false;
    let workspaceOpen = false;
    let notificationDropdownOpen = false;
  
    export let userName: string = "Ronald";
    export let userRole: string = "Project Manager";
  
    // Sample notifications data
    let notifications = [
      {
        id: 1,
        title: "New project assigned to you",
        time: "2 min ago",
        type: "update",
        isRead: false,
      },
      {
        id: 2,
        title: "Team meeting scheduled for tomorrow",
        time: "1 hour ago",
        type: "info",
        isRead: false,
      },
      {
        id: 3,
        title: "Code review completed",
        time: "3 hours ago",
        type: "success",
        isRead: true,
      },
      {
        id: 4,
        title: "System maintenance tonight",
        time: "1 day ago",
        type: "warning",
        isRead: true,
      },
      {
        id: 5,
        title: "Welcome to the team!",
        time: "2 days ago",
        type: "info",
        isRead: true,
      },
    ];
  
    // Function to close all dropdowns
    function closeAllDropdowns() {
      profileOpen = false;
      mobileDropdownOpen = false;
      workspaceOpen = false;
      notificationDropdownOpen = false;
    }
  
    // Toggle functions that close others when opening
    function toggleWorkspace(event: MouseEvent | KeyboardEvent) {
      event.stopPropagation();
      if (workspaceOpen) {
        workspaceOpen = false;
      } else {
        closeAllDropdowns();
        workspaceOpen = true;
      }
    }
  
    function toggleProfile(event: MouseEvent | KeyboardEvent) {
      event.stopPropagation();
      if (profileOpen) {
        profileOpen = false;
      } else {
        closeAllDropdowns();
        profileOpen = true;
      }
    }
  
    function toggleMobileDropdown(event: MouseEvent | KeyboardEvent) {
      event.stopPropagation();
      if (mobileDropdownOpen) {
        mobileDropdownOpen = false;
      } else {
        closeAllDropdowns();
        mobileDropdownOpen = true;
      }
    }
  
    function toggleNotificationDropdown(event: MouseEvent | KeyboardEvent) {
      event.stopPropagation();
      if (notificationDropdownOpen) {
        notificationDropdownOpen = false;
      } else {
        closeAllDropdowns();
        notificationDropdownOpen = true;
      }
    }
  
    // Mark all notifications as read
    function markAllAsRead() {
      notifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
    }
  
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;
  
      const target = event.target as HTMLElement;
  
      // Close workspace dropdown if clicking outside
      if (workspaceOpen && !target.closest(".workspace-container")) {
        workspaceOpen = false;
      }
  
      // Close profile dropdown if clicking outside
      if (profileOpen && !target.closest(".profile-container")) {
        profileOpen = false;
      }
  
      // Close notification dropdown if clicking outside
      if (
        notificationDropdownOpen &&
        !target.closest(".notification-container")
      ) {
        notificationDropdownOpen = false;
      }
  
      // Close mobile dropdown if clicking outside
      if (mobileDropdownOpen && !target.closest(".mobile-dropdown-container")) {
        mobileDropdownOpen = false;
      }
    };
  </script>
  
  <!-- Add global click listener -->
  <svelte:window on:click={handleClickOutside} />
  
  <header
    class="flex items-center justify-between gap-1 sm:gap-6 py-3.5 px-6 border-b border-solid border-gray-200 fixed z-20 top-0 max-lg:left-0 bg-white lg:fixed right-0 transition-all duration-300 ease-in-out"
  class:lg:w-[calc(100%-270px)]={$sidebarStore.isSidebarOpen} 
  class:lg:w-[calc(100%-96px)]={!$sidebarStore.isSidebarOpen}
  >
    <!-- Left section -->
    <div class="relative flex items-center">
      <!-- Mobile menu button -->
      <button
        class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 lg:hidden"
        aria-label="Toggle sidebar menu"
        on:click={() => $sidebarStore.toggleSidebarMenu()}
      >
        <img
          src="/images/menu-icon.svg"
          alt="Menu icon"
          class="rotate-180"
        />
      </button>
  
      <!-- Welcome section -->
      <div class="block max-lg:pl-6">
        <h6
          class="text-sm sm:text-lg font-semibold text-gray-900 whitespace-nowrap mb-1.5"
        >
          Welcome back,
          <span class="text-indigo-600 text-base sm:text-lg font-semibold">
            {userName}!
          </span>
        </h6>
        <nav aria-label="Breadcrumb">
          <ol class="flex text-xs font-medium text-gray-900 space-x-3">
            <li>
              <a href="/home" class="text-blue-600 hover:text-blue-800">Home</a>
            </li>
            <li>
              <svg
                width="6"
                height="20"
                viewBox="0 0 6 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.25 1.13672L1.12433 18.8633"
                  stroke="#E5E7EB"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </li>
            <li>
              <span class="text-gray-500">Team</span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  
    <!-- Right section - Desktop view -->
    <div class="max-sm:hidden flex flex-row items-center gap-1 sm:gap-6">
    <div class="flex items-center">
        <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 rounded-2xl hover:bg-gray-200">
            <!-- Status indicator dot -->
            <span class="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            <!-- Text label -->
            <span class="ml-1 text-green-500 cursor-pointer">Smooth</span>
            <!-- Your custom SVG logo -->
             -
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="ml-1">
                <path d="M15.9162 15.2747H1.77148V16H15.9162V15.2747Z" fill="black"></path>
                <path d="M15.3789 13.8796H2.32227V14.884H15.3789V13.8796Z" fill="black"></path>
                <path d="M15.2272 2.44116H2.24023V3.83611H15.2272V2.44116Z" fill="black"></path>
                <path d="M8.73197 0L1.93164 1.59025L2.3222 2.02268H8.73197H15.1418L15.5323 1.59025L8.73197 0Z" fill="black"></path>
                <path d="M4.11387 8.25216C4.10267 7.56708 4.08493 6.88197 4.05809 6.19736C4.03283 5.55232 3.99126 4.90792 3.95988 4.26308C3.95717 4.2074 3.93358 4.19537 3.88739 4.18528C3.69714 4.14381 3.50589 4.12432 3.31383 4.12402C3.12178 4.12432 2.93053 4.14381 2.74028 4.18528C2.69409 4.19534 2.6705 4.2074 2.66779 4.26308C2.63641 4.90792 2.59484 5.55232 2.56957 6.19736C2.54274 6.88197 2.52496 7.56708 2.5138 8.25216C2.50588 8.73766 2.51079 9.22353 2.51848 9.70916C2.52697 10.2479 2.53893 10.7868 2.56075 11.3251C2.58414 11.9028 2.6203 12.4801 2.65202 13.0575C2.6581 13.1681 2.66943 13.2785 2.67808 13.386C2.89126 13.4415 3.10263 13.4735 3.31387 13.4762C3.52511 13.4735 3.73644 13.4415 3.94965 13.386C3.95831 13.2785 3.9696 13.1681 3.97568 13.0575C4.0074 12.4801 4.04356 11.9028 4.06695 11.3251C4.08877 10.7868 4.10074 10.2479 4.10922 9.70916C4.11688 9.22353 4.12182 8.73766 4.11387 8.25216Z" fill="black"></path>
                <path d="M7.64903 8.25216C7.63783 7.56708 7.62005 6.88197 7.59322 6.19736C7.56792 5.55232 7.52635 4.90792 7.495 4.26308C7.4923 4.2074 7.46874 4.19537 7.42252 4.18528C7.2323 4.14381 7.04101 4.12432 6.84899 4.12402C6.65694 4.12432 6.46568 4.14381 6.27543 4.18528C6.22925 4.19534 6.20566 4.2074 6.20295 4.26308C6.1716 4.90792 6.13 5.55232 6.10473 6.19736C6.0779 6.88197 6.06012 7.56708 6.04896 8.25216C6.04104 8.73766 6.04595 9.22353 6.0536 9.70916C6.06212 10.2479 6.07405 10.7868 6.09588 11.3251C6.1193 11.9028 6.15543 12.4801 6.18714 13.0575C6.19322 13.1681 6.20455 13.2785 6.21317 13.386C6.42638 13.4415 6.63775 13.4735 6.84896 13.4762C7.0602 13.4735 7.27153 13.4415 7.48474 13.386C7.49336 13.2785 7.50469 13.1681 7.51078 13.0575C7.54246 12.4801 7.57861 11.9028 7.60201 11.3251C7.62383 10.7868 7.63579 10.2479 7.64431 9.70916C7.65203 9.22353 7.65695 8.73766 7.64903 8.25216Z" fill="black"></path>
                <path d="M11.7545 8.25216C11.7433 7.56708 11.7256 6.88197 11.6987 6.19736C11.6734 5.55232 11.6318 4.90792 11.6005 4.26308C11.5978 4.2074 11.5742 4.19537 11.528 4.18528C11.3378 4.14381 11.1465 4.12432 10.9545 4.12402C10.7624 4.12432 10.5712 4.14381 10.3809 4.18528C10.3347 4.19534 10.3111 4.2074 10.3084 4.26308C10.2771 4.90792 10.2355 5.55232 10.2102 6.19736C10.1834 6.88197 10.1656 7.56708 10.1544 8.25216C10.1465 8.73766 10.1514 9.22353 10.1591 9.70916C10.1676 10.2479 10.1796 10.7868 10.2014 11.3251C10.2248 11.9028 10.2609 12.4801 10.2926 13.0575C10.2988 13.1681 10.3101 13.2785 10.3187 13.386C10.5319 13.4415 10.7432 13.4735 10.9545 13.4762C11.1657 13.4735 11.377 13.4415 11.5902 13.386C11.5989 13.2785 11.6102 13.1681 11.6163 13.0575C11.648 12.4801 11.6841 11.9028 11.7075 11.3251C11.7293 10.7868 11.7413 10.2479 11.7498 9.70916C11.7575 9.22353 11.7624 8.73766 11.7545 8.25216Z" fill="black"></path>
                <path d="M15.1959 8.25216C15.1847 7.56708 15.167 6.88197 15.1401 6.19736C15.1148 5.55232 15.0733 4.90792 15.0419 4.26308C15.0392 4.2074 15.0156 4.19537 14.9694 4.18528C14.7792 4.14381 14.5879 4.12432 14.3959 4.12402C14.2038 4.12432 14.0126 4.14381 13.8223 4.18528C13.7761 4.19534 13.7526 4.2074 13.7499 4.26308C13.7185 4.90792 13.6769 5.55232 13.6516 6.19736C13.6248 6.88197 13.607 7.56708 13.5958 8.25216C13.5879 8.73766 13.5928 9.22353 13.6005 9.70916C13.609 10.2479 13.621 10.7868 13.6428 11.3251C13.6662 11.9028 13.7024 12.4801 13.734 13.0575C13.7402 13.1681 13.7515 13.2785 13.7601 13.386C13.9733 13.4415 14.1847 13.4735 14.3959 13.4762C14.6071 13.4735 14.8185 13.4415 15.0316 13.386C15.0403 13.2785 15.0516 13.1681 15.0577 13.0575C15.0894 12.4801 15.1256 11.9028 15.1489 11.3251C15.1708 10.7868 15.1827 10.2479 15.1912 9.70916C15.1989 9.22353 15.2039 8.73766 15.1959 8.25216Z" fill="black"></path>
            </svg> 
        </button>
    </div>
    <!-- Notification -->
      <div class="relative inline-block text-left notification-container">
        <div class="bg-violet-100 hover:bg-violet-200 transition-colors duration-300
         rounded-full">
          <button
            class="flex items-center gap-3 cursor-pointer"
            aria-expanded={notificationDropdownOpen}
            aria-haspopup="true"
            aria-label="Toggle notifications"
            on:click={toggleNotificationDropdown}
          >
            <div class="p-3 relative">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.99023 4.89062V7.35113"
                  stroke="#4F46E5"
                  stroke-width="1.10833"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <path
                  d="M9.01472 1.6123C6.29561 1.6123 4.09372 3.81419 4.09372 6.5333V8.08497C4.09372 8.58742 3.88683 9.34108 3.62822 9.76964L2.68983 11.3361C2.1135 12.304 2.5125 13.3828 3.5765 13.7375C7.10838 14.9123 10.9284 14.9123 14.4603 13.7375C15.4578 13.405 15.8864 12.2375 15.347 11.3361L14.4086 9.76964C14.15 9.34108 13.9431 8.58003 13.9431 8.08497V6.5333C13.9357 3.82897 11.7191 1.6123 9.01472 1.6123Z"
                  stroke="#4F46E5"
                  stroke-width="1.10833"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <path
                  d="M11.4522 14.0381C11.4522 15.3903 10.3439 16.4986 8.99175 16.4986C8.31936 16.4986 7.69869 16.2178 7.25536 15.7745C6.81203 15.3311 6.53125 14.7105 6.53125 14.0381"
                  stroke="#4F46E5"
                  stroke-width="1.10833"
                  stroke-miterlimit="10"
                />
              </svg>
              <div
                class="absolute text-[10px] -top-1 -right-1 text-white bg-indigo-600 text-center w-4 h-4 rounded-full flex items-center justify-center"
              >
                {notifications.filter((n) => !n.isRead).length}
              </div>
            </div>
          </button>
  
          {#if notificationDropdownOpen}
            <div
              class="absolute right-0 mt-2 z-10 w-96 rounded-2xl font-poppins shadow-lg bg-white focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              tabindex="-1"
              on:click={(e) => e.stopPropagation()}
              on:keydown={(e) => e.stopPropagation()}
            >
              <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-sm font-semibold text-gray-800">
                    Notifications
                  </h2>
                  <button
                    class="text-xs flex hover:text-indigo-600"
                    on:click={markAllAsRead}
                  >
                    <svg
                      class="mr-2 mt-0.5"
                      width="16"
                      height="11"
                      viewBox="0 0 16 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.10723 6.99725C7.15662 7.04061 7.21409 7.07377 7.27634 7.09484C7.3386 7.1159 7.4044 7.12445 7.46997 7.11999C7.53554 7.11553 7.59957 7.09815 7.6584 7.06884C7.71723 7.03954 7.76968 6.99889 7.81273 6.94924L12.1162 2.01724C12.2034 1.91732 12.2473 1.78686 12.2383 1.65455C12.2293 1.52225 12.1682 1.39893 12.0682 1.31174C11.9683 1.22455 11.8378 1.18063 11.7055 1.18963C11.5732 1.19863 11.4499 1.25982 11.3627 1.35974L7.05923 6.29174C7.01594 6.34116 6.98282 6.39864 6.96179 6.46089C6.94077 6.52313 6.93224 6.58891 6.9367 6.65446C6.94116 6.72001 6.95852 6.78404 6.98778 6.84286C7.01705 6.90168 7.05764 6.95415 7.10723 6.99725Z"
                        fill="#4F46E5"
                      />
                      <path
                        d="M14.6866 0.926738L7.65062 8.99024L4.24962 5.21474C4.16084 5.11615 4.03653 5.05686 3.90404 5.04992C3.77154 5.04298 3.64172 5.08896 3.54312 5.17774C3.44453 5.26652 3.38524 5.39083 3.3783 5.52333C3.37136 5.65582 3.41734 5.78565 3.50612 5.88424L5.49062 8.08724L4.70462 8.98974L1.30462 5.21524C1.21584 5.11664 1.09153 5.05736 0.959036 5.05042C0.826542 5.04348 0.696718 5.08946 0.598123 5.17824C0.499529 5.26702 0.440241 5.39133 0.433302 5.52383C0.426364 5.65632 0.472342 5.78615 0.561123 5.88474L4.33912 10.0782C4.43412 10.1832 4.56912 10.2437 4.71062 10.2437H4.71462C4.7854 10.2432 4.85525 10.2276 4.91956 10.1981C4.98386 10.1685 5.04115 10.1256 5.08762 10.0722L6.16462 8.83574L7.28462 10.0787C7.37962 10.1837 7.51462 10.2442 7.65612 10.2442H7.66012C7.7309 10.2437 7.80075 10.2281 7.86506 10.1986C7.92936 10.169 7.98665 10.1261 8.03312 10.0727L15.4401 1.58374C15.4852 1.53456 15.5199 1.47686 15.5423 1.41406C15.5647 1.35125 15.5743 1.2846 15.5706 1.21802C15.5668 1.15144 15.5498 1.08629 15.5205 1.02639C15.4912 0.966489 15.4502 0.913056 15.3999 0.869233C15.3497 0.82541 15.2912 0.792083 15.2278 0.771213C15.1645 0.750343 15.0976 0.742352 15.0312 0.747711C15.0647 0.753069 15.1 0.771668 15.1408 0.802413C15.1816 0.833159 15.2292 0.87543 15.2866 0.926738Z"
                        fill="#4F46E5"
                      />
                    </svg>
                    Mark all as Read
                  </button>
                </div>
                <hr class="my-3 h-px bg-gray-200 border-0" />
  
                <ul class="space-y-3 text-sm mt-3">
                  {#each notifications as notification}
                    <li
                      class="p-3 border-b border-gray-200 hover:bg-violet-200 transition-colors duration-300"
                      class:bg-violet-100={notification.type === "update"}
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.834 6.66699C17.2147 6.66699 18.334 5.5477 18.334 4.16699C18.334 2.78628 17.2147 1.66699 15.834 1.66699C14.4533 1.66699 13.334 2.78628 13.334 4.16699C13.334 5.5477 14.4533 6.66699 15.834 6.66699Z"
                              stroke="#6F767E"
                              stroke-width="1.25"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M11.666 1.66699H7.49935C3.33268 1.66699 1.66602 3.33366 1.66602 7.50033V12.5003C1.66602 16.667 3.33268 18.3337 7.49935 18.3337H12.4993C16.666 18.3337 18.3327 16.667 18.3327 12.5003V8.33366"
                              stroke="#6F767E"
                              stroke-width="1.25"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <p
                            class="text-gray-700 ml-2"
                            class:text-indigo-600={notification.type === "update"}
                            class:font-medium={notification.type === "update"}
                          >
                            {notification.title}
                          </p>
                        </div>
                        <span class="text-gray-500 flex items-center">
                          {notification.time}
                          {#if !notification.isRead}
                            <svg
                              class="ml-1"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="4" cy="4" r="4" fill="#4F46E5" />
                            </svg>
                          {/if}
                        </span>
                      </div>
                    </li>
                  {/each}
                </ul>
                <button
                  class="w-full mt-2 items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 cursor-pointer"
                  on:click={() => goto("/notifications")}
                  on:click={() => notificationDropdownOpen = false}
                  >
                  See all notifications
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>
      <!-- Profile -->
      <div class="relative inline-block text-left profile-container">
        <button
          class="flex gap-2 items-center py-2 text-sm font-medium text-gray-700  cursor-pointer"
          aria-expanded={profileOpen}
          aria-haspopup="true"
          aria-label="Toggle profile menu"
          on:click={toggleProfile}
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center"
          >
            <img src="/images/ronald.png" alt="user avatar icon" />
          </div>
        </button>
  
        {#if profileOpen}
          <div
            class="absolute font-poppins right-10 mt-2 z-10 w-80 rounded-2xl shadow-lg bg-white focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            tabindex="-1"
            on:click={(e) => e.stopPropagation()}
            on:keydown={(e) => e.stopPropagation()}
          >
            <div class="flex items-center p-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-600"
              >
                <img src="/images/ronald.png" alt="user avatar icon" />
              </div>
              <div class="block text-left ml-4">
                <p class="font-semibold text-sm text-black mb-0.5">
                  {userName}
                </p>
                <p class="font-medium text-xs text-gray-500">{userRole}</p>
              </div>
            </div>
            <div class="px-4 pb-3"> 
              <button
                class="flex items-center justify-between w-full px-4 py-3 mt-1 mb-1 text-sm rounded-xl text-gray-700 bg-violet-100 hover:bg-violet-200 cursor-pointer transition-colors duration-300"
                role="menuitem"
                aria-label="Go to My Account"
              >
                <div class="flex items-center">
                  <svg
                    width="34"
                    height="35"
                    viewBox="0 0 34 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect y="0.5" width="34" height="34" rx="17" fill="#4F46E5" />
                    <path
                      d="M17.0842 18.5854C17.0317 18.5779 16.9642 18.5779 16.9042 18.5854C15.5842 18.5404 14.5342 17.4604 14.5342 16.1329C14.5342 14.7754 15.6292 13.6729 16.9942 13.6729C18.3517 13.6729 19.4542 14.7754 19.4542 16.1329C19.4467 17.4604 18.4042 18.5404 17.0842 18.5854Z"
                      stroke="white"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22.0495 23.5359C20.7145 24.7584 18.9445 25.5009 16.9945 25.5009C15.0445 25.5009 13.2745 24.7584 11.9395 23.5359C12.0145 22.8309 12.4645 22.1409 13.267 21.6009C15.322 20.2359 18.682 20.2359 20.722 21.6009C21.5245 22.1409 21.9745 22.8309 22.0495 23.5359Z"
                      stroke="white"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.9941 25.5005C21.1363 25.5005 24.4941 22.1426 24.4941 18.0005C24.4941 13.8584 21.1363 10.5005 16.9941 10.5005C12.852 10.5005 9.49414 13.8584 9.49414 18.0005C9.49414 22.1426 12.852 25.5005 16.9941 25.5005Z"
                      stroke="white"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <a href="/user-profile/" class="block text-left ml-4">
                  <div class="block text-left ml-4">
                    <p class="font-semibold text-sm text-black mb-0.5">
                      My Account
                    </p>
                    <p class="font-medium text-xs text-gray-500">
                      Edit Account details
                    </p>
                  </div>
                </a>
                </div>
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </button>
    
              <button
              on:click={() => goto("activity-log")}
                class="flex items-center justify-between w-full px-4 py-3 mt-1 mb-1 text-sm rounded-xl text-gray-700  hover:bg-violet-200 cursor-pointer transition-colors duration-300"
                role="menuitem"
                aria-label="Help & Support"
                on:click={() => closeAllDropdowns()}
              >
                <div class="flex items-center">
                  <svg
                    width="34"
                    height="35"
                    viewBox="0 0 34 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect y="0.5" width="34" height="34" rx="17" fill="#F1F5F9" />
                    <path
                      d="M24.501 18C24.501 22.14 21.141 25.5 17.001 25.5C12.861 25.5 9.50098 22.14 9.50098 18C9.50098 13.86 12.861 10.5 17.001 10.5C21.141 10.5 24.501 13.86 24.501 18Z"
                      stroke="#292D32"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19.7836 20.3848L17.4586 18.9973C17.0536 18.7573 16.7236 18.1798 16.7236 17.7073V14.6323"
                      stroke="#292D32"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div 
                  class="block text-left ml-4">
                    <p class="font-semibold text-sm text-black mb-0.5">
                      Activity Log
                    </p>
                    <p class="font-medium text-xs text-gray-500">
                      See recent activity
                    </p>
                  </div>
                </div>
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </button>
              <hr class="my-3 h-px bg-gray-200 border-0" />
              <button
                class="flex items-center justify-between w-full px-4 py-3 mt-1 mb-1 text-sm rounded-xl text-gray-700  hover:bg-violet-200 cursor-pointer transition-colors duration-300"
                role="menuitem"
                aria-label="Log Out"
                on:click={() => closeAllDropdowns()}
                on:click={() => goto("/login")}
              >
                <div class="flex items-center">
                  <svg
                    width="34"
                    height="35"
                    viewBox="0 0 34 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect y="0.5" width="34" height="34" rx="17" fill="#EF4444" />
                    <path
                      d="M22.6667 18.5H12.6667M22.6667 18.5L19.3333 15.1667M22.6667 18.5L19.3333 21.8333"
                      stroke="white"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.3333 12.5V10.8333C15.3333 9.72824 16.2282 8.83334 17.3333 8.83334H22.6667C23.7718 8.83334 24.6667 9.72824 24.6667 10.8333V24.1667C24.6667 25.2718 23.7718 26.1667 22.6667 26.1667H17.3333C16.2282 26.1667 15.3333 25.2718 15.3333 24.1667V22.5"
                      stroke="white"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div class="block text-left ml-4">
                    <p class="font-semibold text-sm text-black mb-0.5">Log Out</p>
                    <p class="font-medium text-xs text-gray-500">
                      Log out of your account
                    </p>
                  </div>
                </div>
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  
    <!-- Mobile right section -->
    <div class="sm:hidden flex items-center gap-2 mobile-dropdown-container">
      <button
        class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100"
        aria-label="Toggle mobile menu"
        on:click={toggleMobileDropdown}
      >
      <img src="/images/ronald.png" alt="user avatar icon" />
      </button>
  
      {#if mobileDropdownOpen}
        <div
          class="absolute right-4 top-16 z-10 w-80 rounded-2xl shadow-lg bg-white focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          tabindex="-1"
          on:click={(e) => e.stopPropagation()}
          on:keydown={(e) => e.stopPropagation()}
        >
          <div class="p-4">
            <!-- Profile section in mobile -->
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-600"
              >
                <img src="/images/ronald.png" alt="user avatar icon" />
              </div>
              <div class="block text-left ml-4">
                <p class="font-semibold text-sm text-black mb-0.5">
                  {userName}
                </p>
                <p class="font-medium text-xs text-gray-500">{userRole}</p>
              </div>
            </div>
  
            <!-- Mobile menu items -->
            <div class="space-y-2">
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-violet-200 text-left transition-colors duration-300"
                role="menuitem"
              >
              <img src="/images/fe.png" alt="user avatar icon" />
                <span class="ml-3">Workspace</span>
              </button>
  
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-violet-200 text-left transition-colors duration-300"
                role="menuitem"
              >
              <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.99023 4.89062V7.35113"
                stroke="#4F46E5"
                stroke-width="1.10833"
                stroke-miterlimit="10"
                stroke-linecap="round"
              />
              <path
                d="M9.01472 1.6123C6.29561 1.6123 4.09372 3.81419 4.09372 6.5333V8.08497C4.09372 8.58742 3.88683 9.34108 3.62822 9.76964L2.68983 11.3361C2.1135 12.304 2.5125 13.3828 3.5765 13.7375C7.10838 14.9123 10.9284 14.9123 14.4603 13.7375C15.4578 13.405 15.8864 12.2375 15.347 11.3361L14.4086 9.76964C14.15 9.34108 13.9431 8.58003 13.9431 8.08497V6.5333C13.9357 3.82897 11.7191 1.6123 9.01472 1.6123Z"
                stroke="#4F46E5"
                stroke-width="1.10833"
                stroke-miterlimit="10"
                stroke-linecap="round"
              />
              <path
                d="M11.4522 14.0381C11.4522 15.3903 10.3439 16.4986 8.99175 16.4986C8.31936 16.4986 7.69869 16.2178 7.25536 15.7745C6.81203 15.3311 6.53125 14.7105 6.53125 14.0381"
                stroke="#4F46E5"
                stroke-width="1.10833"
                stroke-miterlimit="10"
              />
            </svg>
                <span class="ml-3">Notifications</span>
                <span
                  class="ml-auto bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              </button>
  
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-violet-200 text-left transition-colors duration-300"
                role="menuitem"
              >
              <svg
              width="34"
              height="35"
              viewBox="0 0 34 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="34" height="34" rx="17" fill="#4F46E5" />
              <path
                d="M17.0842 18.5854C17.0317 18.5779 16.9642 18.5779 16.9042 18.5854C15.5842 18.5404 14.5342 17.4604 14.5342 16.1329C14.5342 14.7754 15.6292 13.6729 16.9942 13.6729C18.3517 13.6729 19.4542 14.7754 19.4542 16.1329C19.4467 17.4604 18.4042 18.5404 17.0842 18.5854Z"
                stroke="white"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22.0495 23.5359C20.7145 24.7584 18.9445 25.5009 16.9945 25.5009C15.0445 25.5009 13.2745 24.7584 11.9395 23.5359C12.0145 22.8309 12.4645 22.1409 13.267 21.6009C15.322 20.2359 18.682 20.2359 20.722 21.6009C21.5245 22.1409 21.9745 22.8309 22.0495 23.5359Z"
                stroke="white"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.9941 25.5005C21.1363 25.5005 24.4941 22.1426 24.4941 18.0005C24.4941 13.8584 21.1363 10.5005 16.9941 10.5005C12.852 10.5005 9.49414 13.8584 9.49414 18.0005C9.49414 22.1426 12.852 25.5005 16.9941 25.5005Z"
                stroke="white"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
                <span class="ml-3">My Account</span>
              </button>
  
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-violet-200 text-left transition-colors duration-300"
                role="menuitem"
              >
              <svg
              width="34"
              height="35"
              viewBox="0 0 34 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="34" height="34" rx="17" fill="#F1F5F9" />
              <path
                d="M21.5015 14.3705C21.4565 14.363 21.404 14.363 21.359 14.3705C20.324 14.333 19.499 13.4855 19.499 12.4355C19.499 11.363 20.3615 10.5005 21.434 10.5005C22.5065 10.5005 23.369 11.3705 23.369 12.4355C23.3615 13.4855 22.5365 14.333 21.5015 14.3705Z"
                stroke="#292D32"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.7286 19.8306C21.7561 20.0031 22.8886 19.8231 23.6836 19.2906C24.7411 18.5856 24.7411 17.4306 23.6836 16.7256C22.8811 16.1931 21.7336 16.0131 20.7061 16.1931"
                stroke="#292D32"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.4779 14.37C12.5229 14.3625 12.5754 14.3625 12.6204 14.37C13.6554 14.3325 14.4804 13.485 14.4804 12.435C14.4804 11.3625 13.6179 10.5 12.5454 10.5C11.4729 10.5 10.6104 11.37 10.6104 12.435C10.6179 13.485 11.4429 14.3325 12.4779 14.37Z"
                stroke="#292D32"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.2511 19.8301C12.2236 20.0026 11.0911 19.8226 10.2961 19.2901C9.23855 18.5851 9.23855 17.4301 10.2961 16.7251C11.0986 16.1926 12.2461 16.0126 13.2736 16.1926"
                stroke="#292D32"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.0015 19.9725C16.9565 19.965 16.904 19.965 16.859 19.9725C15.824 19.935 14.999 19.0875 14.999 18.0375C14.999 16.965 15.8615 16.1025 16.934 16.1025C18.0065 16.1025 18.869 16.9725 18.869 18.0375C18.8615 19.0875 18.0365 19.9425 17.0015 19.9725Z"
                stroke="#292D32"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.8195 22.335C13.762 23.04 13.762 24.195 14.8195 24.9C16.0195 25.7025 17.9845 25.7025 19.1845 24.9C20.242 24.195 20.242 23.04 19.1845 22.335C17.992 21.54 16.0195 21.54 14.8195 22.335Z"
                stroke="#292D32"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
                <span class="ml-3">My Organization</span>
              </button>
  
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-violet-200 text-left transition-colors duration-300"
                role="menuitem"
              >
              <svg
              width="34"
              height="35"
              viewBox="0 0 34 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="34" height="34" rx="17" fill="#F1F5F9" />
              <path
                d="M24.501 18C24.501 22.14 21.141 25.5 17.001 25.5C12.861 25.5 9.50098 22.14 9.50098 18C9.50098 13.86 12.861 10.5 17.001 10.5C21.141 10.5 24.501 13.86 24.501 18Z"
                stroke="#292D32"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19.7836 20.3848L17.4586 18.9973C17.0536 18.7573 16.7236 18.1798 16.7236 17.7073V14.6323"
                stroke="#292D32"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
                <span class="ml-3">Activity Log</span>
              </button>
  
              <hr class="my-3 h-px bg-gray-200 border-0" />
  
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-red-600 hover:bg-red-50 text-left transition-colors duration-300"
                role="menuitem"
              >
              <svg
              width="34"
              height="35"
              viewBox="0 0 34 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="34" height="34" rx="17" fill="#EF4444" />
              <path
                d="M22.6667 18.5H12.6667M22.6667 18.5L19.3333 15.1667M22.6667 18.5L19.3333 21.8333"
                stroke="white"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.3333 12.5V10.8333C15.3333 9.72824 16.2282 8.83334 17.3333 8.83334H22.6667C23.7718 8.83334 24.6667 9.72824 24.6667 10.8333V24.1667C24.6667 25.2718 23.7718 26.1667 22.6667 26.1667H17.3333C16.2282 26.1667 15.3333 25.2718 15.3333 24.1667V22.5"
                stroke="white"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
                <span class="ml-3">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </header>