import { useCallback, useEffect, useState } from 'react';

import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

export function WebSocketScraper() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState(false);

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
    (serviceType: string) => {
      if (!isScraping) {
        setMessages([]);
        socket.emit('startScraping', serviceType);
      }
    },
    [isScraping],
  );

  return (
    <div>
      <button onClick={() => startScraping('telemart')} disabled={isScraping}>
        {isScraping ? 'Scraping...' : 'Start scraping'}
      </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
