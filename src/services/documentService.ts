
import fetchWithAuth from './api';

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
    return await fetchWithAuth(`/workspaces/${workspaceId}/documents`);
  },
  
  // Upload a document
  uploadDocument: async (workspaceId: string, file: File): Promise<ApiDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use the API URL from environment variables and fetchWithAuth for consistency
    return await fetchWithAuth(`/workspaces/${workspaceId}/documents`, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let the browser set it with the correct boundary for FormData
      },
    });
  },
  
  // Delete a document
  deleteDocument: async (workspaceId: string, documentId: string): Promise<void> => {
    await fetchWithAuth(`/workspaces/${workspaceId}/documents/${documentId}`, {
      method: 'DELETE',
    });
  }
};
