import { ChangeEvent, Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';

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
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash/debounce';

import { apiEndpoints } from '../constants/constants';
import { Element } from '../interfaces/Element.component';
import styles from './searchBar.module.css';

interface SearchBarProps {
  onSelect: (element: Element) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

const fetchProducts = async (query: string): Promise<Element[]> => {
  if (!query.trim()) return [];
  const response = await axios.get(apiEndpoints.elasticsearch.searchBar, {
    params: { query, page: 1, limit: 50 },
  });
  return Array.isArray(response.data) ? response.data.slice(0, 50) : [];
};

export const SearchBar: FC<SearchBarProps> = ({ onSelect, isOpen, setIsOpen, searchTerm, setSearchTerm }) => {
  const [filteredResults, setFilteredResults] = useState<Element[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: searchProducts, isPending } = useMutation({
    mutationFn: fetchProducts,
    onSuccess: results => {
      setFilteredResults(results);
      setIsOpen(results.length > 0);
    },
  });

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
  }, [searchTerm]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
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
            <div className={styles.searchText}>Search...</div>
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
