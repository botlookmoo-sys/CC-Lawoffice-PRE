
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { LegalCase, CaseType, TimelineEvent, UserRole } from '../../types';
import { Plus, Search, Folder, User, Calendar, FileText, SearchX, X, Clock, CheckCircle, Shield, Download, ChevronRight, Trash2, Filter, AlertCircle, CreditCard, Check, XCircle, Edit, Save, PlusCircle, Lock, Briefcase, FilePlus, Eye, UserCog, GripVertical, Upload, ArrowRightLeft, Receipt, Banknote, History } from 'lucide-react';

// Document Templates
const DOC_TEMPLATES = [
  { id: 'attorney_appt', name: 'ใบแต่งทนายความ (Attorney Appointment)', content: 'หนังสือแต่งทนายความ\n\nทำที่ สำนักงานชนะชัยทนายความ\nวันที่ [DATE]\n\nข้าพเจ้า [CLIENT_NAME] ผู้แต่งทนายความ\nขอแต่งตั้งให้ [LAWYER_NAME] เป็นทนายความของข้าพเจ้า\n\nลงชื่อ......................................................ผู้แต่งทนาย' },
  { id: 'power_of_attorney', name: 'หนังสือมอบอำนาจ (Power of Attorney)', content: 'หนังสือมอบอำนาจ\n\nข้าพเจ้า [CLIENT_NAME] ขอมอบอำนาจให้ [LAWYER_NAME] ดำเนินการแทนข้าพเจ้าในเรื่อง...' },
  { id: 'engagement_letter', name: 'สัญญาจ้างว่าความ (Engagement Letter)', content: 'สัญญาจ้างว่าความ\n\nคู่สัญญา: [CLIENT_NAME] และ [LAWYER_NAME]\nข้อตกลงในการให้บริการทางกฎหมาย...' },
  { id: 'court_filing_cover', name: 'หน้าปกคำฟ้อง (Court Filing Cover Letter)', content: 'คำฟ้อง\n\nศาล.....................................\nคดีหมายเลขดำที่......................\n\n[CLIENT_NAME] ....................................... โจทก์' },
  { id: 'summons_draft', name: 'หมายเรียก (Summons Draft)', content: 'หมายเรียก\n\nขอให้ท่านมาศาลเพื่อการไกล่เกลี่ย ให้การ และสืบพยาน ในวันที่...' },
  { id: 'bail_application', name: 'คำร้องขอปล่อยชั่วคราว (Bail Application Form)', content: 'คำร้องขอปล่อยชั่วคราว\n\nข้าพเจ้ามีความประสงค์ขอประกันตัวผู้ต้องหา...' }
];

