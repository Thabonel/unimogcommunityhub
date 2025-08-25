/**
 * Initialization Sequencer
 * Ensures proper startup order to prevent race conditions
 */

import { logger } from '@/utils/logger';

export enum InitializationPhase {
  ENVIRONMENT_CHECK = 'environment_check',
  CLIENT_SETUP = 'client_setup',
  AUTH_INIT = 'auth_init',
  TOKEN_MANAGER = 'token_manager',
  RECOVERY_SERVICE = 'recovery_service',
  APP_READY = 'app_ready',
}

interface InitStep {
  id: string;
  phase: InitializationPhase;
  handler: () => Promise<void>;
  critical?: boolean;
  timeout?: number;
  dependencies?: string[];
}

interface InitializationState {
  currentPhase: InitializationPhase | null;
  completedSteps: Set<string>;
  failedSteps: Set<string>;
  isInitializing: boolean;
  isInitialized: boolean;
  startTime: number;
  endTime: number | null;
}

class InitializationSequencer {
  private static instance: InitializationSequencer;
  private steps: Map<string, InitStep> = new Map();
  private state: InitializationState;
  private listeners: Map<string, Set<Function>> = new Map();
  private initPromise: Promise<void> | null = null;

  private constructor() {
    this.state = {
      currentPhase: null,
      completedSteps: new Set(),
      failedSteps: new Set(),
      isInitializing: false,
      isInitialized: false,
      startTime: 0,
      endTime: null,
    };
  }

  static getInstance(): InitializationSequencer {
    if (!InitializationSequencer.instance) {
      InitializationSequencer.instance = new InitializationSequencer();
    }
    return InitializationSequencer.instance;
  }

  /**
   * Register an initialization step
   */
  registerStep(step: InitStep): void {
    this.steps.set(step.id, step);
    logger.debug(`Registered init step: ${step.id}`, { 
      component: 'InitializationSequencer',
      phase: step.phase,
      critical: step.critical 
    });
  }

  /**
   * Start the initialization sequence
   */
  async initialize(): Promise<void> {
    // Prevent multiple initializations
    if (this.state.isInitializing || this.state.isInitialized) {
      logger.debug('Initialization already in progress or completed', { 
        component: 'InitializationSequencer',
        isInitializing: this.state.isInitializing,
        isInitialized: this.state.isInitialized 
      });
      return this.initPromise || Promise.resolve();
    }

    this.initPromise = this.runInitialization();
    return this.initPromise;
  }

  /**
   * Run the initialization sequence
   */
  private async runInitialization(): Promise<void> {
    this.state.isInitializing = true;
    this.state.startTime = Date.now();
    
    logger.info('Starting initialization sequence', { 
      component: 'InitializationSequencer',
      stepCount: this.steps.size 
    });

    // Emit initialization started event
    this.emit('initStarted', { stepCount: this.steps.size });

    try {
      // Execute phases in order
      const phases = [
        InitializationPhase.ENVIRONMENT_CHECK,
        InitializationPhase.CLIENT_SETUP,
        InitializationPhase.AUTH_INIT,
        InitializationPhase.TOKEN_MANAGER,
        InitializationPhase.RECOVERY_SERVICE,
        InitializationPhase.APP_READY,
      ];

      for (const phase of phases) {
        await this.executePhase(phase);
      }

      this.state.isInitialized = true;
      this.state.isInitializing = false;
      this.state.endTime = Date.now();
      
      const duration = this.state.endTime - this.state.startTime;
      
      logger.info(`Initialization completed in ${duration}ms`, { 
        component: 'InitializationSequencer',
        duration,
        completedSteps: this.state.completedSteps.size,
        failedSteps: this.state.failedSteps.size 
      });

      // Emit initialization completed event
      this.emit('initCompleted', { 
        duration,
        completedSteps: Array.from(this.state.completedSteps),
        failedSteps: Array.from(this.state.failedSteps)
      });

    } catch (error) {
      this.state.isInitializing = false;
      this.state.endTime = Date.now();
      
      logger.error('Initialization sequence failed', error, { 
        component: 'InitializationSequencer',
        currentPhase: this.state.currentPhase,
        failedSteps: Array.from(this.state.failedSteps) 
      });

      // Emit initialization failed event
      this.emit('initFailed', { 
        error,
        currentPhase: this.state.currentPhase,
        failedSteps: Array.from(this.state.failedSteps)
      });

      throw error;
    }
  }

