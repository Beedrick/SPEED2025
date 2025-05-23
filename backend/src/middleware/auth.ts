import { RequestHandler } from 'express';


export const authenticate: RequestHandler = (req, res, next) => {
 
};


export const moderatorOnly: RequestHandler = (req, res, next) => {
  if (!req.user || req.user.role !== 'moderator') {
    res.status(403).json({ message: 'Auditor permissions required' });
    return; 
  }
  next();
};
