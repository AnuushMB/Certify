import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (image) {
            setUploading(true);
            if (image) {
                const storageRef = ref(storage, `files/${user.uid}/${image.name}`);
                await uploadBytes(storageRef, image);
                const downloadURL = await getDownloadURL(storageRef);
                console.log('File uploaded:', downloadURL);
                setImage(null);
                setUploading(false);
                window.location.reload();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex items-center bg-gray-800 max-w-xl mx-auto h-[100px] rounded-lg shadow-lg p-10">
                <label className="flex-1">
                    <span className="sr-only">Choose file</span>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </label>
                <button
                    type="submit"
                    disabled={!image || uploading}
                    className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out ${(!image || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
            </div>
        </form>
    );
}
