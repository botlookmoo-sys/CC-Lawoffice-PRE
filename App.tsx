
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/public/Home';
import ServicesPage from './pages/public/ServicesPage';
import ContactPage from './pages/public/ContactPage';
import AboutUs from './pages/public/AboutUs';
import ClientPortal from './pages/public/ClientPortal';
import RegistrationPage from './pages/public/RegistrationPage';
import GlossaryPage from './pages/public/GlossaryPage';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import InquiryList from './pages/admin/InquiryList';
import AdminLogin from './pages/admin/AdminLogin';
import CaseManagement from './pages/admin/CaseManagement';
import LawyerManagement from './pages/admin/LawyerManagement';
import ProfileSettings from './pages/admin/ProfileSettings';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ChatWidget />
      <Footer />
    </>
  );
};

// Route Guard for Admin
const ProtectedAdminRoute: React.FC = () => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

// Team Page Component
const TeamPage: React.FC = () => {
  const lawyers = [
    { name: "นายชนะชัย ยุติธรรม", role: "ทนายความอาวุโส (ผู้ก่อตั้ง)", spec: "คดีแพ่งและธุรกิจ", img: "https://picsum.photos/400/400?random=1" },
    { name: "นางสาววิไล รักษา", role: "ทนายความ", spec: "คดีครอบครัว", img: "https://picsum.photos/400/400?random=2" },
    { name: "นายเก่งกาจ ชาติชาย", role: "ทนายความ", spec: "คดีอาญา", img: "https://picsum.photos/400/400?random=3" },
  ];
  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-12">ทีมทนายความของเรา</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {lawyers.map((l, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <img src={l.img} alt={l.name} className="w-48 h-48 rounded-full mx-auto mb-6 object-cover border-4 border-slate-100" />
              <h3 className="text-xl font-bold">{l.name}</h3>
              <p className="text-primary font-medium">{l.role}</p>
              <p className="text-slate-500 mt-2 text-sm">{l.spec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/client-portal" element={<ClientPortal />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="inquiries" element={<InquiryList />} />
            <Route path="cases" element={<CaseManagement />} />
            <Route path="lawyers" element={<LawyerManagement />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="calendar" element={<div className="p-10 text-center text-slate-500">ส่วนจัดการปฏิทินนัดหมาย (Coming Soon)</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
