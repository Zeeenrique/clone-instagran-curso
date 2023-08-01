import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/functions';

const firebaseConfig  = {
    apiKey: "AIzaSyC-B6aprEPOnt3qSUAX1QLcfrI571lcFoI",
    authDomain: "instagram-clone-curso-3418b.firebaseapp.com",
    projectId: "instagram-clone-curso-3418b",
    storageBucket: "instagram-clone-curso-3418b.appspot.com",
    messagingSenderId: "933000753379",
    appId: "1:933000753379:web:9a598bd6d1ef50b86d15d6",
    measurementId: "G-Q4H6FYZSTY"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const bancoDados = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage =  firebaseApp.storage();
  const functions = firebaseApp.functions();

  export {bancoDados, auth, storage, functions};