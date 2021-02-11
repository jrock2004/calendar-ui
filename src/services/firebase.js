import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAR8_IUf5LtvGUHrsT1Ywbi1eIkvBLrXAQ',
  authDomain: 'scheduling-99b8a.firebaseapp.com',
  databaseURL: 'https://scheduling-99b8a.firebaseio.com',
  projectId: 'scheduling-99b8a',
  storageBucket: 'scheduling-99b8a.appspot.com',
  messagingSenderId: '639833985647',
  appId: '1:639833985647:web:eaab8b819766c18ce4f39a',
};

firebase.initializeApp(config);

export const db = firebase.database();
