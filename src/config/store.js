import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const config = {
    apiKey: "AIzaSyCjoChnlzEDOt2eeoXSGdZqrXdsnRrAC7Y",
    authDomain: "mystorage-cd584.firebaseapp.com",
    databaseURL: "https://mystorage-cd584.firebaseio.com",
    projectId: "mystorage-cd584",
    storageBucket: "mystorage-cd584.appspot.com",
    messagingSenderId: "919282323349"
};

const app = initializeApp(config);

const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
