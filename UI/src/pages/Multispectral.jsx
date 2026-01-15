import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { multispectralService } from '../services/api';

const Multispectral = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await multispectralService.getData();
            setData(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Multispectral Analysis</h1>
                    <p className="text-gray-500 mt-1">Advanced spectral imaging for crop vigor assessment</p>
                </div>
                <button
                    onClick={fetchData}
                    className="btn-primary flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="card h-64 flex items-center justify-center">
                    <div className="flex flex-col items-center text-green-600">
                        <Activity className="w-10 h-10 animate-pulse mb-3" />
                        <span className="font-medium">Analysis in progress...</span>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            System Status
                        </h3>
                        <div className="bg-green-50 rounded-lg p-4 text-green-800">
                            {data?.message || "No data available"}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample Visualization</h3>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                            {/* Placeholder for spectral map */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-yellow-100 to-red-100 opacity-50"></div>
                            <span className="relative text-gray-400 font-medium">Spectral Map Visualization</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Multispectral;
