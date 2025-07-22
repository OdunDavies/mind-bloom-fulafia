const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  userType: 'student' | 'counselor';
  age?: number;
  gender?: string;
  department?: string;
  specialty?: string;
  bio?: string;
  availability?: string;
  isOnline: boolean;
  lastSeen: string;
}

export interface Message {
  _id: string;
  from: {
    _id: string;
    name: string;
    email: string;
    userType: string;
  };
  to: string;
  content: string;
  timestamp: string;
  read: boolean;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(userType: 'student' | 'counselor'): Promise<User[]> {
    return this.request<User[]>(`/users/${userType}`);
  }

  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    return this.request<Message[]>(`/messages/${userId1}/${userId2}`);
  }

  async markMessagesAsRead(userId: string, fromUserId: string): Promise<void> {
    await this.request(`/messages/read/${userId}/${fromUserId}`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();