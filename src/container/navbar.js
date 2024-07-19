import React from 'react';
import { getAuth, signOut } from "firebase/auth";

const Navbar = ({ name, img }) => {


    const Fname = name.split(" ")[0];
    const logMeOut = () => {
        const auth = getAuth();
        signOut(auth);
    };

    return (
        <nav>
            <div className="user">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={img} className="rounded-circle" style={{ width: '45px', border: '3px solid white', borderRadius: '25px' }} alt="User" />
                    <span style={{ padding: '1rem' }}>Hello, {Fname}</span>
                </div>
                <button className="logout" onClick={logMeOut}>Log Out</button>
            </div>
        </nav>
    );
};

export default Navbar;
