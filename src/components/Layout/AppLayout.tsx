
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <div
        className={`${
          isSidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 ease-in-out bg-sidebar shadow-md hidden md:block`}
      >
        {isSidebarOpen && <Sidebar />}
      </div>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 z-40 w-72 bg-sidebar shadow-xl">
            <Sidebar />
          </div>
          <div className="fixed top-4 left-72 z-40">
            <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-full">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center px-6 bg-white shadow-sm z-10">
          <div className="md:hidden mr-4">
            <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-full">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold gradient-text">DataGPT</h1>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
