import React, { useCallback, useEffect, useState } from 'react';

import { Search } from '@mui/icons-material';
import {
  Avatar,
  CircularProgress,
  InputAdornment,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Popover,
} from '@mui/material';
import axios from 'axios';
import debounce from 'lodash/debounce';

import { Element } from '../interfaces/Element.component';
import styles from './searchBar.module.css';

interface SearchBarProps {
  onSelect: (element: Element) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelect, isOpen, setIsOpen, searchTerm, setSearchTerm }) => {
  const [filteredResults, setFilteredResults] = useState<Element[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fetchProducts = async (query: string) => {
    if (!query.trim()) return [];
    setIsLoading(true);

    try {
      const response = await axios.get('http://localhost:5000/product-search/search', {
        params: { query, page: 1, limit: 50 },
      });
      return Array.isArray(response.data) ? response.data.slice(0, 50) : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      setTimeout(async () => {
        const results = await fetchProducts(query);
        setFilteredResults(results);
        setIsOpen(results.length > 0);
        setIsLoading(false);
      }, 1000);
    }, 300),
    [setIsOpen],
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (element: Element) => {
    onSelect(element);
    setIsOpen(false);
    setSearchTerm(element.title ?? '');
    setIsFocused(false);
  };

  return (
    <div>
      <InputBase
        fullWidth
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className={styles.searchBar}
        startAdornment={
          <InputAdornment position="start">
            <Search className={styles.searchIcon} />
          </InputAdornment>
        }
      />

      <Popover
        open={isFocused || isLoading}
        anchorEl={anchorEl}
        onClose={() => setIsFocused(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{
          style: {
            width: '100%',
            margin: '10px auto',
            color: 'var(--text-color)',
            backgroundColor: 'var(--background-color)',
            minHeight: filteredResults.length === 0 && !isLoading ? '100px' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
        disableAutoFocus
        disableEnforceFocus
        className={filteredResults.length === 0 && !isLoading ? styles.emptyPopover : styles.popover}>
        {isLoading && searchTerm.trim() ? (
          <div>
            <CircularProgress size={32} className={styles.spinner} />
            <div className={styles.serchText}>Search...</div>
          </div>
        ) : filteredResults.length === 0 && searchTerm.trim() ? (
          <div className={styles.noResults}>Nothing Found</div>
        ) : filteredResults.length === 0 && !searchTerm.trim() ? (
          <div className={styles.noResults}>Write your request</div>
        ) : (
          <List className={styles.listContainer}>
            {filteredResults.map(item => (
              <ListItem key={item.id} onMouseDown={() => handleSelect(item)} className={styles.listItem}>
                <Avatar src={item.profileImages?.[0] || ''} className={styles.avatar} />
                <ListItemText className={styles.listItemText} primary={item.title ?? 'No title'} />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </div>
  );
};
