import React, { useState } from 'react';

import { WebSocketScraper } from '../../websocket/WebSocketComponent';
import styles from './ScrapingDropdown.module.css';

export const ScrapingDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { messages, isScraping, service, startScraping } = WebSocketScraper();

  return (
    <div
      className={styles.logoContainer}
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}>
      <h2 className={styles.logoButton}>Scraper</h2>
      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <button onClick={() => startScraping('telemart')} disabled={isScraping}>
            {isScraping && service === 'telemart' ? 'Scraping...' : 'Telemart'}
          </button>
          <button onClick={() => startScraping('rozetka')} disabled={isScraping}>
            {isScraping && service === 'rozetka' ? 'Scraping...' : 'Rozetka'}
          </button>
        </div>
      )}
    </div>
  );
};
