import React, { useState } from 'react';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { storage, database } from '../config/store';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, getMetadata } from "firebase/storage";
import { ref as databaseRef, push } from "firebase/database";

registerPlugin(FilePondPluginImagePreview);

const FileShare = ({ uid }) => {
    const [files, setFiles] = useState([]);
    const [uploadValue, setUploadValue] = useState(0);
    const [message, setMessage] = useState('');

    const handleProcessing = (fieldName, file, metadata, load, error, progress, abort) => {
        const fileRef = storageRef(storage, file.name);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadValue(percentage);
            },
            (error) => {
                setMessage(`Upload error: ${error.message}`);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    getMetadata(fileRef).then((metadata) => {
                        const metadataFile = {
                            name: metadata.name,
                            size: metadata.size,
                            contentType: metadata.contentType,
                            fullPath: metadata.fullPath,
                            downloadURL: downloadURL
                        };

                        const fileMetadataRef = databaseRef(database, `${uid}/files`);
                        push(fileMetadataRef, { metadataFile });

                        const logRef = databaseRef(database, `${uid}/log`);
                        push(logRef, {
                            action: `${file.name} uploaded`,
                            timestamp: new Date().toISOString()
                        });

                        setMessage('Upload Success');
                    }).catch((error) => {
                        console.error('Error getting metadata:', error.message);
                    });
                }).catch((error) => {
                    console.error('Error getting download URL:', error.message);
                });
            }
        );
    };

    return (
        <div className="fileshare" style={{ minHeight: '300px' }}>
            <FilePond
                style={{ minHeight: '100%' }}
                files={files}
                allowMultiple={true}
                maxFiles={3}
                server={{ process: handleProcessing }}
                onupdatefiles={setFiles}
            />
        </div>
    );
};

export default FileShare;