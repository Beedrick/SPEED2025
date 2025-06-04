export interface Article {
  _id?: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi: string;
  abstract?: string;
  
  // SPEED specific fields
  sePractice: string;
  claims: Claim[];
  researchType: ResearchType;
  participantType: ParticipantType;
  
  // Workflow fields
  status: ArticleStatus;
  submittedBy: string;
  submittedAt: Date;
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationNotes?: string;
  analyzedBy?: string;
  analyzedAt?: Date;
  
  // User feedback
  userRatings: UserRating[];
  averageRating?: number;
}

export interface Claim {
  claimText: string;
  evidenceResult: EvidenceResult;
  confidence: ConfidenceLevel;
  notes?: string;
}

export interface UserRating {
  userId: string;
  rating: number; // 1-5
  comment?: string;
  ratedAt: Date;
}

// Enums
export enum ArticleStatus {
  SUBMITTED = 'submitted',
  UNDER_MODERATION = 'under_moderation',
  APPROVED_FOR_ANALYSIS = 'approved_for_analysis',
  UNDER_ANALYSIS = 'under_analysis',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export enum EvidenceResult {
  SUPPORT = 'support',
  CONTRADICT = 'contradict',
  MIXED = 'mixed',
  INCONCLUSIVE = 'inconclusive'
}

export enum ResearchType {
  EXPERIMENT = 'experiment',
  CASE_STUDY = 'case_study',
  SURVEY = 'survey',
  LITERATURE_REVIEW = 'literature_review',
  SYSTEMATIC_REVIEW = 'systematic_review',
  META_ANALYSIS = 'meta_analysis'
}

export enum ParticipantType {
  STUDENTS = 'students',
  PRACTITIONERS = 'practitioners',
  MIXED = 'mixed',
  NOT_SPECIFIED = 'not_specified'
}

export enum ConfidenceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}