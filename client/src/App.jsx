import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExperimentListPage from './pages/ExperimentListPage';
import LabPage from './pages/LabPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExperimentListPage />} />
        <Route path="/experiments/:id" element={<LabPage />} />
      </Routes>
    </BrowserRouter>
  );
}
