
import Layout from "@/components/Layout";
import { KnowledgeNavigation } from "@/components/knowledge/KnowledgeNavigation";
import { Bookmark, BookOpen, Compass, Globe, Map, Calendar, Tag, Mountain } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const AdventuresPage = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: "John Doe",
    avatarUrl: "/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png",
    unimogModel: "U1700L",
  };

  // Sample adventure guides
  const adventureGuides = [
    {
      id: "1",
      title: "Expedition Planning Guide",
      description: "How to plan an extended overland expedition with your Unimog",
      category: "Planning",
      region: "Global",
      duration: "2-6 months",
      image: "https://images.unsplash.com/photo-1605987007244-57516f6ff98f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dW5pbW9nfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      author: "Michael Explorer",
    },
    {
      id: "2",
      title: "Desert Crossing Techniques",
      description: "Essential knowledge for safely traversing desert terrain",
      category: "Terrain",
      region: "Africa, Middle East",
      duration: "1-3 weeks",
      image: "https://images.unsplash.com/photo-1566155119454-2b581dd44c0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVzZXJ0JTIwdHJ1Y2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      author: "Sarah Dunes",
    },
    {
      id: "3",
      title: "Mountain Pass Navigation",
      description: "Techniques for navigating challenging mountain routes",
      category: "Terrain",
      region: "Alps, Andes, Himalayas",
      duration: "1-2 weeks",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW91bnRhaW4lMjBwYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      author: "Robert Peaks",
    },
    {
      id: "4",
      title: "Winter Expedition Essentials",
      description: "Preparing your Unimog and equipment for extreme cold conditions",
      category: "Seasonal",
      region: "Arctic, Antarctic, High Altitude",
      duration: "2-4 weeks",
      image: "https://images.unsplash.com/photo-1548777123-e216912df7d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c25vdyUyMHRydWNrfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      author: "Elsa Frost",
    },
    {
      id: "5",
      title: "River Crossing Guide",
      description: "Safety procedures and techniques for fording rivers",
      category: "Terrain",
      region: "Global",
      duration: "Guide",
      image: "https://images.unsplash.com/photo-1516822003754-cca485356ecb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cml2ZXIlMjBjcm9zc2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      author: "Mark Waters",
    },
    {
      id: "6",
      title: "Jungle Navigation & Survival",
      description: "Essential information for tropical expeditions",
      category: "Terrain",
      region: "Amazon, Congo, Southeast Asia",
      duration: "2-3 weeks",
      image: "https://images.unsplash.com/photo-1596370743446-6a7ef43a36f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8anVuZ2xlJTIwcm9hZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      author: "Jenna Rainforest",
    }
  ];

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Adventure Guides
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore the world with your Unimog using our expedition and adventure guides.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Globe size={16} />
              <span>Regions</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Tag size={16} />
              <span>Filter</span>
            </Button>
            <Button className="bg-primary">
              <BookOpen size={16} className="mr-2" />
              New Adventure
            </Button>
          </div>
        </div>
        
        <KnowledgeNavigation />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {adventureGuides.map((guide) => (
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
                    <Globe size={14} />
                    <span>Region: {guide.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Duration: {guide.duration}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  By {guide.author}
                </div>
                <Button size="sm" asChild>
                  <Link to={`/knowledge/adventures/${guide.id}`}>Read Guide</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdventuresPage;
