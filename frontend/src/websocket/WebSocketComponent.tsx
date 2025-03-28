import { useCallback, useEffect, useState } from 'react';

import { io } from 'socket.io-client';

import { backendUrl } from '../constants/constants';

const socket = io(backendUrl, {
  transports: ['websocket'],
});

export function WebSocketScraper() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [service, setService] = useState<string | null>(null);

  useEffect(() => {
    const handleScrapingStatus = (data: { message: string }) => {
      setMessages(prev => [...prev, data.message]);

      if (data.message.includes('start')) {
        setIsScraping(true);
      }
      if (data.message.includes('finish') || data.message.includes('error')) {
        setIsScraping(false);
      }
    };

    socket.on('scrapingStatus', handleScrapingStatus);

    return () => {
      socket.off('scrapingStatus', handleScrapingStatus);
    };
  }, []);

  const startScraping = useCallback(
    (selectedService: string) => {
      if (!isScraping) {
        setService(selectedService);
        setMessages([]);
        socket.emit('startScraping', selectedService);
      }
    },
    [isScraping],
  );

  return { messages, isScraping, service, startScraping };
}
