import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext(null);

const freshProgress = () => ({
  completedActions:  [],  // [{ id, title, impact, category, completedAt }]
  bookmarkedActions: [],  // [number]
  joinedDate: new Date().toISOString().split('T')[0],
});

async function loadOrCreateProgress(uid) {
  const ref  = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().progress ?? freshProgress();
  }
  const fresh = freshProgress();
  await setDoc(ref, { progress: fresh });
  return fresh;
}

export function AuthProvider({ children }) {
  const [user,     setUser]     = useState(null);
  const [progress, setProgress] = useState(freshProgress());
  const [loading,  setLoading]  = useState(true);

  /* Listen for Firebase auth state changes */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ name: firebaseUser.displayName, email: firebaseUser.email, uid: firebaseUser.uid });
        const prog = await loadOrCreateProgress(firebaseUser.uid);
        setProgress(prog);
      } else {
        setUser(null);
        setProgress(freshProgress());
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /* Sign up with email + password */
  const signup = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const fresh = freshProgress();
    await setDoc(doc(db, 'users', cred.user.uid), { progress: fresh });
    setUser({ name, email, uid: cred.user.uid });
    setProgress(fresh);
  };

  /* Sign in with email + password */
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged handles setting user + progress
  };

  /* Sign in with Google */
  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const prog = await loadOrCreateProgress(cred.user.uid);
    setProgress(prog);
  };

  /* Sign out */
  const logout = async () => {
    await signOut(auth);
  };

  /* Update progress locally + persist to Firestore */
  const updateProgress = (updater) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    setProgress(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      updateDoc(doc(db, 'users', firebaseUser.uid), { progress: next }).catch(console.error);
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, progress, updateProgress, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
