import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey:            "AIzaSyDM7_dNimR3Hso8UgNYH3v8XZm3HBZPaCo",
  authDomain:        "green-steps-dca7c.firebaseapp.com",
  databaseURL:       "https://green-steps-dca7c-default-rtdb.firebaseio.com",
  projectId:         "green-steps-dca7c",
  storageBucket:     "green-steps-dca7c.firebasestorage.app",
  messagingSenderId: "986590724268",
  appId:             "1:986590724268:web:4e209e325c34d722a8df09",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const db             = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
