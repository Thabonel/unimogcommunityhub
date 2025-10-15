import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { EventCreationDialog } from '@/components/events/EventCreationDialog';
import { useEvents } from '@/hooks/use-events';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import type { EventFilters as EventFiltersType } from '@/services/events';

const Events = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const { userData } = useProfile();
  const [filters, setFilters] = useState<EventFiltersType>({ upcoming_only: true });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: events, isLoading, error } = useEvents(filters);

  // Build user data from profile and auth
  const layoutUser = userData ? {
    name: userData.name || authUser?.email?.split('@')[0] || 'User',
    avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl)
      ? userData.vehiclePhotoUrl
      : userData.avatarUrl,
    unimogModel: userData.unimogModel || '',
    vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
    useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
  } : undefined;

  return (
    <Layout isLoggedIn={!!authUser} user={layoutUser}>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Courier New, monospace' }}>
                EVENTS
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Organize trips, working bees, and meetups with fellow Unimog owners
              </p>
            </div>

            {authUser && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-military-green hover:bg-military-green/90 text-white"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                CREATE EVENT
              </Button>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Filters */}
          <div className="lg:col-span-1">
            <EventFilters
              filters={filters}
              onFiltersChange={setFilters}
              hasLocation={false}
            />
          </div>

          {/* Right: Events List */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  Failed to load events. Please try again later.
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg h-64"></div>
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-camo-brown">
                <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {authUser
                    ? 'Be the first to create an event for the community!'
                    : 'Sign in to see and create community events'}
                </p>
                {authUser && (
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-military-green hover:bg-military-green/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Event
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Creation Dialog */}
      <EventCreationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </Layout>
  );
};

export default Events;
