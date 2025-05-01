
import React, { createContext, useContext, useState, useEffect } from "react";

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
  createWorkspace: (name: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: "1",
      name: "Product Research",
      messages: 24,
      files: 3,
      createdAt: new Date(2023, 3, 15),
    },
    {
      id: "2",
      name: "Marketing Strategy",
      messages: 43,
      files: 7,
      createdAt: new Date(2023, 4, 5),
    },
    {
      id: "3",
      name: "Financial Reports",
      messages: 12,
      files: 5,
      isNew: true,
      createdAt: new Date(2023, 4, 28),
    },
  ]);
  
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  const activeWorkspace = activeWorkspaceId
    ? workspaces.find((w) => w.id === activeWorkspaceId) || null
    : null;

  const setActiveWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
  };

  const createWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      messages: 0,
      files: 0,
      isNew: true,
      createdAt: new Date(),
    };
    
    setWorkspaces((prev) => [newWorkspace, ...prev]);
    setActiveWorkspaceId(newWorkspace.id);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        setActiveWorkspace,
        createWorkspace,
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
