'use client';
import { useState } from 'react';
import Header from '../src/components/Header';
import MobileNav from '../src/components/MobileNav';

export default function NavWrapper() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <Header
        mobileNavOpen={mobileOpen}
        onHamburgerClick={() => setMobileOpen(o => !o)}
      />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
