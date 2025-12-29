
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ServicePackage } from '../../types';
import { Check, User, CreditCard, Upload, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Copy, Percent, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const { packages, registerNewCase } = useStore();
  const [step, setStep] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(null);
  
  // Payment Mode
  const [paymentPlan, setPaymentPlan] = useState<'Full' | 'Custom'>('Full');
  const [customAmount, setCustomAmount] = useState<string>(''); // For input
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    idCard: '',
    phone: '',
    email: '',
    address: ''
  });

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [result, setResult] = useState<{caseId: string, password: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleSelectPackage = (pkg: ServicePackage) => {
    setSelectedPkg(pkg);
    setStep(2);
    setCustomAmount((pkg.price * 0.5).toString()); // Default 50% for custom
    window.scrollTo(0, 0);
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    const amountToPay = paymentPlan === 'Full' ? selectedPkg.price : Number(customAmount);
    if (amountToPay <= 0) {
        alert("กรุณาระบุจำนวนเงินที่ถูกต้อง");
        return;
    }

    setIsSubmitting(true);
    try {
        const res = await registerNewCase(formData, selectedPkg.id, proofFile, amountToPay);
        setResult(res);
        setStep(4);
        window.scrollTo(0, 0);
    } catch (error) {
        alert("เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
        setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(price);
  };

  // Calculations
  const totalPrice = selectedPkg?.price || 0;
  const payNowAmount = paymentPlan === 'Full' ? totalPrice : (Number(customAmount) || 0);
  const remainingAmount = Math.max(0, totalPrice - payNowAmount);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stepper */}
        <div className="mb-12">
           <div className="flex items-center justify-center">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>1</div>
                  <span className="hidden sm:inline font-medium">เลือกบริการ</span>
              </div>
              <div className="w-12 h-1 bg-slate-200 mx-2">
                  <div className={`h-full bg-primary transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>2</div>
                  <span className="hidden sm:inline font-medium">ข้อมูลลูกค้า</span>
              </div>
              <div className="w-12 h-1 bg-slate-200 mx-2">
                  <div className={`h-full bg-primary transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>3</div>
                  <span className="hidden sm:inline font-medium">ชำระเงิน</span>
              </div>
           </div>
        </div>

        {/* STEP 1: Package Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">เลือกแพ็คเกจบริการทางกฎหมาย</h1>
                <p className="text-slate-600 mt-2">โปร่งใส ชัดเจน ไม่มีค่าใช้จ่ายแอบแฝง</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {packages.map(pkg => (
                    <div key={pkg.id} className={`bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-xl cursor-pointer flex flex-col ${pkg.popular ? 'border-accent shadow-md' : 'border-slate-100 shadow-sm hover:border-primary/50'}`}>
                        {pkg.popular && (
                            <div className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                                ยอดนิยม
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-slate-900">{pkg.title}</h3>
                        <p className="text-slate-500 text-sm mt-2 flex-grow">{pkg.description}</p>
                        
                        <div className="my-6">
                            <span className="text-3xl font-bold text-primary">{formatPrice(pkg.price)}</span>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {pkg.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => handleSelectPackage(pkg)}
                            className="w-full mt-auto py-3 bg-slate-50 text-slate-900 font-semibold rounded-xl border border-slate-200 hover:bg-primary hover:text-white transition-colors"
                        >
                            เลือกแพ็คเกจนี้
                        </button>
                    </div>
                ))}
             </div>
          </div>
        )}

        {/* STEP 2: Client Info */}
        {step === 2 && selectedPkg && (
           <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <User className="w-6 h-6 text-primary" /> ข้อมูลผู้ว่าจ้าง
              </h2>
              
              <div className="bg-blue-50 p-4 rounded-xl mb-6 flex justify-between items-center">
                  <div>
                      <p className="text-xs text-blue-600 font-semibold uppercase">แพ็คเกจที่เลือก</p>
                      <p className="text-blue-900 font-bold">{selectedPkg.title}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs text-blue-500 underline hover:text-blue-700">เปลี่ยน</button>
              </div>

              <form onSubmit={handleInfoSubmit} className="space-y-5">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ - นามสกุล (ตามบัตรประชาชน)</label>
                      <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" 
                        value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">เลขบัตรประจำตัวประชาชน</label>
                      <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" 
                        value={formData.idCard} onChange={e => setFormData({...formData, idCard: e.target.value})}
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                        <input required type="tel" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" 
                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                        <input required type="email" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" 
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ที่อยู่ปัจจุบัน</label>
                      <textarea required rows={3} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" 
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                  </div>

                  <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">ย้อนกลับ</button>
                      <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-md">ถัดไป: ชำระเงิน</button>
                  </div>
              </form>
           </div>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && selectedPkg && (
           <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <CreditCard className="w-6 h-6 text-primary" /> ชำระค่าบริการ
              </h2>

              {/* Payment Plan Selection */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setPaymentPlan('Full')}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-auto ${paymentPlan === 'Full' ? 'border-primary bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-start w-full mb-2">
                    <span className={`font-bold ${paymentPlan === 'Full' ? 'text-primary' : 'text-slate-600'}`}>ชำระเต็มจำนวน</span>
                    {paymentPlan === 'Full' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>
                  <span className="text-xl font-bold text-slate-800">{formatPrice(selectedPkg.price)}</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentPlan('Custom')}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-auto ${paymentPlan === 'Custom' ? 'border-primary bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-start w-full mb-2">
                    <span className={`font-bold ${paymentPlan === 'Custom' ? 'text-primary' : 'text-slate-600'}`}>แบ่งชำระ (ระบุยอดเอง)</span>
                    {paymentPlan === 'Custom' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>
                   <div className="w-full">
                       <label className="text-[10px] text-slate-500 block mb-1">ระบุจำนวนเงินที่ต้องการชำระวันนี้</label>
                       <div className="relative">
                           <input 
                               type="number" 
                               className={`w-full border rounded px-2 py-1 text-sm font-bold outline-none ${paymentPlan === 'Custom' ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'}`}
                               placeholder="0.00"
                               value={customAmount}
                               onChange={(e) => {
                                   setCustomAmount(e.target.value);
                                   setPaymentPlan('Custom');
                               }}
                               onClick={(e) => e.stopPropagation()}
                           />
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">บาท</span>
                       </div>
                   </div>
                </button>
              </div>

              <div className="mb-8 text-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <p className="text-slate-500 mb-2">ยอดชำระวันนี้</p>
                  <p className="text-4xl font-bold text-primary">{formatPrice(payNowAmount)}</p>
                  {paymentPlan === 'Custom' && (
                    <div className="mt-3 flex justify-center gap-4 text-xs">
                        <div className="bg-white px-3 py-1 rounded-full border border-slate-200">
                             ราคารวม: <span className="font-semibold text-slate-700">{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="bg-white px-3 py-1 rounded-full border border-slate-200">
                             คงเหลือชำระภายหลัง: <span className="font-semibold text-red-600">{formatPrice(remainingAmount)}</span>
                        </div>
                    </div>
                  )}
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl">
                      <div className="w-40 h-40 bg-slate-200 rounded-lg flex items-center justify-center mb-4 text-slate-400">
                          {/* Placeholder for QR Code */}
                          <span className="text-xs text-center">QR Code<br/>แม่มณี/PromptPay</span>
                      </div>
                      <p className="font-bold text-slate-800">สแกนจ่ายง่ายๆ</p>
                  </div>
                  <div>
                      <h3 className="font-semibold text-slate-900 mb-3">โอนเงินผ่านบัญชีธนาคาร</h3>
                      <div className="space-y-4">
                          <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">KBANK</div>
                               <div>
                                   <p className="text-sm text-slate-500">ธนาคารกสิกรไทย</p>
                                   <p className="font-mono font-medium text-lg">099-2-12345-6</p>
                                   <p className="text-xs text-slate-400">บจก. ชนะชัย ลอว์ เฟิร์ม</p>
                               </div>
                          </div>
                      </div>
                      <div className="mt-6 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg border border-yellow-100">
                          <p>กรุณาตรวจสอบยอดเงินและชื่อบัญชีก่อนโอนเงินทุกครั้ง</p>
                      </div>
                  </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6 pt-6 border-t border-slate-100">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">อัพโหลดหลักฐานการโอนเงิน (Slipt)</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary cursor-pointer transition-colors bg-slate-50"
                           onClick={() => document.getElementById('file-upload')?.click()}
                      >
                          <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600 font-medium">
                              {proofFile ? proofFile.name : "คลิกเพื่อเลือกไฟล์รูปภาพ"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">รองรับ JPG, PNG (สูงสุด 5MB)</p>
                      </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">ย้อนกลับ</button>
                      <button 
                        type="submit" 
                        disabled={!proofFile || isSubmitting || payNowAmount <= 0}
                        className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? 'กำลังตรวจสอบ...' : 'ยืนยันการชำระเงิน'}
                      </button>
                  </div>
              </form>
           </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && result && (
            <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-xl text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">เปิดคดีสำเร็จ!</h2>
                <p className="text-slate-600 mb-8">
                    ข้อมูลของท่านถูกบันทึกและระบบได้เปิดคดีให้ท่านเรียบร้อยแล้ว <br/>
                    เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-left">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">ข้อมูลสำหรับเข้าสู่ระบบ (Client Portal)</h3>
                    
                    <div className="grid gap-4">
                        <div>
                            <p className="text-xs text-slate-400">Case ID (บัญชีผู้ใช้)</p>
                            <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 mt-1">
                                <span className="font-mono text-lg font-bold text-primary">{result.caseId}</span>
                                <Copy className="w-4 h-4 text-slate-300 cursor-pointer hover:text-primary" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Password (รหัสผ่าน)</p>
                            <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 mt-1">
                                <span className="font-mono text-lg font-bold text-primary">{result.password}</span>
                                <Copy className="w-4 h-4 text-slate-300 cursor-pointer hover:text-primary" />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-red-500 mt-3 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> โปรดบันทึกรหัสผ่านนี้ไว้เพื่อใช้ในการติดตามคดี
                    </p>
                </div>

                <Link to="/client-portal" className="block w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg transition-transform hover:-translate-y-1">
                    เข้าสู่ระบบติดตามคดี (Client Portal)
                </Link>
            </div>
        )}

      </div>
    </div>
  );
};

export default RegistrationPage;
