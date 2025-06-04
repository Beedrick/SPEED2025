export interface User {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  affiliation?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  SUBMITTER = 'submitter',
  MODERATOR = 'moderator',
  ANALYST = 'analyst',
  ADMIN = 'admin'
}