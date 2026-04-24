import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { SearchSI } from './pages/SearchSI';
import { ServiceDetails } from './pages/ServiceDetails';
import { Execution } from './pages/Execution';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 font-sans pb-safe selection:bg-blue-200">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchSI />} />
          <Route path="/service/:si" element={<ServiceDetails />} />
          <Route path="/execute/:si" element={<Execution />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
