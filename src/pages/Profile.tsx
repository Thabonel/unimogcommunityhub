
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { toast } = useToast();
  
  // Mock user data - in a real app this would come from authentication/context
  const initialUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L',
    about: 'Unimog enthusiast since 2015. I use my vehicle for both work and adventure travel. Currently exploring modifications for improved off-road capability.',
    location: 'Munich, Germany',
    website: 'www.myunimogadventures.com',
    joinDate: '2023-05-10',
  };
  
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUserData);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the updated user data
    setUserData(formData);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };
  
  return (
    <Layout isLoggedIn={true} user={userData}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-unimog-800 dark:text-unimog-200">
          My Profile
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <Avatar className="h-28 w-28 mb-4">
                  <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                  <AvatarFallback className="bg-unimog-500 text-unimog-50 text-xl">
                    {userData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
                <p className="text-muted-foreground mb-4">{userData.unimogModel} Owner</p>
                
                <div className="w-full text-sm space-y-3 mb-6">
                  <div>
                    <span className="font-medium">Location:</span> {userData.location}
                  </div>
                  {userData.website && (
                    <div>
                      <span className="font-medium">Website:</span>{" "}
                      <a href={`https://${userData.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {userData.website}
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Member since:</span>{" "}
                    {new Date(userData.joinDate).toLocaleDateString()}
                  </div>
                </div>
                
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main profile content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
              </TabsList>
              
              {/* Overview tab content */}
              <TabsContent value="overview">
                {isEditing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">
                            Contact support to change your email address
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="unimogModel">Unimog Model</Label>
                          <Input 
                            id="unimogModel" 
                            name="unimogModel" 
                            value={formData.unimogModel} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="about">About</Label>
                          <Textarea 
                            id="about" 
                            name="about" 
                            rows={4} 
                            value={formData.about} 
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input 
                              id="location" 
                              name="location" 
                              value={formData.location} 
                              onChange={handleInputChange} 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input 
                              id="website" 
                              name="website" 
                              value={formData.website} 
                              onChange={handleInputChange} 
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setFormData(userData);
                            }}
                          >
                            Cancel
                          </Button>
                          
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{userData.about}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Your recent activities will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
              
              {/* Activity tab content */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No activities to display yet.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your forum posts, marketplace listings, and other activities will show up here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Vehicles tab content */}
              <TabsContent value="vehicles">
                <Card>
                  <CardHeader>
                    <CardTitle>My Vehicles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Unimog {userData.unimogModel}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Added on {new Date(userData.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Link to="/unimog-u1700l">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <Button>
                      Add Another Vehicle
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
