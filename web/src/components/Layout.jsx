import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bug, Sprout, Activity, Menu, X, Leaf } from 'lucide-react';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/pest', label: 'Pest Detection', icon: Bug },
        { path: '/crop', label: 'Crop Health', icon: Sprout },
        { path: '/multispectral', label: 'Multispectral', icon: Activity },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-green-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-green-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-green-100 transform transition-transform duration-300 ease-in-out lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center h-16 px-6 border-b border-green-100 bg-green-50/50">
                    <Leaf className="w-8 h-8 text-green-600 mr-2" />
                    <span className="text-xl font-bold text-green-800">Agri 4.0</span>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                    ? 'bg-green-100 text-green-800 font-semibold shadow-sm'
                                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive(item.path) ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'
                                    }`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-green-100 bg-green-50/30">
                    <div className="bg-green-600 rounded-xl p-4 text-white shadow-lg shadow-green-200">
                        <p className="text-sm font-medium mb-1">Status: Active</p>
                        <p className="text-xs text-green-100">System functioning normally</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden glass-nav flex items-center justify-between px-4 h-16">
                    <div className="flex items-center">
                        <Leaf className="w-6 h-6 text-green-600 mr-2" />
                        <span className="text-lg font-bold text-green-800">Agri 4.0</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-green-50 focus:outline-none"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-50">
                    <div className="flex justify-between items-center">
                        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-green-600' : 'text-gray-400'}`}>
                            <Sprout className="w-6 h-6" />
                            <span className="text-xs font-medium">Your crops</span>
                        </Link>
                        <Link to="/community" className={`flex flex-col items-center gap-1 ${isActive('/community') ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center">
                                <span className="text-xs font-bold">?</span>
                            </div>
                            <span className="text-xs font-medium">Community</span>
                        </Link>
                        <Link to="/market" className={`flex flex-col items-center gap-1 ${isActive('/market') ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`p-1 rounded-md ${isActive('/market') ? 'bg-blue-100' : ''}`}>
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium">Market</span>
                        </Link>
                        <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                <div className="w-full h-full bg-orange-200 flex items-center justify-center text-[10px]">👤</div>
                            </div>
                            <span className="text-xs font-medium">You</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
