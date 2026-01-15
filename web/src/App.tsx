import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { PestDetection } from './components/PestDetection';
import { CropHealth } from './components/CropHealth';

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-green-700 text-white p-4 shadow-md">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link to="/" className="text-xl font-bold">Agri 4.0</Link>
                        <div className="space-x-4">
                            <Link to="/" className="hover:text-green-200">Dashboard</Link>
                            <Link to="/pest" className="hover:text-green-200">Pest</Link>
                            <Link to="/crop" className="hover:text-green-200">Crop</Link>
                        </div>
                    </div>
                </nav>

                <div className="py-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/pest" element={<PestDetection />} />
                        <Route path="/crop" element={<CropHealth />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
