
import fetchWithAuth from './api';

export interface Citation {
  document_id: string;
  document_name: string;
  page: number;
  text: string;
}

export interface ApiQueryResponse {
  id: string;
  content: string;
  citations: Citation[];
}

export const queryService = {
  // Send a query to the API
  sendQuery: async (workspaceId: string, query: string): Promise<ApiQueryResponse> => {
    return await fetchWithAuth(`/workspaces/${workspaceId}/query`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }
};
