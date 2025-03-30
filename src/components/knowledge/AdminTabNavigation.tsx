
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categories } from '@/lib/knowledge-categories';

interface AdminTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminTabNavigation({ activeTab, onTabChange }: AdminTabNavigationProps) {
  return (
    <>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger 
          value="allArticles" 
          onClick={() => onTabChange("allArticles")}
          className={activeTab === "allArticles" ? "font-semibold" : ""}
        >
          All Articles
        </TabsTrigger>
        <TabsTrigger 
          value="maintenance" 
          onClick={() => onTabChange("maintenance")}
          className={activeTab === "maintenance" ? "font-semibold" : ""}
        >
          Maintenance
        </TabsTrigger>
        <TabsTrigger 
          value="repair" 
          onClick={() => onTabChange("repair")}
          className={activeTab === "repair" ? "font-semibold" : ""}
        >
          Repair
        </TabsTrigger>
      </TabsList>
      <TabsList className="grid w-full grid-cols-3 mt-1">
        <TabsTrigger 
          value="adventures" 
          onClick={() => onTabChange("adventures")}
          className={activeTab === "adventures" ? "font-semibold" : ""}
        >
          Adventures
        </TabsTrigger>
        <TabsTrigger 
          value="modifications" 
          onClick={() => onTabChange("modifications")}
          className={activeTab === "modifications" ? "font-semibold" : ""}
        >
          Modifications
        </TabsTrigger>
        <TabsTrigger 
          value="tyres" 
          onClick={() => onTabChange("tyres")}
          className={activeTab === "tyres" ? "font-semibold" : ""}
        >
          Tyres
        </TabsTrigger>
      </TabsList>
    </>
  );
}
