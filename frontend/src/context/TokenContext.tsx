import React, { createContext, useContext, useState } from 'react';

interface TokenContextType {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  updateTokens: (accessToken: string | null, refreshToken: string | null, role: string | null) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh_token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

  const updateTokens = (accessToken: string | null, refreshToken: string | null, role: string | null) => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      setAccessToken(accessToken);
    } else {
      localStorage.removeItem('access_token');
      setAccessToken(null);
    }

    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
      setRefreshToken(refreshToken);
    } else {
      localStorage.removeItem('refresh_token');
      setRefreshToken(null);
    }

    if (role) {
      localStorage.setItem('role', role);
      setRole(role);
    } else {
      localStorage.removeItem('role');
      setRole(null);
    }
  };

  return (
    <TokenContext.Provider value={{ accessToken, refreshToken, role, updateTokens }}>{children}</TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
};
