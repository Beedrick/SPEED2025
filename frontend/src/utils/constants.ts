export const SE_PRACTICES = [
  'Test-Driven Development (TDD)',
  'Pair Programming',
  'Code Review',
  'Agile Methods',
  'DevOps Practices',
  'Continuous Integration',
  'Refactoring',
  'Design Patterns',
  'Static Analysis',
  'Unit Testing'
] as const;

export const CLAIMS_BY_PRACTICE = {
  'Test-Driven Development (TDD)': [
    'Improves Code Quality',
    'Reduces Bug Count',
    'Increases Development Speed',
    'Improves Design',
    'Increases Test Coverage',
    'Reduces Debugging Time'
  ],
  'Pair Programming': [
    'Improves Code Quality',
    'Increases Knowledge Sharing',
    'Reduces Defects',
    'Improves Design',
    'Increases Learning',
    'Reduces Development Time'
  ],
  'Code Review': [
    'Improves Code Quality',
    'Detects Bugs',
    'Knowledge Transfer',
    'Maintains Coding Standards',
    'Reduces Technical Debt',
    'Improves Security'
  ],
  'Agile Methods': [
    'Increases Team Productivity',
    'Improves Customer Satisfaction',
    'Reduces Time to Market',
    'Improves Quality',
    'Increases Team Morale',
    'Better Requirement Management'
  ]
} as const;

export const RESEARCH_TYPES = [
  'Controlled Experiment',
  'Case Study',
  'Survey',
  'Literature Review',
  'Systematic Review',
  'Meta-Analysis',
  'Industrial Study',
  'Field Study'
] as const;

export const PARTICIPANT_TYPES = [
  'Students',
  'Practitioners',
  'Mixed',
  'Not Specified'
] as const;

export const EVIDENCE_RESULTS = [
  'Support',
  'Contradict',
  'Mixed',
  'Inconclusive'
] as const;

export const API_ENDPOINTS = {
  ARTICLES: '/api/articles',
  SEARCH: '/api/search',
  SUBMIT: '/api/articles/submit',
  MODERATE: '/api/articles/moderate',
  ANALYZE: '/api/articles/analyze',
  QUEUE: '/api/queue',
  USERS: '/api/users'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
} as const;