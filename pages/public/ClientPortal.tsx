
import React, { useState } from 'react';
import { Lock, FileText, Calendar, CheckCircle, Clock, ArrowRight, Shield, AlertCircle, Monitor, ShieldCheck, Bell, XCircle, Download, Wallet, CreditCard, Upload } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LegalCase } from '../../types';

const ClientPortal: React.FC = () => {
  const { cases, recordLogin, markAllNotificationsRead, submitAdditionalPayment } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ caseId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Payment State
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Find the most up-to-date version of the active case from store
  const activeCase = cases.find(c => c.id === activeCaseId);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundCase = cases.find(c => c.id === formData.caseId && c.password === formData.password);

    if (foundCase) {
        setActiveCaseId(foundCase.id);
        recordLogin(foundCase.id, true); // Record this login event as success
        setIsLoggedIn(true);
        // Default payment amount to remaining
        if (foundCase.financials) {
            setPaymentAmount(foundCase.financials.amountRemaining.toString());
        }
    } else {
        setError('ไม่พบข้อมูลคดี หรือ รหัสผ่านไม่ถูกต้อง');
    }
    
    setIsLoading(false);
  };

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && activeCase) {
        markAllNotificationsRead(activeCase.id);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!activeCase || !paymentProof) return;

      setIsPaying(true);
      try {
          await submitAdditionalPayment(activeCase.id, Number(paymentAmount), paymentProof);
          alert("ส่งข้อมูลการชำระเงินเรียบร้อยแล้ว");
          setPaymentProof(null);
          // Amount will update via context
      } catch (e) {
          alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
      } finally {
          setIsPaying(false);
      }
  };

  const unreadCount = activeCase?.notifications.filter(n => !n.read).length || 0;

  if (!isLoggedIn || !activeCase) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
                <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Client Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            เข้าสู่ระบบเพื่อติดตามสถานะคดีและนัดหมาย
          </p>
          <div className="mt-4 text-center">
             <p className="text-xs text-slate-400">Demo User: ID: <span className="font-mono text-slate-600">C-2024-089</span> | Pass: <span className="font-mono text-slate-600">password123</span></p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="caseId" className="block text-sm font-medium text-slate-700">
                  หมายเลขคดี (Case ID)
                </label>
                <div className="mt-1">
                  <input
                    id="caseId"
                    name="caseId"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="เช่น C-2024-001"
                    value={formData.caseId}
                    onChange={(e) => setFormData({...formData, caseId: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  รหัสผ่าน (Password)
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                  </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className={`pb-32 transition-colors duration-500 ${activeCase.status === 'Rejected' ? 'bg-slate-800' : 'bg-primary'}`}>
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white">ยินดีต้อนรับ, {activeCase.clientName}</h1>
                    <p className="text-blue-200 mt-2">หมายเลขคดี: {activeCase.id} | {activeCase.type} ({activeCase.subtype})</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={handleOpenNotifications}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 block h-3 w-3 transform -translate-y-1/4 translate-x-1/4 rounded-full ring-2 ring-primary bg-red-500"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-slate-800">การแจ้งเตือน</h3>
                                    <span className="text-xs text-slate-500">{activeCase.notifications.length} รายการ</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {activeCase.notifications.length === 0 ? (
                                        <div className="p-6 text-center text-slate-500 text-sm">ไม่มีการแจ้งเตือน</div>
                                    ) : (
                                        activeCase.notifications.map((notif) => (
                                            <div key={notif.id} className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-800">{notif.title}</h4>
                                                        <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                                                        <p className="text-[10px] text-slate-400 mt-2">{new Date(notif.timestamp).toLocaleString('th-TH')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => {setIsLoggedIn(false); setActiveCaseId(null);}}
                        className="text-blue-200 hover:text-white text-sm bg-white/10 px-3 py-1 rounded transition-colors"
                    >
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        
        {/* Status Alerts */}
        {activeCase.status === 'Payment Verification' && (
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-md animate-in slide-in-from-bottom-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>สถานะ: รอตรวจสอบการชำระเงิน</strong><br/>
                      เจ้าหน้าที่กำลังตรวจสอบหลักฐานการโอนเงินของท่าน โดยปกติจะใช้เวลาไม่เกิน 24 ชั่วโมง
                    </p>
                  </div>
                </div>
              </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Financial Status & Payment */}
                {activeCase.financials && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-accent" />
                                สถานะการเงิน
                            </h2>
                            <div className="text-sm text-slate-500">
                                รวมทั้งสิ้น: <span className="font-bold text-slate-800">{activeCase.financials.totalPrice.toLocaleString()} บ.</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                                <div className="flex-1 bg-green-50 rounded-lg p-4 border border-green-100">
                                    <p className="text-xs text-green-600 font-semibold uppercase">ชำระแล้ว</p>
                                    <p className="text-2xl font-bold text-green-700">{activeCase.financials.amountPaid.toLocaleString()}</p>
                                </div>
                                <div className="flex-1 bg-red-50 rounded-lg p-4 border border-red-100">
                                    <p className="text-xs text-red-600 font-semibold uppercase">คงเหลือ</p>
                                    <p className="text-2xl font-bold text-red-700">{activeCase.financials.amountRemaining.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Payment Form (Only if remaining > 0) */}
                            {activeCase.financials.amountRemaining > 0 && (
                                <div className="border-t border-slate-100 pt-6">
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> ชำระค่างวดคงเหลือ
                                    </h3>
                                    <form onSubmit={handlePaymentSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">ยอดชำระ (บาท)</label>
                                                <input 
                                                    type="number"
                                                    required
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                    value={paymentAmount}
                                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                                    max={activeCase.financials.amountRemaining}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">แนบสลิปโอนเงิน</label>
                                                <div className="relative">
                                                     <input 
                                                        type="file" 
                                                        className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                                                        accept="image/*"
                                                        onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                                                        required
                                                     />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-slate-500">
                                                * โอนเข้าบัญชีเดิม (KBANK: 099-2-12345-6)
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={isPaying || !paymentProof}
                                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2 transition"
                                            >
                                                {isPaying ? 'กำลังส่งข้อมูล...' : <><Upload className="w-4 h-4" /> ยืนยันชำระเงิน</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Status Card */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent" />
                            สถานะการดำเนินงานล่าสุด
                        </h2>
                    </div>
                    <div className="p-6">
                        {activeCase.timeline.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">ยังไม่มีข้อมูลไทม์ไลน์</p>
                        ) : (
                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-8 pb-2">
                                {activeCase.timeline.map((event) => (
                                    <div key={event.id} className="relative">
                                        <span className={`absolute -left-[41px] h-6 w-6 rounded-full flex items-center justify-center border-4 border-white ${
                                            event.status === 'completed' ? 'bg-green-500' :
                                            event.status === 'current' ? 'bg-primary' : 'bg-slate-200'
                                        }`}>
                                            {event.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                                            {event.status === 'current' && <Clock className="w-3 h-3 text-white" />}
                                        </span>
                                        <h3 className={`text-sm font-semibold ${event.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{event.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{event.date}</p>
                                        <p className={`text-sm mt-2 ${event.status === 'pending' ? 'text-slate-400' : 'text-slate-600'}`}>{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-100">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-accent" />
                            เอกสารสำคัญ
                        </h2>
                        {activeCase.documents.length > 0 && (
                            <span className="text-xs text-slate-500">{activeCase.documents.length} ไฟล์</span>
                        )}
                    </div>
                    <div className="divide-y divide-slate-100">
                        {activeCase.documents.length === 0 ? (
                             <p className="text-slate-500 text-center py-6">ไม่มีเอกสาร</p>
                        ) : activeCase.documents.map((doc, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 p-2 rounded group-hover:bg-blue-50 transition-colors">
                                        <FileText className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                                        <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                                    </div>
                                </div>
                                <a 
                                    href={doc.url} 
                                    download={doc.name}
                                    className="text-sm text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    <Download className="w-4 h-4" /> ดาวน์โหลด
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
                {/* Appointment */}
                {activeCase.nextAppointment && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
                        <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-accent" />
                            นัดหมายถัดไป
                        </h2>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <p className="text-sm font-semibold text-blue-900">{activeCase.nextAppointment.title}</p>
                            <p className="text-2xl font-bold text-primary mt-1">{activeCase.nextAppointment.date}</p>
                            <p className="text-sm text-blue-700 mt-1">เวลา {activeCase.nextAppointment.time}</p>
                            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> {activeCase.nextAppointment.location}
                            </p>
                        </div>
                    </div>
                )}

                {/* Lawyer Contact */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-medium text-slate-900 mb-4">ทนายความผู้รับผิดชอบ</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <img src={`https://picsum.photos/200/200?random=${activeCase.lawyerId}`} className="w-12 h-12 rounded-full object-cover border border-slate-200" alt="Lawyer" />
                        <div>
                            <p className="text-sm font-bold text-slate-900">ทนายสมชาย (ทีมงาน)</p>
                            <p className="text-xs text-slate-500">ทนายความเจ้าของสำนวน</p>
                        </div>
                    </div>
                    <button className="w-full py-2 px-4 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        ส่งข้อความถึงทนาย
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
