import { useAuth } from '../contexts/AuthContext';

export default function Login() {

    const { login } = useAuth();

    return (
        <main className="flex flex-col md:flex-row justify-between items-center container mx-auto h-screen">
            <img
                src="static/asset/hero2.png"
                alt="Hero"
                className="w-1/2 h-auto object-cover"
            />
            <section className="min-w-[400px] flex flex-col items-center">
                <h1 className="text-6xl font-bold">Upload<span className="text-blue-600">It</span></h1>
                <button
                    onClick={login}
                    className="login-with-google-btn border mt-8"
                >
                    Login Using Gmail
                </button>
            </section>
        </main>
    );
};