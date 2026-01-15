import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Bug } from 'lucide-react';
import { pestService } from '../services/api';

export const PestDetection = () => {
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
            const data = await pestService.predict(file);
            setResult(data);
        } catch (err) {
            setError('Failed to analyze image. Ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Pest Detection</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Image Upload</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="pest-upload"
                            />
                            <label
                                htmlFor="pest-upload"
                                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${preview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
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
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500 mt-1">PEG, PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!file || loading}
                            className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    Analyzing...
                                </>
                            ) : 'Run Analysis'}
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
                        <div className="card border-l-4 border-l-green-500 animate-fade-in">
                            <div className="flex items-center mb-6">
                                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                                <h3 className="text-xl font-bold text-gray-800">Analysis Complete</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Detected Species</p>
                                    <p className="text-2xl font-bold text-green-800 mt-1">{result.label || "Unknown"}</p>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {result.confidence ? (result.confidence * 100).toFixed(1) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-green-600 h-2.5 rounded-full transition-all duration-1000"
                                            style={{ width: `${result.confidence * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-800 mb-2">Recommendation</h4>
                                    <p className="text-sm text-gray-600">
                                        Based on the detection of {result.label}, immediate monitoring of the affected area is recommended. Consult local agricultural guidelines for specific treatment options.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 border-dashed border-2 border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Bug className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No Analysis Yet</h3>
                            <p className="text-gray-500 mt-2">Upload an image and run analysis to see results here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
