
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
    
    return await fetch(`${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}/documents`, {
      method: 'POST',
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    });
  },
  
  // Delete a document
  deleteDocument: async (workspaceId: string, documentId: string): Promise<void> => {
    await fetchWithAuth(`/workspaces/${workspaceId}/documents/${documentId}`, {
      method: 'DELETE',
    });
  }
};
