import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-800 mb-4">Agri 4.0 Dashboard</h1>
                <p className="text-xl text-gray-600">AI-Powered Precision Agriculture</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Link to="/pest" className="group">
                    <div className="bg-white rounded-xl shadow-lg p-8 transition-transform transform group-hover:-translate-y-1 hover:shadow-xl border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Pest Detection</h2>
                            <span className="text-3xl">🐛</span>
                        </div>
                        <p className="text-gray-600">
                            Upload images of pests to identify species and get control recommendations using our AI model.
                        </p>
                    </div>
                </Link>

                <Link to="/crop" className="group">
                    <div className="bg-white rounded-xl shadow-lg p-8 transition-transform transform group-hover:-translate-y-1 hover:shadow-xl border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Crop Health</h2>
                            <span className="text-3xl">🌱</span>
                        </div>
                        <p className="text-gray-600">
                            Analyze crop images to detect diseases and monitor overall plant health status.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};
