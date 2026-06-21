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
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

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
  try {
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
  } catch (error) {
    console.error("Failed to hydrate profile from Firestore (offline fallback):", error);
    return {
      uid: user.uid,
      name: user.displayName ?? user.email?.split("@")[0] ?? "CyberSaathi User",
      email: user.email ?? "",
      role: "user",
      preferredLanguage: "en",
      createdAt: new Date().toISOString(),
    } satisfies UserProfile;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [dbAvailable, setDbAvailable] = useState<boolean | null>(
    firebaseEnabled ? null : false
  );
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firebaseEnabled) {
      if (typeof window !== "undefined") {
        const storedUserRaw = window.localStorage.getItem("cybersaathi-demo-user");
        const storedProfileRaw = window.localStorage.getItem("cybersaathi-demo-profile");
        if (storedUserRaw && storedProfileRaw) {
          try {
            setUser(JSON.parse(storedUserRaw));
            setProfile(JSON.parse(storedProfileRaw));
          } catch {
            window.localStorage.removeItem("cybersaathi-demo-user");
            window.localStorage.removeItem("cybersaathi-demo-profile");
          }
        }
      }
      setDbAvailable(false);
      setLoading(false);
      return;
    }

    let active = true;
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      let available = true;
      try {
        const checkRef = doc(db!, "healthz", "check");
        await getDoc(checkRef);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "";
        console.warn("Firestore database check warning:", errMsg);
        const errMsgLower = errMsg.toLowerCase();
        if (
          errMsgLower.includes("database") &&
          (errMsgLower.includes("not found") ||
            errMsgLower.includes("not-found") ||
            errMsgLower.includes("exist") ||
            errMsgLower.includes("missing"))
        ) {
          available = false;
        }
      }

      if (!active) return;
      setDbAvailable(available);

      unsubscribe = onAuthStateChanged(auth!, async (currentUser) => {
        if (!active) return;
        setUser(currentUser);

        if (currentUser) {
          const nextProfile = available
            ? await hydrateProfile(currentUser)
            : {
                uid: currentUser.uid,
                name: currentUser.displayName ?? currentUser.email?.split("@")[0] ?? "CyberSaathi User",
                email: currentUser.email ?? "",
                role: "user",
                preferredLanguage: "en",
                createdAt: new Date().toISOString(),
              } satisfies UserProfile;
          if (active) setProfile(nextProfile);
        } else {
          if (active) setProfile(null);
        }

        if (active) setLoading(false);
      });
    };

    init();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      configured: firebaseEnabled && dbAvailable === true,
      async register(payload) {
        if (!auth || !db || dbAvailable === false) {
          const demoUser = {
            uid: "demo-" + Math.random().toString(36).substring(2, 9),
            email: payload.email,
            displayName: payload.name,
          } as User;
          const demoProfile: UserProfile = {
            uid: demoUser.uid,
            name: payload.name,
            email: payload.email,
            role: "user",
            preferredLanguage: "en",
            createdAt: new Date().toISOString(),
          };
          window.localStorage.setItem("cybersaathi-demo-user", JSON.stringify(demoUser));
          window.localStorage.setItem("cybersaathi-demo-profile", JSON.stringify(demoProfile));
          setUser(demoUser);
          setProfile(demoProfile);
          return;
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
        if (!auth || dbAvailable === false) {
          const storedUserRaw = window.localStorage.getItem("cybersaathi-demo-user");
          const storedProfileRaw = window.localStorage.getItem("cybersaathi-demo-profile");
          if (storedUserRaw && storedProfileRaw) {
            try {
              const storedUser = JSON.parse(storedUserRaw) as User;
              const storedProfile = JSON.parse(storedProfileRaw) as UserProfile;
              if (storedUser.email === payload.email) {
                setUser(storedUser);
                setProfile(storedProfile);
                return;
              }
            } catch {
              // Ignore
            }
          }
          const demoUser = {
            uid: "demo-user-123",
            email: payload.email,
            displayName: payload.email.split("@")[0] || "Demo User",
          } as User;
          const demoProfile: UserProfile = {
            uid: demoUser.uid,
            name: demoUser.displayName || "Demo User",
            email: payload.email,
            role: "user",
            preferredLanguage: "en",
            createdAt: new Date().toISOString(),
          };
          window.localStorage.setItem("cybersaathi-demo-user", JSON.stringify(demoUser));
          window.localStorage.setItem("cybersaathi-demo-profile", JSON.stringify(demoProfile));
          setUser(demoUser);
          setProfile(demoProfile);
          return;
        }

        await signInWithEmailAndPassword(auth, payload.email, payload.password);
      },
      async logout() {
        if (!auth || dbAvailable === false) {
          window.localStorage.removeItem("cybersaathi-demo-user");
          window.localStorage.removeItem("cybersaathi-demo-profile");
          setUser(null);
          setProfile(null);
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
        const preferredLanguage = payload.preferredLanguage as Language | undefined;

        if (!user || !db || dbAvailable === false) {
          if (profile) {
            const nextProfile = {
              ...profile,
              preferredLanguage: preferredLanguage ?? profile.preferredLanguage,
            };
            window.localStorage.setItem("cybersaathi-demo-profile", JSON.stringify(nextProfile));
            setProfile(nextProfile);
          }
          return;
        }

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
    [loading, profile, user, dbAvailable],
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
