import React from 'react';
import { Settings, ChevronRight, HelpCircle, LogOut, FileText, User } from 'lucide-react';

export const Profile = () => {
    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Settings className="w-6 h-6 text-gray-600" />
                </button>
            </header>

            {/* Profile Card */}
            <div className="bg-blue-50/50 rounded-3xl p-6 flex items-center gap-4 border border-blue-50">
                <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm overflow-hidden">
                    <span className="text-2xl">👨‍🌾</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Rahul Rai</h2>
                    <p className="text-blue-600 font-medium text-sm">Farmer</p>
                    <p className="text-gray-400 text-xs">protocolpsi@gmail.com</p>
                </div>
            </div>

            {/* Survey Banner */}
            <div className="bg-blue-600 rounded-3xl p-6 relative overflow-hidden text-white shadow-lg shadow-blue-200">
                <div className="relative z-10 max-w-[70%]">
                    <h3 className="font-bold text-lg mb-2">Help us improve!</h3>
                    <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                        Take a quick survey to help us build better tools for your farming needs.
                    </p>
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform hover:bg-blue-50">
                        Take survey
                    </button>
                </div>

                {/* Decorative background icon */}
                <div className="absolute right-0 bottom-0 top-0 w-32 bg-blue-500/30 transform skew-x-12 translate-x-8 flex items-center justify-center">
                    <FileText className="w-24 h-24 text-blue-700/20 rotate-12" />
                </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-3">
                <button className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50 shadow-sm hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-700">Account Details</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50 shadow-sm hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-700">Help & Support</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50 shadow-sm hover:bg-red-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-red-600">Log Out</span>
                    </div>
                </button>
            </div>
        </div>
    );
};
