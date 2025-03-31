
import { ReactNode } from 'react';
import { 
  ShoppingCart, 
  BookOpen, 
  Map, 
  Users, 
  MessageSquare, 
  Shield
} from 'lucide-react';

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: <ShoppingCart className="h-10 w-10 text-primary" />,
    title: "Marketplace",
    description: "Buy and sell Unimog parts and accessories with other community members."
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Knowledge Base",
    description: "Access comprehensive Unimog manuals and user-contributed repair guides."
  },
  {
    icon: <Map className="h-10 w-10 text-primary" />,
    title: "Trip Planning",
    description: "Discover and share off-road routes perfect for your Unimog's specifications."
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Community Forums",
    description: "Connect with fellow Unimog enthusiasts and share your experiences."
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Real-time Messaging",
    description: "Stay connected with other drivers while on expeditions."
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "AI Assistance",
    description: "Get expert help from our AI that knows everything about Unimogs."
  }
];
