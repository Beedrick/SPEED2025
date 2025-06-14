import React, { useState, useEffect } from 'react';
import { Book } from './Book';

interface BookSearchProps {
  onSearchResults: (books: Book[]) => void;
  onLoadingChange?: (loading: boolean) => void;
}

// Finalized dropdown options
const sePracticeOptions = [
  'Test-Driven Development (TDD)',
  'Code Reviews',
  'Continuous Integration (CI)',
  'Pair Programming',
  'Automated Testing',
  'Agile Planning',
];

const claimOptions = [
  'Improves code quality',
  'Reduces bugs',
  'Speeds up development',
  'Improves team communication',
  'Increases developer productivity',
];

const BookSearch: React.FC<BookSearchProps> = ({ onSearchResults, onLoadingChange }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPractice, setSelectedPractice] = useState<string>('');
  const [selectedClaim, setSelectedClaim] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simple search function without useCallback to avoid dependency issues
  const performSearch = async (): Promise<void> => {
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const queryParams = new URLSearchParams();
      if (searchTerm.trim()) queryParams.append('q', searchTerm.trim());
      if (selectedPractice) queryParams.append('se_practice', selectedPractice);
      if (selectedClaim) queryParams.append('claim', selectedClaim);

      // Always make the API call - your backend handles empty params correctly
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/search?${queryParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
    
      const books: Book[] = await response.json();
      console.log('Search results:', books);
      onSearchResults(books);
    } catch (err) {
      console.error('Search error:', err);
      onSearchResults([]);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  // Use useEffect with direct dependencies instead of the function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedPractice, selectedClaim]); // Direct dependencies

  const handleClearSearch = (): void => {
    setSearchTerm('');
    setSelectedPractice('');
    setSelectedClaim('');
  };

  const handlePracticeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log('Practice changed to:', e.target.value);
    setSelectedPractice(e.target.value);
  };

  const handleClaimChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log('Claim changed to:', e.target.value);
    setSelectedClaim(e.target.value);
  };

  return (
    <div className="search-container mb-4">
      <div className="mb-2 position-relative d-flex align-items-center">
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

      <div className="row mb-2">
        <div className="col-md-6 mb-2 mb-md-0">
          <select
            className="form-select"
            value={selectedPractice}
            onChange={handlePracticeChange}
          >
            <option value="">Filter by SE Practice</option>
            {sePracticeOptions.map((practice) => (
              <option key={practice} value={practice}>
                {practice}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedClaim}
            onChange={handleClaimChange}
          >
            <option value="">Filter by Claim</option>
            {claimOptions.map((claim) => (
              <option key={claim} value={claim}>
                {claim}
              </option>
            ))}
          </select>
        </div>
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