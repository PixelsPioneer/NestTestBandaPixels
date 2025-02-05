import { useEffect, useState } from 'react';

import { getToken } from '../utils/getToken';

export function useToken() {
  const [token, setToken] = useState<string | null>(getToken());

  useEffect(() => {
    const storedToken = getToken();
    setToken(storedToken);
  }, []);

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
    } else {
      localStorage.removeItem('accessToken');
    }
    setToken(newToken);
  };

  return { token, updateToken };
}
