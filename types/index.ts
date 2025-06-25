export type UserRole = 'ngo' | 'donor' | 'victim' | 'consultant';

export type RequestType = 'money' | 'medical' | 'legal';

export type RequestStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  profilePicture?: string;
  location?: string;
  specialization?: string;
  description?: string;
  verified?: boolean;
}

export interface HelpRequest {
  id: string;
  victimId: string;
  type: RequestType;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: RequestStatus;
  createdAt: string;
  assignedConsultantId?: string;
  ngoId?: string;
  amount?: number;
  scheduledDate?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  recipientId: string;
  recipientType: 'ngo' | 'victim';
  amount: number;
  message?: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  requestId: string;
  consultantId: string;
  victimId: string;
  scheduledDate: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}