/**
 * Local Storage Service for Privacy Mode
 * Stores location data locally in browser instead of server
 */

interface LocalTrip {
  id: string;
  vehicle_id: string;
  trip_name?: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  distance_km: number;
  duration_minutes: number;
  trip_type: string;
  average_speed_kmh: number;
  fuel_consumed_liters?: number;
  notes?: string;
  created_at: string;
}

interface LocalCheckin {
  id: string;
  vehicle_id: string;
  location_name: string;
  activity_type: string;
  notes?: string;
  checked_in_at: string;
  coordinates?: { lat: number; lng: number };
}

interface LocalLocationData {
  trips: LocalTrip[];
  checkins: LocalCheckin[];
  settings: any;
}

export class LocalStorageService {
  private static STORAGE_KEY = 'unimog_location_data';
  private static MAX_TRIPS = 100; // Limit to prevent storage overflow
  private static MAX_CHECKINS = 200;

  /**
   * Get all local location data
   */
  static getLocalData(): LocalLocationData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading local storage:', error);
    }

    return {
      trips: [],
      checkins: [],
      settings: {}
    };
  }

  /**
   * Save trip locally
   */
  static saveLocalTrip(trip: Omit<LocalTrip, 'id' | 'created_at'>): LocalTrip {
    const data = this.getLocalData();

    const newTrip: LocalTrip = {
      ...trip,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };

    // Add new trip
    data.trips.unshift(newTrip);

    // Limit stored trips to prevent overflow
    if (data.trips.length > this.MAX_TRIPS) {
      data.trips = data.trips.slice(0, this.MAX_TRIPS);
    }

    this.saveData(data);
    return newTrip;
  }

  /**
   * Save checkin locally
   */
  static saveLocalCheckin(checkin: Omit<LocalCheckin, 'id'>): LocalCheckin {
    const data = this.getLocalData();

    const newCheckin: LocalCheckin = {
      ...checkin,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Add new checkin
    data.checkins.unshift(newCheckin);

    // Limit stored checkins
    if (data.checkins.length > this.MAX_CHECKINS) {
      data.checkins = data.checkins.slice(0, this.MAX_CHECKINS);
    }

    this.saveData(data);
    return newCheckin;
  }

  /**
   * Get local trips for a vehicle
   */
  static getLocalTrips(vehicleId: string, limit: number = 10): LocalTrip[] {
    const data = this.getLocalData();
    return data.trips
      .filter(trip => trip.vehicle_id === vehicleId)
      .slice(0, limit);
  }

  /**
   * Get local checkins for a vehicle
   */
  static getLocalCheckins(vehicleId: string, limit: number = 10): LocalCheckin[] {
    const data = this.getLocalData();
    return data.checkins
      .filter(checkin => checkin.vehicle_id === vehicleId)
      .slice(0, limit);
  }

  /**
   * Calculate local usage statistics
   */
  static getLocalUsageStats(vehicleId: string, periodDays: number = 30) {
    const data = this.getLocalData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);

    const recentTrips = data.trips.filter(trip => {
      return trip.vehicle_id === vehicleId &&
             new Date(trip.created_at) > cutoffDate;
    });

    const totalDistance = recentTrips.reduce((sum, trip) => sum + trip.distance_km, 0);
    const totalMinutes = recentTrips.reduce((sum, trip) => sum + trip.duration_minutes, 0);
    const offRoadTrips = recentTrips.filter(trip => trip.trip_type === 'off-road').length;

    return {
      total_distance_km: totalDistance,
      total_operating_hours: totalMinutes / 60,
      off_road_percentage: recentTrips.length > 0 ? (offRoadTrips / recentTrips.length) * 100 : 0,
      average_speed_kmh: totalMinutes > 0 ? (totalDistance / (totalMinutes / 60)) : 0,
      trip_count: recentTrips.length
    };
  }

  /**
   * Save settings locally
   */
  static saveLocalSettings(settings: any) {
    const data = this.getLocalData();
    data.settings = settings;
    this.saveData(data);
  }

  /**
   * Get local settings
   */
  static getLocalSettings() {
    const data = this.getLocalData();
    return data.settings;
  }

  /**
   * Clear all local data
   */
  static clearLocalData() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Export local data as JSON
   */
  static exportLocalData(): string {
    const data = this.getLocalData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import local data from JSON
   */
  static importLocalData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.trips && data.checkins) {
        this.saveData(data);
        return true;
      }
    } catch (error) {
      console.error('Error importing data:', error);
    }
    return false;
  }

  /**
   * Get storage size info
   */
  static getStorageInfo() {
    const data = JSON.stringify(this.getLocalData());
    const sizeInBytes = new Blob([data]).size;
    const sizeInKB = sizeInBytes / 1024;

    return {
      sizeInBytes,
      sizeInKB: sizeInKB.toFixed(2),
      tripsCount: this.getLocalData().trips.length,
      checkinsCount: this.getLocalData().checkins.length,
      percentUsed: (sizeInKB / 5120) * 100 // Assuming 5MB limit for localStorage
    };
  }

  /**
   * Save data to localStorage
   */
  private static saveData(data: LocalLocationData) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Storage full - remove oldest entries
        console.warn('Local storage full, removing oldest entries');
        data.trips = data.trips.slice(0, Math.floor(this.MAX_TRIPS * 0.8));
        data.checkins = data.checkins.slice(0, Math.floor(this.MAX_CHECKINS * 0.8));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } else {
        throw error;
      }
    }
  }
}