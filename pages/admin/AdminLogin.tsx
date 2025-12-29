
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Lock, ShieldCheck, ArrowLeft, Users } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin } = useStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative">
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          <span>กลับสู่หน้าหลัก</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
               <ShieldCheck className="w-8 h-8 text-accent" />
           </div>
           <h1 className="text-2xl font-bold text-white">Chana Chai Admin</h1>
           <p className="text-slate-400 mt-2">ระบบจัดการสำนักงานกฎหมาย</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
             {error && (
               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                 {error}
               </div>
             )}
             
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                 placeholder="username"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                 placeholder="password"
               />
             </div>

             <button 
               type="submit"
               className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
             >
               <Lock className="w-4 h-4" /> เข้าสู่ระบบ
             </button>

             <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 mb-2 flex items-center justify-center gap-1">
                    <Users className="w-3 h-3" /> 
                    บัญชีทดสอบ (Demo Access)
                </p>
                <div className="space-y-2">
                    <div className="bg-blue-50 px-3 py-2 rounded border border-blue-100 text-xs text-slate-600 flex justify-between items-center">
                        <span><strong>หัวหน้าสำนักงาน (Chief):</strong><br/> user: <code>admin</code> / pass: <code>admin</code></span>
                    </div>
                    <div className="bg-slate-50 px-3 py-2 rounded border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                        <span><strong>ทนายความ (Lawyer):</strong><br/> user: <code>somchai</code> / pass: <code>password</code></span>
                    </div>
                </div>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
