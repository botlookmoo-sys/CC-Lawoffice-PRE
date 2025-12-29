
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X, Shield, Lock, PlusCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'เกี่ยวกับเรา', path: '/about' },
    { name: 'บริการของเรา', path: '/services' },
    { name: 'คลังความรู้', path: '/glossary' },
    { name: 'ติดต่อเรา', path: '/contact' },
    { name: 'Client Portal', path: '/client-portal' },
  ];

  if (isAdmin) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Scale className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">ชนะชัย</h1>
                <p className="text-xs text-slate-500 uppercase tracking-wider">ทนายความ</p>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <Link 
                to="/register" 
                className="bg-accent hover:bg-accent-light text-slate-900 text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm"
            >
                <PlusCircle className="w-4 h-4" />
                เปิดคดีออนไลน์
            </Link>

            <Link 
                to="/admin/login" 
                className="text-slate-400 hover:text-slate-600"
                title="สำหรับเจ้าหน้าที่"
            >
                <Lock className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50"
              >
                {link.name}
              </Link>
            ))}
             <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-accent/10 text-accent-dark border border-accent/20"
              >
                + เปิดคดีออนไลน์
              </Link>
             <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-slate-600"
              >
                ระบบหลังบ้าน
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
