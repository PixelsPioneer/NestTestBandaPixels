import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import { useTokenContext } from '../context/TokenContext';
import { Element } from '../interfaces/Element.component';
import { toastError, toastSuccess } from '../notification/ToastNotification.component';
import { PaginationComponent } from '../pagination/Pagination.component';
import { SearchBar } from '../searchBar/searchBar.component';
import { ProductCard } from './ProductCard.component';
import styles from './product-list.module.css';

const PRODUCTS_PER_PAGE = 16;

export const ProductsComponent: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const { accessToken } = useTokenContext();
  const navigate = useNavigate();

  const getProducts = useMutation({
    mutationFn: async ({ page, searchTerm }: { page: number; searchTerm: string }) => {
      const response = await axios.get(apiEndpoints.products.products, {
        params: { page, limit: PRODUCTS_PER_PAGE, searchTerm },
      });
      return response.data;
    },
    onMutate: () => setLoading(true),
    onSuccess: data => {
      setElements(data.products);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
    },
    onError: () => toastError('Error fetching data.'),
    onSettled: () => setLoading(false),
  });

  useEffect(() => {
    getProducts.mutate({ page: currentPage, searchTerm });
  }, [currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    getProducts.mutate({ page: 1, searchTerm });
  };

  const handleDelete = (id: number) => {
    setElements(prev => prev.filter(element => element.id !== id));
    toastSuccess('Product deleted successfully!');
  };

  const goToProductPage = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleSelect = (element: Element) => {
    setSearchTerm(element.title ?? '');
    setIsOpen(false);
    goToProductPage(element.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - PRODUCTS_PER_PAGE;
  const currentElements = elements;

  if (!accessToken) return <p>Please log in to see the products.</p>;

  return (
    <div>
      <form className={styles.search} onSubmit={handleSearchSubmit} autoComplete="off">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelect={handleSelect}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : currentElements.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <ul className={styles.cardContainer}>
            {currentElements.map((element: Element) => (
              <ProductCard key={element.id} element={element} onDelete={() => handleDelete(element.id)} />
            ))}
          </ul>
          <div className={styles.pagination}>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};
