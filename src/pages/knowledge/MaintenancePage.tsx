
import Layout from "@/components/Layout";
import { KnowledgeNavigation } from "@/components/knowledge/KnowledgeNavigation";
import { Book, BookOpen, Clock, Tag, Tool, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MaintenancePage = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: "John Doe",
    avatarUrl: "/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png",
    unimogModel: "U1700L",
  };

  // Sample maintenance guides
  const maintenanceGuides = [
    {
      id: "1",
      title: "Engine Oil Change Guide",
      description: "Step-by-step instructions for changing your Unimog's engine oil",
      category: "Engine",
      difficulty: "Medium",
      timeRequired: "1-2 hours",
      lastUpdated: "June 15, 2023",
    },
    {
      id: "2",
      title: "Air Filter Replacement",
      description: "How to inspect and replace your Unimog air filter system",
      category: "Engine",
      difficulty: "Easy",
      timeRequired: "30 minutes",
      lastUpdated: "August 23, 2023",
    },
    {
      id: "3",
      title: "Hydraulic System Maintenance",
      description: "Complete guide to maintaining your Unimog's hydraulic systems",
      category: "Hydraulics",
      difficulty: "Advanced",
      timeRequired: "2-3 hours",
      lastUpdated: "May 4, 2023",
    },
    {
      id: "4",
      title: "Cooling System Maintenance",
      description: "How to flush and refill your cooling system",
      category: "Engine",
      difficulty: "Medium",
      timeRequired: "1-2 hours",
      lastUpdated: "September 10, 2023",
    },
    {
      id: "5",
      title: "Fuel Filter Change",
      description: "Procedure for changing primary and secondary fuel filters",
      category: "Engine",
      difficulty: "Medium",
      timeRequired: "1 hour",
      lastUpdated: "July 12, 2023",
    },
    {
      id: "6",
      title: "Brake System Maintenance",
      description: "Regular maintenance procedures for your Unimog brake system",
      category: "Brakes",
      difficulty: "Medium",
      timeRequired: "2-3 hours",
      lastUpdated: "October 5, 2023",
    }
  ];

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Maintenance Guides
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Step-by-step maintenance guides for your Unimog to keep it running at peak performance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Tag size={16} />
              <span>Filter</span>
            </Button>
            <Button className="bg-primary">
              <BookOpen size={16} className="mr-2" />
              New Guide
            </Button>
          </div>
        </div>
        
        <KnowledgeNavigation />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {maintenanceGuides.map((guide) => (
            <Card key={guide.id}>
              <CardHeader>
                <CardTitle>{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    <span>Category: {guide.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tool size={14} />
                    <span>Difficulty: {guide.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Time: {guide.timeRequired}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  Updated: {guide.lastUpdated}
                </div>
                <Button size="sm" asChild>
                  <Link to={`/knowledge/maintenance/${guide.id}`}>Read Guide</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MaintenancePage;
