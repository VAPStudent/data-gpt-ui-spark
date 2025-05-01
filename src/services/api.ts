
// Base API configuration
const API_BASE_URL = 'https://api.datagpt.app/v1';

/**
 * Base fetch wrapper with error handling
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Add common headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export default fetchWithAuth;
