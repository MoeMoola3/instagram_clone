import firebase from "firebase";

//Calling and intializing app function
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyApBQY6kXf5ACgF4jwaRhksUjKmwP9hnqI",
    authDomain: "instagram-clone-6c1df.firebaseapp.com",
    databaseURL: "https://instagram-clone-6c1df.firebaseio.com",
    projectId: "instagram-clone-6c1df",
    storageBucket: "instagram-clone-6c1df.appspot.com",
    messagingSenderId: "416148119516",
    appId: "1:416148119516:web:6b08d106317a1d71f9f919",
    measurementId: "G-L8DFVR2ECW"
});

const db = firebaseApp.firestore();         //To access the db
const auth = firebase.auth();       //To access authentication, verify users
const storage = firebase.storage();     //Accessing firebase storage

export {db, auth, storage};