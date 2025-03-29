
import Layout from "@/components/Layout";
import { KnowledgeNavigation } from "@/components/knowledge/KnowledgeNavigation";
import { Bookmark, BookOpen, Tag, Wrench, AlertTriangle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RepairPage = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: "John Doe",
    avatarUrl: "/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png",
    unimogModel: "U1700L",
  };

  // Sample repair guides
  const repairGuides = [
    {
      id: "1",
      title: "Transmission Repair Guide",
      description: "Complete walkthrough of common transmission issues and repairs",
      category: "Drivetrain",
      complexity: "High",
      tools: ["Transmission jack", "Socket set", "Torque wrench"],
      timeRequired: "5-8 hours",
      warningLevel: "Critical",
    },
    {
      id: "2",
      title: "Starter Motor Replacement",
      description: "How to diagnose and replace a faulty starter motor",
      category: "Electrical",
      complexity: "Medium",
      tools: ["Socket set", "Wire cutters", "Multimeter"],
      timeRequired: "1-2 hours",
      warningLevel: "Moderate",
    },
    {
      id: "3",
      title: "Brake Caliper Rebuild",
      description: "Step-by-step guide to rebuilding brake calipers",
      category: "Brakes",
      complexity: "Medium",
      tools: ["Caliper tool kit", "Brake fluid", "Torque wrench"],
      timeRequired: "2-3 hours per wheel",
      warningLevel: "Moderate",
    },
    {
      id: "4",
      title: "Fuel Injector Removal & Testing",
      description: "How to safely remove, test and reinstall fuel injectors",
      category: "Fuel System",
      complexity: "Medium",
      tools: ["Injector puller", "Cleaning kit", "Pressure tester"],
      timeRequired: "3-4 hours",
      warningLevel: "Moderate",
    },
    {
      id: "5",
      title: "Axle Seal Replacement",
      description: "Guide for diagnosing and replacing leaking axle seals",
      category: "Drivetrain",
      complexity: "High",
      tools: ["Seal puller", "Seal driver", "Jack stands"],
      timeRequired: "4-6 hours",
      warningLevel: "Moderate",
    }
  ];

  const getWarningBadge = (level: string) => {
    switch (level) {
      case "Critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "Moderate":
        return <Badge className="bg-amber-500">Moderate</Badge>;
      default:
        return <Badge>Low</Badge>;
    }
  };

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Repair Guides
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Step-by-step repair procedures to diagnose and fix issues with your Unimog.
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
          {repairGuides.map((guide) => (
            <Card key={guide.id}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle>{guide.title}</CardTitle>
                  {getWarningBadge(guide.warningLevel)}
                </div>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    <span>Category: {guide.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench size={14} />
                    <span>Complexity: {guide.complexity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Time: {guide.timeRequired}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="font-medium text-xs">Required tools:</span>
                    <div className="flex flex-wrap gap-1">
                      {guide.tools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <Bookmark size={14} className="mr-1" /> Save
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/knowledge/repair/${guide.id}`}>View Guide</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RepairPage;
