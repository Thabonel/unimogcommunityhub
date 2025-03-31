
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

// Create icon components using a function that returns the icons with proper props
const createIcon = (Icon: any) => <Icon className="h-10 w-10 text-primary" />;

export const features: Feature[] = [
  {
    icon: createIcon(ShoppingCart),
    title: "Marketplace",
    description: "Buy and sell Unimog parts and accessories with other community members."
  },
  {
    icon: createIcon(BookOpen),
    title: "Knowledge Base",
    description: "Access comprehensive Unimog manuals and user-contributed repair guides."
  },
  {
    icon: createIcon(Map),
    title: "Trip Planning",
    description: "Discover and share off-road routes perfect for your Unimog's specifications."
  },
  {
    icon: createIcon(Users),
    title: "Community Forums",
    description: "Connect with fellow Unimog enthusiasts and share your experiences."
  },
  {
    icon: createIcon(MessageSquare),
    title: "Real-time Messaging",
    description: "Stay connected with other drivers while on expeditions."
  },
  {
    icon: createIcon(Shield),
    title: "AI Assistance",
    description: "Get expert help from our AI that knows everything about Unimogs."
  }
];
