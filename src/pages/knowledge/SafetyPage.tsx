import React from 'react';
import Layout from '@/components/Layout';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { 
  Shield, 
  Heart, 
  Smartphone, 
  MapPin, 
  Battery, 
  Radio, 
  AlertCircle, 
  FileText,
  Clock,
  Phone
} from 'lucide-react';

export default function SafetyPage() {
  const { user } = useAuth();
  const { userData } = useProfile();
  
  // Prepare user data for Layout with proper avatar logic
  const layoutUser = userData ? {
    name: userData.name || user?.email?.split('@')[0] || 'User',
    avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
      ? userData.vehiclePhotoUrl 
      : userData.avatarUrl,
    unimogModel: userData.unimogModel || '',
    vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
    useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
  } : undefined;
  const safetyTips = [
    {
      id: 1,
      icon: Heart,
      title: "First Aid Training and Kit",
      content: [
        "Get First Aid Trained: Regardless of your travel style or age, invest in first aid training. Knowing how to assess injuries, administer CPR, or treat common medical issues can be life-saving.",
        "Carry a Comprehensive First Aid Kit: Ensure your kit includes essentials like bandages, antiseptics, splints, medications (e.g., antihistamines, pain relievers), and supplies for managing bleeding, burns, or fractures. A well-stocked kit is crucial, especially in remote areas."
      ]
    },
    {
      id: 2,
      icon: Shield,
      title: "Stay Calm Under Pressure",
      content: [
        "Keep Your Composure: In an emergency, panic can escalate the situation. Staying calm helps you think clearly and provide effective care.",
        "Reassure the Patient: If the person in need is scared or unwell, your calm demeanor can prevent their condition from worsening. Speak gently, explain what you're doing, and keep them as comfortable as possible.",
        "Time is Critical in Remote Areas: Emergency services may take hours to arrive. Remaining calm ensures you can act effectively during this critical period."
      ]
    },
    {
      id: 3,
      icon: AlertCircle,
      title: "Dress Appropriately",
      content: [
        "Avoid Sleeping Naked in the Bush: This might sound odd, but if an emergency arises at night, you'll need to act quickly. Being dressed appropriately ensures you're ready to assist without delay."
      ]
    },
    {
      id: 4,
      icon: Smartphone,
      title: "Invest in Reliable Communication Tools",
      content: [
        "Starlink or Satellite Internet: These devices are game-changers in remote areas. They provide fast, reliable internet access, enabling you to contact emergency services within minutes.",
        "Satellite Phones: For extremely remote locations, a satellite phone is essential. It ensures communication when traditional networks fail.",
        "Two-Way Radios: Carry handheld radios with at least 5W power. They're invaluable for communicating with nearby stations, properties, or emergency teams. Channel 40 is commonly used, but confirm local frequencies when you arrive."
      ]
    },
    {
      id: 5,
      icon: MapPin,
      title: "Know How to Share Your Location",
      content: [
        "Use GPS Coordinates: Learn how to extract your exact location using your phone's GPS. Many apps work offline, so you can still share coordinates even without cell service.",
        "What3Words: This innovative system divides the world into 3-meter squares, each with a unique three-word address. Australian emergency services widely use it. Familiarize yourself with it at what3words.com."
      ]
    },
    {
      id: 6,
      icon: Battery,
      title: "Keep Your Devices Ready",
      content: [
        "Charge Your Phone: Always carry a fully charged phone. Use airplane mode or turn it off to conserve battery in areas without service.",
        "Backup Power: Bring portable chargers or solar-powered devices to ensure your electronics stay functional."
      ]
    },
    {
      id: 7,
      icon: Radio,
      title: "Research Your Destination",
      content: [
        "Gather Key Information: Before leaving, research the nearest hospitals, towns, and emergency contacts. Note down UHF channels or other communication details specific to the area.",
        "Update Regularly: Details like hospital locations or radio frequencies can change, so verify them before each trip."
      ]
    },
    {
      id: 8,
      icon: FileText,
      title: "Create a Grab Book",
      content: [
        "Document Medical Information: Write down all medications, vitamins, allergies, and relevant medical history. Include dosages and conditions clearly.",
        "Vehicle Details: Add vehicle specifications (length, weight, etc.) to assist recovery teams if needed.",
        "Keep It Accessible: Store this information in a physical notebook or waterproof container, separate from electronic devices. Keep it in a backpack that's easy to grab in an emergency."
      ]
    },
    {
      id: 9,
      icon: Phone,
      title: "Ambulance Cover",
      content: [
        "Have Coverage: Always purchase ambulance cover before traveling. A small annual fee ensures peace of mind and financial protection.",
        "Never Hesitate to Call: If you need help, call emergency services immediately. Lives are priceless, and timely intervention can prevent complications."
      ]
    },
    {
      id: 10,
      icon: Clock,
      title: "Plan for the Unexpected",
      content: [
        "Discuss Emergency Protocols: Sit down with your travel companions and outline roles and responsibilities in case of an emergency. Practice scenarios to ensure everyone knows what to do.",
        "Prepare Mentally: While no one wants to dwell on worst-case scenarios, acknowledging the possibility prepares you to handle them better."
      ]
    }
  ];

  return (
    <Layout isLoggedIn={!!user} user={layoutUser}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <KnowledgeNavigation />
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Essential Safety Tips for Travellers</h1>
              <p className="text-muted-foreground mt-2">
                Preparing for emergencies and staying safe on your adventures
              </p>
            </div>
          </div>
          
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed">
                Travelling is an exciting adventure, whether you're exploring remote outback areas or simply heading off on a road trip. 
                However, emergencies can happen anywhere, and being prepared can make all the difference. Below is a comprehensive guide 
                to help you prepare for unforeseen situations, stay safe, and ensure a swift response in case of an emergency.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {safetyTips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <Card key={tip.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Tip {index + 1}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-foreground">
                        {tip.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {tip.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                        <p className="text-sm leading-relaxed text-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator className="my-8" />

        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-200 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Final Thoughts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              Emergencies can strike anytime, anywhere. The key to managing them lies in preparation, education, and quick thinking. 
              By following these tips, you'll significantly improve your chances of staying safe and responding effectively.
            </p>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Remember:</h4>
              <div className="grid gap-2">
                <div className="flex gap-2 text-sm">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span><strong>Preparation Saves Lives:</strong> From first aid kits to communication tools, every item you pack could prove invaluable.</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span><strong>Stay Informed:</strong> Knowledge about your surroundings and available resources empowers you to act decisively.</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span><strong>Teamwork Matters:</strong> Whether traveling solo or with a group, clear communication and shared responsibility enhance safety.</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mt-4">
              By sharing these insights, we hope to inspire fellow travelers to prioritize safety alongside adventure. 
              After all, the goal is to return home safely after every journey. <strong>Safe travels!</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex gap-2">
                <span>•</span>
                <span><strong>What3Words for Emergency Services:</strong> <a href="https://what3words.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">what3words.com</a></span>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <span><strong>First Aid Courses:</strong> Check local providers or organizations like St John Ambulance or Red Cross.</span>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <span><strong>Satellite Communication Devices:</strong> Explore options like Starlink, Garmin inReach, or Iridium satellite phones.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}