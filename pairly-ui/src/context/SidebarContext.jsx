import React, { createContext, useState, useContext } from 'react';

// 1. Create Context
const SidebarContext = createContext();

// 2. Custom Hook (Optional)
export const useSidebar = () => useContext(SidebarContext);

// 3. Provider Component
export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
