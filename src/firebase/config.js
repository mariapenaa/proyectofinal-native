import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyD9uo_iwMQh-ZD8t3d82ph_VvxXkAAhogk",
  authDomain: "proyectofinal-native.firebaseapp.com",
  projectId: "proyectofinal-native",
  storageBucket: "proyectofinal-native.appspot.com",
  messagingSenderId: "736924448250",
  appId: "1:736924448250:web:8765ba4a5ced5e4a6ea043"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore()