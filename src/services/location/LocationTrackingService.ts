import { supabase } from '@/lib/supabase-client';

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

interface ActiveTrip {
  id: string;
  startTime: number;
  startLocation: LocationPoint;
  trackPoints: LocationPoint[];
  distance: number;
  isActive: boolean;
}

export class LocationTrackingService {
  private static instance: LocationTrackingService;
  private watchId: number | null = null;
  private activeTrip: ActiveTrip | null = null;
  private lastKnownLocation: LocationPoint | null = null;
  private settings: any = null;
  private userId: string | null = null;
  private vehicleId: string | null = null;

  // Trip detection parameters
  private readonly MOVEMENT_THRESHOLD = 0.001; // ~100m in degrees
  private readonly SPEED_THRESHOLD = 5; // km/h minimum speed to consider moving
  private readonly STATIONARY_TIME = 5 * 60 * 1000; // 5 minutes stationary = trip end
  private readonly MIN_TRIP_DISTANCE = 0.1; // km

  private constructor() {}

  static getInstance(): LocationTrackingService {
    if (!LocationTrackingService.instance) {
      LocationTrackingService.instance = new LocationTrackingService();
    }
    return LocationTrackingService.instance;
  }

  async initialize(userId: string, vehicleId: string) {
    this.userId = userId;
    this.vehicleId = vehicleId;
    await this.loadSettings();

    if (this.settings?.tracking_mode === 'automatic' && this.settings?.auto_tracking_enabled) {
      await this.startTracking();
    }
  }

  private async loadSettings() {
    if (!this.userId) return;

    try {
      const { data, error } = await supabase
        .from('location_tracking_settings')
        .select('*')
        .eq('user_id', this.userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading location settings:', error);
        return;
      }

      this.settings = data || {
        tracking_mode: 'manual',
        auto_tracking_enabled: false,
        minimum_trip_distance_km: 1.0,
        auto_detect_trip_start: true
      };
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async startTracking(): Promise<boolean> {
    if (!('geolocation' in navigator)) {
      console.error('Geolocation not supported');
      return false;
    }

    if (this.watchId !== null) {
      console.log('Tracking already active');
      return true;
    }

    try {
      // Check permission first
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        console.error('Location permission denied');
        return false;
      }

      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handleLocationUpdate(position),
        (error) => this.handleLocationError(error),
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000
        }
      );

      console.log('Location tracking started');
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('Location tracking stopped');
    }

