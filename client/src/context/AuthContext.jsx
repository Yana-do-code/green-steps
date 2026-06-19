import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const freshProgress = () => ({
  completedActions: [],  // [{ id, title, impact, category, completedAt }]
  bookmarkedActions: [], // [number]
  joinedDate: new Date().toISOString().split('T')[0],
});

const loadProgress = (email) => {
  try {
    const stored = localStorage.getItem(`gs_progress_${email}`);
    return stored ? JSON.parse(stored) : freshProgress();
  } catch {
    return freshProgress();
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gs_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [progress, setProgress] = useState(() =>
    user ? loadProgress(user.email) : freshProgress()
  );

  const login = (userData) => {
    localStorage.setItem('gs_user', JSON.stringify(userData));
    setUser(userData);
    setProgress(loadProgress(userData.email));
  };

  const logout = () => {
    localStorage.removeItem('gs_user');
    setUser(null);
    setProgress(freshProgress());
  };

  const updateProgress = (updater) => {
    setProgress(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      if (user) {
        localStorage.setItem(`gs_progress_${user.email}`, JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, progress, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
