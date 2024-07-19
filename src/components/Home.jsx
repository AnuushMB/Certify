import Login from './Login';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {

    const { user, logout, isLoading } = useAuth();
    const Fname = user?.displayName?.split(" ")[0];
    const img = user?.photoURL;

    if (isLoading){
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader" />
            </div>
        )
    }

    if (user === null) {
        return <Login />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex justify-between items-center mb-8">
                <nav className="w-full">
                    <div className="flex w-full justify-between items-center">
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src={img} className="rounded-circle"
                                 style={{width: '45px', border: '3px solid white', borderRadius: '25px'}}
                                 alt="User"/>
                            <span style={{padding: '1rem'}}>Hello, {Fname}</span>
                        </div>
                        <button
                            className="text-red-500 bg-red-100 hover:bg-red-600 hover:text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </header>
            <section className="flex flex-col items-center gap-20">
                <ImageUpload/>
                <ImageGallery/>
            </section>
        </div>
    );
}
