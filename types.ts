
export enum CaseType {
  CIVIL = 'แพ่ง',
  CRIMINAL = 'อาญา',
  FAMILY = 'ครอบครัว',
  CORPORATE = 'ธุรกิจ',
  OTHER = 'อื่นๆ'
}

export enum InquiryStatus {
  NEW = 'ใหม่',
  IN_PROGRESS = 'กำลังดำเนินการ',
  CLOSED = 'ปิดเคส'
}

export enum UserRole {
  CHIEF = 'Chief', // Head of Office
  LAWYER = 'Lawyer' // Associate Lawyer
}

export interface InternalUser {
  id: number;
  username: string;
  password?: string; // Added for dynamic login check
  name: string;
  role: UserRole;
  image?: string;
  email?: string;
  phone?: string;
  specialty?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: CaseType;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  aiSummary?: string;
}

// --- Backend System Types ---

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export interface CaseDocument {
  id: string;
  name: string;
  date: string;
  size: string;
  url?: string; // Base64 or Blob URL
  mimeType?: string;
  uploadedBy?: string;
}

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  status: 'Success' | 'Failed'; // Added status tracking
}

export interface ClientNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status' | 'document' | 'alert';
}

export interface ServicePackage {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  type: CaseType;
  popular?: boolean;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: 'Initial' | 'Installment';
  slipUrl: string;
  status: 'Pending' | 'Verified';
}

export interface CaseFinancials {
  totalPrice: number;
  amountPaid: number;
  amountRemaining: number;
  payments: PaymentRecord[];
}

export interface LegalCase {
  id: string; // Acts as Case ID (e.g., C-2024-001)
  clientName: string;
  type: CaseType; // e.g., 'แพ่ง'
  subtype: string; // e.g., 'ผิดสัญญาเช่าซื้อ'
  password: string; // Simple auth for demo
  lawyerId: number;
  status: 'Open' | 'Closed' | 'Pending Court' | 'Payment Verification' | 'Rejected';
  rejectionReason?: string;
  timeline: TimelineEvent[];
  documents: CaseDocument[];
  loginHistory: LoginHistoryEntry[];
  notifications: ClientNotification[];
  nextAppointment?: {
    date: string;
    time: string;
    location: string;
    title: string;
  };
  // New Financial Structure
  financials: CaseFinancials;
  packageId?: string;
  
  // Deprecated but kept for compatibility with existing mock data structure if needed, 
  // though we will migrate logic to use 'financials'
  paymentProof?: string; 
  paymentType?: 'Full' | 'Installment';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Lawyer {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface GlossaryTerm {
  word: string;
  definition: string;
  category: 'General' | 'Civil' | 'Criminal' | 'Family' | 'Business';
}
