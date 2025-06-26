// Mock Firebase services for development when no real Firebase is configured

export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Simulate no user logged in
    setTimeout(() => callback(null), 100);
    return () => {}; // Unsubscribe function
  },
  signInWithEmailAndPassword: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  },
  createUserWithEmailAndPassword: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  },
  signOut: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  },
  signInWithPopup: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  },
  sendPasswordResetEmail: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  },
  updateProfile: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  },
  sendEmailVerification: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  },
  updatePassword: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  },
  reauthenticateWithCredential: async () => {
    throw new Error('Demo mode: Please configure Firebase to enable authentication');
  }
};

export const mockDb = {
  collection: () => ({
    doc: () => ({
      set: async () => {
        throw new Error('Demo mode: Please configure Firebase to enable database operations');
      },
      get: async () => {
        throw new Error('Demo mode: Please configure Firebase to enable database operations');
      },
      update: async () => {
        throw new Error('Demo mode: Please configure Firebase to enable database operations');
      },
      delete: async () => {
        throw new Error('Demo mode: Please configure Firebase to enable database operations');
      }
    }),
    add: async () => {
      throw new Error('Demo mode: Please configure Firebase to enable database operations');
    },
    get: async () => {
      throw new Error('Demo mode: Please configure Firebase to enable database operations');
    }
  }),
  doc: () => ({
    set: async () => {
      throw new Error('Demo mode: Please configure Firebase to enable database operations');
    },
    get: async () => {
      throw new Error('Demo mode: Please configure Firebase to enable database operations');
    },
    update: async () => {
      throw new Error('Demo mode: Please configure Firebase to enable database operations');
    },
    delete: async () => {
      throw new Error('Demo mode: Please configure Firebase to enable database operations');
    }
  })
};

// Check if we should use mock services
export const shouldUseMockServices = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return !apiKey || apiKey === 'demo_api_key';
};
