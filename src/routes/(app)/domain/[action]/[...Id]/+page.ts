import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const { action, id } = params;
  
  // Validate action parameter
  if (action !== 'create' && action !== 'update') {
    throw error(404, 'Page not found');
  }
  
  // For update action, id is required
  if (action === 'update' && !id) {
    throw error(404, 'Domain ID is required for update');
  }
  
  // For create action, id should not be present
  if (action === 'create' && id) {
    throw error(404, 'Create action does not require an ID');
  }
  
  return {
    action,
    id: action === 'update' ? id : undefined
  };
};
