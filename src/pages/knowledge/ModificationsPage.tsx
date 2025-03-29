
import Layout from "@/components/Layout";
import { KnowledgeNavigation } from "@/components/knowledge/KnowledgeNavigation";
import { BookOpen, Tag, Wrench, Clock, Gauge, BarChart3, CircleDollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ModificationsPage = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: "John Doe",
    avatarUrl: "/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png",
    unimogModel: "U1700L",
  };

  // Sample modification guides
  const modificationGuides = [
    {
      id: "1",
      title: "Camper Conversion Guide",
      description: "Complete guide to converting your Unimog into a self-contained expedition vehicle",
      category: "Living Space",
      difficulty: "Expert",
      timeRequired: "3-6 months",
      cost: "$$$$$",
      performance_impact: "Reduced due to weight",
      image: "https://images.unsplash.com/photo-1602969565090-5909c9705cc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGVyJTIwdHJ1Y2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      author: "Alexander Camper",
    },
    {
      id: "2",
      title: "Suspension Upgrade",
      description: "How to upgrade your suspension for improved off-road capability",
      category: "Performance",
      difficulty: "Advanced",
      timeRequired: "2-3 days",
      cost: "$$$",
      performance_impact: "Significantly improved",
      image: "https://images.unsplash.com/photo-1534705867302-2a41394d2a3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJ1Y2slMjBzdXNwZW5zaW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      author: "Mike Offroad",
    },
    {
      id: "3",
      title: "Solar System Installation",
      description: "Complete guide to designing and installing a solar power system",
      category: "Electrical",
      difficulty: "Medium",
      timeRequired: "3-5 days",
      cost: "$$$$",
      performance_impact: "Neutral",
      image: "https://images.unsplash.com/photo-1559302995-f1c7fb9c08d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sYXIlMjBwYW5lbCUyMHJvb2Z8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      author: "Emma Power",
    },
    {
      id: "4",
      title: "Snorkel Installation",
      description: "How to install a snorkel for improved water crossing capability",
      category: "Performance",
      difficulty: "Medium",
      timeRequired: "1-2 days",
      cost: "$$",
      performance_impact: "Improved",
      image: "https://images.unsplash.com/photo-1669529635826-72d7dc9b34aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJ1Y2slMjBzbm9ya2VsfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      author: "Tom Waters",
    },
    {
      id: "5",
      title: "Winch Installation & Setup",
      description: "Complete guide to selecting and installing the right winch",
      category: "Recovery",
      difficulty: "Medium",
      timeRequired: "1-2 days",
      cost: "$$$",
      performance_impact: "Neutral",
      image: "https://images.unsplash.com/photo-1676023133834-e50a76719a79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJ1Y2slMjB3aW5jaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      author: "Jessica Pull",
    },
    {
      id: "6",
      title: "Engine Performance Upgrades",
      description: "Options for increasing power and efficiency",
      category: "Performance",
      difficulty: "Expert",
      timeRequired: "3-7 days",
      cost: "$$$$",
      performance_impact: "Significantly improved",
      image: "https://images.unsplash.com/photo-1620912189868-894878cc0fd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZW5naW5lfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      author: "Max Power",
    }
  ];

  // Helper function to render cost indicators
  const renderCostIndicator = (cost: string) => {
    const count = cost.length;
    return (
      <div className="flex items-center">
        <CircleDollarSign size={14} className="mr-1" />
        <div className="text-sm">{cost}</div>
      </div>
    );
  };

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Modification Guides
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Upgrade and customize your Unimog with our detailed modification guides.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Tag size={16} />
              <span>Filter</span>
            </Button>
            <Button className="bg-primary">
              <BookOpen size={16} className="mr-2" />
              New Modification
            </Button>
          </div>
        </div>
        
        <KnowledgeNavigation />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {modificationGuides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src={guide.image} 
                  alt={guide.title}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
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
                    <Wrench size={14} />
                    <span>Difficulty: {guide.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Time: {guide.timeRequired}</span>
                  </div>
                  <div className="flex flex-wrap justify-between mt-2">
                    {renderCostIndicator(guide.cost)}
                    <Badge 
                      className={
                        guide.performance_impact.includes("improved") 
                          ? "bg-green-500" 
                          : guide.performance_impact.includes("Reduced") 
                          ? "bg-red-500" 
                          : "bg-blue-500"
                      }
                    >
                      <Gauge size={12} className="mr-1" />
                      {guide.performance_impact}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  By {guide.author}
                </div>
                <Button size="sm" asChild>
                  <Link to={`/knowledge/modifications/${guide.id}`}>View Guide</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ModificationsPage;
