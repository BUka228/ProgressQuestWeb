import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User, UserPreferences } from '@/types'
import { handleFirebaseError } from './firebase'

const USERS_COLLECTION = 'users'

export class UserService {
  // Create a new user document
  static async createUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      
      const defaultPreferences: UserPreferences = {
        theme: 'system',
        language: 'ru',
        timezone: 'Europe/Moscow',
        notifications: {
          email: true,
          push: true,
          desktop: true,
          taskReminders: true,
          pomodoroBreaks: true,
          achievements: true,
          weeklyReports: true,
        },
        pomodoro: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4,
          autoStartBreaks: false,
          autoStartPomodoros: false,
          soundEnabled: true,
          soundVolume: 50,
        },
        gamification: {
          showBadges: true,
          showLevel: true,
          showXP: true,
          showStreak: true,
          gardenEnabled: true,
          soundEffects: true,
        },
      }

      const user: User = {
        id: userId,
        email: userData.email || '',
        displayName: userData.displayName || '',
        photoURL: userData.photoURL,
        role: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: defaultPreferences,
        achievements: [],
        level: 1,
        xp: 0,
        streakCount: 0,
        totalTasksCompleted: 0,
        totalPomodoroCompleted: 0,
        ...userData,
      }

      await setDoc(userRef, {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Get user by ID
  static async getUser(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const data = userSnap.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User
      }
      
      return null
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Update user
  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Update user preferences
  static async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      await updateDoc(userRef, {
        preferences,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Add XP to user
  static async addXP(userId: string, xpAmount: number): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User
        const newXP = userData.xp + xpAmount
        const newLevel = this.calculateLevel(newXP)
        
        await updateDoc(userRef, {
          xp: newXP,
          level: newLevel,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Update streak count
  static async updateStreak(userId: string, streakCount: number): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      await updateDoc(userRef, {
        streakCount,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Increment task completion count
  static async incrementTaskCount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User
        await updateDoc(userRef, {
          totalTasksCompleted: userData.totalTasksCompleted + 1,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Increment pomodoro completion count
  static async incrementPomodoroCount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User
        await updateDoc(userRef, {
          totalPomodoroCompleted: userData.totalPomodoroCompleted + 1,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      await deleteDoc(userRef)
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Helper method to calculate level from XP
  private static calculateLevel(xp: number): number {
    const baseXP = 100
    const multiplier = 1.5
    let level = 1
    let requiredXP = 0
    
    while (requiredXP <= xp) {
      level++
      requiredXP += Math.floor(baseXP * Math.pow(multiplier, level - 2))
    }
    
    return level - 1
  }
}
