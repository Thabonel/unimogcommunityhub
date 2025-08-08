
import { createContext, useState, useContext, ReactNode } from "react";

interface AdminContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
  initialSection?: string;
  onSectionChange?: (section: string) => void;
}

export function AdminProvider({ 
  children, 
  initialSection = "articles",
  onSectionChange
}: AdminProviderProps) {
  const [currentSection, setCurrentSectionInternal] = useState(initialSection);
  
  const setCurrentSection = (section: string) => {
    setCurrentSectionInternal(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <AdminContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
