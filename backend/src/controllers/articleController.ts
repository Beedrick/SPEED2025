
import { RequestHandler } from 'express';
import Article from '../models/Article';


export const getPendingArticles: RequestHandler = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'pending' })
      .populate('submitter', 'username email')
      .lean();
      
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to obtain the article for review' });
  }
};


export const approveArticle: RequestHandler = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        reviewer: req.user._id,
        reviewedAt: new Date(),
        $unset: { rejectionReason: 1 }
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article does not exist' });
    }

    res.json({ message: 'Article approved', article });
  } catch (error) {
    res.status(500).json({ message: 'Approval operation failed' });
  }
};

export const rejectArticle: RequestHandler = async (req, res) => {
  const { reason } = req.body;
  
  if (!reason) {
    return res.status(400).json({ message: '' });
  }

  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        reviewer: req.user._id,
        rejectionReason: reason,
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article does not exist' });
    }

    res.json({ message: 'Article rejected', article });
  } catch (error) {
    res.status(500).json({ message: 'Reject operation failed' });
  }
};