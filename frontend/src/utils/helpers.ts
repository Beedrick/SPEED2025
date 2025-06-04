import { Article, EvidenceResult } from '../types/article';

export const formatAuthors = (authors: string[]): string => {
  if (authors.length === 0) return '';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} et al.`;
};

export const getEvidenceColor = (result: EvidenceResult): string => {
  switch (result) {
    case EvidenceResult.SUPPORT:
      return 'text-green-700 bg-green-100';
    case EvidenceResult.CONTRADICT:
      return 'text-red-700 bg-red-100';
    case EvidenceResult.MIXED:
      return 'text-yellow-700 bg-yellow-100';
    case EvidenceResult.INCONCLUSIVE:
      return 'text-gray-700 bg-gray-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

export const calculateAverageRating = (article: Article): number => {
  if (!article.userRatings || article.userRatings.length === 0) return 0;
  
  const sum = article.userRatings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / article.userRatings.length) * 10) / 10;
};

export const formatYear = (year: number): string => {
  return year.toString();
};

export const parseYearRange = (yearRange: string): { start: number; end: number } | null => {
  if (!yearRange.includes('-')) return null;
  
  const [start, end] = yearRange.split('-').map(y => parseInt(y.trim()));
  if (isNaN(start) || isNaN(end)) return null;
  
  return { start, end };
};

export const formatDOI = (doi: string): string => {
  if (doi.startsWith('http')) return doi;
  return `https://doi.org/${doi}`;
};

export const validateBibTeX = (bibtex: string): boolean => {
  // Basic BibTeX validation
  const bibTexPattern = /@\w+\s*\{[^}]+\}/i;
  return bibTexPattern.test(bibtex);
};

export const extractBibTeXFields = (bibtex: string): Partial<Article> | null => {
  try {
    const titleMatch = bibtex.match(/title\s*=\s*\{([^}]+)\}/i);
    const authorMatch = bibtex.match(/author\s*=\s*\{([^}]+)\}/i);
    const yearMatch = bibtex.match(/year\s*=\s*\{?(\d{4})\}?/i);
    const journalMatch = bibtex.match(/journal\s*=\s*\{([^}]+)\}/i);
    const doiMatch = bibtex.match(/doi\s*=\s*\{([^}]+)\}/i);

    return {
      title: titleMatch ? titleMatch[1] : '',
      authors: authorMatch ? authorMatch[1].split(' and ').map(a => a.trim()) : [],
      year: yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear(),
      journal: journalMatch ? journalMatch[1] : '',
      doi: doiMatch ? doiMatch[1] : ''
    };
  } catch (error) {
    console.error('Error parsing BibTeX:', error);
    return null;
  }
};