// Type definitions for AlgoViz Authentication System

export interface StudentUser {
  role: 'user';
  name?: string;
  collegeId: string;
  rollNumber: string;
  branch: string;
  section: string;
  email: string;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  role: 'admin';
  collegeId: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt?: string;
}

export type AuthUser = StudentUser | AdminUser;

export interface StudentLoginPayload {
  name: string;
  collegeId: string;
  rollNumber: string;
  branch: string;
  section: string;
  email: string;
  password?: string;
  otp: string;
}

export interface StudentPasswordLoginPayload {
  identifier: string;
  password: string;
}

export interface AdminPasswordLoginPayload {
  identifier: string;
  password: string;
}

export interface AdminLoginPayload {
  collegeId: string;
  name: string;
  password?: string;
  email: string;
  otp: string;
}

export interface SendOtpPayload {
  email: string;
  role: 'user' | 'admin';
  collegeId: string;
}
