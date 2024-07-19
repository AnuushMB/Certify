import React from 'react';
import { storage, database } from '../config/store';
import { ref as storageRef, deleteObject } from "firebase/storage";
import { ref as databaseRef, remove, onValue, push } from "firebase/database";

const FileTable = ({ uid, myFiles }) => {
    
    const deleteFile = (name, key) => {
        const fileRef = storageRef(storage, name);
        deleteObject(fileRef).then(() => {
            const fileMetadataRef = databaseRef(database, `${uid}/files/${key}`);
            remove(fileMetadataRef).then(() => {
                const logRef = databaseRef(database, `${uid}/log`);
                push(logRef, {
                    action: `${name} deleted`,
                    timestamp: new Date().toISOString()
                });
            }).catch((error) => {
                console.error('Error deleting file metadata:', error.message);
            });
        }).catch((error) => {
            console.error('Error deleting file:', error.message);
        });
    };

    const setIcon = (type) => {
        if (type.includes("image")) {
            return <img src="static/asset/image.png" height="50px" alt="icon" />;
        } else {
            return <img src="static/asset/docs.png" height="50px" alt="icon" />;
        }
    };

    return (
        <div>
            {myFiles.map(myfile => (
                <div className="myFile" key={myfile.key}>
                    <div>{setIcon(myfile.contentType)}</div>
                    <div className="info">
                        <h4>{myfile.name}</h4>
                        <p>{myfile.contentType}</p>
                        <div className="icons">
                            <a className="text_blue download" href={myfile.downloadURL} target="_blank" rel="noopener noreferrer">
                                <i className="fa fa-download" aria-hidden="true"></i>
                            </a>
                            <button className="btn_delete delete" onClick={() => deleteFile(myfile.name, myfile.key)}>
                                <i className="fa fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileTable;