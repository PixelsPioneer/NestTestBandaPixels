import { useEffect, useState } from 'react';

const useToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setAccessToken(token);
  }, []);

  return accessToken;
};

export default useToken;
