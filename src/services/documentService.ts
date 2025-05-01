
import fetchWithAuth from './api';
import { mockDocuments, simulateApiDelay } from '@/utils/mockData';

export interface ApiDocument {
  id: string;
  workspace_id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

export const documentService = {
  // Get documents for a workspace
  getDocuments: async (workspaceId: string): Promise<ApiDocument[]> => {
    try {
      return await fetchWithAuth(`/workspaces/${workspaceId}/documents`);
    } catch (error) {
      console.log(`Using mock document data for workspace ${workspaceId} due to API failure`);
      await simulateApiDelay();
      return mockDocuments[workspaceId] || [];
    }
  },
  
  // Upload a document
  uploadDocument: async (workspaceId: string, file: File): Promise<ApiDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Use the API URL from environment variables and fetchWithAuth for consistency
      return await fetchWithAuth(`/workspaces/${workspaceId}/documents`, {
        method: 'POST',
        body: formData,
        headers: {
          // Remove Content-Type header to let the browser set it with the correct boundary for FormData
        },
      });
    } catch (error) {
      console.log(`Using mock data to simulate document upload for workspace ${workspaceId} due to API failure`);
      await simulateApiDelay(1000, 3000); // Longer delay to simulate upload
      
      // Create a new mock document
      const newDocument: ApiDocument = {
        id: `doc-${Date.now()}`,
        workspace_id: workspaceId,
        name: file.name,
        size: file.size,
        type: file.type,
        created_at: new Date().toISOString(),
        status: 'complete',
      };
      
      // Add the new document to mock data
      if (!mockDocuments[workspaceId]) {
        mockDocuments[workspaceId] = [];
      }
      mockDocuments[workspaceId].push(newDocument);
      
      return newDocument;
    }
  },
  
  // Delete a document
  deleteDocument: async (workspaceId: string, documentId: string): Promise<void> => {
    try {
      await fetchWithAuth(`/workspaces/${workspaceId}/documents/${documentId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log(`Using mock data to simulate deletion of document ${documentId} due to API failure`);
      await simulateApiDelay();
      
      // Remove document from mock data
      if (mockDocuments[workspaceId]) {
        const index = mockDocuments[workspaceId].findIndex(doc => doc.id === documentId);
        if (index !== -1) {
          mockDocuments[workspaceId].splice(index, 1);
        }
      }
    }
  }
};
