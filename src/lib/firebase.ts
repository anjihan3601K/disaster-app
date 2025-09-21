import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: '##############',
  appId: '1:##############,
  apiKey: '#########',
  authDomain: '###########',
  measurementId: '',
  messagingSenderId: '#######',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
