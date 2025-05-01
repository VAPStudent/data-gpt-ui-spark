
import { ApiWorkspace } from "@/services/workspaceService";
import { ApiDocument } from "@/services/documentService";
import { ApiQueryResponse, Citation } from "@/services/queryService";

// Mock workspace data
export const mockWorkspaces: ApiWorkspace[] = [
  {
    id: "ws-1",
    name: "Financial Reports",
    messages_count: 24,
    files_count: 5,
    created_at: "2024-12-10T08:30:00Z"
  },
  {
    id: "ws-2",
    name: "Legal Documents",
    messages_count: 13,
    files_count: 7,
    created_at: "2025-01-15T14:45:00Z"
  },
  {
    id: "ws-3",
    name: "Research Papers",
    messages_count: 42,
    files_count: 12,
    created_at: "2025-02-28T11:20:00Z"
  },
  {
    id: "ws-4",
    name: "Project Proposals",
    messages_count: 8,
    files_count: 3,
    created_at: "2025-03-05T09:15:00Z"
  }
];

// Mock document data
export const mockDocuments: Record<string, ApiDocument[]> = {
  "ws-1": [
    {
      id: "doc-101",
      workspace_id: "ws-1",
      name: "Q1_Financial_Report.pdf",
      size: 2456789,
      type: "application/pdf",
      created_at: "2024-12-15T10:30:00Z",
      status: "complete"
    },
    {
      id: "doc-102",
      workspace_id: "ws-1",
      name: "Budget_Forecast_2025.pdf",
      size: 1234567,
      type: "application/pdf",
      created_at: "2024-12-20T14:15:00Z",
      status: "complete"
    },
    {
      id: "doc-103",
      workspace_id: "ws-1",
      name: "Investment_Strategy.pdf",
      size: 3456789,
      type: "application/pdf",
      created_at: "2025-01-05T09:45:00Z",
      status: "complete"
    }
  ],
  "ws-2": [
    {
      id: "doc-201",
      workspace_id: "ws-2",
      name: "Contract_Template.pdf",
      size: 876543,
      type: "application/pdf",
      created_at: "2025-01-18T11:30:00Z",
      status: "complete"
    },
    {
      id: "doc-202",
      workspace_id: "ws-2",
      name: "Privacy_Policy.pdf",
      size: 654321,
      type: "application/pdf",
      created_at: "2025-01-25T13:20:00Z",
      status: "complete"
    }
  ],
  "ws-3": [
    {
      id: "doc-301",
      workspace_id: "ws-3",
      name: "Machine_Learning_Study.pdf",
      size: 5678901,
      type: "application/pdf",
      created_at: "2025-03-01T15:40:00Z",
      status: "complete"
    },
    {
      id: "doc-302",
      workspace_id: "ws-3",
      name: "Data_Analysis_Results.pdf",
      size: 4567890,
      type: "application/pdf",
      created_at: "2025-03-10T16:25:00Z",
      status: "complete"
    }
  ]
};

// Mock query responses with citations
export const mockQueryResponses: Record<string, (query: string) => ApiQueryResponse> = {
  "ws-1": (query: string) => ({
    id: `query-${Date.now()}`,
    content: `Based on our financial reports, ${query.includes("budget") 
      ? "the budget allocation for Q2 2025 shows a 15% increase compared to Q1, with major investments in R&D and marketing campaigns." 
      : query.includes("investment") 
        ? "our investment strategy focuses on diversification across technology, healthcare, and renewable energy sectors to minimize risk." 
        : "the financial performance exceeded expectations with a 12% revenue growth year-over-year."}`,
    citations: [
      {
        document_id: "doc-101",
        document_name: "Q1_Financial_Report.pdf",
        page: 12,
        text: "Q1 2025 shows a remarkable 12% increase in revenue compared to the same period last year, exceeding market analyst predictions by 3%."
      },
      {
        document_id: "doc-102",
        document_name: "Budget_Forecast_2025.pdf",
        page: 5,
        text: "The budget allocation for Q2 2025 prioritizes R&D (40%) and marketing campaigns (25%), representing a 15% increase from Q1."
      }
    ]
  }),
  "ws-2": (query: string) => ({
    id: `query-${Date.now()}`,
    content: `According to our legal documents, ${query.includes("privacy") 
      ? "our privacy policy complies with GDPR and CCPA requirements, with explicit user consent mechanisms and data deletion protocols." 
      : query.includes("contract") 
        ? "our contract templates include necessary clauses for intellectual property protection and dispute resolution through arbitration." 
        : "all legal documentation has been reviewed and approved by the legal department as of March 2025."}`,
    citations: [
      {
        document_id: "doc-201",
        document_name: "Contract_Template.pdf",
        page: 3,
        text: "Section 7.2: All intellectual property created during the project shall remain the exclusive property of the Company, with limited usage rights granted to the Client as specified in Appendix A."
      },
      {
        document_id: "doc-202",
        document_name: "Privacy_Policy.pdf",
        page: 8,
        text: "Users may request complete deletion of their personal data through the account settings page or by contacting our Data Protection Officer at privacy@example.com."
      }
    ]
  }),
  "ws-3": (query: string) => ({
    id: `query-${Date.now()}`,
    content: `Based on our research papers, ${query.includes("machine learning") 
      ? "our machine learning models achieved 94% accuracy using a combination of supervised and unsupervised learning techniques." 
      : query.includes("data") 
        ? "our data analysis revealed significant correlations between customer behavior and seasonal marketing campaigns." 
        : "our research findings suggest a 30% improvement in efficiency when implementing the proposed methodology."}`,
    citations: [
      {
        document_id: "doc-301",
        document_name: "Machine_Learning_Study.pdf",
        page: 27,
        text: "The ensemble model combining gradient boosting and neural networks achieved 94% accuracy on the test dataset, outperforming previous benchmarks by 7%."
      },
      {
        document_id: "doc-302",
        document_name: "Data_Analysis_Results.pdf",
        page: 15,
        text: "Statistical analysis of the customer engagement metrics showed a strong positive correlation (r=0.78, p<0.001) between targeted marketing campaigns and conversion rates during holiday seasons."
      }
    ]
  })
};

// Helper function to simulate API delay
export const simulateApiDelay = (min: number = 500, max: number = 2000): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};
