
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CaseType } from '../../types';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const { addInquiry } = useStore();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: CaseType.OTHER,
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    if (location.state && location.state.type) {
        setFormData(prev => ({ ...prev, type: location.state.type }));
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await addInquiry(formData);
    
    setStatus('success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: CaseType.OTHER,
      message: ''
    });

    // Reset success message after 5 seconds
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Info Side */}
          <div className="bg-primary p-10 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">ติดต่อขอคำปรึกษา</h2>
              <p className="text-blue-100 mb-8 leading-relaxed">
                กรุณากรอกข้อมูลเบื้องต้นเพื่อให้เจ้าหน้าที่ติดต่อกลับโดยเร็วที่สุด 
                หรือสามารถติดต่อเราผ่านช่องทางอื่นๆ ได้
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">โทรศัพท์</h3>
                    <p className="text-blue-200">02-123-4567</p>
                    <p className="text-blue-200">089-999-9999 (สายด่วน)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">อีเมล</h3>
                    <p className="text-blue-200">contact@nittitham-law.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">ที่ตั้งสำนักงาน</h3>
                    <p className="text-blue-200">
                      123 อาคารยุติธรรม ชั้น 15 ถนนรัชดาภิเษก<br/>
                      เขตจตุจักร กรุงเทพฯ 10900
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm text-blue-200 text-center">
                เวลาทำการ: จันทร์ - ศุกร์ 08:30 - 17:30 น.
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Send className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">ส่งข้อความเรียบร้อย</h3>
                <p className="text-slate-600">เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-primary hover:underline"
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อ - นามสกุล</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="สมชาย ใจดี"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">เบอร์โทรศัพท์</label>
                    <input
                      required
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="081-xxx-xxxx"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">อีเมล</label>
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ประเภทคดี</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-white"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as CaseType})}
                  >
                    {Object.values(CaseType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">รายละเอียดเบื้องต้น</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    placeholder="อธิบายปัญหาของท่านโดยย่อ..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-accent hover:bg-accent-light text-slate-900 font-bold py-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {status === 'submitting' ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลติดต่อ'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
