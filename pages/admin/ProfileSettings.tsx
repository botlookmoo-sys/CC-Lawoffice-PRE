
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, Lock, User, Phone, Mail, Briefcase, Camera } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { currentUser, updateUser } = useStore();
  const [formData, setFormData] = useState({
      name: '',
      password: '',
      email: '',
      phone: '',
      specialty: '',
      image: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
      if (currentUser) {
          setFormData({
              name: currentUser.name,
              password: currentUser.password || '',
              email: currentUser.email || '',
              phone: currentUser.phone || '',
              specialty: currentUser.specialty || '',
              image: currentUser.image || ''
          });
      }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (currentUser) {
          updateUser(currentUser.id, formData);
          setSuccessMsg('บันทึกข้อมูลเรียบร้อยแล้ว');
          setTimeout(() => setSuccessMsg(''), 3000);
      }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-slate-800">ตั้งค่าส่วนตัว (Profile Settings)</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-200">
              <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200">
                          <img src={formData.image || currentUser.image} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-8 h-8 text-white" />
                      </div>
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-slate-900">{currentUser.name}</h3>
                      <p className="text-slate-500">@{currentUser.username} • <span className="text-primary font-medium">{currentUser.role}</span></p>
                  </div>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {successMsg && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                      <Save className="w-4 h-4" /> {successMsg}
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ - นามสกุล</label>
                      <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                              type="text" 
                              required
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ความเชี่ยวชาญ</label>
                      <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                              placeholder="เช่น กฎหมายธุรกิจ"
                              value={formData.specialty}
                              onChange={e => setFormData({...formData, specialty: e.target.value})}
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                      <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                              type="email" 
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                      <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                          />
                      </div>
                  </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> ความปลอดภัย & รูปโปรไฟล์
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน (Password)</label>
                          <input 
                              type="password" 
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                              value={formData.password}
                              onChange={e => setFormData({...formData, password: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">URL รูปโปรไฟล์</label>
                          <input 
                              type="text" 
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-xs"
                              placeholder="https://..."
                              value={formData.image}
                              onChange={e => setFormData({...formData, image: e.target.value})}
                          />
                      </div>
                  </div>
              </div>

              <div className="flex justify-end pt-4">
                  <button 
                      type="submit" 
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition"
                  >
                      <Save className="w-4 h-4" /> บันทึกการเปลี่ยนแปลง
                  </button>
              </div>
          </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
