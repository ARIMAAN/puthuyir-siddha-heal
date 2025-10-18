interface SessionConfig {
  timeoutDuration: number; // in milliseconds
  warningTime: number; // time before expiry to show warning (in milliseconds)
  onSessionExpired: () => void;
  onSessionWarning?: () => void;
}

class SessionManager {
  private timeoutId: NodeJS.Timeout | null = null;
  private warningTimeoutId: NodeJS.Timeout | null = null;
  private config: SessionConfig;
  private lastActivity: number = Date.now();

  constructor(config: SessionConfig) {
    this.config = config;
    this.setupActivityListeners();
    this.resetTimeout();
  }

  private setupActivityListeners() {
    // Listen for user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, this.resetTimeout.bind(this), true);
    });
  }

  private resetTimeout() {
    this.lastActivity = Date.now();
    
    // Clear existing timeouts
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
    }

    // Set warning timeout
    if (this.config.onSessionWarning) {
      this.warningTimeoutId = setTimeout(() => {
        this.config.onSessionWarning?.();
      }, this.config.timeoutDuration - this.config.warningTime);
    }

    // Set session expiry timeout
    this.timeoutId = setTimeout(() => {
      this.handleSessionExpired();
    }, this.config.timeoutDuration);
  }

  private handleSessionExpired() {
    this.cleanup();
    this.config.onSessionExpired();
  }

  public extendSession() {
    this.resetTimeout();
  }

  public getRemainingTime(): number {
    const elapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.config.timeoutDuration - elapsed);
  }

  public isSessionActive(): boolean {
    return this.getRemainingTime() > 0;
  }

  public cleanup() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }

    // Remove event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.removeEventListener(event, this.resetTimeout.bind(this), true);
    });
  }
}

// Session timeout utility functions
export const SESSION_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
export const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('profileComplete');
  window.location.href = '/signin?message=session_expired';
};

export const checkTokenExpiry = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // Decode JWT token to check expiry
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    logout();
    return false;
  }
};

export const createSessionManager = (onSessionWarning?: () => void) => {
  return new SessionManager({
    timeoutDuration: SESSION_TIMEOUT,
    warningTime: WARNING_TIME,
    onSessionExpired: logout,
    onSessionWarning
  });
};

// API request interceptor to handle token expiry
export const handleApiError = (error: any) => {
  if (error.response?.status === 401 && error.response?.data?.expired) {
    logout();
  }
  throw error;
};

export default SessionManager;
