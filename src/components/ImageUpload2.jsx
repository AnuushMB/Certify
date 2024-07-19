import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import {getDownloadURL, uploadBytes} from "firebase/storage";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

// Our app
function App() {
    const [files, setFiles] = useState([])

    const handleImageUpload = async (fileItems) => {
        try {
            const storageRef = await uploadBytes(storageRef, fileItems[0]);
            const downloadURL = await getDownloadURL(storageRef);
            console.log('File uploaded:', downloadURL);
            // Here you would typically save the downloadURL to Firestore
            setFiles(null);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }

    return (
        <div className="App">
            <FilePond
                files={files}
                onupdatefiles={handleImageUpload}
                allowMultiple={false}
                maxFiles={3}
                server="/api"
                name="files" /* sets the file input name, it's filepond by default */
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
        </div>
    )
}

export default App;