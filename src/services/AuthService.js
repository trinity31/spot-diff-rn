import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateReady = false;
    this.authReadyPromise = null;
    this.initAuthListener();
  }

  initAuthListener() {
    // Auth 상태가 준비될 때까지 기다리는 Promise 생성
    this.authReadyPromise = new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        this.authStateReady = true;

        if (user) {
          console.log('User signed in:', user.uid);
        } else {
          console.log('No user signed in');
        }

        // 첫 번째 콜백에서만 resolve
        if (!this.authStateResolved) {
          this.authStateResolved = true;
          resolve(user);
        }
      });
    });
  }

  async loginAnonymously() {
    try {
      const result = await signInAnonymously(auth);
      console.log('Firebase anonymous login successful:', result.user.uid);
      return { userId: result.user.uid };
    } catch (error) {
      console.error('Firebase auth error:', error);
      throw error;
    }
  }

  async isLoggedIn() {
    // Auth 상태가 준비될 때까지 기다림
    if (!this.authStateReady) {
      await this.authReadyPromise;
    }
    return !!this.currentUser;
  }

  async getUserId() {
    // Auth 상태가 준비될 때까지 기다림
    if (!this.authStateReady) {
      await this.authReadyPromise;
    }
    return this.currentUser?.uid;
  }

  async logout() {
    try {
      await auth.signOut();
      this.currentUser = null;
      console.log('User signed out');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export default new AuthService();

// Named export for backward compatibility
export { AuthService as AuthServiceClass };
