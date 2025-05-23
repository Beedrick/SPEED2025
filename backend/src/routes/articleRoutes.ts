
import express from 'express';
import {
  getPendingArticles,
  approveArticle,
  rejectArticle
} from '../controllers/articleController';
import { moderatorOnly } from '..//middleware/auth';

const router = express.Router();

router.get('/pending', moderatorOnly, getPendingArticles);
router.put('/:id/approve', moderatorOnly, approveArticle);
router.put('/:id/reject', moderatorOnly, rejectArticle);

export default router;