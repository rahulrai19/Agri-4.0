import React, { useState } from 'react';
import { ChevronLeft, Sprout, CloudRain, ThermometerSun, Leaf, Droplets, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { staticTips } from '../data/cultivationTipsData';

const COMMON_CROPS = [
    { name: 'Rice', icon: '🍚', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Wheat', icon: '🌾', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Tomato', icon: '🍅', color: 'bg-red-100 text-red-700' },
    { name: 'Potato', icon: '🥔', color: 'bg-amber-100 text-amber-700' },
    { name: 'Cotton', icon: '☁️', color: 'bg-blue-100 text-blue-700' },
    { name: 'Sugarcane', icon: '🎋', color: 'bg-green-100 text-green-700' },
    { name: 'Maize', icon: '🌽', color: 'bg-orange-100 text-orange-700' },
    { name: 'Chilli', icon: '🌶️', color: 'bg-red-100 text-red-700' }
];

export const CultivationTips = () => {
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tips, setTips] = useState(null);
    const [language, setLanguage] = useState('English');
    const [error, setError] = useState(null);

    const fetchTips = async (cropName) => {
        setLoading(true);
        setError(null);
        setTips(null);
        setSelectedCrop(cropName);

        // Check for static data first (simulated delay for feel, or instant)
        if (staticTips[cropName] && language === 'English') {
            // Use static data
            setTips(staticTips[cropName]);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/tips', {
                crop_name: cropName,
                language: language
            });

            let data = response.data.data;
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.error("JSON parse error", e);
                }
            }
            setTips(data);

        } catch (err) {
            console.error(err);
            setError("Failed to fetch tips. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Cultivation Tips</h1>
                    <p className="text-sm text-gray-500">Expert farming advice</p>
                </div>
                <button
                    onClick={() => {
                        const newLang = language === 'English' ? 'Hindi' : 'English';
                        setLanguage(newLang);
                        if (selectedCrop) fetchTips(selectedCrop); // Refresh if crop selected
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${language === 'Hindi' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
                >
                    {language === 'Hindi' ? 'हिंदी' : 'English'}
                </button>
            </div>

            {/* Crop Grid */}
            {!selectedCrop && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                    {COMMON_CROPS.map((crop) => (
                        <button
                            key={crop.name}
                            onClick={() => fetchTips(crop.name)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform group"
                        >
                            <div className={`w-14 h-14 ${crop.color} rounded-full flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}>
                                {crop.icon}
                            </div>
                            <span className="font-bold text-gray-800">{crop.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">Asking AI Agronomist...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 border border-red-100">
                    {error}
                    <button onClick={() => setSelectedCrop(null)} className="block mt-2 text-sm font-bold underline">Try another crop</button>
                </div>
            )}

            {/* Results View */}
            {!loading && tips && selectedCrop && (
                <div className="space-y-6 animate-fade-in-up">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{COMMON_CROPS.find(c => c.name === selectedCrop)?.icon || '🌱'}</span>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedCrop}</h2>
                        </div>
                        <button onClick={() => setSelectedCrop(null)} className="text-blue-600 text-sm font-bold hover:underline">Change Crop</button>
                    </div>

                    <div className="grid gap-4">
                        <TipCard title="Soil & Climate" icon={ThermometerSun} color="orange" content={tips.soil_climate} />
                        <TipCard title="Sowing" icon={Sprout} color="green" content={tips.sowing_planting} />
                        <TipCard title="Water" icon={Droplets} color="blue" content={tips.water_management} />
                        <TipCard title="Nutrients" icon={Leaf} color="emerald" content={tips.nutrient_management} />
                        <TipCard title="Pests & Diseases" icon={CloudRain} color="red" content={tips.pest_disease_mgmt} />
                        <TipCard title="Harvesting" icon={Sprout} color="yellow" content={tips.harvesting} />
                    </div>
                </div>
            )}
        </div>
    );
};

const TipCard = ({ title, icon: Icon, color, content }) => {
    // Map color props to Tailwind classes
    const colors = {
        orange: 'bg-orange-50 text-orange-700 border-orange-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        red: 'bg-red-50 text-red-700 border-red-100',
        yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    };

    const theme = colors[color] || colors.green;

    return (
        <div className={`p-4 rounded-2xl border ${theme} transition-all hover:shadow-sm`}>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-1">{title}</h3>
                    <p className="text-sm leading-relaxed opacity-90">{content}</p>
                </div>
            </div>
        </div>
    );
};
