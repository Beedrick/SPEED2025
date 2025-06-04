import React, { useState, useEffect } from 'react';
import { Book } from "./Book";

interface BookSearchProps {
  onSearchResults: (books: Book[]) => void;
  onLoadingChange?: (loading: boolean) => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ onSearchResults, onLoadingChange }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        searchBooks(searchTerm);
      } else {
        // If search is empty, load all books
        loadAllBooks();
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const searchBooks = async (query: string): Promise<void> => {
    setIsLoading(true);
    onLoadingChange?.(true);
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/books/search?q=" + encodeURIComponent(query));
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const books: Book[] = await response.json();
      onSearchResults(books);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([]);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const loadAllBooks = async (): Promise<void> => {
    setIsLoading(true);
    onLoadingChange?.(true);
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/books/`);
      if (!response.ok) {
        throw new Error('Failed to load books');
      }
      const books: Book[] = await response.json();
      onSearchResults(books);
    } catch (error) {
      console.error('Load error:', error);
      onSearchResults([]);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handleClearSearch = (): void => {
    setSearchTerm('');
  };

  return (
    <div className="search-container mb-4">
      <div className="position-relative d-flex align-items-center">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search books by title, author, journal, or DOI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            paddingRight: searchTerm ? '40px' : '16px',
            borderRadius: '8px',
            border: '2px solid #e1e5e9',
          }}
        />
        
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="btn btn-link position-absolute"
            style={{
              right: '8px',
              padding: '0',
              width: '24px',
              height: '24px',
              fontSize: '18px',
              color: '#666',
              textDecoration: 'none',
            }}
            title="Clear search"
            type="button"
          >
            ×
          </button>
        )}
      </div>
      
      {isLoading && (
        <div className="mt-2 text-muted small d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Searching...</span>
        </div>
      )}
    </div>
  );
};

export default BookSearch;