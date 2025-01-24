import React, { createContext, useContext } from 'react';

import { useToken } from '../hooks/useToken';

interface TokenContextType {
  token: string | null;
  updateToken: (newToken: string | null) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, updateToken } = useToken();

  return <TokenContext.Provider value={{ token, updateToken }}>{children}</TokenContext.Provider>;
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
};
