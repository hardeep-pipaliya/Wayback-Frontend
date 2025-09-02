<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props
	export let value: number = 10;
	export let options: number[] = [10, 50, 100];
	export let label: string = 'Per Page:';
	export let id: string = 'limit';
	export let name: string = 'limit';

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		change: { value: number };
	}>();

	// Handle select change
	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newValue = parseInt(target.value);
		dispatch('change', { value: newValue });
	}
</script>

<div class="flex items-center gap-2 text-sm text-gray-600">
	<label for={id} class="font-medium">{label}</label>
	<!-- Dropdown with arrow -->
	<div class="relative">
		<select
			{id}
			{name}
			value={value}
			on:change={handleChange}
			class="!appearance-none bg-white border border-gray-300 text-gray-900 text-sm font-normal rounded-lg py-2 px-3 pr-10 focus:outline-none cursor-pointer "
		>
			{#each options as option}
				<option 
				value={option}>{option}</option>
			{/each}
		</select>
		<!-- Custom dropdown arrow -->
		<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
			<svg
				class="w-4 h-4 text-gray-700"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
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
</div>