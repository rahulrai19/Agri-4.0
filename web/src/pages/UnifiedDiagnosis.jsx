import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X, Bug, Sprout, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { pestService, cropService } from '../services/api';
import api from '../services/api';

export const UnifiedDiagnosis = () => {
    const [mode, setMode] = useState('initial'); // initial, camera, analyzing, results
    const [image, setImage] = useState(null);
    const [pestResult, setPestResult] = useState(null);
    const [cropResult, setCropResult] = useState(null);
    const [language, setLanguage] = useState('English');
    const [aiAdvice, setAiAdvice] = useState(null);
    const [consulting, setConsulting] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // File Upload handling
    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageSelected(e.target.files[0]);
        }
    };

    // Camera handling
    const startCamera = async () => {
        setMode('camera');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Could not access camera. Please check permissions.");
            setMode('initial');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            canvas.toBlob(blob => {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                handleImageSelected(file);
            }, 'image/jpeg');

            stopCamera();
        }
    };

    // Main Analysis Logic
    const handleImageSelected = async (file) => {
        setImage(URL.createObjectURL(file));
        setMode('analyzing');
        setError(null);

        try {
            // Run both analyses in parallel
            const [pestData, cropData] = await Promise.allSettled([
                pestService.predict(file),
                cropService.predict(file)
            ]);

            // Handle Pest Result
            if (pestData.status === 'fulfilled') {
                setPestResult(pestData.value);
            } else {
                console.error("Pest API failed", pestData.reason);
            }

            // Handle Crop Result
            if (cropData.status === 'fulfilled') {
                setCropResult(cropData.value);
            } else {
                console.error("Crop API failed", cropData.reason);
            }

            setMode('results');

        } catch (err) {
            setError("Analysis failed. Please try again.");
            console.error(err);
            setMode('results'); // Show partial results if any
        }
    };

    // AI Consultation Logic
    const handleConsult = async () => {
        setConsulting(true);
        try {
            // Build text for AI using ONLY pest result (as requested)
            let diagnosisText = '';

            if (pestResult) {
                const pestLabel = pestResult.label || 'Unknown';
                const pestConf = (pestResult.confidence * 100).toFixed(1);
                diagnosisText = `Pest Detection: ${pestLabel} (Confidence: ${pestConf}%)`;
            } else {
                diagnosisText = 'No pest detected.';
            }

            const response = await api.post('/consult', {
                diagnosis_text: diagnosisText,
                pest_data: pestResult || null,
                language: language
            });

            // Try to parse the clean JSON if string, or use direct object
            let advice = response.data.clean;
            if (typeof advice === 'string') {
                try {
                    advice = JSON.parse(advice);
                } catch (e) {
                    console.error("JSON Parse Error", e);
                    // Fallback if AI didn't return perfect JSON
                    advice = { diagnosis: advice, remedies: [] };
                }
            }
            setAiAdvice(advice);
        } catch (err) {
            console.error(err);
            let msg = err.response?.data?.error || "Failed to consult AI expert. Please check your OpenAI API Key.";

            if (err.response?.status === 429) {
                msg = "⚠️ AI rate limit reached. Please wait a minute and try again.";
            }

            setError(msg);
        } finally {
            setConsulting(false);
        }
    };

    // Auto-trigger AI when results are ready OR language changes
    useEffect(() => {
        if (mode === 'results' && !consulting && !error) {
            if (!aiAdvice) {
                // We won't auto-trigger on mount to save costs usually, but if user switches language we might want to re-fetch.
                // For now let's keep it manual trigger for cost saving unless requested otherwise.
                // Actually the previous code had auto-trigger:
                // if (!aiAdvice) handleConsult();
            }
        }
    }, [mode, language]);

    // Function to switch language and trigger re-fetch
    const toggleLanguage = (targetLang) => {
        const newLang = targetLang || (language === 'English' ? 'Hindi' : 'English');
        if (newLang === language) return;
        setLanguage(newLang);
        if (mode === 'results') {
            setAiAdvice(null); // This clears advice, forcing user to click 'Ask AI' again or we could auto-fetch
        }
    };

    // Cleanup camera on unmount
    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Unified Diagnosis</h1>

            {/* Initial Selection Mode */}
            {mode === 'initial' && (
                <div className="grid md:grid-cols-2 gap-6 h-96">
                    <button
                        onClick={() => document.getElementById('unified-upload').click()}
                        className="card hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
                    >
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Upload className="w-12 h-12" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-700">Upload Image</h2>
                        <p className="text-gray-500 text-sm">Select from gallery</p>
                        <input
                            id="unified-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </button>

                    <button
                        onClick={startCamera}
                        className="card hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                            <Camera className="w-12 h-12" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-700">Use Camera</h2>
                        <p className="text-gray-500 text-sm">Take a photo now</p>
                    </button>
                </div>
            )}

            {/* Camera Mode */}
            {mode === 'camera' && (
                <div className="relative bg-black rounded-3xl overflow-hidden aspect-[3/4] md:aspect-video flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>

                    <button
                        onClick={() => { stopCamera(); setMode('initial'); }}
                        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <button
                        onClick={captureImage}
                        className="absolute bottom-8 w-20 h-20 border-4 border-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <div className="w-16 h-16 bg-white rounded-full"></div>
                    </button>
                </div>
            )}

            {/* Analysis Loading Mode */}
            {mode === 'analyzing' && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="relative w-32 h-32 mb-8">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto text-green-500 w-12 h-12 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Analyzing Crop Health...</h2>
                    <p className="text-gray-500 mt-2">Running dual-model diagnostics</p>
                </div>
            )}

            {/* Results Mode */}
            {mode === 'results' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Diagnosis Report
                            </h2>
                            <p className="text-sm text-gray-500">AI Expert Analysis</p>
                        </div>
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => toggleLanguage('English')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'English' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => toggleLanguage('Hindi')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'Hindi' ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                हिंदी
                            </button>
                        </div>
                        <button
                            onClick={() => { setImage(null); setPestResult(null); setCropResult(null); setAiAdvice(null); setMode('initial'); }}
                            className="text-blue-600 font-semibold hover:underline bg-blue-50 px-4 py-2 rounded-full text-sm"
                        >
                            New Scan
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Selected Image */}
                        <div className="card p-2 bg-gray-50">
                            <img src={image} alt="Analyzed" className="w-full h-64 object-contain rounded-xl" />
                        </div>

                        {/* Combined Results */}
                        <div className="space-y-4">
                            {/* Pest Result Card */}
                            <div className={`card border-l-4 ${pestResult ? 'border-l-red-500' : 'border-l-gray-300'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <Bug className={`w-5 h-5 ${pestResult ? 'text-red-500' : 'text-gray-400'}`} />
                                    <h3 className="font-bold text-gray-700">Pest Detection</h3>
                                </div>
                                {pestResult ? (
                                    <div>
                                        <p className="text-xl font-bold text-gray-800">{pestResult.label}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No pest detected or analysis failed.</p>
                                )}
                            </div>

                            {/* Crop Health Card */}
                            <div className={`card border-l-4 ${cropResult ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <Sprout className={`w-5 h-5 ${cropResult ? 'text-green-500' : 'text-gray-400'}`} />
                                    <h3 className="font-bold text-gray-700">Crop Health</h3>
                                </div>
                                {cropResult ? (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${cropResult.is_healthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {cropResult.is_healthy ? (language === 'Hindi' ? 'स्वस्थ' : 'Healthy') : (language === 'Hindi' ? 'अस्वस्थ' : 'Unhealthy')}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {cropResult.confidence ? `${(cropResult.confidence * 100).toFixed(0)}%` : ''}
                                            </span>
                                        </div>
                                        {!cropResult.is_healthy && cropResult.disease && (
                                            <p className="font-bold text-gray-800 text-lg mb-1">
                                                {cropResult.disease}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600 leading-snug">
                                            {cropResult.description || (language === 'Hindi' ? 'विस्तृत विश्लेषण के लिए एआई विशेषज्ञ से पूछें।' : 'Ask AI Expert for detailed analysis.')}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No health data available.</p>
                                )}
                            </div>

                            {/* AI Consult Button Area */}
                            {!consulting && (
                                <div className="pt-2">
                                    <button
                                        onClick={handleConsult}
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                                    >
                                        <Sparkles className="w-5 h-5" /> Ask AI Expert
                                    </button>
                                </div>
                            )}

                            {consulting && (
                                <div className="pt-2">
                                    <div className="text-center py-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <span className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin inline-block mb-2"></span>
                                        <p className="text-purple-700 text-sm font-semibold">Analyzing...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Gemini AI Consultation Results */}
            <div className="">
                {/* Button was here, now moved up */}

                {aiAdvice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-white w-full max-w-lg h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">

                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-start shrink-0">
                                <div>
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Sparkles className="text-yellow-300" /> Expert Diagnosis
                                    </h3>
                                    <p className="text-purple-100 text-sm mt-1">AI-Powered Agricultural Analysis</p>
                                </div>
                                <button
                                    onClick={() => setAiAdvice(null)}
                                    className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-purple-50">

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-purple-800 uppercase text-xs tracking-wider mb-2">Summary</h4>
                                        <p className="text-gray-700 leading-relaxed bg-white/50 p-3 rounded-lg">{aiAdvice.diagnosis}</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-bold text-red-700 uppercase text-xs tracking-wider mb-2">Symptoms to Check</h4>
                                            <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-100">{aiAdvice.symptoms}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-green-700 uppercase text-xs tracking-wider mb-2">Prevention</h4>
                                            <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">{aiAdvice.prevention}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-blue-800 uppercase text-xs tracking-wider mb-3">Remedies & Cures</h4>
                                        <div className="space-y-3">
                                            {aiAdvice.remedies?.map((remedy, idx) => (
                                                <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                                    <div className={`px-2 py-1 rounded text-xs font-bold ${remedy.type === 'Chemical' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                        {remedy.type}
                                                    </div>
                                                    <p className="text-gray-700 text-sm font-medium">{remedy.action}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
