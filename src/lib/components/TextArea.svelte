<script lang="ts">
    export let id: string;
    export let name: string;
    export let label: string;
    export let placeholder: string = '';
    export let value: string = '';
   
    export let required: boolean = false;
    
    export let readonly: boolean = false;
    export let maxlength: number | undefined = undefined;
    export let minlength: number | undefined = undefined;
   
   
    
    // Additional styling props
    export let labelClass: string = '';
    export let textareaClass: string = '';
    export let containerClass: string = '';
  

  
    // Character count
    $: characterCount = value.length;
    $: showCharacterCount = maxlength !== undefined;
  </script>
  
  <div class="space-y-2 {containerClass}">
    <!-- Label -->
    <label 
      for={id} 
      class="block text-sm font-medium text-gray-600 {labelClass}"
    >
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  
    <!-- Textarea -->
    <textarea
    {id}
    {name}
    {placeholder}
    {required}
    {readonly}
    {maxlength}
    {minlength}
    bind:value
    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-colors duration-200 {textareaClass} placeholder-gray-400"
    on:input
    on:change
    on:focus
    on:blur
    on:keydown
    on:keyup
  />
  
  
    <!-- Character count -->
    {#if showCharacterCount}
      <div class="flex justify-end">
        <span class="text-xs text-gray-500">
          {characterCount}{#if maxlength}/{maxlength}{/if}
        </span>
      </div>
    {/if}
  
  </div>