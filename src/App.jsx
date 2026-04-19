import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Dashboard from './pages/Dashboard';
import OnChain from './pages/OnChain';
import Macro from './pages/Macro';
import News from './pages/News';
import Altcoins from './pages/Altcoins';
import Alerts from './pages/Alerts';
import { MarketDataProvider } from './context/MarketDataContext';

export default function App() {
  return (
    <MarketDataProvider>
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0b0e]">
        <Nav />
        <main>
          <Routes>
            <Route path="/signal-stack/"         element={<Dashboard />} />
            <Route path="/signal-stack/onchain"  element={<OnChain />}   />
            <Route path="/signal-stack/macro"    element={<Macro />}     />
            <Route path="/signal-stack/news"     element={<News />}      />
            <Route path="/signal-stack/altcoins" element={<Altcoins />}  />
            <Route path="/signal-stack/alerts"   element={<Alerts />}    />
            <Route path="*" element={<Navigate to="/signal-stack/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </MarketDataProvider>
  );
}
