
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquareText, LogOut, Shield, Briefcase, Calendar, Globe, UserCircle, Users, Settings } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin, currentUser } = useStore();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const menu = [
    { name: 'ภาพรวม (Dashboard)', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'รายการติดต่อ (Inquiries)', path: '/admin/inquiries', icon: <MessageSquareText className="w-5 h-5" /> },
    { name: 'จัดการคดี (Cases)', path: '/admin/cases', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'นัดหมาย (Calendar)', path: '/admin/calendar', icon: <Calendar className="w-5 h-5" /> },
  ];

  // Chief Only Menu Items
  if (currentUser?.role === UserRole.CHIEF) {
      menu.push({ name: 'จัดการทนายความ (Lawyers)', path: '/admin/lawyers', icon: <Users className="w-5 h-5" /> });
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
             <Shield className="w-6 h-6 text-accent" />
             <span className="font-bold text-lg tracking-wide">Admin Portal</span>
          </div>
          <p className="text-xs text-slate-500">Chana Chai Law Firm</p>
        </div>

        {/* User Profile */}
        <div className="p-4 bg-slate-800/50 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                {currentUser?.image ? (
                    <img src={currentUser.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <UserCircle className="w-full h-full text-slate-400" />
                )}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
                <p className="text-xs text-accent uppercase tracking-wider font-bold">
                    {currentUser?.role === UserRole.CHIEF ? 'Head of Office' : 'Associate'}
                </p>
            </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menu.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
             to="/admin/profile"
             className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/admin/profile' 
                ? 'bg-primary text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
             }`}
          >
             <Settings className="w-5 h-5" />
             <span className="font-medium">ตั้งค่าส่วนตัว</span>
          </Link>

          <Link 
            to="/"
            className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span>กลับสู่หน้าเว็บไซต์</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 sticky top-0 z-10 justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
                System Management
            </h2>
            <div className="text-sm text-slate-500">
                Role: <span className="font-mono text-slate-700">{currentUser?.role}</span>
            </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
