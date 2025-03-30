
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Knowledge from './pages/Knowledge';
import KnowledgeManuals from './pages/KnowledgeManuals';
import { ArticleView } from './components/knowledge/ArticleView';
import MaintenancePage from './pages/knowledge/MaintenancePage';
import RepairPage from './pages/knowledge/RepairPage';
import AdventuresPage from './pages/knowledge/AdventuresPage';
import ModificationsPage from './pages/knowledge/ModificationsPage';
import TyresPage from './pages/knowledge/TyresPage';
import { Toaster } from '@/components/ui/toaster';
import AdminPage from './pages/knowledge/AdminPage';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Authentication pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Knowledge pages */}
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/knowledge/manuals" element={<KnowledgeManuals />} />
          <Route path="/knowledge/article/:id" element={<ArticleView />} />
          <Route path="/knowledge/maintenance" element={<MaintenancePage />} />
          <Route path="/knowledge/repair" element={<RepairPage />} />
          <Route path="/knowledge/adventures" element={<AdventuresPage />} />
          <Route path="/knowledge/modifications" element={<ModificationsPage />} />
          <Route path="/knowledge/tyres" element={<TyresPage />} />
          <Route path="/knowledge/admin" element={<AdminPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
