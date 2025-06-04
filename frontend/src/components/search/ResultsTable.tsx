'use client';

import { useState } from 'react';
import { Article } from '../../types/article';
import { formatAuthors, getEvidenceColor, formatDOI } from '../../utils/helpers';

interface ResultsTableProps {
  articles: Article[];
  loading?: boolean;
}

type SortField = 'title' | 'year' | 'authors' | 'journal';
type SortDirection = 'asc' | 'desc';

export default function ResultsTable({ articles, loading = false }: ResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    authors: true,
    year: true,
    journal: true,
    evidence: true,
    type: false,
    participants: false,
    rating: false
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortField) {
      case 'title':
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case 'year':
        aVal = a.year;
        bVal = b.year;
        break;
      case 'authors':
        aVal = formatAuthors(a.authors).toLowerCase();
        bVal = formatAuthors(b.authors).toLowerCase();
        break;
      case 'journal':
        aVal = a.journal.toLowerCase();
        bVal = b.journal.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">No evidence found</div>
          <div className="text-gray-400">Try adjusting your search criteria</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="text-lg font-semibold text-gray-800">
          Found {articles.length} evidence article{articles.length === 1 ? '' : 's'}
        </div>
        
        {/* Column Toggles */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(visibleColumns).map(([column, visible]) => (
            <button
              key={column}
              onClick={() => toggleColumn(column as keyof typeof visibleColumns)}
              className={`px-3 py-1 text-sm rounded-md border ${
                visible 
                  ? 'bg-blue-100 text-blue-800 border-blue-300' 
                  : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}
            >
              {column.charAt(0).toUpperCase() + column.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {visibleColumns.title && (
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('title')}
                >
                  Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {visibleColumns.authors && (
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('authors')}
                >
                  Authors {sortField === 'authors' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {visibleColumns.year && (
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('year')}
                >
                  Year {sortField === 'year' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {visibleColumns.journal && (
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('journal')}
                >
                  Journal {sortField === 'journal' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {visibleColumns.evidence && (
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Evidence
                </th>
              )}
              {visibleColumns.type && (
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Research Type
                </th>
              )}
              {visibleColumns.participants && (
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Participants
                </th>
              )}
              {visibleColumns.rating && (
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Rating
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedArticles.map((article) => (
              <tr key={article._id} className="border-b border-gray-100 hover:bg-gray-50">
                {visibleColumns.title && (
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{article.title}</div>
                    {article.doi && (
                      <a 
                        href={formatDOI(article.doi)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        DOI: {article.doi}
                      </a>
                    )}
                  </td>
                )}
                {visibleColumns.authors && (
                  <td className="py-3 px-4 text-gray-700">
                    {formatAuthors(article.authors)}
                  </td>
                )}
                {visibleColumns.year && (
                  <td className="py-3 px-4 text-gray-700">
                    {article.year}
                  </td>
                )}
                {visibleColumns.journal && (
                  <td className="py-3 px-4 text-gray-700">
                    {article.journal}
                  </td>
                )}
                {visibleColumns.evidence && (
                  <td className="py-3 px-4">
                    {article.claims.map((claim, index) => (
                      <div key={index} className="mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getEvidenceColor(claim.evidenceResult)}`}>
                          {claim.evidenceResult}
                        </span>
                      </div>
                    ))}
                  </td>
                )}
                {visibleColumns.type && (
                  <td className="py-3 px-4 text-gray-700">
                    {article.researchType}
                  </td>
                )}
                {visibleColumns.participants && (
                  <td className="py-3 px-4 text-gray-700">
                    {article.participantType}
                  </td>
                )}
                {visibleColumns.rating && (
                  <td className="py-3 px-4">
                    {article.averageRating ? (
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{article.averageRating}/5</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">No ratings</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}