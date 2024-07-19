import React, { useState, useEffect, createContext } from 'react';
import { auth, database } from './store';
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";

const   Context = createContext();

const Provider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [myFiles, setMyFiles] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);

                const filesRef = ref(database, `${user.uid}/files`);
                onValue(filesRef, (snapshot) => {
                    const files = [];
                    snapshot.forEach((childSnapshot) => {
                        files.push({ ...childSnapshot.val().metadataFile, key: childSnapshot.key });
                    });
                    setMyFiles(files);
                });

                const logsRef = ref(database, `${user.uid}/log`);
                onValue(logsRef, (snapshot) => {
                    const logs = [];
                    snapshot.forEach((childSnapshot) => {
                        logs.push(childSnapshot.val().action);
                    });
                    setLogs(logs);
                });
            } else {
                setUser(null);
                setMyFiles([]);
                setLogs([]);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Context.Provider value={{ user, myFiles, logs }}>
            {children}
        </Context.Provider>
    );
};

export { Provider, Context as Consumer };
