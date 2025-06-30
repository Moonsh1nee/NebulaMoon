export interface AuthResponse {
  accessToken: string;
  userId: string;
  email: string;
}

export interface LogoutResponse {
  message: string;
}

export interface User {
  userId: string;
  email: string;
}
