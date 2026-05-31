import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import Index from './pages/Index';
import Intake from './pages/Intake';
import Report from './pages/Report';
import Modules from './pages/Modules';
import Ipo from './pages/Ipo';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <BrowserRouter>
      <Header
        mobileNavOpen={mobileOpen}
        onHamburgerClick={() => setMobileOpen(o => !o)}
      />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/report" element={<Report />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/ipo" element={<Ipo />} />
      </Routes>
    </BrowserRouter>
  );
}
