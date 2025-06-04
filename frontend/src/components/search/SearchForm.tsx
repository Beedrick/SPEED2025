'use client';

import { useState, useEffect } from 'react';
import { SearchQuery } from '../../types/evidence';
import { SE_PRACTICES, CLAIMS_BY_PRACTICE } from '../../utils/constants';

interface SearchFormProps {
  onSearch: (query: SearchQuery) => void;
  loading?: boolean;
}

export default function SearchForm({ onSearch, loading = false }: SearchFormProps) {
  const [selectedPractice, setSelectedPractice] = useState<string>('');
  const [selectedClaim, setSelectedClaim] = useState<string>('');
  const [yearRange, setYearRange] = useState<string>('');
  const [availableClaims, setAvailableClaims] = useState<string[]>([]);

  useEffect(() => {
    if (selectedPractice && CLAIMS_BY_PRACTICE[selectedPractice as keyof typeof CLAIMS_BY_PRACTICE]) {
      setAvailableClaims(CLAIMS_BY_PRACTICE[selectedPractice as keyof typeof CLAIMS_BY_PRACTICE]);
      setSelectedClaim(''); // Reset claim when practice changes
    } else {
      setAvailableClaims([]);
      setSelectedClaim('');
    }
  }, [selectedPractice]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const query: SearchQuery = {
      sePractice: selectedPractice || undefined,
      claim: selectedClaim || undefined,
    };

    // Parse year range
    if (yearRange && yearRange.includes('-')) {
      const [start, end] = yearRange.split('-').map(y => parseInt(y.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        query.yearRange = { start, end };
      }
    }

    onSearch(query);
  };

  const handleReset = () => {
    setSelectedPractice('');
    setSelectedClaim('');
    setYearRange('');
    setAvailableClaims([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Evidence</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SE Practice Selection */}
          <div>
            <label htmlFor="practice" className="block text-sm font-medium text-gray-700 mb-2">
              Software Engineering Practice
            </label>
            <select
              id="practice"
              value={selectedPractice}
              onChange={(e) => setSelectedPractice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a practice...</option>
              {SE_PRACTICES.map(practice => (
                <option key={practice} value={practice}>
                  {practice}
                </option>
              ))}
            </select>
          </div>

          {/* Claim Selection */}
          <div>
            <label htmlFor="claim" className="block text-sm font-medium text-gray-700 mb-2">
              Claim
            </label>
            <select
              id="claim"
              value={selectedClaim}
              onChange={(e) => setSelectedClaim(e.target.value)}
              disabled={!selectedPractice}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select a claim...</option>
              {availableClaims.map(claim => (
                <option key={claim} value={claim}>
                  {claim}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range */}
          <div>
            <label htmlFor="yearRange" className="block text-sm font-medium text-gray-700 mb-2">
              Publication Years
            </label>
            <input
              type="text"
              id="yearRange"
              value={yearRange}
              onChange={(e) => setYearRange(e.target.value)}
              placeholder="e.g., 2015-2023"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || (!selectedPractice && !selectedClaim)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search Evidence'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}