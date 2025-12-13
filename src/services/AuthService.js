import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';
import * as Random from 'expo-random';

const AUTH_KEY = 'auth_session';
const DEVICE_ID_KEY = 'device_id';

export const AuthService = {
  /**
   * Get or create a unique device ID.
   * We try to use native identifiers first, but fallback to a generated UUID stored in SecureStore.
   */
  async getDeviceId() {
    try {
      // 1. Check if we already have a stored device ID
      let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

      if (deviceId) {
        return deviceId;
      }

      // 2. If not, try to get a native ID
      if (Platform.OS === 'android') {
        deviceId = Application.androidId;
      } else if (Platform.OS === 'ios') {
        deviceId = await Application.getIosIdForVendorAsync();
      }

      // 3. If native ID is available, use it (and store it for consistency, though native APIs are stable)
      // 4. If native ID is NOT available (or fails), generate a UUID
      if (!deviceId) {
        deviceId = uuid.v4();
      }

      // Store it securely
      await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);

      return deviceId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      // Fallback: generate a random string one-time if secure store fails entirely
      return `fallback-${Date.now()}-${Math.random()}`;
    }
  },

  /**
   * Perform anonymous login using the device ID.
   * In a real backend, this would send the Device ID to the server to get a session token.
   * Here, we just simulate creating a session.
   */
  async loginAnonymously() {
    try {
      const deviceId = await this.getDeviceId();
      console.log('Logging in with Device ID:', deviceId);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock Session Object
      const session = {
        token: `mock-token-${deviceId}`,
        user: {
          id: deviceId,
          isAnonymous: true,
          lastLogin: new Date().toISOString(),
        }
      };

      // Store session
      await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(session));

      return session;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Check if user is currently logged in
   */
  async isLoggedIn() {
    try {
      const session = await SecureStore.getItemAsync(AUTH_KEY);
      return !!session;
    } catch (error) {
      return false;
    }
  },

  /**
   * Logout (Clear session)
   */
  async logout() {
    await SecureStore.deleteItemAsync(AUTH_KEY);
  }
};
