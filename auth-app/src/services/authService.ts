import { eventBus } from '../eventBus';
import { store } from '../store';
import { login as loginAction, logout as logoutAction } from '../store/authSlice';

class AuthService {
  constructor() {
    // Subscribe to Redux store changes and emit events
    store.subscribe(() => {
      const state = store.getState();
      const { token, userData } = state.auth;
      
      // Emit auth state change event for other MFs
      eventBus.emit({
        type: 'AUTH_STATE_CHANGE',
        payload: { token, userData }
      });
    });

    // Subscribe to auth events from other MFs
    eventBus.onAuth().subscribe((event: any) => {
      switch (event.type) {
        case 'AUTH_STATE_CHANGE':
          if (event.payload === 'REQUEST_STATE') {
            // Respond with current auth state
            const state = store.getState();
            eventBus.emit({
              type: 'AUTH_STATE_CHANGE',
              payload: { token: state.auth.token, userData: state.auth.userData }
            });
          }
          break;
      }
    });
  }

  public login(): void {
    store.dispatch(loginAction());
  }

  public logout(): void {
    store.dispatch(logoutAction());
  }
}

// Create singleton instance
export const authService = new AuthService();
