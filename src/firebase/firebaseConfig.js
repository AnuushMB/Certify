import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC2H1yy4zBWTsr4ADkxXIr7A9YLnoN0V6E",
    authDomain: "uploadit-3f398.firebaseapp.com",
    projectId: "uploadit-3f398",
    storageBucket: "uploadit-3f398.appspot.com",
    messagingSenderId: "1090423340144",
    appId: "1:1090423340144:web:8ad20c46e199477ecd48b5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
