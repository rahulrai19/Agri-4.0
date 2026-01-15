import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PestDetection } from './components/PestDetection';
import { CropHealth } from './components/CropHealth';
import Multispectral from './pages/Multispectral';
import { Market } from './pages/Market';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { UnifiedDiagnosis } from './pages/UnifiedDiagnosis';
import { CultivationTips } from './pages/CultivationTips';
import { Calculators } from './pages/Calculators';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/diagnosis" element={<UnifiedDiagnosis />} />
                        <Route path="/calculators" element={<Calculators />} />
                        <Route path="/pest" element={<PestDetection />} />
                        <Route path="/crop" element={<CropHealth />} />
                        <Route path="/multispectral" element={<Multispectral />} />
                        <Route path="/market" element={<Market />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/cultivation" element={<CultivationTips />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
