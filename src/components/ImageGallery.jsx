import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../firebase/firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

function getFileIcon(contentType) {
    if (contentType === 'application/pdf') {
        return '/pdf-icon.svg';
    }
    return '/file-icon.svg';
}

function truncateFileName(name, maxLength = 20) {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExtension = name.slice(0, -(extension.length + 1));
    const truncatedName = nameWithoutExtension.slice(0, maxLength - 3) + '...';
    return `${truncatedName}.${extension}`;
}

export default function FileGallery() {
    const [files, setFiles] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchFiles = async () => {
                const storageRef = ref(storage, `files/${user.uid}`);
                const result = await listAll(storageRef);
                setFiles(result?.items)
                console.log(result)
            };
            fetchFiles();
        }
    }, []);

    const downloadImage = async (filename) => {
        try {
            const imageRef = ref(storage, `files/${user.uid}/${filename}`); // Adjust the path to your image
            const url = await getDownloadURL(imageRef);

            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => {
                return (
                    <div key={index} className="flex flex-col items-center p-4 duration-300">
                        <button
                            onClick={() => downloadImage(file.name)}
                            rel="noopener noreferrer"
                            className="mt-2 text-xs flex flex-col text-blue-500 hover:underline relative cursor-pointer"
                        >
                            <img src="/file-icon.svg" className="w-36 h-auto text-blue-500 mb-2" alt="file"/>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" className="absolute bottom-10 right-8">
                                <path d="M12 17V3"/>
                                <path d="m6 11 6 6 6-6"/>
                                <path d="M19 21H5"/>
                            </svg>
                            <p className="text-sm text-left text-gray-600 truncate w-full">
                                {truncateFileName(file.name)}
                            </p>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}