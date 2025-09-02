<script lang="ts">
    export let name: string = "status";
    export let selected: string = "Radio 1";
    export let options: string[] = ["Radio 1", "Radio 2", "Radio 3"];
    export let className: string = "";
    export let label: string = "";
    export let required: boolean = false;
    export let id: string = "";

  </script>
  
  <fieldset class={`mb-2 text-sm font-medium text-gray-600  flex flex-col ${className}`}>
    <legend
        class="mb-2 text-sm font-medium text-gray-600 flex items-center"
      >
    <span>{label}{#if required}<span class="text-red-500">*</span>{/if}</span>
      </legend>
    <div class="space-y-2">
      {#each options as option}
        <label
          class="inline-flex items-center rounded-lg border border-solid border-gray-200 p-[10px] cursor-pointer mr-2"
        >
          <input
            type="radio"
            {id}
            name={name}
            value={option}
            class="form-radio text-indigo-600 mr-2"
            bind:group={selected}
          />
          <span>{option}</span>
        </label>
      {/each}
    </div>
  </fieldset>