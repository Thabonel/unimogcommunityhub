/**
 * Version Detection System
 * Detects when a new version of the app is deployed and prompts for refresh
 */

const VERSION_CHECK_INTERVAL = 60000; // Check every minute
const VERSION_KEY = 'app-build-version';

export class VersionDetector {
  private static instance: VersionDetector;
  private checkInterval: number | null = null;
  private currentVersion: string | null = null;

  static getInstance(): VersionDetector {
    if (!VersionDetector.instance) {
      VersionDetector.instance = new VersionDetector();
    }
    return VersionDetector.instance;
  }

  initialize() {
    // Get current version from meta tag
    this.currentVersion = this.getCurrentVersion();

    // Store version in localStorage if not already there
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (!storedVersion && this.currentVersion) {
      localStorage.setItem(VERSION_KEY, this.currentVersion);
    } else if (storedVersion && storedVersion !== this.currentVersion && this.currentVersion) {
      // Only show notification if we have a valid current version and it's actually different
      console.log(`Version change detected: ${storedVersion} -> ${this.currentVersion}`);
      localStorage.setItem(VERSION_KEY, this.currentVersion);
      // Don't auto-reload, just show notification
      this.showUpdateNotification();
      return;
    }

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SERVICE_WORKER_UPDATED') {
          console.log('Service worker update detected');
          this.handleNewVersion();
        }
      });
    }

    // Start periodic checks
    this.startChecking();
  }

  private getCurrentVersion(): string | null {
    const meta = document.querySelector('meta[name="build-timestamp"]');
    return meta?.getAttribute('content') || null;
  }

  private async checkForNewVersion() {
    try {
      // Fetch the HTML to check for new version
      const response = await fetch('/', {
        method: 'HEAD',
        cache: 'no-cache'
      });

      // Check if there's a new build timestamp in headers
      const newBuildTime = response.headers.get('x-build-timestamp');
      if (newBuildTime && newBuildTime !== this.currentVersion) {
        this.handleNewVersion();
      }
    } catch (error) {
      console.error('Version check failed:', error);
    }
  }

  private handleNewVersion() {
    console.log('New version detected via service worker or periodic check');

    // Just show notification, don't force reload
    this.showUpdateNotification();
  }

  private showUpdateNotification() {
    // Check if we've already shown this notification recently
    const lastNotification = sessionStorage.getItem('version-update-shown');
    if (lastNotification) return;

    sessionStorage.setItem('version-update-shown', 'true');

    // Create a custom event that components can listen to
    window.dispatchEvent(new CustomEvent('app-update-available', {
      detail: { version: this.currentVersion }
    }));
  }

  private startChecking() {
    if (this.checkInterval) return;

    this.checkInterval = window.setInterval(() => {
      this.checkForNewVersion();
    }, VERSION_CHECK_INTERVAL);
  }

  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  const detector = VersionDetector.getInstance();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => detector.initialize());
  } else {
    detector.initialize();
  }
}