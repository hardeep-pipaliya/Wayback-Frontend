<script lang="ts">
    import { createEventDispatcher } from 'svelte';
 
    // Type definitions
    type Column = {
        value: string;
        label: string;
        type: 'text' | 'date';
    };
 
    type SortOrder = 'asc' | 'desc';
 
    type SortConfig = {
        column: string;
        order: SortOrder;
    };
 
    type SortOption = {
        column: string;
        order: SortOrder;
        label: string;
    };
 
    // Props
    export let selectedColumn: string = '';
    export let selectedOrder: SortOrder = 'desc';
    export let selectedValue: string = '-created_date'; // For backward compatibility
 
    // Event dispatcher
    const dispatch = createEventDispatcher<{
        sortChange: { value: string; column: string; order: SortOrder };
    }>();
 
    // Component state
    let isOpen = false;

    // Parse selectedValue to extract column and order
    $: {
        if (selectedValue) {
            if (selectedValue.startsWith('-')) {
                selectedColumn = selectedValue.substring(1);
                selectedOrder = 'desc';
            } else {
                selectedColumn = selectedValue;
                selectedOrder = 'asc';
            }
        }
    }
 
    // Available columns to sort by
    export let columns: Column[] = [
        { value: 'created_date', label: 'Created Date', type: 'date' },
        { value: 'updated_date', label: 'Updated Date', type: 'date' },
        { value: 'name', label: 'Name', type: 'text' },
        { value: 'firstName', label: 'First Name', type: 'text' },
        { value: 'lastName', label: 'Last Name', type: 'text' },
        { value: 'email', label: 'Email', type: 'text' },
        { value: 'status', label: 'Status', type: 'text' },
        { value: 'priority', label: 'Priority', type: 'text' }
    ];
 
    // Generate all sort options
    $: sortOptions = columns.reduce((acc: SortOption[], column) => {
        if (column.type === 'date') {
            acc.push(
                { column: column.value, order: 'desc', label: `${column.label} (Newest)` },
                { column: column.value, order: 'asc', label: `${column.label} (Oldest)` }
            );
        } else {
            acc.push(
                { column: column.value, order: 'asc', label: `${column.label} (A to Z)` },
                { column: column.value, order: 'desc', label: `${column.label} (Z to A)` }
            );
        }
        return acc;
    }, []);
 
    // Get current selection label
    $: currentSelectionLabel = selectedColumn
        ? sortOptions.find(opt => opt.column === selectedColumn && opt.order === selectedOrder)?.label || 'Sort by'
        : 'Sort by';
 
    // Functions
    function toggleDropdown(): void {
        isOpen = !isOpen;
    }
 
    function closeDropdown(): void {
        isOpen = false;
    }
 
    function handleSortOptionChange(option: SortOption): void {
        selectedColumn = option.column;
        selectedOrder = option.order;
        closeDropdown();
        dispatchSortChange();
    }
 
    function dispatchSortChange(): void {
        // Update selectedValue to match the new selection
        selectedValue = selectedOrder === 'desc' ? `-${selectedColumn}` : selectedColumn;
        
        // Dispatch the event with all necessary properties
        dispatch('sortChange', {
            value: selectedValue,
            column: selectedColumn,
            order: selectedOrder
        });
    }
 
    function handleColumnChange(columnValue: string): void {
        if (selectedColumn === columnValue) {
            // Toggle order if same column
            selectedOrder = selectedOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, set default order based on type
            const column = columns.find(col => col.value === columnValue);
            selectedColumn = columnValue;
            selectedOrder = column?.type === 'date' ? 'desc' : 'asc';
        }
        closeDropdown();
        dispatchSortChange();
    }
 
    function getOrderLabel(order: SortOrder, isDate: boolean): string {
        if (isDate) {
            return order === 'desc' ? 'Newest' : 'Oldest';
        } else {
            return order === 'asc' ? 'A to Z' : 'Z to A';
        }
    }

    function clearAll() {
        selectedColumn = '';
        selectedOrder = 'desc';
        selectedValue = '-created_date';
        dispatchSortChange();
    }

    function applySelection() {
        closeDropdown();
    }
 
    function handleClickOutside(node: HTMLElement) {
        const handleClick = (event: MouseEvent) => {
            if (!node.contains(event.target as Node)) {
                isOpen = false;
            }
        };
  
        document.addEventListener('click', handleClick, true);
  
        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        };
    }
</script>
 
<div class="inline-block relative text-left" use:handleClickOutside>
    <button 
        onclick={toggleDropdown}
        class="flex items-center gap-2 border-gray-300 bg-white hover:bg-violet-200 px-3 py-2 border rounded-lg font-medium text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
    >
        <!-- <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Sort Icon -->
		<svg
		width="18"
		height="18"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="flex-shrink-0"
	>
		<path
			d="M6.75719 15.375L2.99219 11.6175"
			stroke="#292D32"
			stroke-width="1.125"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M6.75781 2.625V15.375"
			stroke="#292D32"
			stroke-width="1.125"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M11.2422 2.625L15.0072 6.3825"
			stroke="#292D32"
			stroke-width="1.125"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M11.2422 15.375V2.625"
			stroke="#292D32"
			stroke-width="1.125"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
        {currentSelectionLabel}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M12.0007 5.99973L8.00057 9.9999L3.99805 5.99738" 
                stroke="#111827" stroke-linecap="round" stroke-linejoin="round"
            />
        </svg>
    </button>
 
    <!-- Dropdown Panel -->
    {#if isOpen}
        <div class="max-w-md:relative left-0 z-50 absolute bg-white ring-opacity-5 shadow-lg mt-2 w-64 focus:outline-none border-rounded-lg">
            <!-- Options List -->
            <div class="p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                {#each columns as column}
                    <label class="flex items-center hover:bg-violet-200 mb-1 px-4 py-3 rounded-xl text-gray-700 text-sm cursor-pointer">
                        <input 
                            type="radio" 
                            name="sortColumn"
                            checked={selectedColumn === column.value}
                            onclick={() => handleColumnChange(column.value)}
                            onkeydown={(e) => e.key === 'Enter' && handleColumnChange(column.value)}
                            class="mr-2"
                        />
                        <span class="text-gray-700 text-sm cursor-pointer">{column.label}</span>
                        {#if selectedColumn === column.value}
                            <div class="flex items-center gap-1 text-xs font-medium text-white bg-indigo-600 px-2 py-1 rounded ml-auto">
                                <!-- Sort Icon -->
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {#if selectedOrder === 'asc'}
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                    {:else}
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                    {/if}
                                </svg>
                                {getOrderLabel(selectedOrder, column.type === 'date')}
                            </div>
                        {/if}
                    </label>
                {/each}
                
                <!-- <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onclick={clearAll}
                      class="px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-gray-300 rounded-lg hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    >
                      Clear all
                    </button>
                    <button
                      type="button"
                      onclick={applySelection}
                      class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    >
                      Apply
                    </button>
                </div> -->
            </div>
        </div>
    {/if}
</div>