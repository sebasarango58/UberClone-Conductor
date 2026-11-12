import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSOa9XMOmBHHz9if4Xs6gK6l5L2i9x-I",
  authDomain: "uberclone-driver-6ec85.firebaseapp.com",
  projectId: "uberclone-driver-6ec85",
  storageBucket: "uberclone-driver-6ec85.firebasestorage.app",
  messagingSenderId: "583605689368",
  appId: "1:583605689368:web:9b3f4eb5c5b86f138df76d",
  measurementId: "G-6FGSCB6SP6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la instancia de Firestore para usarla en el proyecto
export const db = getFirestore(app);