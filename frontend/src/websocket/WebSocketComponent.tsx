import { useCallback, useEffect, useState } from 'react';

import { socket } from './WebSocket';

export function WebSocketScraper() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [service, setService] = useState<string | null>(null);

  useEffect(() => {
    let subscribed = true;

    const handleScrapingStatus = (data: { message: string }) => {
      if (!subscribed) return;
      setMessages(prev => [...prev, data.message]);

      if (data.message.includes('start')) setIsScraping(true);
      if (data.message.includes('finish') || data.message.includes('error')) {
        setIsScraping(false);
      }
    };

    socket.on('scrapingStatus', handleScrapingStatus);

    return () => {
      subscribed = false;
      socket.off('scrapingStatus', handleScrapingStatus);
    };
  }, []);

  const startScraping = useCallback(
    (selectedService: string) => {
      if (isScraping) return;

      console.info('Starting scrape for', selectedService);
      setService(selectedService);
      setMessages([]);
      socket.emit('startScraping', selectedService);
    },
    [isScraping],
  );

  return { messages, isScraping, service, startScraping };
}
