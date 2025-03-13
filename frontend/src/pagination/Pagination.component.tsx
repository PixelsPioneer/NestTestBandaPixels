import React from 'react';

import { Pagination, PaginationItem } from '@mui/material';

import styles from './paganation.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  onPageChange,
}) => {
  const disablePrev = currentPage === 1;
  const disableNext = currentPage === totalPages;

  return (
    <div className={styles.paginationContainer}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        classes={{
          root: styles.paginationContainer,
          ul: styles.paginationList,
        }}
        renderItem={item => (
          <PaginationItem
            {...item}
            sx={{
              fontSize: '20px',
              padding: '12px 20px',
              borderRadius: '20px',
              backgroundColor: item.selected ? 'var(--pagination-button-active)' : 'transparent',
              color: item.selected ? 'var(--pagination-button-active)' : 'var(--text-color)',
              '&:hover': {
                backgroundColor: 'var(--pagination-button-hover)',
              },
              '&.Mui-selected': {
                backgroundColor: 'var(--pagination-button-active)',
                color: 'var(--pagination-color) !important',
              },
              '&.Mui-disabled': {
                backgroundColor: 'var(--shadow)',
                cursor: 'not-allowed',
              },
            }}
          />
        )}
        disabled={disablePrev && disableNext}
      />
    </div>
  );
};
