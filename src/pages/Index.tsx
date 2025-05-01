
import AppLayout from "@/components/Layout/AppLayout";
import ChatWindow from "@/components/Chat/ChatWindow";
import { WorkspaceProvider } from "@/hooks/useWorkspace";

const Index = () => {
  return (
    <WorkspaceProvider>
      <AppLayout>
        <ChatWindow />
      </AppLayout>
    </WorkspaceProvider>
  );
};

export default Index;
