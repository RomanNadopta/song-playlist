import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAPJv_bLsNnmcMWPYR5EsHxac0yeOTKnxo',
  authDomain: 'song-playlist-by-daniel.firebaseapp.com',
  projectId: 'song-playlist-by-daniel',
  storageBucket: 'song-playlist-by-daniel.appspot.com',
  messagingSenderId: '152810595481',
  appId: '1:152810595481:web:9835c6d55ea1c7cbf88408',
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

// timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
