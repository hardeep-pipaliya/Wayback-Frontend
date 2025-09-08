<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Type definitions
	type SortOption = {
		value: string;
		label: string;
	};

	type UserSortValue = '-created_date' | 'firstName' | '-firstName' | 'lastName' | '-lastName' | 'email' | '-email';

	// Props
	export let selectedValue: UserSortValue = '-created_date';

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		sortChange: { value: UserSortValue };
	}>();

	// Component state
	let isOpen = false;

	// Sort options
	const sortOptions: SortOption[] = [
		{ value: '-created_date', label: 'Create By' },
		{ value: 'firstName', label: 'First Name A-Z' },
		{ value: '-firstName', label: 'First Name Z-A' },
		{ value: 'lastName', label: 'Last Name A-Z' },
		{ value: '-lastName', label: 'Last Name Z-A' },
		{ value: 'email', label: 'Email A-Z' },
		{ value: '-email', label: 'Email Z-A' }
	];

	// Functions
	function toggleDropdown(): void {
		isOpen = !isOpen;
	}

	function closeDropdown(): void {
		isOpen = false;
	}

	function handleSortChange(value: UserSortValue): void {
		selectedValue = value;
		dispatch('sortChange', { value });
		closeDropdown();
	}

	function handleClickOutside(event: MouseEvent): void {
		const target = event.target as Element;
		if (!target.closest('.sort-dropdown')) {
			closeDropdown();
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative inline-block text-left sort-dropdown">
	<!-- Sort Button -->
	<button
		on:click={toggleDropdown}
		class="flex gap-2 border border-gray-300 rounded-lg items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer hover:bg-violet-200"
		type="button"
		aria-haspopup="true"
		aria-expanded={isOpen}
	>
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
		Sort by
	</button>

	<!-- Dropdown Panel -->
	{#if isOpen}
		<div
			class="absolute max-h-[none] overflow-visible font-['Poppins'] left-0 mt-1 z-10 w-56 rounded-2xl shadow-lg bg-white focus:outline-none"
			role="menu"
			aria-orientation="vertical"
		>
			<div class="p-4">
				{#each sortOptions as option}
					<label
						class="flex cursor-pointer items-center px-4 py-3 text-sm rounded-xl mb-1 text-gray-700 hover:bg-indigo-600/30"
					>
						<input
							type="radio"
							class="mr-2"
							name="order_by"
							value={option.value}
							checked={selectedValue === option.value}
							on:change={() => handleSortChange(option.value as UserSortValue)}
						/>
						{option.label}
					</label>
				{/each}
			</div>
		</div>
	{/if}
</div>
