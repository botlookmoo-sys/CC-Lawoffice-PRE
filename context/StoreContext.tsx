
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Inquiry, InquiryStatus, CaseType, LegalCase, ServicePackage, LoginHistoryEntry, ClientNotification, InternalUser, UserRole, CaseDocument, PaymentRecord, TimelineEvent } from '../types';
import { summarizeInquiry } from '../services/geminiService';
import { saveFileToDB, getFileUrl } from '../services/storageService';

interface StoreContextType {
  inquiries: Inquiry[];
  cases: LegalCase[];
  packages: ServicePackage[];
  availableLawyers: InternalUser[];
  currentUser: InternalUser | null;
  
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  deleteInquiry: (id: string) => void;
  
  // Case Management
  addCase: (newCase: LegalCase) => void;
  registerNewCase: (clientData: any, packageId: string, proofFile: File | null, initialPaidAmount: number) => Promise<{caseId: string, password: string}>;
  submitAdditionalPayment: (caseId: string, amount: number, proofFile: File) => Promise<void>;
  approveCase: (id: string, updates?: Partial<LegalCase>) => void;
  rejectCase: (id: string, reason: string) => void;
  updateLegalCase: (id: string, updates: Partial<LegalCase>) => void;
  recordLogin: (caseId: string, success: boolean) => void;
  deleteCase: (id: string) => void;
  getCaseById: (id: string) => LegalCase | undefined;
  verifyPayment: (caseId: string, paymentId: string) => void;
  
  // Document Management
  addCaseDocument: (caseId: string, file: File, uploaderName: string) => Promise<void>;
  addGeneratedDocument: (caseId: string, doc: CaseDocument) => void;
  openFile: (fileIdOrUrl: string) => Promise<void>;

  // User Management
  addLawyer: (user: Omit<InternalUser, 'id'>) => void;
  updateUser: (id: number, updates: Partial<InternalUser>) => void;
  deleteUser: (id: number) => void;

  // Notifications
  pushNotification: (caseId: string, title: string, message: string, type: 'status' | 'document' | 'alert') => void;
  markAllNotificationsRead: (caseId: string) => void;
  
  // Admin Auth
  loginAdmin: (username: string, pass: string) => boolean;
  logoutAdmin: () => void;
  
  stats: {
    totalInquiries: number;
    activeCases: number;
    closedInquiries: number;
    pendingApprovals: number;
    byType: Record<string, number>;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to format file size
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Mock Data - Internal Users
const INITIAL_USERS: InternalUser[] = [
  { 
    id: 999, 
    username: 'admin', 
    password: 'admin',
    name: 'หัวหน้าสำนักงาน (Chief)', 
    role: UserRole.CHIEF, 
    image: 'https://ui-avatars.com/api/?name=Chief+Admin&background=0D8ABC&color=fff',
    email: 'chief@chanachai.com',
    specialty: 'บริหารจัดการ',
    phone: '02-123-4567'
  },
  { 
    id: 1, 
    username: 'somchai', 
    password: 'password',
    name: 'ทนายสมชาย ยุติธรรม', 
    role: UserRole.LAWYER, 
    image: 'https://ui-avatars.com/api/?name=Somchai+Y&background=random',
    email: 'somchai@chanachai.com',
    specialty: 'คดีแพ่งและธุรกิจ',
    phone: '081-111-1111'
  },
  { 
    id: 2, 
    username: 'wilai', 
    password: 'password',
    name: 'ทนายวิไล รักษา', 
    role: UserRole.LAWYER, 
    image: 'https://ui-avatars.com/api/?name=Wilai+R&background=random',
    email: 'wilai@chanachai.com',
    specialty: 'คดีครอบครัว',
    phone: '082-222-2222'
  },
];

// Mock Data - Service Packages
const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg_estate_simple',
    title: 'คดีจัดการมรดก (ไม่มีข้อโต้แย้ง)',
    price: 8000,
    type: CaseType.FAMILY,
    description: 'บริการยื่นคำร้องขอตั้งผู้จัดการมรดก กรณีทายาททุกคนยินยอมและไม่มีพินัยกรรมซับซ้อน',
    features: ['จัดทำคำร้อง', 'ยื่นต่อศาล', 'ประกาศหนังสือพิมพ์', 'ทนายความดูแลในวันไต่สวน 1 นัด'],
    popular: true
  },
  {
    id: 'pkg_divorce_mutual',
    title: 'คดีฟ้องหย่า (สมัครใจ)',
    price: 15000,
    type: CaseType.FAMILY,
    description: 'ดำเนินการหย่าโดยความยินยอม หรือมีข้อตกลงเรื่องทรัพย์สินชัดเจน',
    features: ['ร่างสัญญาประนีประนอม', 'ยื่นฟ้อง', 'ดูแลวันนัดไกล่เกลี่ย']
  },
  {
    id: 'pkg_civil_defense',
    title: 'ต่อสู้คดีแพ่ง (เริ่มต้น)',
    price: 20000,
    type: CaseType.CIVIL,
    description: 'การจัดทำคำให้การต่อสู้คดีแพ่งทั่วไป เช่น บัตรเครดิต, กู้ยืม',
    features: ['ตรวจเอกสาร', 'ร่างคำให้การ', 'ว่าความศาลชั้นต้น']
  },
  {
    id: 'pkg_consult_hour',
    title: 'ที่ปรึกษากฎหมายธุรกิจ (รายเดือน)',
    price: 5000,
    type: CaseType.CORPORATE,
    description: 'ที่ปรึกษาประจำบริษัท ให้คำปรึกษาทางโทรศัพท์และตรวจสัญญา',
    features: ['ปรึกษาไม่จำกัดครั้ง', 'ตรวจสัญญา 2 ฉบับ/เดือน', 'หนังสือทวงถามหนี้ 5 ฉบับ']
  },
  {
    id: 'pkg_demand_letter',
    title: 'หนังสือทวงถาม / โนติส (Demand Letter)',
    price: 3000,
    type: CaseType.CIVIL,
    description: 'บริการออกหนังสือทวงถามหนี้ หรือแจ้งให้คู่กรณีปฏิบัติตามสัญญาอย่างเป็นทางการโดยทนายความ',
    features: ['ร่างหนังสือโนติสตามหลักกฎหมาย', 'ส่งไปรษณีย์ลงทะเบียนตอบรับ', 'รายงานผลการส่ง', 'คำแนะนำเบื้องต้นหากลูกหนี้เพิกเฉย']
  }
];

