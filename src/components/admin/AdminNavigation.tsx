
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/contexts/AdminContext";

interface AdminNavigationProps {
  tabs: Array<{ id: string; label: string }>;
}

export function AdminNavigation({ tabs }: AdminNavigationProps) {
  const { currentSection, setCurrentSection } = useAdmin();

  return (
    <Tabs value={currentSection} onValueChange={setCurrentSection} className="space-y-4">
      <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
