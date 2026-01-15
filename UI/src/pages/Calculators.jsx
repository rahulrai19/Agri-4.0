import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calculator, Sprout, TrendingUp, RefreshCw, ChevronRight } from 'lucide-react';
import { cropsData } from '../data/cropsData';

export const Calculators = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('fertilizer'); // fertilizer, seed, converter

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [inputValue, setInputValue] = useState(1); // can be area or numPlants
    const [unit, setUnit] = useState('hectare'); // hectare, acre

    // Converter State
    const [convValue, setConvValue] = useState(1);
    const [convFrom, setConvFrom] = useState('hectare');
    const [convTo, setConvTo] = useState('acre');
    const [convResult, setConvResult] = useState(2.47);

    // Filter crops that have calculator data
    const calculableCrops = Object.values(cropsData).filter(c => c.calculatorData);

    // Derived state for current basis
    const currentBasis = selectedCrop?.calculatorData?.basis || 'area';

    const getMultiplier = () => {
        if (!selectedCrop) return 0;

        if (currentBasis === 'plant') {
            // Logic: Users enters "Number of Plants" (inputValue)
            // We know "Plants Per Hectare" (seedRate)
            // Fraction of Hectare = inputValue / seedRate
            return inputValue / selectedCrop.calculatorData.seedRate;
        } else {
            // Logic: Area based
            // Convert everything to Hectare first
            return unit === 'hectare' ? inputValue : inputValue / 2.47105;
        }
    };

    const convertArea = (val, toUnit) => {
        // 1 Hectare = 2.47105 Acres
        if (toUnit === 'acre') return val * 2.47105;
        return val / 2.47105;
    };

    const calculateFertilizer = () => {
        if (!selectedCrop) return null;

        const multiplier = getMultiplier();
        const { n, p, k } = selectedCrop.calculatorData.npk;

        const reqN = n * multiplier;
        const reqP = p * multiplier;
        const reqK = k * multiplier;

        // Bag Estimation (Approximate)
        const ureaKg = reqN / 0.46;
        const dapKg = reqP / 0.46;
        const mopKg = reqK / 0.60;

        return {
            nutrients: { N: reqN, P: reqP, K: reqK },
            fertilizers: {
                Urea: ureaKg,
                DAP: dapKg,
                MOP: mopKg
            }
        };
    };

    const calculateSeed = () => {
        if (!selectedCrop) return null;
        // Seed Calc always defaults to Area for simplicity in this version
        let areaInHa = unit === 'hectare' ? inputValue : inputValue / 2.47105;
        const rate = selectedCrop.calculatorData.seedRate;

        return {
            qty: rate * areaInHa,
            unit: selectedCrop.calculatorData.seedUnit
        };
    };

    // Update converter result
    useEffect(() => {
        if (convFrom === convTo) {
            setConvResult(convValue);
        } else if (convFrom === 'hectare' && convTo === 'acre') {
            setConvResult(convValue * 2.47105);
        } else {
            setConvResult(convValue / 2.47105);
        }
    }, [convValue, convFrom, convTo]);


    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-8 h-8 text-green-600" /> Agri Calculators
            </h1>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl overflow-x-auto">
                <button
                    onClick={() => setActiveTab('fertilizer')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors ${activeTab === 'fertilizer' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Fertilizer Estimator
                </button>
                <button
                    onClick={() => setActiveTab('seed')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors ${activeTab === 'seed' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Seed Rate
                </button>
                <button
                    onClick={() => setActiveTab('converter')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors ${activeTab === 'converter' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Unit Converter
                </button>
            </div>

            {/* Fertilizer Calculator */}
            {activeTab === 'fertilizer' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="card space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Select Crop</label>
                                <select
                                    className="input"
                                    onChange={(e) => setSelectedCrop(calculableCrops.find(c => c.name === e.target.value))}
                                    value={selectedCrop?.name || ''}
                                >
                                    <option value="">-- Choose Crop --</option>
                                    {calculableCrops.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                                </select>
                            </div>

                            {/* Dynamic Inputs based on Basis */}
                            {selectedCrop && currentBasis === 'plant' ? (
                                <div className="col-span-2 md:col-span-1">
                                    <label className="label">Number of Plants</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            className="input"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(Math.max(0, parseFloat(e.target.value) || 0))}
                                            placeholder="e.g. 500"
                                        />
                                        <span className="flex items-center px-4 bg-gray-100 rounded-lg text-gray-500 font-bold">Plants</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Calculation based on individual plant requirement.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Area Size</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(Math.max(0, parseFloat(e.target.value) || 0))}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Unit</label>
                                        <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
                                            <option value="hectare">Hectare</option>
                                            <option value="acre">Acre</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedCrop && (
                            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Estimated Requirement
                                </h3>

                                {(() => {
                                    const res = calculateFertilizer();
                                    return (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                                    <div className="text-xs text-gray-500 font-bold uppercase">Nitrogen (N)</div>
                                                    <div className="text-xl font-bold text-gray-800">{res.nutrients.N.toFixed(1)} kg</div>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                                    <div className="text-xs text-gray-500 font-bold uppercase">Phosphorus (P)</div>
                                                    <div className="text-xl font-bold text-gray-800">{res.nutrients.P.toFixed(1)} kg</div>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                                    <div className="text-xs text-gray-500 font-bold uppercase">Potassium (K)</div>
                                                    <div className="text-xl font-bold text-gray-800">{res.nutrients.K.toFixed(1)} kg</div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2">Recommended Fertilizers (Approx)</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center border-b pb-2">
                                                        <span>Urea (46% N)</span>
                                                        <span className="font-mono font-bold">{(res.fertilizers.Urea / 50).toFixed(1)} Bags (50kg)</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-b pb-2">
                                                        <span>DAP (18% N, 46% P)</span>
                                                        <span className="font-mono font-bold">{(res.fertilizers.DAP / 50).toFixed(1)} Bags (50kg)</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>MOP (60% K)</span>
                                                        <span className="font-mono font-bold">{(res.fertilizers.MOP / 50).toFixed(1)} Bags (50kg)</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2 italic">*Estimates are general. Soil testing recommended for precision.</p>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Seed Calculator */}
            {activeTab === 'seed' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="card space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Select Crop</label>
                                <select
                                    className="input"
                                    onChange={(e) => setSelectedCrop(calculableCrops.find(c => c.name === e.target.value))}
                                    value={selectedCrop?.name || ''}
                                >
                                    <option value="">-- Choose Crop --</option>
                                    {calculableCrops.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Area Size</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="input"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(Math.max(0, parseFloat(e.target.value) || 0))}
                                    />
                                </div>
                                <div>
                                    <label className="label">Unit</label>
                                    <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
                                        <option value="hectare">Hectare</option>
                                        <option value="acre">Acre</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {selectedCrop && (
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                                        <Sprout className="w-5 h-5" /> Seeds Required
                                    </h3>
                                    <p className="text-blue-600 text-sm">For {inputValue} {unit} of {selectedCrop.name}</p>
                                </div>
                                <div className="text-right">
                                    {(() => {
                                        const res = calculateSeed();
                                        return (
                                            <>
                                                <div className="text-3xl font-bold text-blue-900">{res.qty.toFixed(1)}</div>
                                                <div className="text-sm font-bold text-blue-600 uppercase">{res.unit}</div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Unit Converter */}
            {activeTab === 'converter' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="card">
                        <div className="flex items-center justify-center gap-4 flex-col md:flex-row">
                            <div className="flex-1 w-full">
                                <label className="label">Value</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="input text-center text-xl font-bold"
                                    value={convValue}
                                    onChange={(e) => setConvValue(Math.max(0, parseFloat(e.target.value) || 0))}
                                />
                                <select
                                    className="input mt-2"
                                    value={convFrom}
                                    onChange={(e) => setConvFrom(e.target.value)}
                                >
                                    <option value="hectare">Hectare</option>
                                    <option value="acre">Acre</option>
                                </select>
                            </div>

                            <div className="text-gray-400">
                                <RefreshCw className="w-6 h-6" />
                            </div>

                            <div className="flex-1 w-full bg-gray-50 p-4 rounded-xl text-center border">
                                <label className="label mb-2 block">Result</label>
                                <div className="text-3xl font-bold text-gray-800 mb-2">{convResult.toFixed(4)}</div>
                                <select
                                    className="input bg-white"
                                    value={convTo}
                                    onChange={(e) => setConvTo(e.target.value)}
                                >
                                    <option value="hectare">Hectare</option>
                                    <option value="acre">Acre</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
