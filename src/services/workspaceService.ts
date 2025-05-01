
import fetchWithAuth from './api';
import { mockWorkspaces, simulateApiDelay } from '@/utils/mockData';

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
    try {
      return await fetchWithAuth('/workspaces');
    } catch (error) {
      console.log('Using mock workspace data due to API failure');
      await simulateApiDelay();
      return mockWorkspaces;
    }
  },
  
  // Create a new workspace
  createWorkspace: async (name: string): Promise<ApiWorkspace> => {
    try {
      return await fetchWithAuth('/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
    } catch (error) {
      console.log('Using mock data to create workspace due to API failure');
      await simulateApiDelay();
      const newWorkspace: ApiWorkspace = {
        id: `ws-${Date.now()}`,
        name,
        messages_count: 0,
        files_count: 0,
        created_at: new Date().toISOString(),
      };
      return newWorkspace;
    }
  },
  
  // Get a specific workspace
  getWorkspace: async (id: string): Promise<ApiWorkspace> => {
    try {
      return await fetchWithAuth(`/workspaces/${id}`);
    } catch (error) {
      console.log(`Using mock data for workspace ${id} due to API failure`);
      await simulateApiDelay();
      const workspace = mockWorkspaces.find(w => w.id === id);
      if (!workspace) {
        throw new Error(`Workspace with ID ${id} not found`);
      }
      return workspace;
    }
  },
  
  // Update a workspace
  updateWorkspace: async (id: string, data: Partial<ApiWorkspace>): Promise<ApiWorkspace> => {
    try {
      return await fetchWithAuth(`/workspaces/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log(`Using mock data to update workspace ${id} due to API failure`);
      await simulateApiDelay();
      const workspace = mockWorkspaces.find(w => w.id === id);
      if (!workspace) {
        throw new Error(`Workspace with ID ${id} not found`);
      }
      return { ...workspace, ...data };
    }
  },
  
  // Delete a workspace
  deleteWorkspace: async (id: string): Promise<void> => {
    try {
      await fetchWithAuth(`/workspaces/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log(`Using mock data to simulate deletion of workspace ${id} due to API failure`);
      await simulateApiDelay();
      return;
    }
  }
};
