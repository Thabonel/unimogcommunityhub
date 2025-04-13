
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SubscriptionSection from "@/components/profile/SubscriptionSection";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Import existing components and hooks

interface ProfileSidebarProps {
  userData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProfileSidebar({ userData, activeTab, setActiveTab }: ProfileSidebarProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === userData?.id;
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "vehicles", label: "Vehicles" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="w-full lg:w-64 space-y-6">
      {/* Avatar and basic info */}
      <div className="flex flex-col items-center p-4 space-y-4 bg-background border rounded-lg">
        <Avatar className="h-24 w-24">
          <AvatarImage src={userData?.avatar_url || ""} alt={userData?.full_name || "User"} />
          <AvatarFallback>{getInitials(userData?.full_name || "User")}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-bold">{userData?.full_name || "User"}</h2>
          <p className="text-sm text-muted-foreground">{userData?.location || ""}</p>
        </div>
        <div className="w-full">
          {isOwnProfile && (
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/profile/edit'}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-background border rounded-lg overflow-hidden">
        <nav className="flex flex-col">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              className={`justify-start rounded-none h-auto py-3 ${
                activeTab === tab.id ? "bg-secondary" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Subscription status - only show on own profile */}
      {isOwnProfile && (
        <ErrorBoundary fallback={<div className="bg-background border rounded-lg p-4">Subscription information unavailable</div>}>
          <SubscriptionSection />
        </ErrorBoundary>
      )}
    </div>
  );
}

export default ProfileSidebar;
