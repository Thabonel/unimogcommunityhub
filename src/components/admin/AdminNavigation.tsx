
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/contexts/AdminContext";
import { BarChart3, FileText, Settings, Users, Book, Image, Database, MessageSquare, FolderOpen, Brain, ThumbsUp, Cpu } from "lucide-react";

interface AdminNavigationProps {
  tabs: Array<{ id: string; label: string }>;
}

export function AdminNavigation({ tabs }: AdminNavigationProps) {
  const { currentSection, setCurrentSection } = useAdmin();
  
  // Map icons to tab ids
  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case "analytics":
        return <BarChart3 className="h-4 w-4 mr-2" />;
      case "articles":
        return <FileText className="h-4 w-4 mr-2" />;
      case "resources":
        return <FolderOpen className="h-4 w-4 mr-2" />;
      case "manuals":
        return <Book className="h-4 w-4 mr-2" />;
      case "image-extraction":
        return <Image className="h-4 w-4 mr-2" />;
      case "wis-data":
        return <Database className="h-4 w-4 mr-2" />;
      case "feedback":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "barry-knowledge":
        return <Brain className="h-4 w-4 mr-2" />;
      case "ai-models":
        return <Cpu className="h-4 w-4 mr-2" />;
      case "validated-answers":
        return <ThumbsUp className="h-4 w-4 mr-2" />;
      case "users":
        return <Users className="h-4 w-4 mr-2" />;
      case "settings":
        return <Settings className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <Tabs value={currentSection} onValueChange={setCurrentSection} className="space-y-4">
      <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 md:grid-cols-none md:flex-wrap">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
            {getTabIcon(tab.id)}
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
