
import fetchWithAuth from './api';
import { mockQueryResponses, simulateApiDelay } from '@/utils/mockData';

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
    try {
      return await fetchWithAuth(`/workspaces/${workspaceId}/query`, {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
    } catch (error) {
      console.log(`Using mock data for query in workspace ${workspaceId} due to API failure`);
      await simulateApiDelay(1500, 4000); // Longer delay to simulate thinking time
      
      // Get mock response for the workspace or use a default
      const mockResponseGenerator = mockQueryResponses[workspaceId] || 
        (() => ({
          id: `query-${Date.now()}`,
          content: `I found some information related to your query: "${query}". This is a fallback response as no specific workspace data was found.`,
          citations: []
        }));
        
      return mockResponseGenerator(query);
    }
  }
};
