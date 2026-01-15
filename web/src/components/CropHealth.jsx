import React, { useState } from 'react';
import { Upload, AlertCircle, Activity, Sprout } from 'lucide-react';
import { cropService } from '../services/api';

export const CropHealth = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);
        try {
            const data = await cropService.predict(file);
            setResult(data);
        } catch (err) {
            setError('Failed to analyze crop health.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Crop Health Analysis</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Leaf Image Upload</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="crop-upload"
                            />
                            <label
                                htmlFor="crop-upload"
                                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${preview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                    }`}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-full w-full object-contain rounded-lg p-2"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Upload Leaf Image</p>
                                        <p className="text-xs text-gray-500 mt-1">High resolution preferred</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!file || loading}
                            className={`w-full group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Health'}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {result ? (
                        <div className="card border-l-4 border-l-blue-500 animate-fade-in">
                            <div className="flex items-center mb-6">
                                <Activity className="w-6 h-6 text-blue-500 mr-2" />
                                <h3 className="text-xl font-bold text-gray-800">Health Report</h3>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-gray-200">
                                <pre className="whitespace-pre-wrap text-gray-700">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="card h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 border-dashed border-2 border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Sprout className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Waiting for Data</h3>
                            <p className="text-gray-500 mt-2">Upload a leaf image to generate a health report.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
