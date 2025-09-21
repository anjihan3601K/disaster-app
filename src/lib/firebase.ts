import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'studio-5841216832-7f12e',
  appId: '1:611615799432:web:b19329f8f5e80d4dfcc73d',
  apiKey: 'AIzaSyBI0DFgPxXtB1RjdrBghciy2Rym0ecCrz0',
  authDomain: 'studio-5841216832-7f12e.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '611615799432',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
