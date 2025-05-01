
import fetchWithAuth from './api';

export interface ApiWorkspace {
  id: string;
  name: string;
  messages_count: number;
  files_count: number;
  created_at: string;
}

export const workspaceService = {
  // Get all workspaces
  getWorkspaces: async (): Promise<ApiWorkspace[]> => {
    return await fetchWithAuth('/workspaces');
  },
  
  // Create a new workspace
  createWorkspace: async (name: string): Promise<ApiWorkspace> => {
    return await fetchWithAuth('/workspaces', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
  
  // Get a specific workspace
  getWorkspace: async (id: string): Promise<ApiWorkspace> => {
    return await fetchWithAuth(`/workspaces/${id}`);
  },
  
  // Update a workspace
  updateWorkspace: async (id: string, data: Partial<ApiWorkspace>): Promise<ApiWorkspace> => {
    return await fetchWithAuth(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Delete a workspace
  deleteWorkspace: async (id: string): Promise<void> => {
    await fetchWithAuth(`/workspaces/${id}`, {
      method: 'DELETE',
    });
  }
};
