export interface SearchQuery {
  sePractice?: string;
  claim?: string;
  yearRange?: {
    start: number;
    end: number;
  };
  evidenceResult?: EvidenceResult[];
  researchType?: ResearchType[];
  participantType?: ParticipantType[];
}

export interface SearchResult {
  articles: Article[];
  totalCount: number;
  facets: {
    practices: { name: string; count: number }[];
    claims: { name: string; count: number }[];
    evidenceResults: { name: string; count: number }[];
    researchTypes: { name: string; count: number }[];
  };
}

export interface QueueItem {
  article: Article;
  queuedAt: Date;
  priority: 'high' | 'medium' | 'low';
}