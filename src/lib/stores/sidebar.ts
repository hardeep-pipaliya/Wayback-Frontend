import { writable } from 'svelte/store';

type SidebarState = {
  loading: boolean;
  isSidebarOpen: boolean;
  isSettingsPanelOpen: boolean;
  isSearchBoxOpen: boolean;
  toggleSidebarMenu: () => void;
};

function createSidebarStore() {
  // Prevent SSR access to window
  const isClient = typeof window !== 'undefined';

  // Helper to get initial state
  const getInitialSidebarState = (): boolean => {
    if (!isClient) return false;
    const stored = window.localStorage.getItem('isSidebarOpen');
    return stored ? JSON.parse(stored) : false;
  };

  const { subscribe, update } = writable<SidebarState>({
    loading: true,
    isSidebarOpen: getInitialSidebarState(),
    isSettingsPanelOpen: false,
    isSearchBoxOpen: false,
    toggleSidebarMenu: () => {}
  });

  // Custom toggle function
  const toggleSidebarMenu = () => {
    update(state => {
      const newState = !state.isSidebarOpen;
      if (isClient) {
        window.localStorage.setItem('isSidebarOpen', JSON.stringify(newState));
      }
      return { ...state, isSidebarOpen: newState };
    });
  };

  // Inject the function into the store state
  update(state => ({
    ...state,
    toggleSidebarMenu
  }));

  return {
    subscribe,
    toggleSidebarMenu
  };
}

export const sidebarStore = createSidebarStore();
