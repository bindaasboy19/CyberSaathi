"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db, firebaseEnabled } from "@/lib/firebase/client";
import { fetchUserProfile } from "@/lib/firebase/firestore";
import type { Language, UserProfile } from "@/types";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updatePreferences: (payload: Partial<Pick<UserProfile, "preferredLanguage">>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function hydrateProfile(user: User) {
  const existingProfile = await fetchUserProfile(user.uid);

  if (existingProfile) {
    return existingProfile;
  }

  const fallbackProfile: UserProfile = {
    uid: user.uid,
    name: user.displayName ?? user.email?.split("@")[0] ?? "CyberSaathi User",
    email: user.email ?? "",
    role: "user",
    preferredLanguage: "en",
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await setDoc(
      doc(db, "users", user.uid),
      {
        ...fallbackProfile,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  return fallbackProfile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!auth || !firebaseEnabled) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const nextProfile = await hydrateProfile(currentUser);
        setProfile(nextProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      configured: firebaseEnabled,
      async register(payload) {
        if (!auth || !db) {
          throw new Error("Firebase authentication is not configured.");
        }

        const credentials = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password,
        );

        const nextProfile: UserProfile = {
          uid: credentials.user.uid,
          name: payload.name,
          email: payload.email,
          role: "user",
          preferredLanguage: "en",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", credentials.user.uid), {
          ...nextProfile,
          createdAt: serverTimestamp(),
        });

        setProfile(nextProfile);
      },
      async login(payload) {
        if (!auth) {
          throw new Error("Firebase authentication is not configured.");
        }

        await signInWithEmailAndPassword(auth, payload.email, payload.password);
      },
      async logout() {
        if (!auth) {
          return;
        }

        await signOut(auth);
      },
      async refreshProfile() {
        if (!user) {
          return;
        }

        const nextProfile = await hydrateProfile(user);
        setProfile(nextProfile);
      },
      async updatePreferences(payload) {
        if (!user || !db) {
          return;
        }

        const preferredLanguage = payload.preferredLanguage as Language | undefined;

        await setDoc(
          doc(db, "users", user.uid),
          {
            preferredLanguage,
          },
          { merge: true },
        );

        setProfile((current) =>
          current
            ? {
                ...current,
                preferredLanguage: preferredLanguage ?? current.preferredLanguage,
              }
            : current,
        );
      },
    }),
    [loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
