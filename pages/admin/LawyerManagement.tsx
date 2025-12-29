
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole, InternalUser } from '../../types';
import { Users, Plus, Trash2, Mail, Phone, Briefcase, Shield, X, Save } from 'lucide-react';

const LawyerManagement: React.FC = () => {
  const { availableLawyers, addLawyer, deleteUser, currentUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({
      username: '',
      password: '',
      name: '',
      role: UserRole.LAWYER,
      email: '',
      phone: '',
      specialty: ''
  });

  // Only Chief can access this
  if (currentUser?.role !== UserRole.CHIEF) {
      return (
          <div className="p-10 text-center text-red-500">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-bold">Access Denied</h2>
              <p>เฉพาะหัวหน้าสำนักงานเท่านั้นที่สามารถจัดการข้อมูลทนายความได้</p>
          </div>
      );
  }

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      addLawyer({
          ...newUser,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`
      });
      setIsModalOpen(false);
      setNewUser({ username: '', password: '', name: '', role: UserRole.LAWYER, email: '', phone: '', specialty: '' });
  };

  const handleDelete = (id: number, name: string) => {
      if (id === currentUser.id) {
          alert("ไม่สามารถลบบัญชีตัวเองได้");
          return;
      }
      if (window.confirm(`ยืนยันการลบบัญชี "${name}" ?`)) {
          deleteUser(id);
      }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-8 h-8 text-primary" /> จัดการบุคลากร (Lawyer Management)
                </h2>
                <p className="text-slate-500 mt-1">เพิ่ม ลบ หรือแก้ไขข้อมูลทนายความในสำนักงาน</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
            >
                <Plus className="w-5 h-5" /> เพิ่มทนายความใหม่
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อ - นามสกุล</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ตำแหน่ง</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ข้อมูลติดต่อ</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ความเชี่ยวชาญ</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {availableLawyers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                        <img src={user.image} alt="" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                        <div className="text-xs text-slate-500">@{user.username}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === UserRole.CHIEF ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900 flex items-center gap-1.5 mb-1">
                                    <Mail className="w-3 h-3 text-slate-400" /> {user.email || '-'}
                                </div>
                                <div className="text-sm text-slate-500 flex items-center gap-1.5">
                                    <Phone className="w-3 h-3 text-slate-400" /> {user.phone || '-'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {user.specialty ? (
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase className="w-3 h-3" /> {user.specialty}
                                    </span>
                                ) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                    onClick={() => handleDelete(user.id, user.name)}
                                    disabled={user.id === currentUser.id}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-30 disabled:cursor-not-allowed p-2 hover:bg-red-50 rounded transition"
                                    title="ลบบัญชี"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Add User Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-900">เพิ่มบุคลากรใหม่</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Username (สำหรับเข้าระบบ)</label>
                                <input required type="text" className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                                    value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input required type="text" className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                                    value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ - นามสกุล</label>
                            <input required type="text" className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                                <input type="text" className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                                    value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                                <input type="email" className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                                    value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                                />
                             </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ความเชี่ยวชาญ / หน้าที่</label>
                            <input type="text" className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                                placeholder="เช่น คดีครอบครัว, ธุรการ"
                                value={newUser.specialty} onChange={e => setNewUser({...newUser, specialty: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ตำแหน่ง (Role)</label>
                            <select className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                                value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                            >
                                <option value={UserRole.LAWYER}>ทนายความ (Associate)</option>
                                <option value={UserRole.CHIEF}>หัวหน้าสำนักงาน (Chief)</option>
                            </select>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 border border-slate-300 rounded-lg">ยกเลิก</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center gap-2">
                                <Save className="w-4 h-4" /> บันทึกข้อมูล
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default LawyerManagement;