const CaseManagement: React.FC = () => {
  const { cases, addCase, updateLegalCase, deleteCase, approveCase, rejectCase, verifyPayment, openFile, packages, pushNotification, availableLawyers, currentUser, addCaseDocument, addGeneratedDocument, submitAdditionalPayment } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Payment Verification' | 'Open' | 'Pending Court' | 'Closed' | 'Rejected'>('All');
  
  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check role
  const isChief = currentUser?.role === UserRole.CHIEF;

  // Filter cases logic
  const myCases = isChief 
    ? cases // Chief sees all
    : cases.filter(c => c.lawyerId === currentUser?.id); // Lawyer sees assigned

  // Timeline Editing State
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineEvent[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Case Details Editing State
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editingDetails, setEditingDetails] = useState<Partial<LegalCase>>({});
  
  // Lawyer Change State
  const [isLawyerChangeModalOpen, setIsLawyerChangeModalOpen] = useState(false);
  const [pendingLawyerId, setPendingLawyerId] = useState<number | null>(null);
  const [lawyerChangeNote, setLawyerChangeNote] = useState('');

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

  // Document Generator State
  const [isDocGeneratorOpen, setIsDocGeneratorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(DOC_TEMPLATES[0].id);

  // Document Viewer State
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);

  // Form State
  const [newCase, setNewCase] = useState<Partial<LegalCase>>({
    clientName: '',
    type: CaseType.CIVIL,
    subtype: '',
    password: '',
    status: 'Open',
    lawyerId: currentUser?.id || 1
  });

  // Initialization Effect: Runs when a new case is selected
  useEffect(() => {
    if (selectedCase) {
        setEditingTimeline(selectedCase.timeline || []);
        setEditingDetails(selectedCase);
    }
  }, [selectedCase?.id]);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const caseId = `C-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    addCase({
      ...newCase as LegalCase,
      id: caseId,
      timeline: [],
      documents: [],
      notifications: [],
      loginHistory: [],
      financials: {
          totalPrice: 0,
          amountPaid: 0,
          amountRemaining: 0,
          payments: []
      }
    });
    setIsModalOpen(false);
    setNewCase({ clientName: '', type: CaseType.CIVIL, subtype: '', password: '', status: 'Open', lawyerId: currentUser?.id || 1 });
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (!isChief) return;
    if (window.confirm(`ยืนยันการลบคดี ${id} ของคุณ ${name} หรือไม่?`)) {
        deleteCase(id);
        if (selectedCase?.id === id) {
            setSelectedCase(null);
        }
    }
  };
  
  const handleApprove = (id: string) => {
      if (window.confirm('ยืนยันการอนุมัติคดีนี้ (Approve Case)?')) {
          approveCase(id);
          pushNotification(id, 'คดีได้รับการอนุมัติ', 'สถานะคดีของคุณเปลี่ยนเป็น "กำลังดำเนินการ" (Open) เรียบร้อยแล้ว', 'status');
          
          // Manually update selected case state to reflect changes immediately in modal if open
          if (selectedCase && selectedCase.id === id) {
              setSelectedCase(prev => prev ? ({...prev, status: 'Open'}) : null);
          }
      }
  };

  const handleReject = (id: string) => {
      const reason = prompt('ระบุเหตุผลการปฏิเสธ (Rejection Reason):');
      if (reason) {
          rejectCase(id, reason);
      }
  };

  // Timeline Logic
  const handleSaveTimeline = () => {
      if (selectedCase) {
          updateLegalCase(selectedCase.id, { timeline: editingTimeline });
          pushNotification(selectedCase.id, 'อัพเดทไทม์ไลน์', 'มีความคืบหน้าใหม่ในไทม์ไลน์คดีของคุณ', 'status');
          setIsEditingTimeline(false);
      }
  };

  const handleTimelineChange = (index: number, field: keyof TimelineEvent, value: string) => {
      const newTimeline = [...editingTimeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      setEditingTimeline(newTimeline);
  };

  const handleAddEvent = () => {
      const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          title: '',
          date: new Date().toLocaleDateString('th-TH'),
          description: '',
          status: 'pending'
      };
      setEditingTimeline([...editingTimeline, newEvent]);
  };

  const handleDeleteEvent = (index: number) => {
      const newTimeline = editingTimeline.filter((_, i) => i !== index);
      setEditingTimeline(newTimeline);
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    if (draggedItemIndex === index) return;

    const newTimeline = [...editingTimeline];
    const draggedItem = newTimeline[draggedItemIndex];
    newTimeline.splice(draggedItemIndex, 1);
    newTimeline.splice(index, 0, draggedItem);
    
    setEditingTimeline(newTimeline);
    setDraggedItemIndex(null);
  };

  // Lawyer Change Logic
  const initiateLawyerChange = (newId: number) => {
      if (!isChief) return;
      setPendingLawyerId(newId);
      setLawyerChangeNote('');
      setIsLawyerChangeModalOpen(true);
  };

  const handleConfirmLawyerChange = () => {
      if (!selectedCase || pendingLawyerId === null) return;

      const oldLawyerName = getLawyerName(selectedCase.lawyerId);
      const newLawyerName = getLawyerName(pendingLawyerId);

      // Create log event
      const logEvent: TimelineEvent = {
          id: Date.now().toString(),
          title: 'เปลี่ยนผู้รับผิดชอบ (Reassignment)',
          date: new Date().toLocaleDateString('th-TH'),
          description: `เปลี่ยนจาก: ${oldLawyerName} เป็น: ${newLawyerName}.\nหมายเหตุ: ${lawyerChangeNote || '-'}`,
          status: 'completed'
      };

      const newTimeline = [logEvent, ...selectedCase.timeline];

      // Update Store
      updateLegalCase(selectedCase.id, { 
          lawyerId: pendingLawyerId,
          timeline: newTimeline 
      });

      // Update Local State (to reflect immediately without close)
      setSelectedCase({
          ...selectedCase,
          lawyerId: pendingLawyerId,
          timeline: newTimeline
      });
      // Also update editing timeline if open
      setEditingTimeline(newTimeline);

      pushNotification(selectedCase.id, 'เปลี่ยนแปลงทนายความ', `คดีของคุณได้รับการดูแลโดย ${newLawyerName}`, 'alert');

      setIsLawyerChangeModalOpen(false);
      setPendingLawyerId(null);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedCase) return;
      
      // Create dummy file if none provided (e.g. cash payment)
      const file = paymentProofFile || new File(["Manual Admin Entry"], "admin_entry.txt", { type: "text/plain" });
      
      await submitAdditionalPayment(selectedCase.id, Number(paymentAmount), file);
      setIsPaymentModalOpen(false);
      setPaymentAmount('');
      setPaymentProofFile(null);
      alert("บันทึกการชำระเงินเรียบร้อยแล้ว");
  };

  const handleSaveDetails = () => {
      if (selectedCase && editingDetails) {
          updateLegalCase(selectedCase.id, editingDetails);
          setIsEditingDetails(false);
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && selectedCase) {
          const file = e.target.files[0];
          addCaseDocument(selectedCase.id, file, currentUser?.name || 'Admin');
          if(fileInputRef.current) fileInputRef.current.value = '';
      }
  };

  const triggerFileUpload = () => {
      fileInputRef.current?.click();
  };

  const handleGenerateDoc = () => {
    if (!selectedCase) return;
    const template = DOC_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;

    let content = template.content;
    content = content.replace(/\[CLIENT_NAME\]/g, selectedCase.clientName);
    content = content.replace(/\[DATE\]/g, new Date().toLocaleDateString('th-TH'));
    content = content.replace(/\[LAWYER_NAME\]/g, getLawyerName(selectedCase.lawyerId));

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
         const base64data = reader.result as string;
         const newDoc = {
            id: Date.now().toString(),
            name: `${template.name.split(' (')[0]}_${selectedCase.id}.txt`,
            date: new Date().toLocaleDateString('th-TH'),
            size: '1 KB',
            url: base64data,
            mimeType: 'text/plain',
            uploadedBy: 'System (AI)'
         };
         addGeneratedDocument(selectedCase.id, newDoc);
         setIsDocGeneratorOpen(false);
         alert(`สร้างเอกสาร "${newDoc.name}" เรียบร้อยแล้ว`);
    };
  };

  const getLawyerName = (id?: number) => {
      if (!id) return 'ไม่ระบุ';
      return availableLawyers.find(l => l.id === id)?.name || `Unknown (ID: ${id})`;
  };

  const filteredCases = myCases.filter(c => {
    const matchesSearch = c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : c.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Payment Verification': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
        case 'Open': return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'Pending Court': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
        case 'Closed': return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
        case 'Rejected': return 'bg-gray-200 text-gray-600 hover:bg-gray-300';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPackageName = (pkgId?: string) => {
      if(!pkgId) return null;
      return packages.find(p => p.id === pkgId)?.title || pkgId;
  };

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-xl font-bold text-slate-800">จัดการคดี (Case Management)</h2>
            <p className="text-sm text-slate-500">
                {isChief ? 'จัดการคดีทั้งหมดและมอบหมายงาน' : 'จัดการคดีที่ได้รับมอบหมาย'}
            </p>
        </div>
        {isChief && (
            <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm">
                <Plus className="w-4 h-4" /> เปิดคดีใหม่ (Manual)
            </button>
        )}
      </div>

      {/* Stats & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto gap-1">
             {[
                 { id: 'All', label: 'ทั้งหมด' },
                 { id: 'Payment Verification', label: 'รออนุมัติ (Pending)' },
                 { id: 'Open', label: 'กำลังดำเนินการ' },
                 { id: 'Pending Court', label: 'ชั้นศาล' },
                 { id: 'Closed', label: 'ปิดคดี' },
                 { id: 'Rejected', label: 'ถูกปฏิเสธ' }
             ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                        activeTab === tab.id ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                 >
                    {tab.label}
                 </button>
             ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="ค้นหา Case ID / ชื่อ..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Case List Grid */}
      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(c => (
            <div key={c.id} className={`bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition group relative ${c.status === 'Rejected' ? 'border-slate-100 opacity-70' : 'border-slate-100'}`}>
              {c.status === 'Rejected' && <div className="absolute top-0 right-0 bg-slate-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg z-10 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</div>}
              {c.status === 'Payment Verification' && <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg z-10 flex items-center gap-1"><Clock className="w-3 h-3" /> Waiting Approval</div>}

              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-semibold font-mono">{c.id}</div>
                <div className="flex items-center gap-2">
                    {c.status === 'Payment Verification' && isChief ? (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleApprove(c.id)} className="p-1 bg-green-100 text-green-600 hover:bg-green-200 rounded transition" title="อนุมัติ"><Check className="w-4 h-4" /></button>
                            <button onClick={() => handleReject(c.id)} className="p-1 bg-red-100 text-red-600 hover:bg-red-200 rounded transition" title="ปฏิเสธ"><X className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        c.status !== 'Rejected' && (
                            <select 
                                value={c.status} 
                                onChange={(e) => { 
                                    const newStatus = e.target.value;
                                    if (window.confirm(`ยืนยันการเปลี่ยนสถานะเป็น "${newStatus}" หรือไม่?`)) {
                                        updateLegalCase(c.id, { status: newStatus as any }); 
                                        pushNotification(c.id, 'อัพเดทสถานะ', `สถานะคดีของคุณถูกเปลี่ยนเป็น: ${newStatus}`, 'status'); 
                                    } else {
                                        e.target.value = c.status;
                                    }
                                }} 
                                className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer transition-colors appearance-none text-center ${getStatusColor(c.status)}`} 
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="Payment Verification">Pending</option>
                                <option value="Open">Open</option>
                                <option value="Pending Court">Pending Court</option>
                                <option value="Closed">Closed</option>
                            </select>
                        )
                    )}
                    {isChief && <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(c.id, c.clientName); }} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition" title="ลบคดี"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{c.clientName}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-1">{c.type} - {c.subtype}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-50">
                 {c.packageId && <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 p-2 rounded"><CreditCard className="w-4 h-4" /><span className="font-medium truncate">{getPackageName(c.packageId)}</span></div>}
                 <div className="flex items-center gap-2 text-sm text-slate-600"><User className="w-4 h-4" /><span>Pass: <span className="font-mono bg-slate-100 px-1 rounded">{c.password}</span></span></div>
                 <div className="flex items-center gap-2 text-sm text-slate-600"><UserCog className="w-4 h-4" /><span className="truncate">{getLawyerName(c.lawyerId)}</span></div>
              </div>
              <button onClick={() => setSelectedCase(c)} className={`w-full mt-6 py-2 border rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary hover:text-white`}>
                 {c.status === 'Rejected' ? 'ดูสาเหตุการปฏิเสธ' : (c.status === 'Payment Verification' ? 'ตรวจสอบ & อนุมัติ' : 'จัดการข้อมูล & Timeline')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100 border-dashed">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4"><SearchX className="w-6 h-6 text-slate-400" /></div>
            <h3 className="text-lg font-medium text-slate-900">ไม่พบข้อมูลที่ค้นหา</h3>
        </div>
      )}

      {/* New Case Modal - Only Chief */}
      {isModalOpen && isChief && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">เปิดคดีใหม่ (Manual)</h3>
            <form onSubmit={handleCreateCase} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">ชื่อลูกความ</label><input required type="text" className="w-full border p-2 rounded" value={newCase.clientName} onChange={e => setNewCase({...newCase, clientName: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">ประเภทคดี</label><select className="w-full border p-2 rounded" value={newCase.type} onChange={e => setNewCase({...newCase, type: e.target.value as CaseType})}>{Object.values(CaseType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">เรื่อง (Subtype)</label><input required type="text" className="w-full border p-2 rounded" placeholder="เช่น ผิดสัญญา" value={newCase.subtype} onChange={e => setNewCase({...newCase, subtype: e.target.value})} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ทนายผู้รับผิดชอบ</label>
                <select className="w-full border p-2 rounded" value={newCase.lawyerId} onChange={e => setNewCase({...newCase, lawyerId: Number(e.target.value)})}>
                    {availableLawyers.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1">รหัสผ่านลูกความ</label><input required type="text" className="w-full border p-2 rounded" value={newCase.password} onChange={e => setNewCase({...newCase, password: e.target.value})} /></div>
              <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">ยกเลิก</button><button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">บันทึกข้อมูล</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Case Detail / Approval Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                <div className={`p-6 border-b border-slate-100 flex justify-between items-start ${selectedCase.status === 'Rejected' ? 'bg-slate-100' : 'bg-slate-50'}`}>
                    <div className="flex-1 mr-4">
                        <div className="flex items-center gap-3 mb-2"><span className="bg-primary text-white px-2 py-1 rounded text-xs font-mono">{selectedCase.id}</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>{selectedCase.status}</span></div>
                        <h2 className="text-2xl font-bold text-slate-900">{selectedCase.clientName}</h2>
                        <p className="text-slate-500 text-sm">{selectedCase.type} • {selectedCase.subtype}</p>
                    </div>
                    <button onClick={() => {setSelectedCase(null); setIsEditingTimeline(false); setIsEditingDetails(false); setDraggedItemIndex(null);}} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="w-6 h-6 text-slate-500" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Rejected Reason */}
                    {selectedCase.status === 'Rejected' && selectedCase.rejectionReason && (
                        <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
                             <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-2"><XCircle className="w-5 h-5 text-red-500" /> สาเหตุการปฏิเสธ</h3>
                             <p className="text-slate-600 bg-white p-4 rounded-lg border border-slate-200">{selectedCase.rejectionReason}</p>
                        </div>
                    )}

                    {/* NEW: Case Info & Reassignment Section */}
                    {selectedCase.status !== 'Rejected' && (
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-accent" /> ข้อมูลคดี (Case Info)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">แพ็คเกจบริการ</p>
                                    <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-2 rounded border border-slate-100">
                                        <CreditCard className="w-4 h-4 text-purple-500" />
                                        {getPackageName(selectedCase.packageId) || 'ไม่ระบุ'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">ทนายผู้รับผิดชอบ</p>
                                    <div className="relative">
                                        <UserCog className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <select 
                                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-slate-100 disabled:text-slate-400"
                                            value={selectedCase.lawyerId}
                                            disabled={!isChief}
                                            onChange={(e) => initiateLawyerChange(Number(e.target.value))}
                                        >
                                            {availableLawyers.map(l => (
                                                <option key={l.id} value={l.id}>
                                                    {l.name} {l.role === UserRole.CHIEF ? '(Chief)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {!isChief && <p className="text-[10px] text-slate-400 mt-1">*เฉพาะหัวหน้าสำนักงานเท่านั้นที่เปลี่ยนได้</p>}
                                </div>
                                {/* Financial Info */}
                                <div className="col-span-1 md:col-span-2 mt-2">
                                     <p className="text-xs text-slate-400 mb-2">สถานะการชำระเงิน (Financial Status)</p>
                                     {selectedCase.financials && (
                                         <>
                                             <div className="grid grid-cols-3 gap-2 text-center mb-3">
                                                 <div className="bg-slate-50 p-2 rounded border border-slate-200">
                                                     <p className="text-[10px] text-slate-500 uppercase">ยอดรวม</p>
                                                     <p className="text-sm font-bold">{selectedCase.financials.totalPrice.toLocaleString()}</p>
                                                 </div>
                                                 <div className="bg-green-50 p-2 rounded border border-green-200">
                                                     <p className="text-[10px] text-green-600 uppercase">จ่ายแล้ว</p>
                                                     <p className="text-sm font-bold text-green-700">{selectedCase.financials.amountPaid.toLocaleString()}</p>
                                                 </div>
                                                 <div className="bg-red-50 p-2 rounded border border-red-200">
                                                     <p className="text-[10px] text-red-600 uppercase">คงเหลือ</p>
                                                     <p className="text-sm font-bold text-red-700">{selectedCase.financials.amountRemaining.toLocaleString()}</p>
                                                 </div>
                                             </div>
                                             {/* Approve Button for Payment Verification */}
                                             {selectedCase.status === 'Payment Verification' && isChief && (
                                                 <div className="flex gap-2 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                     <div className="flex-1">
                                                         <p className="text-xs text-yellow-800 font-bold mb-1">คดีรอการตรวจสอบ (Pending Approval)</p>
                                                         <p className="text-[10px] text-yellow-700">โปรดตรวจสอบสลิปการโอนเงินก่อนอนุมัติ</p>
                                                     </div>
                                                     <div className="flex gap-1 items-center">
                                                         <button onClick={() => handleApprove(selectedCase.id)} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 shadow-sm">อนุมัติ (Approve)</button>
                                                         <button onClick={() => { handleReject(selectedCase.id); setSelectedCase(null); }} className="px-3 py-1.5 bg-red-100 text-red-600 border border-red-200 rounded text-xs font-bold hover:bg-red-200">ปฏิเสธ</button>
                                                     </div>
                                                 </div>
                                             )}

                                             {selectedCase.financials.amountRemaining > 0 && selectedCase.status !== 'Payment Verification' && (
                                                 <button 
                                                    onClick={() => setIsPaymentModalOpen(true)}
                                                    className="w-full py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100 flex items-center justify-center gap-2 transition"
                                                 >
                                                    <PlusCircle className="w-3 h-3" /> บันทึกการชำระงวด (Pay Installment)
                                                 </button>
                                             )}
                                         </>
                                     )}
                                </div>
                            </div>
                            
                            {/* Payment History List */}
                            {selectedCase.financials && selectedCase.financials.payments.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-400 mb-3 flex items-center gap-1"><Receipt className="w-3 h-3"/> ประวัติการชำระเงิน (Payment History)</p>
                                    <div className="space-y-3">
                                        {selectedCase.financials.payments.map((payment, idx) => (
                                            <div key={idx} className="flex items-start justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{payment.amount.toLocaleString()} บาท</p>
                                                    <p className="text-xs text-slate-500">{payment.date} • {payment.type === 'Initial' ? 'มัดจำ/งวดแรก' : 'ชำระเพิ่ม'}</p>
                                                </div>
                                                <div className="text-right flex items-center justify-end gap-2">
                                                    {payment.status === 'Pending' ? (
                                                        isChief ? (
                                                            <button 
                                                                onClick={() => verifyPayment(selectedCase.id, payment.id)}
                                                                className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-green-100 hover:text-green-700 transition border border-yellow-200"
                                                            >
                                                                รอตรวจสอบ (คลิกยืนยัน)
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded border border-yellow-200">รอตรวจสอบ</span>
                                                        )
                                                    ) : (
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3"/> ยืนยันแล้ว
                                                        </span>
                                                    )}
                                                    
                                                    {payment.slipUrl && (
                                                        <button onClick={() => openFile(payment.slipUrl)} className="text-xs text-primary hover:underline flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timeline */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Clock className="w-5 h-5 text-accent" /> Timeline</h3>
                            {selectedCase.status !== 'Rejected' && (
                                <button onClick={() => { setIsEditingTimeline(!isEditingTimeline); if(!isEditingTimeline) setEditingTimeline(selectedCase.timeline); }} className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${isEditingTimeline ? 'bg-slate-200 text-slate-700' : 'text-primary hover:bg-blue-50'}`}>
                                    {isEditingTimeline ? 'ยกเลิกแก้ไข' : <><Edit className="w-3.5 h-3.5" /> แก้ไข Timeline</>}
                                </button>
                            )}
                        </div>
                        {isEditingTimeline ? (
                             <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-in fade-in">
                                 <div className="space-y-4 mb-4">
                                     {editingTimeline.map((event, index) => (
                                         <div 
                                            key={event.id || index} 
                                            draggable 
                                            onDragStart={(e) => handleDragStart(e, index)} 
                                            onDragOver={handleDragOver} 
                                            onDrop={(e) => handleDrop(e, index)} 
                                            className={`bg-white p-3 rounded-lg border shadow-sm flex gap-3 transition-all cursor-move ${
                                                draggedItemIndex === index 
                                                    ? 'border-primary border-dashed opacity-50 bg-slate-50 scale-95' 
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                         >
                                             <div className="flex items-center justify-center text-slate-300 cursor-move">
                                                <GripVertical className="w-5 h-5" />
                                             </div>
                                             <div className="flex-1 flex flex-col gap-3">
                                                <div className="flex justify-between gap-3">
                                                    <input type="text" value={event.date} onChange={(e) => handleTimelineChange(index, 'date', e.target.value)} className="w-1/3 border border-slate-300 rounded px-2 py-1 text-sm" placeholder="วันที่" />
                                                    <input type="text" value={event.title} onChange={(e) => handleTimelineChange(index, 'title', e.target.value)} className="w-2/3 border border-slate-300 rounded px-2 py-1 text-sm font-medium" placeholder="หัวข้อ" />
                                                </div>
                                                <textarea value={event.description} onChange={(e) => handleTimelineChange(index, 'description', e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm" rows={2} placeholder="รายละเอียด..." />
                                                <div className="flex justify-between items-center">
                                                    <select value={event.status} onChange={(e) => handleTimelineChange(index, 'status', e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-xs bg-slate-50"><option value="pending">Pending</option><option value="current">Current</option><option value="completed">Completed</option></select>
                                                    <button onClick={() => handleDeleteEvent(index)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                                 <div className="flex gap-3"><button onClick={handleAddEvent} className="flex-1 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition flex items-center justify-center gap-2 text-sm"><PlusCircle className="w-4 h-4" /> เพิ่มเหตุการณ์</button></div>
                                 <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end gap-2"><button onClick={() => setIsEditingTimeline(false)} className="px-4 py-2 text-slate-600 text-sm hover:underline">ยกเลิก</button><button onClick={handleSaveTimeline} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"><Save className="w-4 h-4" /> บันทึก</button></div>
                             </div>
                        ) : (
                            <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 ml-2">
                                {selectedCase.timeline.length === 0 ? <p className="text-slate-400 text-sm">ยังไม่มีการอัพเดทไทม์ไลน์</p> : selectedCase.timeline.map((event, index) => (
                                    <div key={event.id || index} className="relative">
                                        <div className={`absolute -left-[43px] w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 ${event.status === 'completed' ? 'bg-green-500' : event.status === 'current' ? 'bg-primary' : 'bg-slate-200'}`}>
                                            {event.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                                            {event.status === 'current' && <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />}
                                        </div>
                                        <div className="rounded-xl p-4 border bg-white border-slate-100">
                                            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">{event.date}</span>
                                            <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{event.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Documents */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Folder className="w-5 h-5 text-accent" /> เอกสาร</h3>
                             <div className="flex gap-2">
                                <button onClick={() => setIsDocViewerOpen(true)} className="text-sm bg-white border border-slate-200 text-slate-600 hover:text-primary px-3 py-1.5 rounded-lg flex items-center gap-1"><Eye className="w-4 h-4" /> ดูทั้งหมด</button>
                                <button onClick={() => setIsDocGeneratorOpen(true)} className="text-sm bg-blue-50 text-primary hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1"><FilePlus className="w-4 h-4" /> สร้าง</button>
                                <button onClick={triggerFileUpload} className="text-sm text-white bg-slate-600 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><Upload className="w-3 h-3" /> อัพโหลด</button>
                             </div>
                        </div>
                        <div className="grid gap-3">
                            {selectedCase.documents.length === 0 ? <p className="text-slate-400 text-sm text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">ยังไม่มีเอกสาร</p> : selectedCase.documents.map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-50 p-2 rounded text-red-600"><FileText className="w-5 h-5" /></div>
                                        <div><p className="text-sm font-medium text-slate-900">{doc.name}</p><p className="text-xs text-slate-500">{doc.date} • {doc.size}</p></div>
                                    </div>
                                    <button onClick={() => openFile(doc.url || '')} className="text-slate-400 hover:text-primary p-2"><Download className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
