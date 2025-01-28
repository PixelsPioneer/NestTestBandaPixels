export const backendUrl = process.env.REACT_APP_API_BASE_URL;

export const apiEndpoints = {
  products: {
    products: `${backendUrl}/product`,
    productDelete: (id: string) => `${backendUrl}/product/${id}`,
  },
  auth: {
    signUp: `${backendUrl}/auth/signup`,
    signIn: `${backendUrl}/auth/login`,
    profile: `${backendUrl}/auth/profile`,
    checkLogin: `${backendUrl}/auth/check-login`,
  },
};

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  user_id: number;
  login: string;
  password: string;
  role: string;
}
