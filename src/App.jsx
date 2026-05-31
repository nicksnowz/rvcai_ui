import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Stub({ name }) {
  return <div style={{ color: '#fff', padding: 40 }}>{name} — coming soon</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Stub name="Index" />} />
        <Route path="/intake" element={<Stub name="Intake" />} />
        <Route path="/report" element={<Stub name="Report" />} />
        <Route path="/modules" element={<Stub name="Modules" />} />
        <Route path="/ipo" element={<Stub name="Ipo" />} />
      </Routes>
    </BrowserRouter>
  );
}
