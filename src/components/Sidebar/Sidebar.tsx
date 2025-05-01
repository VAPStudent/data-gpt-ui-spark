import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Plus,
  Database,
  FileText,
  Folder,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import WorkspaceList from "../Workspace/WorkspaceList";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/hooks/useWorkspace";

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const { createWorkspace } = useWorkspace();

  const handleCreateWorkspace = async () => {
    if (newWorkspaceName.trim()) {
      await createWorkspace(newWorkspaceName);
      setIsCreatingWorkspace(false);
      setNewWorkspaceName("");
    }
  };

  return (
    <div className="h-full flex flex-col py-4">
      <div className="px-4 pb-4">
        <h2 className="text-xl font-bold text-center mb-6 gradient-text">DataGPT</h2>
        
        <Button 
          className="w-full mb-4 bg-datagpt-blue hover:bg-datagpt-blue/90" 
          onClick={() => setIsCreatingWorkspace(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>

        {isCreatingWorkspace && (
          <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
            <Input
              placeholder="Workspace name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="mb-2"
            />
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="bg-datagpt-blue hover:bg-datagpt-blue/90 flex-1"
                onClick={handleCreateWorkspace}
              >
                Create
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setIsCreatingWorkspace(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search workspaces..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Separator className="my-2" />

      <div className="flex items-center px-4 py-2">
        <Folder className="h-4 w-4 mr-2 text-datagpt-gray" />
        <span className="font-medium text-sm text-datagpt-gray">WORKSPACES</span>
      </div>

      <div className="overflow-y-auto flex-1 px-2 scrollbar-thin">
        <WorkspaceList searchQuery={searchQuery} />
      </div>

      <div className="mt-auto px-4 pt-2">
        <Separator className="my-2" />
        <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-datagpt-blue/10">
              <FileText className="h-4 w-4 text-datagpt-blue" />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">Documents</p>
            </div>
          </div>
          <div className="bg-muted rounded-full px-2 py-0.5 text-xs">
            42
          </div>
        </div>

        <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-datagpt-green/10">
              <Database className="h-4 w-4 text-datagpt-green" />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">Storage</p>
            </div>
          </div>
          <div className="bg-muted rounded-full px-2 py-0.5 text-xs">
            12.4MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
