<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import Dropdown from '$lib/components/Dropdown.svelte';
    import TextArea from '$lib/components/TextArea.svelte';
  
    // Types
    interface ConfigField {
      key: string;
      value: string;
      type: 'text' | 'number' | 'boolean' | 'json';
    }
  
    interface ConfigurationSetting {
      id?: string;
      name: string;
      description: string;
      slug_id?: string;
      config_data?: Record<string, any>;
    }
  
    // Get page data from load function
    export let data;
    
    // Get URL params to determine if create or update
    $: isUpdateMode = data.action === 'update';
    $: configId = data.id;
  
    // Form state
    let formData: ConfigurationSetting = {
      name: '',
      description: '',
      config_data: {}
    };
  
    let dynamicFields: ConfigField[] = [];
    let isLoading = false;
  
    // Configuration types with their default fields
    interface ConfigType {
      label: string;
      fields: { key: string; type: 'text' | 'number' | 'boolean' | 'json' }[];
    }
    
    const configTypes: Record<string, ConfigType> = {
      '': { label: 'Select Name', fields: [] },
      'services': { 
        label: 'Services Configuration',
        fields: [
          { key: 'api_endpoint', type: 'text' },
          { key: 'timeout', type: 'number' },
          { key: 'max_retries', type: 'number' },
          { key: 'enabled', type: 'boolean' }
        ]
      },
      'retry': { 
        label: 'Retry Configuration',
        fields: [
          { key: 'max_attempts', type: 'number' },
          { key: 'delay_seconds', type: 'number' },
          { key: 'exponential_backoff', type: 'boolean' }
        ]
      },
      'aws': { 
        label: 'AWS Configuration',
        fields: [
          { key: 'region', type: 'text' },
          { key: 'access_key_id', type: 'text' },
          { key: 'secret_access_key', type: 'text' },
          { key: 'bucket_name', type: 'text' }
        ]
      },
      'novita': { 
        label: 'Novita Configuration',
        fields: [
          { key: 'api_key', type: 'text' },
          { key: 'base_url', type: 'text' },
          { key: 'model', type: 'text' },
          { key: 'max_tokens', type: 'number' }
        ]
      },
      'price': { 
        label: 'Price Configuration',
        fields: [
          { key: 'base_price', type: 'number' },
          { key: 'currency', type: 'text' },
          { key: 'tax_rate', type: 'number' },
          { key: 'discount_enabled', type: 'boolean' }
        ]
      },
      'queue': { 
        label: 'Queue Configuration',
        fields: [
          { key: 'queue_name', type: 'text' },
          { key: 'max_size', type: 'number' },
          { key: 'workers', type: 'number' },
          { key: 'priority_enabled', type: 'boolean' }
        ]
      }
    };
  
    // Get configuration type options for dropdown
    $: configTypeOptions = Object.keys(configTypes).filter(key => key !== '');
  
    // Handle configuration type change
    function handleTypeChange() {
      const selectedType = formData.name;
      
      const selectedConfig = configTypes[selectedType];
      if (selectedConfig && selectedConfig.fields) {
        dynamicFields = selectedConfig.fields.map(field => ({
          key: field.key,
          value: formData.config_data?.[field.key] || getDefaultValue(field.type),
          type: field.type
        }));
      } else {
        dynamicFields = [];
      }
    }
  
    function getDefaultValue(type: string): string {
      switch (type) {
        case 'number': return '0';
        case 'boolean': return 'false';
        case 'json': return '{}';
        default: return '';
      }
    }
  
    // Update config data when dynamic fields change
    function updateConfigData() {
      formData.config_data = {};
      dynamicFields.forEach(field => {
        let value: any = field.value;
        
        // Convert values based on type
        switch (field.type) {
          case 'number':
            value = field.value ? Number(field.value) : 0;
            break;
          case 'boolean':
            value = field.value === 'true';
            break;
          case 'json':
            try {
              value = JSON.parse(field.value || '{}');
            } catch {
              value = {};
            }
            break;
        }
        
        if (formData.config_data) {
          formData.config_data[field.key] = value;
        }
      });
    }
  
    // Load existing configuration for update mode
    onMount(async () => {
      if (isUpdateMode && configId) {
        try {
          isLoading = true;
          // Replace with your actual API endpoint
          const response = await fetch(`/api/configuration/${configId}`);
          if (response.ok) {
            const data = await response.json();
            formData = { ...data };
            
            // Load dynamic fields based on existing data
            if (formData.name && configTypes[formData.name]) {
              const selectedConfig = configTypes[formData.name];
              dynamicFields = selectedConfig.fields.map(field => ({
                key: field.key,
                value: String(formData.config_data?.[field.key] || getDefaultValue(field.type)),
                type: field.type
              }));
            }
          }
        } catch (error) {
          console.error('Error loading configuration:', error);
        } finally {
          isLoading = false;
        }
      }
    });
  
    // Handle form submission
    async function handleSubmit() {
      try {
        isLoading = true;
        updateConfigData();
        
        const url = isUpdateMode 
          ? `/api/configuration/${configId}` 
          : '/api/configuration';
        
        const method = isUpdateMode ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          goto('/configuration');
        } else {
          console.error('Error saving configuration');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        isLoading = false;
      }
    }
  
  </script>
  
    <div>
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <!-- Left Side: Title Section -->
        <div>
          <h3 class="text-lg font-semibold text-black">Configuration Settings</h3>
          <p class="text-xs text-gray-500">
            {isUpdateMode ? 'Update existing configuration settings' : 'Create new configuration settings'}
          </p>
        </div>
  
        <!-- Right Side: Back Button -->
        <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
          <button 
            on:click={() => goto('/configuration')}
            class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-black border border-black-600 rounded-lg hover:bg-indigo-700 cursor-pointer hover:border-none transition-colors duration-300"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.99953 11.78C5.87286 11.78 5.7462 11.7333 5.6462 11.6333L1.29953 7.28668C0.592865 6.58001 0.592865 5.42001 1.29953 4.71335L5.6462 0.36668C5.83953 0.173346 6.15953 0.173346 6.35286 0.36668C6.5462 0.560013 6.5462 0.880013 6.35286 1.07335L2.0062 5.42001C1.6862 5.74001 1.6862 6.26001 2.0062 6.58001L6.35286 10.9267C6.5462 11.12 6.5462 11.44 6.35286 11.6333C6.25286 11.7267 6.1262 11.78 5.99953 11.78Z" fill="white"></path>
            </svg>
            Back
          </button>
        </div>
      </div>
  
      <!-- Form Section -->
      <div class="grid grid-cols-12 gap-5 pt-6 font-poppins">
        <div class="col-span-12 lg:col-span-4">
          <div class="p-4 border border-gray-200 rounded-2xl">
            <h5 class="text-base font-semibold text-gray-900 pb-4 border-b border-gray-200">
              Configuration Settings Details
            </h5>
  
            <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 pt-4">
              <!-- Name -->

              <Dropdown
                id="name"
                name="name"
                label="Name"
                options={configTypeOptions}
                value={formData.name}
                on:change={handleTypeChange}
              />
  
              <!-- Dynamic Config Fields -->
              {#if dynamicFields.length > 0}
                <div class="flex flex-col gap-3">
                  {#each dynamicFields as field, index}
                    <div class="flex flex-col gap-2">
                      {#if field.type === 'boolean'}
                        <div class="flex flex-col gap-2">
                          <label for={field.key} class="text-sm font-medium text-gray-700 capitalize">
                            {field.key.replace(/_/g, ' ')}
                          </label>
                          <select 
                            id={field.key}
                            bind:value={field.value}
                            on:change={updateConfigData}
                            class="px-3 py-2 text-sm border rounded-lg border-gray-300 focus:outline-none focus:ring"
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </div>
                      {:else if field.type === 'json'}
                        <TextArea
                          id={field.key}
                          name={field.key}
                          label={field.key.replace(/_/g, ' ')}
                          placeholder="Enter valid JSON"
                          value={field.value}
                          on:input={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            field.value = target.value;
                            updateConfigData();
                          }}
                        />
                      {:else}
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          id={field.key}
                          bind:value={field.value}
                          on:input={updateConfigData}
                          class="px-3 py-2 text-sm border rounded-lg border-gray-300 focus:outline-none focus:ring"
                          placeholder="Enter {field.key.replace(/_/g, ' ')}"
                        />
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}
  
              <!-- Description -->
              <TextArea
                id="description"
                name="description"
                label="Description"
                placeholder="Optional description..."
                value={formData.description}
                on:input={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  formData.description = target.value;
                }}
              />
  
              <!-- Submit -->
              <div class="pt-2">
                <button 
                  type="submit"
                  disabled={isLoading}
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {#if isLoading}
                    {isUpdateMode ? 'Updating...' : 'Saving...'}
                  {:else}
                    {isUpdateMode ? 'Update' : 'Save'}
                  {/if}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  
  <style>
    .bg-custom-black {
      background-color: #1f2937;
    }
  </style>