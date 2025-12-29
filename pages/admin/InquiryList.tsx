import React from 'react';
import { useStore } from '../../context/StoreContext';
import { InquiryStatus } from '../../types';
import { Phone, Mail, Clock, BrainCircuit, Trash2 } from 'lucide-react';

const InquiryList: React.FC = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useStore();

  const getStatusColor = (status: InquiryStatus) => {
    switch(status) {
        case InquiryStatus.NEW: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case InquiryStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 border-blue-200';
        case InquiryStatus.CLOSED: return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">จัดการรายการติดต่อ</h3>
        <span className="text-sm text-slate-500">ทั้งหมด {inquiries.length} รายการ</span>
      </div>
      
      <div className="divide-y divide-slate-100">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-lg text-slate-800">{inquiry.name}</h4>
                  <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-600">
                    {inquiry.type}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(inquiry.createdAt).toLocaleDateString('th-TH')}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {inquiry.phone}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {inquiry.email}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                  <p className="text-slate-700 text-sm leading-relaxed">{inquiry.message}</p>
                </div>

                {inquiry.aiSummary && (
                  <div className="flex items-start gap-2 text-sm text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <BrainCircuit className="w-4 h-4 mt-0.5 shrink-0" />
                    <p><span className="font-semibold">AI Summary:</span> {inquiry.aiSummary}</p>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-48 flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</label>
                <select
                  value={inquiry.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as InquiryStatus;
                    if (window.confirm(`ยืนยันการเปลี่ยนสถานะเป็น "${newStatus}" หรือไม่?`)) {
                        updateInquiryStatus(inquiry.id, newStatus);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-sm font-medium focus:ring-2 focus:ring-offset-1 outline-none transition-all appearance-none cursor-pointer text-center ${getStatusColor(inquiry.status)}`}
                >
                  {Object.values(InquiryStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                
                <button 
                  onClick={() => {
                      if(window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
                          deleteInquiry(inquiry.id);
                      }
                  }}
                  className="mt-auto w-full px-3 py-2 text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
                   <Trash2 className="w-4 h-4" /> ลบรายการ
                </button>
              </div>

            </div>
          </div>
        ))}

        {inquiries.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            ยังไม่มีรายการติดต่อเข้ามา
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryList;