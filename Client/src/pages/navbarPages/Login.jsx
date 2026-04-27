import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    // 🔥 IMPORTANT: backend base URL
    const API = "http://13.53.160.129:3000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(
                `${API}/api/v1/login`,
                { email, password },
                { withCredentials: true } // 🔥 cookie support
            );

            login(data.data);
            alert('Login successful!');
            navigate('/');

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API}/api/v1/auth/google`;
    };

    return (
        <div className="flex justify-center items-center py-10 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">

                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Login to Your Account
                </h1>

                {error && (
                    <p className="text-center text-red-500 bg-red-100 p-2 rounded-md">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="text-sm font-semibold text-gray-600 block">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-600 block">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                            placeholder="********"
                        />
                    </div>

                    <div>
                        <Link
                            to="/forgot-password"
                            className="text-sm font-semibold text-purple-600 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <div className="flex items-center">
                    <div className="flex-grow bg-gray-200 h-px"></div>
                    <span className="mx-4 text-sm text-gray-400">OR</span>
                    <div className="flex-grow bg-gray-200 h-px"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                    <FcGoogle size={24} />
                    Sign in with Google
                </button>

                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-purple-600 font-semibold">
                        Sign Up
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
