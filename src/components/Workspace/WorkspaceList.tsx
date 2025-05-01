
import React from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type WorkspaceListProps = {
  searchQuery: string;
};

const WorkspaceList: React.FC<WorkspaceListProps> = ({ searchQuery }) => {
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspace();

  // Filter workspaces based on search query
  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-1">
      {filteredWorkspaces.length > 0 ? (
        filteredWorkspaces.map((workspace) => (
          <Button
            key={workspace.id}
            variant="ghost"
            className={cn(
              "w-full justify-start px-2 py-5 text-left h-auto",
              workspace.id === activeWorkspaceId && "bg-sidebar-accent"
            )}
            onClick={() => setActiveWorkspace(workspace.id)}
          >
            <div className="flex w-full items-center">
              <div className={cn(
                "h-8 w-8 rounded-md flex items-center justify-center mr-3",
                workspace.id === activeWorkspaceId ? "bg-datagpt-blue text-white" : "bg-muted text-datagpt-gray"
              )}>
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="font-medium truncate">{workspace.name}</span>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span>{workspace.messages} messages</span>
                  <span className="mx-1">•</span>
                  <span>{workspace.files} files</span>
                </div>
              </div>
              {workspace.isNew && (
                <Badge className="ml-2 bg-datagpt-green text-white">New</Badge>
              )}
            </div>
          </Button>
        ))
      ) : (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">No workspaces found</p>
        </div>
      )}
    </div>
  );
};

export default WorkspaceList;