    // End any active trip
    if (this.activeTrip) {
      this.endTrip();
    }
  }

  private async handleLocationUpdate(position: GeolocationPosition) {
    const locationPoint: LocationPoint = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined
    };

    // Store current location
    this.lastKnownLocation = locationPoint;

    // Handle trip detection if enabled
    if (this.settings?.auto_detect_trip_start) {
      await this.handleTripDetection(locationPoint);
    }

    // Add point to active trip if one exists
    if (this.activeTrip) {
      this.addPointToActiveTrip(locationPoint);
    }
  }

  private handleLocationError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('Location permission denied by user');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Location information unavailable');
        break;
      case error.TIMEOUT:
        console.error('Location request timeout');
        break;
      default:
        console.error('Unknown location error:', error);
        break;
    }
  }

  private async handleTripDetection(currentLocation: LocationPoint) {
    if (!this.lastKnownLocation) {
      this.lastKnownLocation = currentLocation;
      return;
    }

    const distance = this.calculateDistance(this.lastKnownLocation, currentLocation);
    const isMoving = distance > this.MOVEMENT_THRESHOLD ||
                    (currentLocation.speed && currentLocation.speed > this.SPEED_THRESHOLD);

    if (isMoving && !this.activeTrip) {
      // Start new trip
      await this.startTrip(currentLocation);
    } else if (!isMoving && this.activeTrip) {
      // Check if we should end the trip
      const timeSinceLastMovement = Date.now() - this.activeTrip.trackPoints[this.activeTrip.trackPoints.length - 1]?.timestamp;
      if (timeSinceLastMovement > this.STATIONARY_TIME) {
        await this.endTrip();
      }
    }
  }

  private async startTrip(startLocation: LocationPoint) {
    if (!this.userId || !this.vehicleId) return;

    try {
      // Create trip in database
      const { data, error } = await supabase
        .from('trip_logs')
        .insert([
          {
            user_id: this.userId,
            vehicle_id: this.vehicleId,
            start_location: `Auto-detected trip`,
            start_coordinates: `POINT(${startLocation.longitude} ${startLocation.latitude})`,
            start_time: new Date(startLocation.timestamp).toISOString(),
            tracking_method: 'automatic',
            is_active: true,
            gps_data: {
              startPoint: startLocation,
              trackPoints: []
            }
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating trip:', error);
        return;
      }

      this.activeTrip = {
        id: data.id,
        startTime: startLocation.timestamp,
        startLocation,
        trackPoints: [startLocation],
        distance: 0,
        isActive: true
      };

      console.log('Trip started automatically:', this.activeTrip.id);
    } catch (error) {
      console.error('Error starting trip:', error);
    }
  }

  private addPointToActiveTrip(locationPoint: LocationPoint) {
    if (!this.activeTrip) return;

    const lastPoint = this.activeTrip.trackPoints[this.activeTrip.trackPoints.length - 1];
    if (lastPoint) {
      const segmentDistance = this.calculateDistance(lastPoint, locationPoint);
      this.activeTrip.distance += segmentDistance;
    }

    this.activeTrip.trackPoints.push(locationPoint);

    // Update trip in database periodically (every 10 points or 5 minutes)
    if (this.activeTrip.trackPoints.length % 10 === 0 ||
        Date.now() - this.activeTrip.startTime > 5 * 60 * 1000) {
      this.updateTripInDatabase();
    }
  }

  private async endTrip() {
    if (!this.activeTrip) return;

    // Check minimum distance
    if (this.activeTrip.distance < (this.settings?.minimum_trip_distance_km || this.MIN_TRIP_DISTANCE)) {
      console.log('Trip too short, discarding');
      await this.deleteTripFromDatabase();
      this.activeTrip = null;
      return;
    }

    const endLocation = this.activeTrip.trackPoints[this.activeTrip.trackPoints.length - 1];
    const duration = (endLocation.timestamp - this.activeTrip.startTime) / (1000 * 60); // minutes
    const averageSpeed = duration > 0 ? (this.activeTrip.distance / (duration / 60)) : 0;

    try {
      const { error } = await supabase
        .from('trip_logs')
        .update({
          end_location: 'Auto-detected end',
          end_coordinates: `POINT(${endLocation.longitude} ${endLocation.latitude})`,
          end_time: new Date(endLocation.timestamp).toISOString(),
          distance_km: this.activeTrip.distance,
          duration_minutes: Math.round(duration),
          average_speed_kmh: Math.round(averageSpeed * 10) / 10,
          trip_type: this.classifyTripType(),
          is_active: false,
          gps_data: {
            startPoint: this.activeTrip.startLocation,
            trackPoints: this.activeTrip.trackPoints,
            totalDistance: this.activeTrip.distance,
            duration: duration
          }
        })
        .eq('id', this.activeTrip.id);

      if (error) {
        console.error('Error ending trip:', error);
      } else {
        console.log('Trip ended successfully:', this.activeTrip.id);
      }
    } catch (error) {
      console.error('Error ending trip:', error);
    }

    this.activeTrip = null;
  }

  private async updateTripInDatabase() {
    if (!this.activeTrip) return;

    try {
      await supabase
        .from('trip_logs')
        .update({
          gps_data: {
            startPoint: this.activeTrip.startLocation,
            trackPoints: this.activeTrip.trackPoints,
            currentDistance: this.activeTrip.distance
          }
        })
        .eq('id', this.activeTrip.id);
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  }

  private async deleteTripFromDatabase() {
    if (!this.activeTrip) return;

    try {
      await supabase
        .from('trip_logs')
        .delete()
        .eq('id', this.activeTrip.id);
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  }

  private classifyTripType(): string {
    if (!this.activeTrip) return 'mixed';

    // Simple classification based on average speed
    const duration = (this.activeTrip.trackPoints[this.activeTrip.trackPoints.length - 1].timestamp - this.activeTrip.startTime) / (1000 * 60 * 60);
    const averageSpeed = duration > 0 ? this.activeTrip.distance / duration : 0;

    if (averageSpeed > 60) return 'on-road';
    if (averageSpeed < 20) return 'off-road';
    return 'mixed';
  }

  private calculateDistance(point1: LocationPoint, point2: LocationPoint): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    const lat1 = this.toRadians(point1.latitude);
    const lat2 = this.toRadians(point2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Public methods for manual control
  async manualStartTrip(startLocation?: string): Promise<string | null> {
    if (!this.userId || !this.vehicleId) return null;

    const currentLocation = this.lastKnownLocation;
    if (!currentLocation && !startLocation) {
      throw new Error('No current location available');
    }

    try {
      const { data, error } = await supabase
        .from('trip_logs')
        .insert([
          {
            user_id: this.userId,
            vehicle_id: this.vehicleId,
            start_location: startLocation || 'Manual start',
            start_coordinates: currentLocation ? `POINT(${currentLocation.longitude} ${currentLocation.latitude})` : null,
            start_time: new Date().toISOString(),
            tracking_method: 'gps',
            is_active: true,
            gps_data: currentLocation ? {
              startPoint: currentLocation,
              trackPoints: [currentLocation]
            } : null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating manual trip:', error);
        return null;
      }

      if (currentLocation) {
        this.activeTrip = {
          id: data.id,
          startTime: currentLocation.timestamp,
          startLocation: currentLocation,
          trackPoints: [currentLocation],
          distance: 0,
          isActive: true
        };
      }

      return data.id;
    } catch (error) {
      console.error('Error starting manual trip:', error);
      return null;
    }
  }

  async manualEndTrip(endLocation?: string): Promise<boolean> {
    if (!this.activeTrip) return false;

    const endLocationPoint = this.lastKnownLocation || this.activeTrip.trackPoints[this.activeTrip.trackPoints.length - 1];
    const duration = (Date.now() - this.activeTrip.startTime) / (1000 * 60);
    const averageSpeed = duration > 0 ? (this.activeTrip.distance / (duration / 60)) : 0;

    try {
      const { error } = await supabase
        .from('trip_logs')
        .update({
          end_location: endLocation || 'Manual end',
          end_coordinates: endLocationPoint ? `POINT(${endLocationPoint.longitude} ${endLocationPoint.latitude})` : null,
          end_time: new Date().toISOString(),
          distance_km: this.activeTrip.distance,
          duration_minutes: Math.round(duration),
          average_speed_kmh: Math.round(averageSpeed * 10) / 10,
          trip_type: this.classifyTripType(),
          is_active: false
        })
        .eq('id', this.activeTrip.id);

      if (error) {
        console.error('Error ending manual trip:', error);
        return false;
      }

      this.activeTrip = null;
      return true;
    } catch (error) {
      console.error('Error ending manual trip:', error);
      return false;
    }
  }

  getCurrentLocation(): LocationPoint | null {
    return this.lastKnownLocation;
  }

  getActiveTrip(): ActiveTrip | null {
    return this.activeTrip;
  }

  isTracking(): boolean {
    return this.watchId !== null;
  }
}