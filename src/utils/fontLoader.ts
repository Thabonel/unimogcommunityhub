/**
 * Font Loader Utility
 * Handles self-hosted font loading with fallbacks and performance optimization
 * Eliminates Google Fonts CDN dependency that causes blank page cascade failures
 */

export type FontLoadingState = 'loading' | 'loaded' | 'error' | 'fallback';

export interface FontConfig {
  family: string;
  url: string;
  fallbacks: string[];
  loadingTimeout: number;
  displaySwap: boolean;
}

class FontLoader {
  private loadingStates = new Map<string, FontLoadingState>();
  private loadingPromises = new Map<string, Promise<void>>();
  private loadingTimeout = 5000; // 5 seconds default timeout

  constructor() {
    this.initializeDefaultFonts();
  }

  private initializeDefaultFonts(): void {
    // Initialize Special Elite font configuration
    this.registerFont({
      family: 'Special Elite',
      url: '/fonts/special-elite.ttf',
      fallbacks: ['Courier New', 'Typewriter', 'monospace', 'serif'],
      loadingTimeout: this.loadingTimeout,
      displaySwap: true
    });
  }

  public registerFont(config: FontConfig): void {
    this.loadingStates.set(config.family, 'loading');
  }

  public async loadFont(fontFamily: string): Promise<FontLoadingState> {
    // Return cached state if already processed
    const currentState = this.loadingStates.get(fontFamily);
    if (currentState && currentState !== 'loading') {
      return currentState;
    }

    // Return existing promise if already loading
    const existingPromise = this.loadingPromises.get(fontFamily);
    if (existingPromise) {
      await existingPromise;
      return this.loadingStates.get(fontFamily) || 'error';
    }

    // Create new loading promise
    const loadingPromise = this.performFontLoad(fontFamily);
    this.loadingPromises.set(fontFamily, loadingPromise);

    try {
      await loadingPromise;
      return this.loadingStates.get(fontFamily) || 'error';
    } finally {
      this.loadingPromises.delete(fontFamily);
    }
  }

  private async performFontLoad(fontFamily: string): Promise<void> {
    try {
      // Try FontFace API first (modern browsers)
      if ('FontFace' in window) {
        await this.loadWithFontFaceAPI(fontFamily);
        this.loadingStates.set(fontFamily, 'loaded');
        return;
      }

      // Fallback to CSS-based detection
      await this.loadWithCSSDetection(fontFamily);
      this.loadingStates.set(fontFamily, 'loaded');
      
    } catch (error) {
      console.warn(`Font loading failed for ${fontFamily}:`, error);
      this.loadingStates.set(fontFamily, 'fallback');
      
      // Apply fallback font immediately
      this.applyFallbackFont(fontFamily);
    }
  }

  private async loadWithFontFaceAPI(fontFamily: string): Promise<void> {
    if (fontFamily === 'Special Elite') {
      const font = new FontFace('Special Elite', 'url(/fonts/special-elite.ttf)', {
        display: 'swap'
      });

      // Set up timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Font loading timeout')), this.loadingTimeout);
      });

      // Race between font loading and timeout
      try {
        const loadedFont = await Promise.race([font.load(), timeoutPromise]);
        document.fonts.add(loadedFont);
      } catch (error) {
        throw new Error(`FontFace API loading failed: ${error}`);
      }
    }
  }

  private async loadWithCSSDetection(fontFamily: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create test elements to detect font loading
      const testElement = document.createElement('div');
      testElement.style.fontFamily = `${fontFamily}, monospace`;
      testElement.style.fontSize = '100px';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.style.top = '-9999px';
      testElement.style.visibility = 'hidden';
      testElement.textContent = 'BESbswy'; // Letters that vary significantly between fonts
      
      document.body.appendChild(testElement);
      
      const initialWidth = testElement.offsetWidth;
      const maxAttempts = 50; // 5 seconds with 100ms intervals
      let attempts = 0;

      const checkFont = () => {
        attempts++;
        const currentWidth = testElement.offsetWidth;
        
        if (currentWidth !== initialWidth) {
          // Font has loaded and changed the text width
          document.body.removeChild(testElement);
          resolve();
        } else if (attempts >= maxAttempts) {
          // Timeout reached
          document.body.removeChild(testElement);
          reject(new Error('CSS detection timeout'));
        } else {
          // Check again after 100ms
          setTimeout(checkFont, 100);
        }
      };

      // Start checking after a short delay
      setTimeout(checkFont, 100);
    });
  }

  private applyFallbackFont(fontFamily: string): void {
    // Apply fallback CSS class to body to handle font failure gracefully
    document.body.classList.add('font-rugged-fallback');
    
    // Update CSS custom property for fallback
    document.documentElement.style.setProperty(
      '--font-rugged', 
      "'Courier New', 'Typewriter', monospace, serif"
    );
  }

  public getLoadingState(fontFamily: string): FontLoadingState {
    return this.loadingStates.get(fontFamily) || 'loading';
  }

  public async loadAllFonts(): Promise<Map<string, FontLoadingState>> {
    const fontPromises = Array.from(this.loadingStates.keys()).map(async (fontFamily) => {
      const state = await this.loadFont(fontFamily);
      return [fontFamily, state] as [string, FontLoadingState];
    });

    const results = await Promise.allSettled(fontPromises);
    const stateMap = new Map<string, FontLoadingState>();

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const [fontFamily, state] = result.value;
        stateMap.set(fontFamily, state);
      } else {
        // Get font family from original array
        const fontFamily = Array.from(this.loadingStates.keys())[index];
        stateMap.set(fontFamily, 'error');
        this.loadingStates.set(fontFamily, 'error');
      }
    });

    return stateMap;
  }

  public preloadCriticalFonts(): void {
    // Preload Special Elite immediately for critical text
    this.loadFont('Special Elite').catch(() => {
      // Silent fallback - already handled in loadFont
    });
  }
}

// Singleton instance
let fontLoaderInstance: FontLoader | null = null;

export function getFontLoader(): FontLoader {
  if (!fontLoaderInstance) {
    fontLoaderInstance = new FontLoader();
  }
  return fontLoaderInstance;
}

export function initializeFontLoader(): FontLoader {
  const loader = getFontLoader();
  loader.preloadCriticalFonts();
  return loader;
}

// Utility function for React components
export function useFontLoader() {
  const loader = getFontLoader();
  
  return {
    loadFont: (fontFamily: string) => loader.loadFont(fontFamily),
    getLoadingState: (fontFamily: string) => loader.getLoadingState(fontFamily),
    loadAllFonts: () => loader.loadAllFonts()
  };
}