
import React, { createContext, useContext, useState, useEffect } from "react";
import { workspaceService, ApiWorkspace } from "@/services/workspaceService";
import { useToast } from "@/hooks/use-toast";

type Workspace = {
  id: string;
  name: string;
  messages: number;
  files: number;
  isNew?: boolean;
  createdAt: Date;
};

type WorkspaceContextType = {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (id: string) => void;
  createWorkspace: (name: string) => Promise<void>;
  isLoading: boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Helper to convert API workspace to our format
const mapApiWorkspace = (apiWorkspace: ApiWorkspace): Workspace => ({
  id: apiWorkspace.id,
  name: apiWorkspace.name,
  messages: apiWorkspace.messages_count,
  files: apiWorkspace.files_count,
  createdAt: new Date(apiWorkspace.created_at),
  isNew: false,
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch workspaces on component mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoading(true);
        const apiWorkspaces = await workspaceService.getWorkspaces();
        const mappedWorkspaces = apiWorkspaces.map(mapApiWorkspace);
        setWorkspaces(mappedWorkspaces);
        
        // Set first workspace as active if exists and no active workspace
        if (mappedWorkspaces.length > 0 && !activeWorkspaceId) {
          setActiveWorkspaceId(mappedWorkspaces[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
        toast({
          title: "Error",
          description: "Failed to load workspaces",
          variant: "destructive",
        });
        // Fallback to sample data if API fails
        setWorkspaces([
          {
            id: "1",
            name: "Sample Workspace",
            messages: 0,
            files: 0,
            createdAt: new Date(),
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const activeWorkspace = activeWorkspaceId
    ? workspaces.find((w) => w.id === activeWorkspaceId) || null
    : null;

  const setActiveWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
  };

  const createWorkspace = async (name: string) => {
    if (!name.trim()) return;
    
    try {
      setIsLoading(true);
      const newApiWorkspace = await workspaceService.createWorkspace(name);
      const newWorkspace = mapApiWorkspace(newApiWorkspace);
      newWorkspace.isNew = true; // Mark as new for UI purposes
      
      setWorkspaces((prev) => [newWorkspace, ...prev]);
      setActiveWorkspaceId(newWorkspace.id);
      
      toast({
        title: "Success",
        description: `Workspace "${name}" created`,
      });
    } catch (error) {
      console.error("Failed to create workspace:", error);
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        setActiveWorkspace,
        createWorkspace,
        isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