// Mock Data - Inquiries
const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: '1',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '081-234-5678',
    type: CaseType.CIVIL,
    message: 'ต้องการฟ้องร้องเรื่องผิดสัญญาเช่าซื้อรถยนต์ คู่กรณีไม่ยอมจ่ายค่างวดมา 3 เดือนแล้ว',
    status: InquiryStatus.NEW,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    aiSummary: 'ผิดสัญญาเช่าซื้อรถยนต์ ค้างชำระ 3 งวด'
  }
];

// Mock Data - Cases
const INITIAL_CASES: LegalCase[] = [
    {
        id: 'C-2024-089',
        clientName: 'คุณสมชาย ใจดี',
        type: CaseType.CIVIL,
        subtype: 'ผิดสัญญาเช่าซื้อ',
        password: 'password123',
        lawyerId: 1,
        status: 'Open',
        timeline: [
            { id: '1', title: 'ยื่นคำฟ้องต่อศาล', date: '15 มีนาคม 2567', description: 'ทนายความได้ดำเนินการยื่นคำฟ้องเรียบร้อยแล้ว ศาลประทับรับฟ้อง', status: 'completed' },
            { id: '2', title: 'รอวันนัดไกล่เกลี่ย', date: '20 เมษายน 2567', description: 'เตรียมเอกสารหลักฐานตัวจริงเพื่อนำสืบในชั้นศาล', status: 'current' }
        ],
        documents: [],
        loginHistory: [],
        notifications: [],
        nextAppointment: {
            date: '20 เม.ย.',
            time: '09:00 น.',
            location: 'ศาลแพ่งรัชดา',
            title: 'นัดไกล่เกลี่ย'
        },
        financials: {
            totalPrice: 20000,
            amountPaid: 20000,
            amountRemaining: 0,
            payments: [
                { id: 'p1', date: '15/03/2024', amount: 20000, type: 'Initial', status: 'Verified', slipUrl: 'https://placehold.co/400x600?text=Slip' }
            ]
        },
        paymentType: 'Full'
    }
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [cases, setCases] = useState<LegalCase[]>(INITIAL_CASES);
  const [users, setUsers] = useState<InternalUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<InternalUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Data from LocalStorage
  useEffect(() => {
    const loadData = () => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try { setCurrentUser(JSON.parse(savedUser)); } catch (e) { console.error("Session Error"); }
        }

        const savedCases = localStorage.getItem('cases');
        if (savedCases) {
            try { setCases(JSON.parse(savedCases)); } catch (e) { console.error("Case Load Error"); }
        }

        const savedInquiries = localStorage.getItem('inquiries');
        if (savedInquiries) {
            try { setInquiries(JSON.parse(savedInquiries)); } catch (e) { console.error("Inquiry Load Error"); }
        }
        
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            try { setUsers(JSON.parse(savedUsers)); } catch (e) { console.error("Users Load Error"); }
        }

        setIsInitialized(true);
    };
    loadData();
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (isInitialized) {
        localStorage.setItem('cases', JSON.stringify(cases));
    }
  }, [cases, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
    }
  }, [inquiries, isInitialized]);
  
  useEffect(() => {
      if (isInitialized) {
          localStorage.setItem('users', JSON.stringify(users));
      }
  }, [users, isInitialized]);


  // Helper to open files
  const openFile = async (fileIdOrUrl: string) => {
      if (!fileIdOrUrl) {
          alert("ไม่พบไฟล์เอกสาร");
          return;
      }
      const url = await getFileUrl(fileIdOrUrl);
      if (url) {
          window.open(url, '_blank');
      } else {
          alert("ไม่สามารถเปิดไฟล์ได้ หรือไฟล์ถูกลบไปแล้ว");
      }
  };


  const addInquiry = async (data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const summary = await summarizeInquiry(data.message);
    const newInquiry: Inquiry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: InquiryStatus.NEW,
      aiSummary: summary
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const deleteInquiry = (id: string) => {
      setInquiries(prev => prev.filter(item => item.id !== id));
  }

  // Case Management
  const addCase = (newCase: LegalCase) => {
      setCases(prev => [newCase, ...prev]);
  };

  const registerNewCase = async (clientData: any, packageId: string, proofFile: File | null, initialPaidAmount: number) => {
    const selectedPkg = SERVICE_PACKAGES.find(p => p.id === packageId);
    const totalPrice = selectedPkg ? selectedPkg.price : 0;
    const isInstallment = initialPaidAmount < totalPrice;

    const generatedId = `C-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const generatedPassword = Math.random().toString(36).slice(-8);

    // Process Proof File with DB
    let paymentProofId: string = '';
    if (proofFile) {
        try {
            paymentProofId = await saveFileToDB(proofFile);
        } catch (e) {
            console.error("Failed to save file to DB", e);
        }
    }

    const newPayment: PaymentRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('th-TH'),
        amount: initialPaidAmount,
        type: 'Initial',
        slipUrl: paymentProofId, // Stores ID
        status: 'Pending'
    };

    const newCase: LegalCase = {
      id: generatedId,
      clientName: clientData.fullName,
      type: selectedPkg?.type || CaseType.OTHER,
      subtype: selectedPkg?.title || 'General Case',
      password: generatedPassword,
      lawyerId: 999, 
      status: 'Payment Verification',
      timeline: [
        { 
          id: '1', 
          title: 'ได้รับคำขอเปิดคดี (Request Received)', 
          date: new Date().toLocaleDateString('th-TH'), 
          description: `ระบบได้รับข้อมูลแล้ว อยู่ระหว่างตรวจสอบการชำระเงิน (${initialPaidAmount.toLocaleString()} บาท)`, 
          status: 'current' 
        }
      ],
      documents: [],
      loginHistory: [],
      notifications: [
           {
              id: Date.now().toString(),
              title: 'ได้รับข้อมูลการจ้างว่าความ',
              message: 'ระบบได้รับข้อมูลของท่านแล้ว กรุณารอเจ้าหน้าที่ตรวจสอบการชำระเงินและอนุมัติคดี',
              timestamp: new Date().toISOString(),
              read: false,
              type: 'status'
          }
      ],
      packageId: packageId,
      paymentProof: paymentProofId,
      paymentType: isInstallment ? 'Installment' : 'Full',
      financials: {
          totalPrice: totalPrice,
          amountPaid: initialPaidAmount,
          amountRemaining: totalPrice - initialPaidAmount,
          payments: [newPayment]
      }
    };

    setCases(prev => [newCase, ...prev]);
    // Allow state to settle
    await new Promise(resolve => setTimeout(resolve, 500));
    return { caseId: generatedId, password: generatedPassword };
  };

  const submitAdditionalPayment = async (caseId: string, amount: number, proofFile: File) => {
    try {
        const proofId = await saveFileToDB(proofFile);
        const newPayment: PaymentRecord = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('th-TH'),
            amount: amount,
            type: 'Installment',
            slipUrl: proofId,
            status: 'Pending'
        };

        setCases(prev => prev.map(c => {
            if (c.id === caseId) {
                // IMPORTANT: Do not update amountPaid yet, wait for verification
                // But we add the payment record so admin can see it
                
                const timelineEvent: TimelineEvent = {
                     id: Date.now().toString(),
                     title: 'แจ้งชำระเงินงวด (Payment Submitted)',
                     date: new Date().toLocaleDateString('th-TH'),
                     description: `ลูกความแจ้งชำระเงิน ${amount.toLocaleString()} บาท (รอตรวจสอบ)`,
                     status: 'pending'
                };

                return {
                    ...c,
                    timeline: [timelineEvent, ...c.timeline],
                    financials: {
                        ...c.financials,
                        payments: [...c.financials.payments, newPayment]
                    }
                }
            }
            return c;
        }));
    } catch (e) {
        console.error("Payment submission failed", e);
        throw e;
    }
  };

  const verifyPayment = (caseId: string, paymentId: string) => {
      setCases(prev => prev.map(c => {
          if (c.id === caseId) {
               // Find payment to get amount
               const payment = c.financials.payments.find(p => p.id === paymentId);
               if (!payment || payment.status === 'Verified') return c; // Already verified or not found

               const updatedPayments = c.financials.payments.map(p => 
                  p.id === paymentId ? { ...p, status: 'Verified' as const } : p
              );
               
               const newPaid = c.financials.amountPaid + payment.amount;
               const newRemaining = c.financials.totalPrice - newPaid;

               const newTimeline = c.timeline.map(t => 
                   t.title.includes('แจ้งชำระเงินงวด') && t.status === 'pending' 
                   ? { ...t, status: 'completed' as const, title: 'ชำระเงินงวดสำเร็จ (Payment Verified)', description: t.description.replace('รอตรวจสอบ', 'ตรวจสอบแล้ว') }
                   : t
               );

               const notif: ClientNotification = {
                   id: Date.now().toString(),
                   title: 'การชำระเงินได้รับการยืนยัน',
                   message: 'เจ้าหน้าที่ตรวจสอบยอดเงินของท่านเรียบร้อยแล้ว',
                   timestamp: new Date().toISOString(),
                   read: false,
                   type: 'status'
               };

               return {
                  ...c,
                  timeline: newTimeline,
                  notifications: [notif, ...c.notifications],
                  financials: {
                      ...c.financials,
                      amountPaid: newPaid,
                      amountRemaining: newRemaining,
                      payments: updatedPayments
                  }
              };
          }
          return c;
      }));
  };

  const approveCase = (id: string, updates?: Partial<LegalCase>) => {
    setCases(prev => prev.map(c => {
        if (c.id === id) {
            // Verify all pending payments when case is approved
            // Calculate total paid from verified + pending(now verified)
            let addedAmount = 0;
            const updatedPayments = c.financials.payments.map(p => {
                if (p.status === 'Pending') {
                    // Only add to paid amount if it wasn't counted yet (initial payment logic might vary, assuming initial isn't counted in paid yet for safety in this logic)
                    // Actually, rely on re-calc logic or just mark verified. 
                    // Simpler: Just mark verified. 'registerNewCase' set amounts already?
                    // registerNewCase set amountPaid. So we just mark verified.
                    return { ...p, status: 'Verified' as const };
                }
                return p;
            });

            return {
                ...c,
                ...updates,
                status: 'Open' as const,
                financials: {
                    ...c.financials,
                    payments: updatedPayments
                },
                timeline: [
                    { 
                        id: Date.now().toString(), 
                        title: 'คดีได้รับการอนุมัติ (Case Approved)', 
                        date: new Date().toLocaleDateString('th-TH'), 
                        description: 'เจ้าหน้าที่ตรวจสอบข้อมูลและการชำระเงินเรียบร้อยแล้ว เริ่มดำเนินการตามขั้นตอน', 
                        status: 'current' 
                    },
                    ...c.timeline
                ]
            };
        }
        return c;
    }));
  };

  const rejectCase = (id: string, reason: string) => {
      setCases(prev => prev.map(c => {
        if (c.id === id) {
             const newNotif: ClientNotification = {
              id: Date.now().toString(),
              title: 'คำขอเปิดคดีถูกปฏิเสธ',
              message: `คำขอของคุณถูกปฏิเสธเนื่องจาก: ${reason}. กรุณาติดต่อเจ้าหน้าที่หากมีข้อสงสัย`,
              timestamp: new Date().toISOString(),
              read: false,
              type: 'alert'
            };
            
            return {
                ...c,
                status: 'Rejected',
                rejectionReason: reason,
                notifications: [newNotif, ...c.notifications]
            };
        }
        return c;
    }));
  };

  const updateLegalCase = (id: string, updates: Partial<LegalCase>) => {
      setCases(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const recordLogin = (caseId: string, success: boolean = true) => {
    const newEntry: LoginHistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString('th-TH', { 
            day: 'numeric', 
            month: 'short', 
            year: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        ip: '127.0.0.1', 
        device: 'Web Browser', 
        status: success ? 'Success' : 'Failed'
    };

    setCases(prev => prev.map(c => {
        if (c.id === caseId) {
            return { ...c, loginHistory: [newEntry, ...c.loginHistory].slice(0, 10) };
        }
        return c;
    }));
  };

  const deleteCase = (id: string) => {
      setCases(prev => prev.filter(c => c.id !== id));
  };

  // Document Management
  const addCaseDocument = async (caseId: string, file: File, uploaderName: string) => {
      try {
          const fileId = await saveFileToDB(file);
          const newDoc: CaseDocument = {
              id: Date.now().toString(),
              name: file.name,
              date: new Date().toLocaleDateString('th-TH'),
              size: formatFileSize(file.size),
              url: fileId, // Store ID
              mimeType: file.type,
              uploadedBy: uploaderName
          };

          setCases(prev => prev.map(c => {
              if (c.id === caseId) {
                  const updatedDocs = [newDoc, ...c.documents];
                  const newNotif: ClientNotification = {
                    id: Date.now().toString(),
                    title: 'มีเอกสารใหม่ในคดีของคุณ',
                    message: `ทนายความได้อัพโหลดเอกสาร: ${file.name}`,
                    timestamp: new Date().toISOString(),
                    read: false,
                    type: 'document'
                  };
                  return { ...c, documents: updatedDocs, notifications: [newNotif, ...c.notifications] };
              }
              return c;
          }));

      } catch (error) {
          console.error("Upload failed", error);
          alert("ไม่สามารถอัพโหลดไฟล์ได้");
      }
  };

  const addGeneratedDocument = (caseId: string, doc: CaseDocument) => {
      setCases(prev => prev.map(c => {
          if (c.id === caseId) {
             const updatedDocs = [doc, ...c.documents];
             return { ...c, documents: updatedDocs };
          }
          return c;
      }));
  }

  const pushNotification = (caseId: string, title: string, message: string, type: 'status' | 'document' | 'alert') => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const newNotif: ClientNotification = {
          id: Date.now().toString(),
          title,
          message,
          timestamp: new Date().toISOString(),
          read: false,
          type
        };
        return { ...c, notifications: [newNotif, ...c.notifications] };
      }
      return c;
    }));
  };

  const markAllNotificationsRead = (caseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          notifications: c.notifications.map(n => ({ ...n, read: true }))
        };
      }
      return c;
    }));
  };

  const getCaseById = (id: string) => cases.find(c => c.id === id);

  // User Management
  const addLawyer = (userData: Omit<InternalUser, 'id'>) => {
    const newUser: InternalUser = {
        ...userData,
        id: Math.floor(Math.random() * 10000) + 100 
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: number, updates: Partial<InternalUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const loginAdmin = (username: string, pass: string) => {
      const user = users.find(u => u.username === username);
      if (user && user.password === pass) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return true;
      }
      return false;
  };
  
  const logoutAdmin = () => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
  };

  const visibleCases = currentUser?.role === UserRole.CHIEF 
    ? cases 
    : cases.filter(c => c.lawyerId === currentUser?.id);

  const stats = {
    totalInquiries: inquiries.length, 
    activeCases: visibleCases.filter(c => c.status === 'Open' || c.status === 'Pending Court').length,
    pendingApprovals: visibleCases.filter(c => c.status === 'Payment Verification').length,
    closedInquiries: inquiries.filter(i => i.status === InquiryStatus.CLOSED).length,
    byType: inquiries.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <StoreContext.Provider value={{ 
        inquiries, 
        cases, 
        packages: SERVICE_PACKAGES,
        availableLawyers: users.filter(u => u.role === UserRole.LAWYER || u.role === UserRole.CHIEF),
        currentUser,
        addInquiry, 
        updateInquiryStatus, 
        deleteInquiry,
        addCase,
        registerNewCase,
        submitAdditionalPayment,
        approveCase,
        rejectCase,
        updateLegalCase,
        recordLogin,
        deleteCase,
        getCaseById,
        addCaseDocument,
        addGeneratedDocument,
        verifyPayment,
        openFile,
        addLawyer,
        updateUser,
        deleteUser,
        pushNotification,
        markAllNotificationsRead,
        loginAdmin,
        logoutAdmin,
        stats 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
