
import React, { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  MessageSquare, 
  Trash,
  MoreVertical 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type WorkspaceListProps = {
  searchQuery: string;
};

const WorkspaceList: React.FC<WorkspaceListProps> = ({ searchQuery }) => {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, deleteWorkspace } = useWorkspace();
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null);

  // Filter workspaces based on search query
  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWorkspaceClick = (workspaceId: string) => {
    setActiveWorkspace(workspaceId);
  };

  const handleDeleteWorkspace = async (id: string) => {
    await deleteWorkspace(id);
    setWorkspaceToDelete(null);
  };

  return (
    <div className="space-y-1">
      {filteredWorkspaces.length > 0 ? (
        filteredWorkspaces.map((workspace) => (
          <div key={workspace.id} className={cn(
            "relative group",
          )}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start px-2 py-5 text-left h-auto",
                workspace.id === activeWorkspaceId && "bg-sidebar-accent"
              )}
              onClick={() => handleWorkspaceClick(workspace.id)}
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
                    workspace.id === activeWorkspaceId && "opacity-100"
                  )}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setWorkspaceToDelete(workspace.id);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))
      ) : (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">No workspaces found</p>
        </div>
      )}

      <AlertDialog open={!!workspaceToDelete} onOpenChange={(open) => !open && setWorkspaceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone and will permanently delete the workspace
              and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => workspaceToDelete && handleDeleteWorkspace(workspaceToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkspaceList;
