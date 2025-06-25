import { HelpRequest, Donation, User, Consultation } from '@/types';
import requests from '@/data/requests.json';
import donations from '@/data/donations.json';
import users from '@/data/users.json';

class DataService {
  private requests: HelpRequest[] = requests;
  private donations: Donation[] = donations;
  private users: User[] = users;
  private consultations: Consultation[] = [];

  getRequestsByVictim(victimId: string): HelpRequest[] {
    return this.requests.filter(req => req.victimId === victimId);
  }

  getAllRequests(): HelpRequest[] {
    return this.requests;
  }

  getPendingRequests(): HelpRequest[] {
    return this.requests.filter(req => req.status === 'pending');
  }

  getRequestsByConsultant(consultantId: string): HelpRequest[] {
    return this.requests.filter(req => req.assignedConsultantId === consultantId);
  }

  createRequest(request: Omit<HelpRequest, 'id' | 'createdAt'>): HelpRequest {
    const newRequest: HelpRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.requests.push(newRequest);
    return newRequest;
  }

  updateRequest(id: string, updates: Partial<HelpRequest>): HelpRequest | null {
    const index = this.requests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.requests[index] = { ...this.requests[index], ...updates };
      return this.requests[index];
    }
    return null;
  }

  getUsersByRole(role: string): User[] {
    return this.users.filter(user => user.role === role);
  }

  getVictimsWithRequests(): User[] {
    const victimIds = this.requests.map(req => req.victimId);
    return this.users.filter(user => user.role === 'victim' && victimIds.includes(user.id));
  }

  createDonation(donation: Omit<Donation, 'id' | 'createdAt'>): Donation {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.donations.push(newDonation);
    return newDonation;
  }

  scheduleConsultation(consultation: Omit<Consultation, 'id'>): Consultation {
    const newConsultation: Consultation = {
      ...consultation,
      id: Date.now().toString(),
    };
    this.consultations.push(newConsultation);
    return newConsultation;
  }
}

export const dataService = new DataService();