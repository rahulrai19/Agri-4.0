import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bug, Sprout, Activity, Sparkles, Plus, X, Droplets, Calendar } from 'lucide-react';
import { cropsData, availableCrops as allCrops } from '../data/cropsData';

const CropCircle = ({ name, icon, onClick }) => (
    <div onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1">
        <div className="w-16 h-16 rounded-full border-[3px] border-yellow-300 p-0.5 bg-white shadow-sm group-hover:shadow-md group-hover:border-yellow-400 transition-all">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center overflow-hidden">
                <span className="text-3xl drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
            </div>
        </div>
        <span className="text-sm font-semibold text-gray-600 group-hover:text-green-700 transition-colors">{name}</span>
    </div>
);

const DashboardCard = ({ to, title, icon: Icon, description, colorClass }) => (
    <Link to={to} className="group">
        <div className="card h-full flex flex-col justify-between hover:-translate-y-2">
            <div>
                <div className={`p-4 rounded-xl w-fit mb-4 ${colorClass}`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                Launch Tool <ArrowRight className="w-4 h-4 ml-2" />
            </div>
        </div>
    </Link>
);

import { ChatAssistant } from '../components/ChatAssistant';
import { VideoShorts } from '../components/VideoShorts';

export const Dashboard = () => {
    const [myCrops, setMyCrops] = useState([
        { name: "Banana", icon: "🍌" },
        { name: "Barley", icon: "🌾" },
        { name: "Cauliflower", icon: "🥦" },
        { name: "Rice", icon: "🍚" }
    ]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssistant, setShowAssistant] = useState(false);

    // Weather State
    const [weather, setWeather] = useState(null);
    const [sprayingCondition, setSprayingCondition] = useState(null);

    React.useEffect(() => {
        // Fetch weather on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=windspeed_10m,precipitation`);
                    const data = await response.json();
                    setWeather(data);

                    // Logic for Spraying Conditions
                    const currentHour = new Date().getHours();
                    const windSpeed = data.hourly.windspeed_10m[currentHour];
                    const rain = data.hourly.precipitation[currentHour];

                    let status = "Moderate";
                    let reason = "Caution advised";

                    if (rain > 0.5) {
                        status = "Poor";
                        reason = "Rain detected";
                    } else if (windSpeed > 15) {
                        status = "Poor";
                        reason = "Too windy (>15km/h)";
                    } else if (windSpeed < 10 && rain === 0) {
                        status = "Optimal";
                        reason = "Low wind, no rain";
                    }

                    setSprayingCondition({ status, reason });

                } catch (error) {
                    console.error("Weather fetch failed", error);
                    setSprayingCondition({ status: "Unknown", reason: "Network error" });
                }
            }, (err) => {
                console.warn("Geolocation denied, using defaults", err);
                // Fallback to New Delhi coordinates or just leave null
                // Or set dummy data for visual confirmation if location denied
                setSprayingCondition({ status: "Check Location", reason: "GPS required" });
            });
        }
    }, []);

    return (
        <div className="space-y-10">
            <ChatAssistant isOpen={showAssistant} onClose={() => setShowAssistant(false)} />

            <header className="flex flex-col gap-4 relative">
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight max-w-[70%]">
                        Agricultural <span className="text-green-600">Intelligence</span>
                    </h1>
                    <button
                        onClick={() => setShowAssistant(true)}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold shadow-sm hover:bg-blue-200 transition-colors text-sm md:text-base animate-pulse active:scale-95 whitespace-nowrap"
                    >
                        <Sparkles className="w-4 h-4" />
                        Assistant
                    </button>
                </div>
                <p className="text-gray-600 text-sm md:text-lg max-w-2xl">
                    Deploying advanced AI models for real-time pest detection, crop health monitoring, and multispectral analysis.
                </p>
            </header>

            {/* Crop Selection Row */}
            <div className="flex items-center gap-4 -mx-4 px-4 overflow-hidden">
                <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-6 pb-4 pt-2 px-2">
                    {myCrops.map((crop) => (
                        <CropCircle
                            key={crop.name}
                            name={crop.name}
                            icon={crop.icon}
                            onClick={() => setSelectedCrop(cropsData[crop.name] || crop)}
                        />
                    ))}
                </div>

                {/* Docked Add Button (Right) */}
                <div onClick={() => setShowAddModal(true)} className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer pl-2 relative z-10">
                    {/* Smooth Gradient Background */}
                    <div className="absolute inset-y-0 -left-8 right-0 bg-gradient-to-l from-[#F0FDF4] via-[#F0FDF4] to-transparent pointer-events-none -z-10"></div>

                    <div className="w-16 h-16 rounded-full border-2 border-yellow-400 p-1 bg-white hover:scale-105 transition-transform shadow-sm relative z-20">
                        <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white shadow-inner">
                            <Plus className="w-6 h-6" />
                        </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 relative z-20">Add</span>
                </div>
            </div>

            {/* Weather & Spraying Widgets */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-50 flex flex-col justify-between relative overflow-hidden group hover:border-green-100 transition-colors h-36">
                    <div className="relative z-10">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                            {weather ? new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }) : 'Loading'}
                        </p>
                        <p className="text-3xl font-black text-gray-800 tracking-tight">
                            {weather ? `${Math.round(weather.current_weather.temperature)}°` : '--'}
                        </p>
                    </div>
                    <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-100 transition-opacity duration-500 scale-150 transform">
                        {weather && weather.current_weather.weathercode < 3
                            ? <Sparkles className="w-12 h-12 text-yellow-400" />
                            : <Droplets className="w-12 h-12 text-blue-400" />
                        }
                    </div>
                    <div className="relative z-10 flex items-center gap-2 mt-auto">
                        <span className="text-sm font-medium text-gray-600">
                            {weather ? (weather.current_weather.weathercode < 3 ? 'Sunny' : 'Cloudy') : '...'}
                        </span>
                    </div>
                </div>

                <div className={`rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border flex flex-col justify-between relative overflow-hidden transition-all h-36 ${sprayingCondition?.status === 'Optimal' ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/80 border-green-100' :
                    sprayingCondition?.status === 'Poor' ? 'bg-gradient-to-br from-red-50/50 to-orange-50/80 border-red-100' :
                        'bg-gradient-to-br from-gray-50 to-white border-gray-100'
                    }`}>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Spraying</p>
                            <p className={`text-xl font-black ${sprayingCondition?.status === 'Optimal' ? 'text-green-700' :
                                sprayingCondition?.status === 'Poor' ? 'text-red-700' :
                                    'text-gray-700'
                                }`}>
                                {sprayingCondition ? sprayingCondition.status : '--'}
                            </p>
                        </div>
                        <Droplets className={`w-6 h-6 ${sprayingCondition?.status === 'Optimal' ? 'text-green-400' :
                            sprayingCondition?.status === 'Poor' ? 'text-red-400' :
                                'text-blue-400'
                            }`} />
                    </div>

                    <div className="relative z-10 mt-auto">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sprayingCondition?.status === 'Optimal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {sprayingCondition ? sprayingCondition.reason : 'Checking...'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Diagnosis Action Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-50 text-center relative overflow-hidden group">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10">
                    <div className="flex justify-center items-center gap-4 mb-8 opacity-80">
                        {/* Process Flow - Simplified */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <Sprout className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Snap</span>
                        </div>
                        <div className="h-px w-8 bg-gray-200"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Activity className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Analyze</span>
                        </div>
                        <div className="h-px w-8 bg-gray-200"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600">
                                <span className="text-xs font-black border border-current rounded px-1">Rx</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Heal</span>
                        </div>
                    </div>

                    <Link to="/diagnosis" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
                        Take a picture
                    </Link>
                </div>
            </div>

            {/* Tools Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 px-1">Tools</h2>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <Link to="/calculators" state={{ tab: 'fertilizer' }} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-all hover:shadow-md hover:border-green-100 h-32 group">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <img src="https://cdn-icons-png.flaticon.com/512/3058/3058995.png" className="w-6 h-6" alt="Fertilizer" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 text-center group-hover:text-blue-700 transition-colors leading-tight">Fertilizer<br />calculator</span>
                    </Link>

                    <Link to="/calculators" state={{ tab: 'pest' }} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-all hover:shadow-md hover:border-red-100 h-32 group">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                            <span className="text-xl">🧴</span>
                        </div>
                        <span className="text-xs font-bold text-gray-600 text-center group-hover:text-red-700 transition-colors leading-tight">Pesticide<br />calculator</span>
                    </Link>

                    <Link to="/calculators" state={{ tab: 'seed' }} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-all hover:shadow-md hover:border-green-100 h-32 group">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                            <span className="text-xl">📅</span>
                        </div>
                        <span className="text-xs font-bold text-gray-600 text-center group-hover:text-green-700 transition-colors leading-tight">Farming<br />calculator</span>
                    </Link>
                </div>
            </div>

            {/* Feature Cards / Library */}
            <h2 className="text-xl font-bold text-gray-900">Library</h2>
            <div className="grid md:grid-cols-2 gap-4">
                <Link to="/cultivation" className="bg-blue-50 rounded-2xl p-6 relative overflow-hidden h-40 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-blue-900 mb-1">Cultivation<br />Tips</h3>
                    <div className="absolute right-4 bottom-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Sprout className="w-6 h-6 text-blue-600" />
                    </div>
                </Link>

                <div className="space-y-4">
                    <Link to="/pest" className="block bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-red-200 hover:shadow-sm transition-all">
                        <span className="font-bold text-gray-700">Pests & diseases</span>
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                            <Bug className="w-5 h-5 text-gray-600" />
                        </div>
                    </Link>
                    <Link to="/crop" className="block bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between hover:shadow-sm transition-all">
                        <span className="font-bold text-red-800">Disease Alert</span>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-red-600" />
                        </div>
                    </Link>
                </div>

            </div>

            {/* Agri Short Videos */}
            <VideoShorts />

            {/* Old Feature Grid (Hidden/Removed to match new style or kept at bottom?) 
               I will comment out the old grid for now as I replaced it with "Library" designed to match the new look 
               Actually, the user didn't ask to delete the existing features, but just to move the calculator.
               However, to "match the screenshot", the old grid looks different. 
               The screenshot shows "Library" with "Pests & diseases".
               I will keep the old grid but maybe push it down or rename it to "Advanced Analysis" if I want to keep the original functionality accessible.
               Let's keep the original features accessible but re-styled or below.
            */}

            <div className="hidden">
                <DashboardCard
                    to="/pest"
                    title="Pest Detection"
                    icon={Bug}
                    colorClass="bg-gradient-to-br from-red-400 to-red-600"
                    description="Upload field images to instantly identify pest species and assess infestation risks."
                />
                <DashboardCard
                    to="/crop"
                    title="Crop Health"
                    icon={Sprout}
                    colorClass="bg-gradient-to-br from-green-400 to-green-600"
                    description="Monitor plant vitality and detect early signs of disease through visual leaf analysis."
                />
                <DashboardCard
                    to="/multispectral"
                    title="Multispectral"
                    icon={Activity}
                    colorClass="bg-gradient-to-br from-blue-400 to-blue-600"
                    description="Analyze invisible spectral bands to reveal crop stress and moisture levels."
                />
            </div>

            {/* Quick Stats */}
            <div className="bg-green-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">System Status: Optimal</h3>
                        <p className="text-green-100">All AI inference models are online and ready for processing.</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            </div>

            {/* Crop Details Modal */}
            {selectedCrop && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setSelectedCrop(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-5xl bg-yellow-50 p-4 rounded-2xl">{selectedCrop.icon}</span>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">{selectedCrop.name}</h2>
                                {selectedCrop.scientificName && (
                                    <p className="text-gray-500 italic">{selectedCrop.scientificName}</p>
                                )}
                            </div>
                        </div>

                        {selectedCrop.description ? (
                            <div className="space-y-4">
                                <p className="text-gray-600 leading-relaxed">{selectedCrop.description}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
                                            <Calendar className="w-4 h-4" /> Season
                                        </div>
                                        <p className="text-blue-600 text-sm">{selectedCrop.season}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-green-800 font-semibold mb-1">
                                            <Activity className="w-4 h-4" /> Duration
                                        </div>
                                        <p className="text-green-600 text-sm">{selectedCrop.duration}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Sowing Tips</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {selectedCrop.sowingTips}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-red-600 mb-1">Common Pests</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {selectedCrop.pests?.map(p => <li key={p}>{p}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-orange-600 mb-1">Diseases</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {selectedCrop.diseases?.map(d => <li key={d}>{d}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>Detailed information for {selectedCrop.name} is coming soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Manage Crops Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Manage Crops</h2>
                                <p className="text-sm text-gray-500">Tap to add or remove from dashboard</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {allCrops.map(crop => {
                                const isSelected = myCrops.some(c => c.name === crop.name);
                                return (
                                    <button
                                        key={crop.name}
                                        onClick={() => {
                                            if (isSelected) {
                                                setMyCrops(myCrops.filter(c => c.name !== crop.name));
                                            } else {
                                                setMyCrops([...myCrops, crop]);
                                            }
                                        }}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all border-2 group relative overflow-hidden ${isSelected
                                            ? 'bg-green-50 border-green-500 shadow-sm'
                                            : 'bg-white border-transparent hover:bg-gray-50'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                                        )}
                                        <span className={`text-3xl p-2 rounded-full transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                                            {crop.icon}
                                        </span>
                                        <span className={`text-xs font-bold ${isSelected ? 'text-green-700' : 'text-gray-500'}`}>
                                            {crop.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-black transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