  /**
   * Execute all steps in a phase
   */
  private async executePhase(phase: InitializationPhase): Promise<void> {
    this.state.currentPhase = phase;
    
    logger.info(`Starting phase: ${phase}`, { 
      component: 'InitializationSequencer' 
    });

    // Emit phase started event
    this.emit('phaseStarted', { phase });

    // Get all steps for this phase
    const phaseSteps = Array.from(this.steps.values()).filter(
      step => step.phase === phase
    );

    if (phaseSteps.length === 0) {
      logger.debug(`No steps for phase: ${phase}`, { 
        component: 'InitializationSequencer' 
      });
      return;
    }

    // Sort steps by dependencies
    const sortedSteps = this.sortByDependencies(phaseSteps);

    // Execute steps
    for (const step of sortedSteps) {
      await this.executeStep(step);
    }

    logger.info(`Completed phase: ${phase}`, { 
      component: 'InitializationSequencer' 
    });

    // Emit phase completed event
    this.emit('phaseCompleted', { phase });
  }

  /**
   * Execute a single initialization step
   */
  private async executeStep(step: InitStep): Promise<void> {
    // Check dependencies
    if (step.dependencies) {
      for (const dep of step.dependencies) {
        if (!this.state.completedSteps.has(dep)) {
          if (step.critical) {
            throw new Error(`Critical step ${step.id} missing dependency: ${dep}`);
          } else {
            logger.warn(`Skipping step ${step.id} - missing dependency: ${dep}`, { 
              component: 'InitializationSequencer' 
            });
            return;
          }
        }
      }
    }

    logger.debug(`Executing step: ${step.id}`, { 
      component: 'InitializationSequencer',
      phase: step.phase 
    });

    // Emit step started event
    this.emit('stepStarted', { step: step.id, phase: step.phase });

    try {
      // Execute with timeout
      const timeout = step.timeout || 10000; // Default 10 seconds
      await this.executeWithTimeout(step.handler(), timeout, step.id);
      
      this.state.completedSteps.add(step.id);
      
      logger.debug(`Completed step: ${step.id}`, { 
        component: 'InitializationSequencer' 
      });

      // Emit step completed event
      this.emit('stepCompleted', { step: step.id, phase: step.phase });

    } catch (error) {
      this.state.failedSteps.add(step.id);
      
      logger.error(`Step failed: ${step.id}`, error, { 
        component: 'InitializationSequencer',
        phase: step.phase,
        critical: step.critical 
      });

      // Emit step failed event
      this.emit('stepFailed', { step: step.id, phase: step.phase, error });

      if (step.critical) {
        throw new Error(`Critical initialization step failed: ${step.id}`);
      }
    }
  }

  /**
   * Execute a promise with timeout
   */
  private executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    stepId: string
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Step ${stepId} timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      promise
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Sort steps by dependencies
   */
  private sortByDependencies(steps: InitStep[]): InitStep[] {
    const sorted: InitStep[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (step: InitStep) => {
      if (visited.has(step.id)) return;
      if (visiting.has(step.id)) {
        throw new Error(`Circular dependency detected: ${step.id}`);
      }

      visiting.add(step.id);

      if (step.dependencies) {
        for (const depId of step.dependencies) {
          const depStep = steps.find(s => s.id === depId);
          if (depStep) {
            visit(depStep);
          }
        }
      }

      visiting.delete(step.id);
      visited.add(step.id);
      sorted.push(step);
    };

    for (const step of steps) {
      visit(step);
    }

    return sorted;
  }

  /**
   * Wait for initialization to complete
   */
  async waitForInitialization(): Promise<void> {
    if (this.state.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    // If not started, start it
    return this.initialize();
  }

  /**
   * Check if a specific step is completed
   */
  isStepCompleted(stepId: string): boolean {
    return this.state.completedSteps.has(stepId);
  }

  /**
   * Check if a specific phase is completed
   */
  isPhaseCompleted(phase: InitializationPhase): boolean {
    const phaseSteps = Array.from(this.steps.values()).filter(
      step => step.phase === phase
    );

    return phaseSteps.every(step => 
      this.state.completedSteps.has(step.id) || 
      (!step.critical && this.state.failedSteps.has(step.id))
    );
  }

  /**
   * Get current state
   */
  getState(): InitializationState {
    return { ...this.state };
  }

  /**
   * Subscribe to initialization events
   */
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Unsubscribe from initialization events
   */
  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit initialization event
   */
  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logger.error('Event listener error', error, { 
          component: 'InitializationSequencer',
          event 
        });
      }
    });
  }

  /**
   * Reset state (for testing)
   */
  reset() {
    this.state = {
      currentPhase: null,
      completedSteps: new Set(),
      failedSteps: new Set(),
      isInitializing: false,
      isInitialized: false,
      startTime: 0,
      endTime: null,
    };
    this.initPromise = null;
    this.steps.clear();
  }
}

// Export singleton instance
export const initSequencer = InitializationSequencer.getInstance();
export default initSequencer;