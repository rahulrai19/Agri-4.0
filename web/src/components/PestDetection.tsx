import React, { useState } from 'react';
import { pestService } from '../services/api';

export const PestDetection = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);
        try {
            const data = await pestService.predict(file);
            setResult(data);
        } catch (err) {
            setError('Failed to analyze image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Pest Detection</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="pest-upload"
                    />
                    <label
                        htmlFor="pest-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {file ? file.name : "Click to upload image"}
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!file || loading}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${!file || loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                    {loading ? 'Analyzing...' : 'Analyze Image'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Analysis Result</h3>
                    <div className="space-y-2">
                        <p className="text-gray-700"><span className="font-medium">Detected:</span> {result.label}</p>
                        <p className="text-gray-700"><span className="font-medium">Confidence:</span> {(result.confidence * 100).toFixed(1)}%</p>
                    </div>
                </div>
            )}
        </div>
    );
};
