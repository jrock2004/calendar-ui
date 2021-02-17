import { ReactText } from 'react';

export interface ICustomer {
  email: string;
  firstName: string;
  fullName: string;
  id: number;
  lastName: string;
  phone: string;
}

export interface IServices {
  duration: string;
  id: number;
  name: string;
}

export interface ISelectedEvent {
  customerId: number | null;
  customerName: string;
  employeeId: number | null | undefined;
  employeeName: string;
  end: ReactText;
  endStr: string;
  id: string;
  notes: string;
  serviceId: number | null;
  start: ReactText;
  startStr: string;
  status: number;
}

export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface IBubbleOptions {
  isEditing: boolean;
  isNewEvent: boolean;
  isOpen: boolean;
}

export interface IToast {
  showToast: boolean;
  toastMessage: string;
}
