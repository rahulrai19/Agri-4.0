import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex flex-col justify-center items-center p-4">
            <Link to="/" className="flex items-center gap-2 mb-8">
                <div className="bg-green-600 p-2 rounded-xl text-white">
                    <Sprout className="w-8 h-8" />
                </div>
                <span className="text-2xl font-bold text-green-900">Agri 4.0</span>
            </Link>

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 mt-2"
                    >
                        Please Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-green-600 font-bold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};
