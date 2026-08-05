declare module 'express' {
  interface GoogleAuthRequest extends Request {
    user: GoogleUser;
    query: {
      state?: string;
      code?: string;
      error?: string;
    };
  }
  interface OAuthState {
    role: UserRole.BRAND | UserRole.CREATOR;
  }
  interface AuthenticatedRequest extends Request {
    user: {
      id: number;
      email: string;
      role?: UserRole.BRAND | UserRole.CREATOR;
    };
  }
}
export interface GoogleUser {
  email: string;
  name: string;
  googleId?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
}
export interface GoogleUserPayload {
  email: string;
  name: string;
  avatarUrl: string;
}
export interface JwtPayload {
  sub: number; // User ID (subject)
  email: string;
  role?: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}
