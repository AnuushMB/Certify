import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Consumer } from '../config/context';

const Login = () => {
    const provider = new GoogleAuthProvider();
    const log = () => {
        const auth = getAuth();
        signInWithPopup(auth, provider).then((result) => {
            console.log('Logged in:', result.user);
        }).catch((error) => {
            console.error('Error during login:', error.message);
        });
    };

    return (
        <Consumer>
            {value => {
                return (

                );
            }}
        </Consumer>
    );
};

export default Login;
